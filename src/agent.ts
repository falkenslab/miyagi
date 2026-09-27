import { mkdir } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  buildSessionOptions,
  createConsoleRenderer,
  runChatTui,
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
import { friendlyToolLabel } from "./toolLabels.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  throw new Error(`Modo desconocido "${value}". Usa uno de: ${VALID_MODES.join(", ")}.`);
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
function buildSpec(runDir: string, kind: SessionKind): AgentSpec<WorkspaceSessionConfig> {
  const hasBrowser = kind !== "ingest";
  return {
    buildSystemPrompt,
    buildMcpServers: (config): Record<string, McpServerConfig> => (!hasBrowser ? {} : {
      playwright: {
        command: process.execPath,
        args: [
          PLAYWRIGHT_MCP_CLI,
          "--caps",
          "devtools",
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
            checkpointTitle: "Manual login required",
            checkpointLines: ["No saved credentials for this workspace.", "Log in manually in the already-open browser window."],
            checkpointQuestion: "Press Enter once you've finished logging in (or 'q' to cancel): ",
          },
        }
      : {}),
  };
}

/**
 * Reads the workspace's config.json, or — with a terminal in front — offers to create it
 * right there.
 */
async function resolveWorkspace(workspaceDir: string, canPrompt: boolean): Promise<WorkspaceConfig> {
  if (await workspaceExists(workspaceDir)) {
    const config = await ensureTeacherRole(workspaceDir, await readWorkspaceConfig(workspaceDir));
    return offerPracticeRunner(workspaceDir, config, canPrompt);
  }
  if (!process.stdin.isTTY) {
    throw new Error(
      `${workspaceDir} no es un workspace de teacher-agent (falta config.json). Ejecuta ` +
        '"teacher-agent init" ahí, o pasa --dir con un workspace existente.',
    );
  }
  return promptInitWorkspace(workspaceDir);
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
    console.log(ui.warn(`context/ ya no se usa: sus ${movedContext} ficheros se han movido a ${sourcesDirFor(workspaceDir)}.\n`));
  }
  if (await moveLegacyKnowledge(workspaceDir)) {
    console.log(ui.warn(
      `knowledge/ tenía la estructura antigua: se ha movido a ${legacyKnowledgeDirFor(workspaceDir)} ` +
        `(sus ficheros descargados, a ${sourcesDirFor(workspaceDir)}) y el agente reconstruirá la base de conocimiento a partir de ahí.\n`,
    ));
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
  if (kind === "ingest") return "Ingesta en la base de conocimiento (sin navegador)";
  if (kind === "explore") return "Explorando las capacidades de este Moodle";
  return `Modo: ${mode}${kind === "chat" ? " (chat)" : ""}`;
}

/** Entry point for the "run", "chat", "ingest" and "explore" subcommands — `args` excludes the subcommand itself. */
export async function runSession(kind: SessionKind, args: string[]): Promise<void> {
  const workspaceDir = resolveWorkspaceDir(args);
  const modeFlag = kind === "run" ? parseMode(args) : undefined;

  await loadWorkspaceEnv(workspaceDir);
  await ensureClaudeAuthPersisted();

  const canPrompt = Boolean(process.stdin.isTTY) && (kind === "run" || kind === "chat") && modeFlag !== "autonomous";
  const workspace = await resolveWorkspace(workspaceDir, canPrompt);
  const mode = await resolveMode(kind, modeFlag);
  const headless = await resolveHeadless(parseBooleanFlag(args, "--headless"), workspace.agent.headless);
  const hasCredentials = Boolean(workspace.classroom.username && workspace.classroom.password);

  // Manual login needs a visible browser window — no channel for it in autonomous or
  // headless (mirrors agent-kit's own includeManualLoginTool condition in session.ts).
  if (kind !== "ingest" && mode === "autonomous" && !hasCredentials) {
    throw new Error(
      "El modo autonomous no admite login manual (no hay forma de pedir ayuda a un humano): " +
        "guarda usuario y contraseña en config.json, o usa --mode guided/interactive.",
    );
  }
  if (kind !== "ingest" && headless && !hasCredentials) {
    throw new Error(
      "--headless necesita credenciales guardadas (no hay ventana visible para iniciar sesión " +
        "a mano): guarda usuario y contraseña en config.json, o quita --headless.",
    );
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

  const runDir = sessionDirFor(workspaceDir, kind);
  await mkdir(runDir, { recursive: true });
  if (kind !== "ingest") await writePlaywrightConfig(runDir, config.moodlePassword);

  console.log(ui.heading(sessionHeading(kind, mode)));
  console.log(ui.dim(`Workspace: ${workspace.classroom.label} (${workspaceDir})`));
  console.log(ui.dim(`Sesión: ${runDir}`));
  console.log(ui.dim(`Curso: ${config.moodleUrl} (id ${config.moodleCourseId})\n`));

  const { options } = await buildSessionOptions(config, runDir, buildSpec(runDir, kind), {
    autoCompactEnabled: await isAutoCompactEnabled(),
  });
  if (kind === "explore") options.maxTurns = EXPLORE_MAX_TURNS;

  if (kind === "chat") {
    await runChatTui(options, {
      welcomeMessage:
        "teacher-agent conectando con Moodle. Esc interrumpe la respuesta en curso; /exit o Ctrl+C (sin respuesta en curso) cierran la sesión.",
      promptLabel: `\n${ui.user("tú>")} `,
      agentLabel: ui.agent("teacher-agent>"),
      formatAction: friendlyToolLabel,
      initialPrompt: loadPrompt("messages/chat-opening-teacher.md"),
      sessionLogPath: path.join(runDir, "session.log"),
      historyPath: path.join(sessionsDirFor(workspaceDir), "history.jsonl"),
    });
    printSessionEnd(kind, workspaceDir, runDir, false);
    return;
  }

  // One-shot "run"/"ingest"/"explore": a single string prompt, printed straight to the
  // console via agent-kit's own normalized AgentEvent stream (runQuery()) — no interactive REPL.
  // Same console rendering as the chat (agent-kit's createConsoleRenderer): no blank line
  // between consecutive actions.
  const renderer = createConsoleRenderer({ formatAction: friendlyToolLabel });
  const run = runQuery(initialPrompt(kind, workspaceDir, args), options);

  // Without a handler, Ctrl+C killed the process on the spot, with no word about what was
  // kept. The first one interrupts the run and lets it close normally (so the end message
  // below still prints); a second one exits without waiting.
  let interrupted = false;
  const onSigint = () => {
    if (interrupted) {
      renderer.writeLine(ui.warn("Saliendo sin esperar. Lo registrado hasta ahora ya está guardado en disco."));
      process.exit(130);
    }
    interrupted = true;
    renderer.writeLine(ui.warn("Interrumpiendo y cerrando la sesión… (Ctrl+C otra vez para salir sin esperar)"));
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
  }
  printSessionEnd(kind, workspaceDir, runDir, interrupted);
  process.exitCode = interrupted ? 130 : failed ? 1 : 0;
}

/**
 * What the human sees when a session ends, however it ended: that nothing needs saving —
 * everything is written as it happens — and where each part of it is.
 */
function printSessionEnd(kind: SessionKind, workspaceDir: string, runDir: string, interrupted: boolean): void {
  const lines = [
    "",
    ui.heading(interrupted ? "Sesión interrumpida." : "Sesión cerrada."),
    ui.dim("No hay nada pendiente de guardar: todo se escribe en disco sobre la marcha."),
    ui.dim(`  - Acciones del agente y sus resultados: ${path.join(runDir, "transcript.jsonl")}`),
    ...(kind === "chat" ? [ui.dim(`  - La conversación tal como la has visto: ${path.join(runDir, "session.log")}`)] : []),
    ui.dim(`  - Lo que el agente ha aprendido: ${path.join(workspaceDir, "knowledge")}`),
    ...(interrupted
      ? [ui.dim("Lo que estaba haciendo al interrumpir puede haber quedado a medias (una nota sin guardar, una respuesta sin publicar); en la próxima sesión puedes pedirle que lo retome.")]
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
