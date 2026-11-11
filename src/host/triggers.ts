import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listCommands } from "../catalog.js";
import { splitFrontmatter } from "../materials/frontmatter.js";
import { listWorkspaces } from "../workspaces.js";
import { knowledgeDirFor, sessionsDirFor } from "../workspace.js";
import { lastDue, parseTrigger, type Trigger } from "../triggerSpec.js";

/**
 * Actions that run on their own (action-triggers #108). A command with `trigger:` in its
 * frontmatter runs, while the app is open, on its schedule (`daily 07:30`, `weekly mon 08:00`) or
 * when something happens (`on draft.published`; `on submission.new` and `on post.new`, which only
 * the classroom knows, are looked for at most once an hour). It runs as a session of its own in
 * guided mode where every approval is answered no: it prepares (drafts, the register, reports) and
 * publishes nothing, and the bell says it's done. Nothing reaches students without the teacher's
 * yes (principles).
 */

/** At most this often for what only the classroom knows (a session each time). */
const POLL_MS = 60 * 60_000;

interface TriggerState {
  lastRun?: string;
  paused?: boolean;
  /** draft.published: the register lines already seen published. */
  seen?: string[];
}

export interface AutomaticRun {
  subject: string;
  command: string;
  at: string;
  dir?: string;
  ok: boolean;
  seen?: boolean;
}

const stateFile = (workspaceDir: string) => path.join(sessionsDirFor(workspaceDir), "triggers.json");

async function readState(workspaceDir: string): Promise<{ triggers: Record<string, TriggerState>; runs: AutomaticRun[] }> {
  try {
    const data = JSON.parse(await readFile(stateFile(workspaceDir), "utf8")) as { triggers?: Record<string, TriggerState>; runs?: AutomaticRun[] };
    return { triggers: data.triggers ?? {}, runs: data.runs ?? [] };
  } catch {
    return { triggers: {}, runs: [] };
  }
}

async function writeState(workspaceDir: string, state: { triggers: Record<string, TriggerState>; runs: AutomaticRun[] }): Promise<void> {
  await mkdir(sessionsDirFor(workspaceDir), { recursive: true });
  await writeFile(stateFile(workspaceDir), `${JSON.stringify({ triggers: state.triggers, runs: state.runs.slice(-30) }, null, 2)}\n`);
}

