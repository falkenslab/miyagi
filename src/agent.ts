import { mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  buildSessionOptions,
  createProgressView,
  runChatInk,
  type RunFolder,
  runQuery,
  createPromptLoader,
  ui,
  type AgentDefinition,
  type AgentEvent,
  type AgentSpec,
  type McpServerConfig,
  type Mode,
} from "@falkenslab/agent-kit";
import {
  draftsDirFor,
  ensureTeacherRole,
  isMigrationPending,
  legacyKnowledgeDirFor,
  moveLegacyContext,
  moveLegacyKnowledge,
  readInstructions,
  readWorkspaceConfig,
  sessionDirFor,
  sessionsDirFor,
  sourcesDirFor,
  toSessionConfig,
  workspaceExists,
  type SessionKind,
  type WorkspaceConfig,
  type WorkspaceSessionConfig,
} from "./workspace.js";
import {
  ensureClaudeAuthPersisted,
  isAutoCompactEnabled,
  loadWorkspaceEnv,
  resolveHeadless,
  resolveLanguage,
} from "./globalConfig.js";
import { offerPracticeRunner, promptInitWorkspace, promptMode } from "./menu.js";
import { buildSystemPrompt } from "./systemPrompt.js";
import { playwrightConfigPathFor, writePlaywrightConfig } from "./playwrightConfig.js";
import { friendlyToolLabel, toolPhrase } from "./toolLabels.js";
import { installPublishGate } from "./publishGate.js";
import { sessionSkills } from "./catalog.js";
import { t } from "./messages/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** The installed version, for the chat header (package.json sits next to src/ and dist/). */
const VERSION = (JSON.parse(readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")) as { version: string }).version;
const loadPrompt = createPromptLoader(path.join(__dirname, "..", "prompts"));

/** The installed @playwright/mcp's CLI, launched with this same Node — its version is pinned
 * in package.json instead of whatever `npx @playwright/mcp@latest` happens to fetch. The
 * package doesn't export cli.js, so it's resolved next to its package.json. */
const PLAYWRIGHT_MCP_CLI = path.join(
  path.dirname(createRequire(import.meta.url).resolve("@playwright/mcp/package.json")),
  "cli.js",
);

/** "explore" is a bounded task (login, a few look-and-cancel screens, one page written): it
 * doesn't need the headroom of a full run. */
const EXPLORE_MAX_TURNS = 60;

/**
 * The chat header's logo: an owl in a mortarboard. One-column characters only (ASCII):
 * agent-kit measures the logo to place the title beside it, and an emoji would shift it.
 */
const LOGO = [
  ui.dim("  ____"),
  ui.dim(" /___/|"),
  `${ui.accent(" {o,o}")}${ui.warn("'")}`,
  ui.accent(" |)__)"),
  ui.dim(" -\"-\"-"),
];

const VALID_MODES: readonly Mode[] = ["interactive", "guided", "autonomous"];

export function parseFlag(args: string[], name: string): string | undefined {
  const withEquals = args.find((a) => a.startsWith(`${name}=`));
  if (withEquals) return withEquals.slice(name.length + 1);
  const idx = args.indexOf(name);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

/** A bare boolean flag: `--name`/`--name=true` → true, `--name=false` → false, absent → undefined. */
function parseBooleanFlag(args: string[], name: string): boolean | undefined {
  const withEquals = args.find((a) => a.startsWith(`${name}=`));
  if (withEquals) return withEquals.slice(name.length + 1) !== "false";
  return args.includes(name) ? true : undefined;
}

function parseMode(args: string[]): Mode | undefined {
  const value = parseFlag(args, "--mode");
  if (!value) return undefined;
  if ((VALID_MODES as readonly string[]).includes(value)) return value as Mode;
  throw new Error(t().unknownMode(value, VALID_MODES.join(", ")));
}

/** Arguments that aren't flags nor a flag's value, e.g. the files given to "ingest". */
function positionalArgs(args: string[]): string[] {
  const valueFlags = new Set(["--dir", "--mode", "--task"]);
  return args.filter((arg, i) => !arg.startsWith("--") && !valueFlags.has(args[i - 1] ?? ""));
}

/** `--dir <path>`, or the current directory — a workspace works like a git repo. */
export function resolveWorkspaceDir(args: string[]): string {
  return path.resolve(parseFlag(args, "--dir") ?? process.cwd());
}

/**
 * The parts of the session that are genuinely domain-specific (system prompt, the Playwright
 * MCP server, the plugin root, the RCE-equivalent disallowed tool, human-approval/manual-login
 * wording). Everything else (tool/hook wiring per mode, file-tool scoping, the
 * approval/manual-login/save-to-sources MCP tools themselves) is agent-kit's own
 * `buildSessionOptions()`, not repeated here. Subagents: see buildSubagents() below. An
 * "ingest" session has no browser: no Playwright server, no manual login.
 */
function buildSpec(runDir: string, kind: SessionKind, skills: string[]): AgentSpec<WorkspaceSessionConfig> {
  const hasBrowser = kind !== "ingest";
  return {
    skills,
    buildSystemPrompt,
    buildMcpServers: (config): Record<string, McpServerConfig> => (!hasBrowser ? {} : {
      playwright: {
        command: process.execPath,
        args: [
          PLAYWRIGHT_MCP_CLI,
          "--config",
          playwrightConfigPathFor(runDir),
          "--output-dir",
          path.join(runDir, "browser-files"),
          "--user-data-dir",
          path.join(runDir, "browser-profile"),
          ...(config.headless ? ["--headless"] : []),
        ],
      },
    }),
    pluginRoots: () => [path.join(__dirname, "..", "plugin")],
    // In run/chat: two helpers without a shell (researcher: public web; pedagogy-reviewer:
    // read-only critique), always on; and the opt-in practice-runner
    // (workspace.agent.allowPracticeRunner, off by default — the only thing that grants a shell).
    // Registering any subagent puts Agent and Bash in the session's tools, but agent-kit's three
    // subagent gates keep Bash away from the main agent, restrict the Agent tool to these
    // registered types, and each subagent only gets the tools it lists.
    buildSubagents: (config) => {
      if (kind !== "run" && kind !== "chat") return undefined;
      const agents: Record<string, AgentDefinition> = {
        researcher: {
          description: "Researches concrete questions on the public web (official documentation first) and returns sourced findings with dates and confidence. Invoke with the questions and what you need back.",
          tools: ["WebSearch", "WebFetch", "Read", "Glob", "Grep"],
          prompt: loadPrompt("system/researcher.md"),
          maxTurns: 40,
        },
        "pedagogy-reviewer": {
          description: "Instructional-design expert that reviews a plan or an activity (alignment of objectives, activities and assessment; methodology fit; workload; diversity) and returns a prioritized critique. Invoke with what to review and the knowledge-base pages where it's written.",
          tools: ["Read", "Glob", "Grep"],
          prompt: loadPrompt("system/pedagogy-reviewer.md"),
          maxTurns: 20,
        },
      };
      if (config.allowPracticeRunner) {
        agents["practice-runner"] = {
          description: "Runs a practical activity in Docker containers inside practice/<activity>/ - the teacher's own statement or solution before publishing it, or a student's submission while grading - and reports exactly what ran and what came out. Invoke with the activity's slug, what to check and where its files are (sources/ or practice/).",
          tools: ["Bash", "Read", "Write", "Glob"],
          // Forward slashes even on Windows: interpolated into shell commands run through
          // Bash (Git Bash on Windows), which doesn't want backslashes.
          prompt: loadPrompt("system/practice-runner.md", {
            practiceDir: config.practiceDir.split(path.sep).join("/"),
            sourcesDir: (config.sourcesDir ?? "").split(path.sep).join("/"),
          }),
          maxTurns: 60,
        };
      }
      return { agents, allowedSubagentTypes: Object.keys(agents) };
    },
    // browser_run_code_unsafe runs arbitrary JS in the Playwright server process (not the
    // page) — Microsoft's own description calls it "RCE-equivalent". disallowedTools takes
    // full precedence over canUseTool/allowAnyMcpTool (confirmed empirically, see
    // agent-kit's own session.ts doc comment).
    disallowedTools: ["mcp__playwright__browser_run_code_unsafe"],
    humanApprovalTexts: {
      description: loadPrompt("tools/human-approval-description.md"),
      approved: loadPrompt("tools/human-approval-approved.md"),
      rejected: loadPrompt("tools/human-approval-rejected.md"),
    },
    ...(hasBrowser
      ? {
          manualInterventionTexts: {
            toolDescription: loadPrompt("tools/manual-login-description.md"),
            confirmedMessage: loadPrompt("tools/manual-login-confirmed.md"),
            checkpointTitle: t().manualLoginTitle,
            checkpointLines: t().manualLoginLines,
            checkpointQuestion: t().manualLoginQuestion,
          },
        }
      : {}),
  };
}

/**
 * Reads the workspace's config.json, or — with a terminal in front — offers to create it
 * right there.
 */
/** The workspace's config, or null when it was just created here: then the session doesn't start. */
async function resolveWorkspace(workspaceDir: string, canPrompt: boolean): Promise<WorkspaceConfig | null> {
  if (await workspaceExists(workspaceDir)) {
    const config = await ensureTeacherRole(workspaceDir, await readWorkspaceConfig(workspaceDir));
    return offerPracticeRunner(workspaceDir, config, canPrompt);
  }
  if (!process.stdin.isTTY) {
    throw new Error(t().notAWorkspace(workspaceDir));
  }
  await promptInitWorkspace(workspaceDir);
  return null;
}

/**
 * Moves a moodle-agent aula's context/ and pre-knowledge base knowledge/ aside (see
 * moveLegacyContext()/moveLegacyKnowledge()) and tells whether the knowledge base still has
 * to be rebuilt — the agent does that part, prompted by the migration section of its
 * system prompt.
 */
async function prepareKnowledgeBase(workspaceDir: string): Promise<boolean> {
  const movedContext = await moveLegacyContext(workspaceDir);
  if (movedContext > 0) {
    console.log(ui.warn(t().contextMoved(movedContext, sourcesDirFor(workspaceDir))));
  }
  if (await moveLegacyKnowledge(workspaceDir)) {
    console.log(ui.warn(t().knowledgeMoved(legacyKnowledgeDirFor(workspaceDir), sourcesDirFor(workspaceDir))));
  }
  return isMigrationPending(workspaceDir);
}

/** The mode each kind runs in: "run" asks (or takes --mode), "chat" and "explore" are
 * guided (a human may have to log in by hand), "ingest" publishes nothing. */
async function resolveMode(kind: SessionKind, modeFlag: Mode | undefined): Promise<Mode> {
  if (kind === "ingest") return "autonomous";
  if (kind !== "run") return "guided";
  return modeFlag ?? (process.stdin.isTTY ? await promptMode() : "guided");
}

function sessionHeading(kind: SessionKind, mode: Mode): string {
  if (kind === "ingest") return t().headingIngest;
  if (kind === "explore") return t().headingExplore;
  return t().headingMode(mode, kind === "chat");
}

/** Entry point for the "run", "chat", "ingest" and "explore" subcommands — `args` excludes the subcommand itself. */
export async function runSession(kind: SessionKind, args: string[]): Promise<void> {
  const workspaceDir = resolveWorkspaceDir(args);
  const modeFlag = kind === "run" ? parseMode(args) : undefined;

  await loadWorkspaceEnv(workspaceDir);
  await ensureClaudeAuthPersisted();

  const canPrompt = Boolean(process.stdin.isTTY) && (kind === "run" || kind === "chat") && modeFlag !== "autonomous";
  const workspace = await resolveWorkspace(workspaceDir, canPrompt);
  // Just configured: stop here, so the session starts clean (the full-screen chat) from its
  // own command instead of right after the setup wizard's prompts.
  if (!workspace) {
    console.log(ui.dim(t().setupSaved(kind, workspaceDir)));
    return;
  }
  const mode = await resolveMode(kind, modeFlag);
  const headless = await resolveHeadless(parseBooleanFlag(args, "--headless"), workspace.agent.headless);
  const hasCredentials = Boolean(workspace.classroom.username && workspace.classroom.password);

  // Manual login needs a visible browser window — no channel for it in autonomous or
  // headless (mirrors agent-kit's own includeManualLoginTool condition in session.ts).
  if (kind !== "ingest" && mode === "autonomous" && !hasCredentials) {
    throw new Error(t().autonomousNeedsCredentials);
  }
  if (kind !== "ingest" && headless && !hasCredentials) {
    throw new Error(t().headlessNeedsCredentials);
  }

  const config = toSessionConfig(workspaceDir, workspace, {
    mode,
    kind,
    headless,
    // "explore" only writes moodle-capabilities.md: a pending rebuild waits for a real session.
    migrationPending: kind === "explore" ? false : await prepareKnowledgeBase(workspaceDir),
    language: await resolveLanguage(workspace.agent.language),
    instructions: await readInstructions(workspaceDir),
  });

  await mkdir(draftsDirFor(workspaceDir), { recursive: true }); // workspaces from before drafts/
  const autoCompactEnabled = await isAutoCompactEnabled();
  const skills = await sessionSkills(workspaceDir);

  /** The session's options for a run folder: its browser, its tools and hooks, the publish gate. */
  async function openSession(runDir: string, run?: RunFolder) {
    if (kind !== "ingest") await writePlaywrightConfig(runDir, config.moodlePassword);
    const { options, modeControl } = await buildSessionOptions(config, runDir, buildSpec(runDir, kind, skills), { autoCompactEnabled, run });
    if (kind === "explore") options.maxTurns = EXPLORE_MAX_TURNS;
    // The approval before publishing, enforced (it only acts in guided; ingest has no browser).
    if (kind !== "ingest") installPublishGate(options, runDir, modeControl, loadPrompt("tools/human-approval-approved.md"));
    return { options, modeControl };
  }

  // The Ink chat shows these in its own header (full screen would wipe anything printed
  // before it); the readline chat, like the one-shot kinds, gets them printed.
  const plain = parseBooleanFlag(args, "--plain") === true || !process.stdin.isTTY || !process.stdout.isTTY;
  const printHeading = (runDir?: string): void => {
    console.log(ui.heading(sessionHeading(kind, mode)));
    console.log(ui.dim(t().headingWorkspace(workspace.classroom.label, workspaceDir)));
    if (runDir) console.log(ui.dim(t().headingSession(runDir)));
    console.log(ui.dim(t().headingCourse(config.moodleUrl, config.moodleCourseId)));
  };

  if (kind === "chat") {
    if (plain) printHeading();
    // Each chat is a run folder under sessions/ keeping its whole conversation (agent-kit's
    // runs, ADR-011): --continue starts with the latest one, /resume switches to another, and
    // either reopens the session in that same folder. The opener runs again on each switch.
    let runDir = "";
    // Full screen by default; --inline keeps the history in the terminal's scrollback, and
    // --plain (or no TTY) falls back to the readline chat.
    await runChatInk(
      async (run) => {
        runDir = run.dir;
        return await openSession(run.dir, run);
      },
      {
        runsDir: sessionsDirFor(workspaceDir),
        language: config.language,
        header: {
          title: `teacher-agent v${VERSION}`,
          art: LOGO,
          // One line, cut to the terminal's width: short values only (the full paths are
          // printed again when the session ends).
          fields: {
            [t().headerWorkspace]: workspace.classroom.label,
            [t().headerCourse]: `${new URL(config.moodleUrl).host} · id ${config.moodleCourseId}`,
          },
        },
        mode,
        plain,
        fullscreen: parseBooleanFlag(args, "--inline") !== true,
        welcomeMessage: plain ? t().welcomePlain : ui.dim(t().welcomeInk),
        promptLabel: `\n${ui.user(t().promptLabel)} `,
        agentLabel: ui.agent("teacher-agent>"),
        formatAction: friendlyToolLabel,
        toolPhrase,
        initialPrompt: loadPrompt("messages/chat-opening-teacher.md"),
        historyPath: path.join(sessionsDirFor(workspaceDir), "history.jsonl"),
      },
    );
    printSessionEnd(kind, workspaceDir, runDir, false);
    return;
  }

  const runDir = sessionDirFor(workspaceDir, kind);
  await mkdir(runDir, { recursive: true });
  printHeading(runDir);
  const { options } = await openSession(runDir);

  // One-shot "run"/"ingest"/"explore": a single string prompt and agent-kit's normalized
  // AgentEvent stream (runQuery()), shown with its Ink progress view: a spinner with the
  // current action, the chat's approval panels and a status bar. --plain (or no TTY) keeps
  // the plain console lines.
  const renderer = createProgressView({ formatAction: friendlyToolLabel, toolPhrase, mode, plain });
  const run = runQuery(initialPrompt(kind, workspaceDir, args), options);

  // Without a handler, Ctrl+C killed the process on the spot, with no word about what was
  // kept. The first one interrupts the run and lets it close normally (so the end message
  // below still prints); a second one exits without waiting.
  let interrupted = false;
  // As an "info" event, not writeLine(): agent-kit 0.13's progress view drops writeLine()'s
  // text (it goes to its inner, silent console renderer); an event shows in both views.
  const notice = (text: string) => renderer.render({ type: "info", level: "warning", text });
  const onSigint = () => {
    if (interrupted) {
      notice(t().exitingNow);
      process.exit(130);
    }
    interrupted = true;
    notice(t().interrupting);
    void run.interrupt().finally(() => run.close());
  };
  process.on("SIGINT", onSigint);

  let failed = false;
  try {
    for await (const event of run.events as AsyncIterable<AgentEvent>) {
      renderer.render(event);
      if (event.type === "turn-end") failed = event.failed;
    }
  } finally {
    process.off("SIGINT", onSigint);
    run.close();
    renderer.endLine();
    await renderer.close();
  }
  printSessionEnd(kind, workspaceDir, runDir, interrupted);
  process.exitCode = interrupted ? 130 : failed ? 1 : 0;
}

/**
 * What the human sees when a session ends, however it ended: that nothing needs saving —
 * everything is written as it happens — and where each part of it is.
 */
/** knowledge/drafts.md lists only the drafts still hidden in Moodle, one list item each. */
function hasPendingDrafts(workspaceDir: string): boolean {
  try {
    return /^\s*[-*] /m.test(readFileSync(path.join(workspaceDir, "knowledge", "drafts.md"), "utf-8"));
  } catch {
    return false;
  }
}

function printSessionEnd(kind: SessionKind, workspaceDir: string, runDir: string, interrupted: boolean): void {
  const lines = [
    "",
    ui.heading(interrupted ? t().sessionInterrupted : t().sessionClosed),
    ui.dim(t().nothingPending),
    ui.dim(t().endTranscript(path.join(runDir, "transcript.jsonl"))),
    ...(kind === "chat" ? [ui.dim(t().endConversation(path.join(runDir, "session.log")))] : []),
    ui.dim(t().endKnowledge(path.join(workspaceDir, "knowledge"))),
    ...(hasPendingDrafts(workspaceDir)
      ? [ui.warn(t().endDrafts(path.join(workspaceDir, "knowledge", "drafts.md")))]
      : []),
    ...(interrupted
      ? [ui.dim(t().endInterruptedNote)]
      : []),
  ];
  console.log(lines.join("\n"));
}

function initialPrompt(kind: SessionKind, workspaceDir: string, args: string[]): string {
  if (kind === "ingest") return ingestPrompt(workspaceDir, args);
  if (kind === "explore") return loadPrompt("messages/explore-initial.md");
  // --task "<text>" gives the run one concrete job (e.g. "/teacher-agent:build-course ..." or
  // "corrige la Tarea 2") instead of managing the whole course.
  const task = parseFlag(args, "--task")?.trim();
  const mission = task
    ? loadPrompt("messages/run-mission-task.md", { task })
    : loadPrompt("messages/run-mission-teacher.md");
  return loadPrompt("messages/run-initial.md", { mission });
}

/** "ingest" with files → just those (relative to the current directory); without → everything pending in sources/. */
function ingestPrompt(workspaceDir: string, args: string[]): string {
  const files = positionalArgs(args).map((file) => path.relative(workspaceDir, path.resolve(file)).split(path.sep).join("/"));
  const targets = files.length > 0
    ? `these files: ${files.map((file) => `\`${file}\``).join(", ")}`
    : "every file in `sources/` that has no summary page in the knowledge base yet";
  return loadPrompt("messages/ingest-initial.md", { targets });
}
