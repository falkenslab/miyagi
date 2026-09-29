import { chmod, mkdir, readdir, readFile, rename, rmdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BaseSessionConfig, Mode } from "@falkenslab/agent-kit";

export type AgentPersona = "formal" | "warm" | "motivating";

/**
 * A one-shot course management run, a chat, an offline ingest of sources/ into the
 * knowledge base (no browser), or the short "explore" probe of what this Moodle supports.
 */
export type SessionKind = "run" | "chat" | "ingest" | "explore";

/**
 * The shape of `<workspace>/config.json` — the same one moodle-agent wrote for a teacher
 * aula, so an existing one opens as-is.
 */
export interface WorkspaceConfig {
  /** Everything about *this* Moodle course, independent of who is acting on it. */
  classroom: {
    label: string;
    description?: string;
    url: string;
    courseId: string;
    username?: string;
    password?: string;
  };
  /** How the agent shows up on that course. */
  agent: {
    /** Never asked: teacher-agent always writes "teacher" (see ensureTeacherRole()), so another
     * agent opening the same workspace knows whose it is; "student" is rejected when reading. */
    role?: "student" | "teacher";
    persona?: AgentPersona;
    /** Free text, e.g. "español". Falls back to the global config's defaultLanguage. */
    language?: string;
    /** Falls back to the global config's defaultHeadless, then false. --headless wins over both. */
    headless?: boolean;
    /** Opt-in, off by default: registers the practice-runner subagent, the only thing that gets
     * a shell (Docker only, inside practice/) — see agent.ts's buildSubagents(). */
    allowPracticeRunner?: boolean;
  };
}

/** `WorkspaceConfig` flattened together with the CLI's own choices (mode, session kind,
 * resolved headless/language, instructions.md's content) into what `AgentSpec`'s methods
 * actually see. */
export interface WorkspaceSessionConfig extends BaseSessionConfig {
  moodleUrl: string;
  moodleCourseId: string;
  moodleUsername?: string;
  moodlePassword?: string;
  agentPersona?: AgentPersona;
  knownLanguage?: string;
  customInstructions?: string;
  headless: boolean;
  allowPracticeRunner?: boolean;
  /** Where the practice-runner subagent works: one folder per activity. */
  practiceDir: string;
  /** Orthogonal to `mode` (see agent-kit's own agentSpec.ts doc comment on `Mode`) — set
   * by `agent.ts` from the CLI subcommand, decides which base prompt buildSystemPrompt()
   * loads and whether the session has a browser at all. */
  kind: SessionKind;
  /** A legacy knowledge/ was moved to knowledge-legacy/ and the knowledge base isn't rebuilt yet. */
  migrationPending: boolean;
}

export function workspaceConfigPath(workspaceDir: string): string {
  return path.join(workspaceDir, "config.json");
}

export function knowledgeDirFor(workspaceDir: string): string {
  return path.join(workspaceDir, "knowledge");
}

/** Original files, read-only for the agent: the material the human drops in (syllabus, rubrics, model solutions), plus what it saves with `save_to_sources` (downloaded course documents). */
export function sourcesDirFor(workspaceDir: string): string {
  return path.join(workspaceDir, "sources");
}

/** The editable source of every resource the agent builds for Moodle (HTML, GIFT, text,
 * images), one folder per resource: the teacher's material, not notes, so outside the
 * knowledge base. Uploaded hidden to be tested in Moodle before students see it. */
export function draftsDirFor(workspaceDir: string): string {
  return path.join(workspaceDir, "drafts");
}

/** Practical activities checked in containers by the practice-runner subagent (Dockerfiles,
 * scripts, student submissions copied in): working files, not notes, so outside the knowledge base. */
export function practiceDirFor(workspaceDir: string): string {
  return path.join(workspaceDir, "practice");
}

/** Where a pre-knowledge base knowledge/ is moved so the agent can rebuild the knowledge base from it. */
export function legacyKnowledgeDirFor(workspaceDir: string): string {
  return path.join(workspaceDir, "knowledge-legacy");
}

export function sessionsDirFor(workspaceDir: string): string {
  return path.join(workspaceDir, "sessions");
}

/** e.g. "sessions/2026-09-10T16-50-12-345Z-run/" — filesystem-safe, sorts chronologically. */
export function sessionDirFor(workspaceDir: string, kind: SessionKind): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(sessionsDirFor(workspaceDir), `${timestamp}-${kind}`);
}

export function instructionsPath(workspaceDir: string): string {
  return path.join(workspaceDir, "instructions.md");
}