/** The subject's commands that run on their own, with their trigger. */
export async function automaticCommands(workspaceDir: string): Promise<{ command: string; trigger: Trigger; text: string }[]> {
  const found: { command: string; trigger: Trigger; text: string }[] = [];
  for (const entry of await listCommands(workspaceDir)) {
    if (!entry.file || entry.origin === "builtin") continue;
    const { data } = splitFrontmatter(await readFile(entry.file, "utf-8").catch(() => ""));
    if (typeof data.trigger !== "string") continue;
    const trigger = parseTrigger(data.trigger);
    if (typeof trigger !== "string") found.push({ command: entry.name.replace(/^\//, ""), trigger, text: data.trigger });
  }
  return found;
}

/** The register's published lines (`served`), to see a new one. */
async function publishedLines(workspaceDir: string): Promise<string[]> {
  const page = await readFile(path.join(knowledgeDirFor(workspaceDir), "drafts.md"), "utf8").catch(() => "");
  return page.split(/\r?\n/).filter((line) => /^\s*[-*]\s+`served`/.test(line)).map((line) => line.trim());
}

/** Why it runs now, for its task; null when it isn't due. Updates `state` (seen lines, first sight). */
async function dueReason(workspaceDir: string, trigger: Trigger, state: TriggerState, now: Date): Promise<string | null> {
  if (state.paused) return null;
  if (trigger.kind === "event" && trigger.event === "draft.published") {
    const lines = await publishedLines(workspaceDir);
    if (!state.seen) {
      state.seen = lines;
      return null;
    }
    const fresh = lines.filter((line) => !state.seen!.includes(line));
    state.seen = lines;
    return fresh.length ? `newly published in the register:\n${fresh.join("\n")}` : null;
  }
  const last = state.lastRun ? new Date(state.lastRun) : null;
  if (!last) {
    // First sight: from now on, never a burst of what was due before.
    state.lastRun = now.toISOString();
    return null;
  }
  if (trigger.kind === "event") return now.getTime() - last.getTime() >= POLL_MS ? `look for what's new in the classroom (${trigger.event === "submission.new" ? "submissions" : "forum posts"}) since ${last.toISOString()}; if there's nothing, say so and stop` : null;
  const due = lastDue(trigger, now);
  return due && last < due ? `its schedule (${due.toISOString()})` : null;
}

const cliPath = () => path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "cli.js");

/**
 * Runs one automatic action as a session of its own and answers its questions so it publishes
 * nothing: an approval or a tool's confirmation, no; a question, to decide without publishing.
 */
export async function runAutomatic(workspaceDir: string, command: string, reason: string): Promise<{ ok: boolean; dir?: string }> {
  const task = [
    `/${command}`,
    "",
    `(An automatic action: it ran on its own because of ${reason}. No one can approve anything now: prepare what's needed in drafts/ and the Drafts register, publish or send nothing, and end with what you left prepared for the teacher.)`,
  ].join("\n");
  const sessions = sessionsDirFor(workspaceDir);
  const before = new Set(await readdir(sessions).catch(() => []));
  const child = spawn(process.execPath, [cliPath(), "run", "--dir", workspaceDir, "--mode", "guided", "--headless", "--plain", "--task", task], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1", NO_COLOR: "1" },
    stdio: "ignore",
    windowsHide: true,
  });
  let dir: string | undefined;
  const answer = setInterval(() => {
    void (async () => {
      if (!dir) {
        const fresh = (await readdir(sessions).catch(() => [])).filter((name) => !before.has(name) && name.endsWith("-run"));
        if (fresh.length) dir = path.join(sessions, fresh.sort().at(-1)!);
        if (!dir) return;
      }
      const transcript = await readFile(path.join(dir, "transcript.jsonl"), "utf8").catch(() => "");
      const events = transcript.split("\n").filter(Boolean).map((line) => {
        try {
          return JSON.parse(line) as { event?: string; tool?: string; input?: { options?: unknown[] } };
        } catch {
          return null;
        }
      });
      const open: { tool?: string; input?: { options?: unknown[] } }[] = [];
      for (const event of events) {
        if (event?.event === "pre_tool_use") open.push(event);
        else if (event?.event === "post_tool_use" || event?.event === "post_tool_use_failure") {
          const index = open.findIndex((one) => one.tool === event.tool);
          if (index >= 0) open.splice(index, 1);
        }
      }
      const pending = open.at(-1);
      const response = path.join(dir, "approval-response.txt");
      if (!pending || existsSync(response)) return;
      const reply = /ask_human/.test(pending.tool ?? "") ? "Nobody can answer now (an automatic action): decide what's prudent, publishing nothing." : "n";
      await writeFile(response, reply).catch(() => undefined);
    })();
  }, 1500);
  const code = await new Promise<number | null>((resolve) => child.on("exit", resolve));
  clearInterval(answer);
  return { ok: code === 0, dir };
}

/** One look at every subject: runs what's due, one action at a time. */
let running = false;
export async function tickTriggers(now = new Date(), onDone?: (run: AutomaticRun) => void): Promise<void> {
  if (running) return;
  running = true;
  try {
    for (const subject of (await listWorkspaces()).filter((one) => !one.missing)) {
      const commands = await automaticCommands(subject.dir);
      if (!commands.length) continue;
      const state = await readState(subject.dir);
      for (const { command, trigger } of commands) {
        const mine = (state.triggers[command] ??= {});
        const reason = await dueReason(subject.dir, trigger, mine, now);
        await writeState(subject.dir, state);
        if (!reason) continue;
        mine.lastRun = now.toISOString();
        await writeState(subject.dir, state);
        const result = await runAutomatic(subject.dir, command, reason);
        const run: AutomaticRun = { subject: subject.dir, command, at: now.toISOString(), dir: result.dir, ok: result.ok };
        state.runs.push(run);
        await writeState(subject.dir, state);
        onDone?.(run);
      }
    }
  } finally {
    running = false;
  }
}

/** The subject's automatic actions as the page lists them: trigger, last run, paused. */
export async function listTriggers(workspaceDir: string): Promise<{ command: string; trigger: string; lastRun?: string; paused: boolean }[]> {
  const state = await readState(workspaceDir);
  return (await automaticCommands(workspaceDir)).map(({ command, text }) => ({ command, trigger: text, lastRun: state.triggers[command]?.lastRun, paused: Boolean(state.triggers[command]?.paused) }));
}

export async function pauseTrigger(workspaceDir: string, command: string, paused: boolean): Promise<void> {
  const state = await readState(workspaceDir);
  (state.triggers[command] ??= {}).paused = paused;
  await writeState(workspaceDir, state);
}

/** The automatic runs the teacher hasn't opened yet, for the bell. */
export async function unseenRuns(workspaceDir: string): Promise<AutomaticRun[]> {
  return (await readState(workspaceDir)).runs.filter((run) => !run.seen);
}

export async function markRunSeen(workspaceDir: string, dir: string): Promise<void> {
  const state = await readState(workspaceDir);
  for (const run of state.runs) if (run.dir === dir) run.seen = true;
  await writeState(workspaceDir, state);
}
