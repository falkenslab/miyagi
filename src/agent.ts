import { mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
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
  knowledge,
  sources,
} from "@falkenslab/agent-kit";
import {
  draftsDirFor,
  ensureWorkspaceDefaults,
  isMigrationPending,
  knowledgeDirFor,
  workspaceLabel,
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
  resolveLanguage,
} from "./globalConfig.js";
import { promptInitWorkspace, promptMigrateClassroom, promptMode, promptPickWorkspace } from "./menu.js";
import { moodleTeacherActive } from "./classroom.js";
import { labsFor, NEVER_DOCKER_TOOL_NAMES } from "./practiceLabs.js";
import { listWorkspaces, locateWorkspace, registerWorkspace, workspaceIds } from "./workspaces.js";
import { buildSystemPrompt } from "./systemPrompt.js";
import { friendlyToolLabel, toolPhrase } from "./toolLabels.js";
import { installUploadGate } from "./uploadGate.js";
import { createDraftsServer, DRAFTS_SERVER } from "./drafts/server.js";
import { sessionSkills } from "./catalog.js";
import { t } from "./messages/index.js";
import { LOGO } from "./theme.js";
import { COURSE_PAGE_TYPES, tagCoursePages } from "./knowledgeTypes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** The installed version, for the chat header (package.json sits next to src/ and dist/). */
const VERSION = (JSON.parse(readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")) as { version: string }).version;
const loadPrompt = createPromptLoader(path.join(__dirname, "..", "prompts"));

/** "explore" is a bounded task (sign in, a few read tools, one page written): it doesn't need
 * the headroom of a full run. 80 since agent-kit 0.16: a real explore of the sandbox ran out at
 * 60 with the page still unwritten (the task list and the knowledge tools take turns). */
const EXPLORE_MAX_TURNS = 80;

/** The knowledge base's reading tools (agent-kit's `knowledge` server), for the subagents:
 * the file tools don't reach knowledge/ any more (agent-kit's ADR-024). */
const KNOWLEDGE_READ_TOOLS = ["mcp__knowledge__knowledge_index", "mcp__knowledge__knowledge_search", "mcp__knowledge__knowledge_read"];

/** moodle-mcp's tools miyagi never uses (they're the teacher's or the site's, not a teaching assistant's). */
const NEVER_MOODLE_TOOLS = [
  "enrol_users", "unenrol_user", "set_user_roles", "set_enrolment_method",
  "create_group", "update_group", "delete_group", "set_group_members", "auto_create_groups", "import_groups",
  "create_grouping", "delete_grouping", "set_grouping_groups",
  "send_message", "message_participants",
  "reset_course", "copy_course", "copy_between_sites",
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
  const valueFlags = new Set(["--dir", "--workspace", "-w", "--mode", "--task"]);
  return args.filter((arg, i) => !arg.startsWith("--") && !valueFlags.has(args[i - 1] ?? ""));
}

/**
 * The parts of the session that are genuinely domain-specific (system prompt, the drafts
 * toolbox, the plugin root, the approval wording). Everything else (tool/hook wiring per mode,
 * file-tool scoping, the approval and sources tools themselves, the installed extensions with
 * moodle-teacher among them) is agent-kit's own `buildSessionOptions()`, not repeated here.
 * Subagents: see buildSubagents() below. miyagi has no browser: the classroom is moodle-teacher's
 * (ADR-021).
 */
function buildSpec(kind: SessionKind, skills: string[]): AgentSpec<WorkspaceSessionConfig> {
  return {
    skills,
    extensions: [
      sources<WorkspaceSessionConfig>({ dir: (config) => config.sourcesDir }),
      // The course's pages (course/, topic/, activity/) next to the kit's own, all through the
      // kit's knowledge_* tools, never the file tools (agent-kit's ADR-024).
      knowledge<WorkspaceSessionConfig>({ dir: (config) => config.knowledgeDir, pageTypes: COURSE_PAGE_TYPES }),
    ],
    buildSystemPrompt,
    buildMcpServers: (config): Record<string, McpServerConfig> => ({
      // The drafts toolbox (download, copy, zip, PDF...) — file operations as code, not a
      // shell; with or without a classroom.
      ...(kind === "run" || kind === "chat" ? { [DRAFTS_SERVER]: createDraftsServer(config.draftsDir, config.draftsLimits) } : {}),
    }),
    pluginRoots: () => [path.join(__dirname, "..", "plugin")],
    // In run/chat: two helpers without a shell (researcher: public web; pedagogy-reviewer:
    // read-only critique). miyagi has no shell at all: practices run in docker-lab's labs (#45).
    // agent-kit's subagent gates restrict the Agent tool to these registered types, and each
    // subagent only gets the tools it lists.
    buildSubagents: () => {
      if (kind !== "run" && kind !== "chat") return undefined;
      const agents: Record<string, AgentDefinition> = {
        researcher: {
          description: "Researches concrete questions on the public web (official documentation first) and returns sourced findings with dates and confidence. Invoke with the questions and what you need back.",
          tools: ["WebSearch", "WebFetch", "Read", "Glob", "Grep", ...KNOWLEDGE_READ_TOOLS],
          prompt: loadPrompt("system/researcher.md"),
          maxTurns: 40,
        },
        "pedagogy-reviewer": {
          description: "Instructional-design expert that reviews a plan or an activity (alignment of objectives, activities and assessment; methodology fit; workload; diversity) and returns a prioritized critique. Invoke with what to review and the knowledge-base pages where it's written.",
          tools: ["Read", "Glob", "Grep", ...KNOWLEDGE_READ_TOOLS],
          prompt: loadPrompt("system/pedagogy-reviewer.md"),
          maxTurns: 20,
        },
      };
      return { agents, allowedSubagentTypes: Object.keys(agents) };
    },
    // moodle-teacher's tools that are never miyagi's, whatever the mode (principles, ADR-014):
    // enrolments and roles, groups and who is in them, private messages, a whole course reset or
    // copied out of this one. The prompt says so; this makes it true in autonomous too.
    // And docker-lab's tools on the computer's whole Docker: only its labs, under their policy (#45).
    disallowedTools: [...NEVER_MOODLE_TOOLS.map((tool) => `mcp__moodle__${tool}`), ...NEVER_DOCKER_TOOL_NAMES],
    // The approval before an extension's tool that changes something is the kit's guided gate
    // (ADR-021): a deletion always asks (moodle-mcp's destructiveHint), and an approved
    // request_human_approval covers the batch until the teacher's next message. Autonomous
    // publishes by design, so it lets them run.
    extensionGate: { autonomous: "allow" },
    humanApprovalTexts: {
      description: loadPrompt("tools/human-approval-description.md"),
      approved: loadPrompt("tools/human-approval-approved.md"),
      rejected: loadPrompt("tools/human-approval-rejected.md"),
    },
  };
}

/**
 * Reads the workspace's config.json, or — with a terminal in front — offers to create it
 * right there.
 */
/** The workspace's config, or the id of the one just created here: then the session doesn't start. */
async function resolveWorkspace(workspaceDir: string, canPrompt: boolean): Promise<WorkspaceConfig | { created: string }> {
  if (await workspaceExists(workspaceDir)) {
    const config = await ensureWorkspaceDefaults(workspaceDir, await readWorkspaceConfig(workspaceDir));
    // A classroom from before moodle-teacher: moved there, or this session works without it (ADR-021).
    const migrated = canPrompt ? await promptMigrateClassroom(workspaceDir, config) : config;
    return migrated;
  }
  if (!process.stdin.isTTY) {
    throw new Error(t().notAWorkspace(workspaceDir));
  }
  const { id } = await promptInitWorkspace(workspaceDir);
  return { created: id };
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
 * guided (the teacher may have to sign in in moodle-teacher's window), "ingest" publishes nothing. */
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
  const modeFlag = kind === "run" ? parseMode(args) : undefined;
  // Named by --dir/-w or the current directory; otherwise, with a terminal, the list (ADR-023).
  let workspaceDir = await locateWorkspace(args);
  if (!workspaceDir) {
    if (!process.stdin.isTTY || (kind !== "run" && kind !== "chat")) throw new Error(t().noWorkspaceHere(await workspaceIds()));
    workspaceDir = await promptPickWorkspace(await listWorkspaces());
    if (!workspaceDir) {
      const { id } = await promptInitWorkspace();
      console.log(ui.dim(t().setupSaved(`miyagi ${kind} -w ${id}`)));
      return;
    }
  }

  await loadWorkspaceEnv(workspaceDir);
  await ensureClaudeAuthPersisted();

  const canPrompt = Boolean(process.stdin.isTTY) && (kind === "run" || kind === "chat") && modeFlag !== "autonomous";
  const workspace = await resolveWorkspace(workspaceDir, canPrompt);
  // Just configured: stop here, so the session starts clean (the full-screen chat) from its
  // own command instead of right after the setup wizard's prompts.
  if ("created" in workspace) {
    console.log(ui.dim(t().setupSaved(`miyagi ${kind} -w ${workspace.created}`)));
    return;
  }
  await registerWorkspace(workspaceDir, workspaceLabel(workspaceDir, workspace), workspace.kind ?? "subject");
  // The classroom is moodle-teacher's (ADR-021): it needs moving there if it's from before, and
  // the extension installed and on. Otherwise the session works without it, and says how to fix it.
  const pending = workspace.classroom && workspace.classroom.connector !== "moodle-teacher";
  if (pending) console.log(ui.warn(t().classroomNeedsMoving));
  const active = !pending && workspace.classroom ? await moodleTeacherActive(workspaceDir) : false;
  if (workspace.classroom && !pending && !active) console.log(ui.warn(t().moodleTeacherMissing));
  const classroom = active ? workspace.classroom : undefined;
  if (kind === "explore" && !classroom) {
    console.log(ui.warn(t().exploreNeedsClassroom(workspaceDir)));
    return;
  }
  const mode = await resolveMode(kind, modeFlag);

  const config = toSessionConfig(workspaceDir, workspace, {
    mode,
    kind,
    // "explore" only writes moodle-capabilities.md: a pending rebuild waits for a real session.
    migrationPending: kind === "explore" ? false : await prepareKnowledgeBase(workspaceDir),
    language: await resolveLanguage(workspace.agent.language),
    instructions: await readInstructions(workspaceDir),
    labs: await labsFor(workspaceDir, workspaceLabel(workspaceDir, workspace)),
  });
  if (!classroom) config.hasMoodle = false;

  await mkdir(draftsDirFor(workspaceDir), { recursive: true }); // workspaces from before drafts/
  await tagCoursePages(knowledgeDirFor(workspaceDir)); // root pages from before the knowledge_* tools
  const autoCompactEnabled = await isAutoCompactEnabled();
  const skills = await sessionSkills(workspaceDir);

  /** The session's options for a run folder: its tools and hooks, the publish and upload gates. */
  async function openSession(runDir: string, run?: RunFolder) {
    // The whole result, not only options and modeControl: the chat needs the extensions, their sign-in and labels.
    const opened = await buildSessionOptions(config, runDir, buildSpec(kind, skills), { autoCompactEnabled, run });
    const { options } = opened;
    if (kind === "explore") options.maxTurns = EXPLORE_MAX_TURNS;
    // GIFT checked before it's imported. Without a classroom nothing publishes.
    if (classroom && kind !== "ingest") installUploadGate(options);
    return opened;
  }

  // The Ink chat shows these in its own header (full screen would wipe anything printed
  // before it); the readline chat, like the one-shot kinds, gets them printed.
  const plain = parseBooleanFlag(args, "--plain") === true || !process.stdin.isTTY || !process.stdout.isTTY;
  const printHeading = (runDir?: string): void => {
    console.log(ui.heading(sessionHeading(kind, mode)));
    console.log(ui.dim(t().headingWorkspace(workspaceLabel(workspaceDir, workspace), workspaceDir)));
    if (runDir) console.log(ui.dim(t().headingSession(runDir)));
    console.log(ui.dim(classroom ? t().headingCourse(classroom.url, classroom.courseId) : `${t().headerClassroom}: ${t().noClassroom}
`));
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
          title: `miyagi v${VERSION}`,
          art: LOGO,
          // One line, cut to the terminal's width: short values only (the full paths are
          // printed again when the session ends).
          fields: {
            [t().headerWorkspace]: workspaceLabel(workspaceDir, workspace),
            ...(classroom
              ? { [t().headerCourse]: `${new URL(classroom.url).host} · id ${classroom.courseId}` }
              : { [t().headerClassroom]: t().noClassroom }),
          },
        },
        mode,
        plain,
        fullscreen: parseBooleanFlag(args, "--inline") !== true,
        welcomeMessage: plain ? t().welcomePlain : ui.dim(t().welcomeInk),
        promptLabel: `\n${ui.user(t().promptLabel)} `,
        agentLabel: ui.agent("miyagi>"),
        formatAction: friendlyToolLabel,
        toolPhrase,
        initialPrompt: loadPrompt(classroom ? "messages/chat-opening-teacher.md" : "messages/chat-opening-teacher-standalone.md"),
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
  const run = runQuery(initialPrompt(kind, workspaceDir, args, config.hasMoodle), options);

  // Without a handler, Ctrl+C killed the process on the spot, with no word about what was
  // kept. The first one interrupts the run and lets it close normally (so the end message
  // below still prints); a second one exits without waiting.
  let interrupted = false;
  const onSigint = () => {
    if (interrupted) {
      renderer.writeLine(ui.warn(t().exitingNow));
      process.exit(130);
    }
    interrupted = true;
    renderer.writeLine(ui.warn(t().interrupting));
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

function initialPrompt(kind: SessionKind, workspaceDir: string, args: string[], hasMoodle: boolean): string {
  if (kind === "ingest") return ingestPrompt(workspaceDir, args);
  if (kind === "explore") return loadPrompt("messages/explore-initial.md");
  // --task "<text>" gives the run one concrete job (e.g. "/miyagi:build-course ..." or
  // "corrige la Tarea 2") instead of managing the whole course. Without a classroom there's
  // no Moodle to log into: the general mission reviews the subject instead.
  const task = parseFlag(args, "--task")?.trim();
  const suffix = hasMoodle ? "" : "-standalone";
  const mission = task
    ? loadPrompt(`messages/run-mission-task${suffix}.md`, { task })
    : loadPrompt(`messages/run-mission-teacher${suffix}.md`);
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