export async function workspaceExists(workspaceDir: string): Promise<boolean> {
  try {
    await readFile(workspaceConfigPath(workspaceDir), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export async function readWorkspaceConfig(workspaceDir: string): Promise<WorkspaceConfig> {
  const raw = await readFile(workspaceConfigPath(workspaceDir), "utf-8");
  const config = JSON.parse(raw) as WorkspaceConfig;
  if (config.agent?.role === "student") {
    throw new Error(`${workspaceDir} es un aula con rol "student": teacher-agent solo actúa como profesor.`);
  }
  return config;
}

/** Records `agent.role: "teacher"` in a workspace that has no role yet, and returns the updated config. */
export async function ensureTeacherRole(workspaceDir: string, config: WorkspaceConfig): Promise<WorkspaceConfig> {
  if (config.agent?.role) return config;
  const updated = { ...config, agent: { ...config.agent, role: "teacher" as const } };
  await writeWorkspaceConfig(workspaceDir, updated);
  return updated;
}

const GITIGNORE_TEMPLATE = `# Generado por "teacher-agent init" — config.json guarda tu contraseña de Moodle en
# claro, .env (si lo creas) puede guardar tu CLAUDE_CODE_OAUTH_TOKEN, y sessions/
# acumula transcripciones y perfiles de navegador pesados. Si versionas este workspace
# con git, no subas ninguno de los tres.
config.json
.env
sessions/
practice/
`;

/** Writes `config` (chmod 600 best-effort, no-op on Windows) — used both to create a
 * workspace and to persist later changes to an existing one. */
export async function writeWorkspaceConfig(workspaceDir: string, config: WorkspaceConfig): Promise<void> {
  await mkdir(workspaceDir, { recursive: true });
  const file = workspaceConfigPath(workspaceDir);
  await writeFile(file, JSON.stringify(config, null, 2), "utf-8");
  await chmod(file, 0o600).catch(() => {});
}

/** Creates a new workspace: config.json, sources/, knowledge/, drafts/, and a starter
 * .gitignore (without overwriting one that already exists). */
export async function createWorkspace(workspaceDir: string, config: WorkspaceConfig): Promise<void> {
  await mkdir(knowledgeDirFor(workspaceDir), { recursive: true });
  await mkdir(sourcesDirFor(workspaceDir), { recursive: true });
  await mkdir(draftsDirFor(workspaceDir), { recursive: true });
  await writeWorkspaceConfig(workspaceDir, config);

  const gitignorePath = path.join(workspaceDir, ".gitignore");
  try {
    await readFile(gitignorePath, "utf-8");
  } catch {
    await writeFile(gitignorePath, GITIGNORE_TEMPLATE, "utf-8");
  }
}

/** `<workspace>/instructions.md`, trimmed; `undefined` if missing or empty — appended
 * verbatim to the end of the system prompt (see systemPrompt.ts's customInstructionsSection). */
export async function readInstructions(workspaceDir: string): Promise<string | undefined> {
  try {
    const raw = (await readFile(instructionsPath(workspaceDir), "utf-8")).trim();
    return raw.length > 0 ? raw : undefined;
  } catch {
    return undefined;
  }
}

const INSTRUCTIONS_TEMPLATE = `<!--
  Instrucciones adicionales para el agente en este workspace. Lo que escribas aquí se
  añade al final de sus instrucciones de serie (no las sustituye): úsalo para los matices
  propios de este curso — criterios de corrección, tono, prioridades, excepciones...
-->
`;

/** Creates an empty instructions.md template, without overwriting one that already exists. */
export async function writeInstructionsTemplate(workspaceDir: string): Promise<void> {
  await writeFile(instructionsPath(workspaceDir), INSTRUCTIONS_TEMPLATE, { encoding: "utf-8", flag: "wx" }).catch(() => {});
}

/** Default label when the user doesn't give one while creating the workspace. */
export function defaultWorkspaceLabel(url: string, courseId: string): string {
  let host: string;
  try {
    host = new URL(url).host;
  } catch {
    host = url;
  }
  return `${host} · curso ${courseId}`;
}

/**
 * agent-kit's interface language ("en", "es", "fr", "de": status bar, panels, labels) for the
 * workspace's `agent.language`, which is free text ("español", "English"). Spanish, the
 * language of teacher-agent's own texts, when it's none of the others. `--language=<code>` on
 * the command line still wins (the kit reads it).
 */
export function interfaceLanguage(language: string | undefined): string {
  const name = (language ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
  if (/^(en\b|english|ingles)/.test(name)) return "en";
  if (/^(fr\b|french|frances|francais)/.test(name)) return "fr";
  if (/^(de\b|german|aleman|deutsch)/.test(name)) return "de";
  return "es";
}

/** Merges `WorkspaceConfig` (the file) with the CLI's own choices into the config `AgentSpec` sees. */
export function toSessionConfig(
  workspaceDir: string,
  workspace: WorkspaceConfig,
  options: { mode: Mode; kind: SessionKind; headless: boolean; migrationPending: boolean; language?: string; instructions?: string },
): WorkspaceSessionConfig {
  return {
    mode: options.mode,
    kind: options.kind,
    migrationPending: options.migrationPending,
    projectDir: workspaceDir,
    knowledgeDir: knowledgeDirFor(workspaceDir),
    sourcesDir: sourcesDirFor(workspaceDir),
    extraWritableDirs: [draftsDirFor(workspaceDir), ...(workspace.agent.allowPracticeRunner ? [practiceDirFor(workspaceDir)] : [])],
    // The password lives in config.json and the Claude token may live in .env.
    deniedPaths: [workspaceConfigPath(workspaceDir), path.join(workspaceDir, ".env")],
    secrets: workspace.classroom.password ? [workspace.classroom.password] : [],
    moodleUrl: workspace.classroom.url,
    moodleCourseId: workspace.classroom.courseId,
    moodleUsername: workspace.classroom.username,
    moodlePassword: workspace.classroom.password,
    agentPersona: workspace.agent.persona,
    allowPracticeRunner: workspace.agent.allowPracticeRunner,
    practiceDir: practiceDirFor(workspaceDir),
    knownLanguage: options.language,
    language: interfaceLanguage(options.language),
    customInstructions: options.instructions,
    headless: options.headless,
  };
}

async function exists(target: string): Promise<boolean> {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

/** Every file under `dir`, as paths relative to it. */
async function listFiles(dir: string, prefix = ""): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(path.join(dir, entry.name), relative)));
    else files.push(relative);
  }
  return files;
}

/**
 * A moodle-agent teacher aula kept knowledge/ as folders per topic indexed by a README.md,
 * with downloaded files mixed in. The agent can't move files itself (it can only write
 * text inside the knowledge base), so this does the mechanical part: knowledge/ becomes
 * knowledge-legacy/ (the notes to rebuild the knowledge base from) and originals —
 * anything that isn't markdown or a GIFT file the agent wrote — go to sources/ under the
 * same relative path. Returns whether anything was moved.
 */
export async function moveLegacyKnowledge(workspaceDir: string): Promise<boolean> {
  const knowledgeDir = knowledgeDirFor(workspaceDir);
  const legacyDir = legacyKnowledgeDirFor(workspaceDir);
  const isLegacy =
    (await exists(path.join(knowledgeDir, "README.md"))) &&
    !(await exists(path.join(knowledgeDir, "index.md"))) &&
    !(await exists(legacyDir));
  if (!isLegacy) return false;

  await rename(knowledgeDir, legacyDir);
  await mkdir(knowledgeDir, { recursive: true });

  for (const file of await listFiles(legacyDir)) {
    if (/\.(md|gift)$/i.test(file)) continue;
    await moveIntoSources(workspaceDir, path.join(legacyDir, file), file);
  }
  return true;
}

/** Moves `from` to sources/<relative>, never overwriting a file already there. */
async function moveIntoSources(workspaceDir: string, from: string, relative: string): Promise<void> {
  const target = path.join(sourcesDirFor(workspaceDir), relative);
  if (await exists(target)) return;
  await mkdir(path.dirname(target), { recursive: true });
  await rename(from, target);
}

/** Removes `dir` and its subfolders if no file is left in them; keeps anything that isn't empty. */
async function removeEmptyDirs(dir: string): Promise<void> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) await removeEmptyDirs(path.join(dir, entry.name));
  }
  if ((await readdir(dir)).length === 0) await rmdir(dir);
}

/**
 * moodle-agent aulas kept the human's own material in context/; it now lives in sources/
 * next to the downloaded originals. Moves every file over (same relative path, never
 * overwriting) and removes context/ once empty. Returns how many files were moved.
 */
export async function moveLegacyContext(workspaceDir: string): Promise<number> {
  const contextDir = path.join(workspaceDir, "context");
  if (!(await exists(contextDir))) return 0;

  const files = await listFiles(contextDir);
  for (const file of files) await moveIntoSources(workspaceDir, path.join(contextDir, file), file);
  await removeEmptyDirs(contextDir);
  return files.length;
}

/** Whether a legacy knowledge/ is waiting to be rebuilt as a knowledge base. */
export async function isMigrationPending(workspaceDir: string): Promise<boolean> {
  return (await exists(legacyKnowledgeDirFor(workspaceDir))) && !(await exists(path.join(knowledgeDirFor(workspaceDir), "index.md")));
}
