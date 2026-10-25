import { mkdir, readdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { t } from "./messages/index.js";
import { createWorkspace, workspaceExists, type AgentPersona, type WorkspaceConfig, type WorkspaceKind } from "./workspace.js";

/**
 * The workspaces the teacher has, by name (ADR-023): new ones live in `~/.miyagi/workspaces/<slug>/`,
 * and every one, wherever its folder is, is listed in `~/.miyagi/workspaces.json`. Never deletes a
 * folder: forgetting one only drops it from the list.
 */
export interface RegisteredWorkspace {
  /** A unique slug of its name, what `--workspace` matches first. */
  id: string;
  name: string;
  kind: WorkspaceKind;
  dir: string;
  createdAt: string;
  openedAt: string;
}

/** A registered workspace as listed: `missing` when its folder no longer has a `config.json`. */
export interface ListedWorkspace extends RegisteredWorkspace {
  missing: boolean;
}

interface Registry {
  workspaces: RegisteredWorkspace[];
}

export function workspacesRegistryPath(): string {
  return path.join(os.homedir(), ".miyagi", "workspaces.json");
}

/** Where a new workspace goes unless the teacher picks another folder. */
export function defaultWorkspacesDir(): string {
  return path.join(os.homedir(), ".miyagi", "workspaces");
}

/** The same folder, whatever its spelling (Windows paths are case-insensitive). */
function sameDir(a: string, b: string): boolean {
  const norm = (dir: string) => (process.platform === "win32" ? path.resolve(dir).toLowerCase() : path.resolve(dir));
  return norm(a) === norm(b);
}

/** Lowercase ASCII words joined by hyphens: "Bases de Datos 1º" → "bases-de-datos-1". */
export function slugify(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "workspace";
}

async function readRegistry(): Promise<Registry> {
  try {
    const parsed = JSON.parse(await readFile(workspacesRegistryPath(), "utf-8")) as Partial<Registry>;
    return { workspaces: Array.isArray(parsed.workspaces) ? parsed.workspaces : [] };
  } catch {
    // Missing or unreadable: an empty list. Opening a workspace writes it again.
    return { workspaces: [] };
  }
}

/** Written to a temporary file first, so a crash never leaves half a list. */
async function writeRegistry(registry: Registry): Promise<void> {
  const file = workspacesRegistryPath();
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(registry, null, 2)}\n`, "utf-8");
  await rename(tmp, file);
}

/** Every registered workspace, last opened first. */
export async function listWorkspaces(): Promise<ListedWorkspace[]> {
  const { workspaces } = await readRegistry();
  const listed = await Promise.all(workspaces.map(async (ws) => ({ ...ws, missing: !(await workspaceExists(ws.dir)) })));
  return listed.sort((a, b) => b.openedAt.localeCompare(a.openedAt));
}

/** By id, then by name, ignoring case and accents. */
export async function findWorkspace(query: string): Promise<ListedWorkspace | undefined> {
  const workspaces = await listWorkspaces();
  const key = slugify(query);
  return workspaces.find((ws) => ws.id === query) ?? workspaces.find((ws) => ws.id === key || slugify(ws.name) === key);
}

/**
 * Adds a workspace to the list, or updates its name, kind and `openedAt` when its folder is
 * already there. A workspace whose folder was moved is found again: a missing one with the same
 * name takes the new folder, keeping its id. A new one gets an id no other has.
 */
export async function registerWorkspace(dir: string, name: string, kind: WorkspaceKind): Promise<RegisteredWorkspace> {
  const registry = await readRegistry();
  const now = new Date().toISOString();
  let existing = registry.workspaces.find((ws) => sameDir(ws.dir, dir));
  if (!existing) {
    for (const ws of registry.workspaces) {
      if (slugify(ws.name) === slugify(name) && !(await workspaceExists(ws.dir))) {
        existing = ws;
        break;
      }
    }
  }
  if (existing) {
    Object.assign(existing, { name, kind, dir: path.resolve(dir), openedAt: now });
    await writeRegistry(registry);
    return existing;
  }
  const taken = new Set(registry.workspaces.map((ws) => ws.id));
  const base = slugify(name);
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  const added: RegisteredWorkspace = { id, name, kind, dir: path.resolve(dir), createdAt: now, openedAt: now };
  registry.workspaces.push(added);
  await writeRegistry(registry);
  return added;
}

/** Drops a workspace from the list; its folder stays as it is. */
export async function forgetWorkspace(id: string): Promise<void> {
  const registry = await readRegistry();
  await writeRegistry({ workspaces: registry.workspaces.filter((ws) => ws.id !== id) });
}

/** A folder for a new workspace in miyagi's home, not used by another one: `<slug>`, `<slug>-2`… */
export async function newWorkspaceDir(name: string): Promise<string> {
  const base = slugify(name);
  const registered = (await readRegistry()).workspaces;
  for (let n = 1; ; n++) {
    const dir = path.join(defaultWorkspacesDir(), n === 1 ? base : `${base}-${n}`);
    const used = registered.some((ws) => sameDir(ws.dir, dir));
    if (!used && !(await stat(dir).then(() => true, () => false))) return dir;
  }
}

/**
 * A new subject without a classroom, registered: what `init` makes from its answers and the GUI
 * from its form (gui-workspaces, #49). In miyagi's home unless `dir` names a folder of the
 * teacher's, which must be empty or not exist yet. A classroom is connected afterwards.
 */
export async function createSubject(answers: { label: string; description?: string; language?: string; persona?: AgentPersona; dir?: string }): Promise<{ dir: string; id: string }> {
  const label = answers.label.trim();
  const description = answers.description?.trim();
  const language = answers.language?.trim();
  const config: WorkspaceConfig = {
    kind: "subject",
    label,
    ...(description ? { description } : {}),
    agent: { role: "teacher", ...(answers.persona ? { persona: answers.persona } : {}), ...(language ? { language } : {}) },
  };
  const chosen = answers.dir?.trim();
  if (chosen) {
    if (await workspaceExists(chosen)) throw new Error("already a subject");
    const entries = await readdir(chosen).catch(() => [] as string[]);
    if (entries.length) throw new Error("folder not empty");
  }
  const dir = chosen ? path.resolve(chosen) : await newWorkspaceDir(label);
  await createWorkspace(dir, config);
  const { id } = await registerWorkspace(dir, label, "subject");
  return { dir, id };
}

/** The flags that name a workspace; every other argument is the command's own. */
const WORKSPACE_FLAGS = ["--dir", "--workspace", "-w"];

function flagValue(args: string[], name: string): string | undefined {
  const withEquals = args.find((a) => a.startsWith(`${name}=`));
  if (withEquals) return withEquals.slice(name.length + 1);
  const idx = args.indexOf(name);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

/** `args` without `--dir`, `--workspace` and `-w` (and their values), for a command that doesn't know them. */
export function withoutWorkspaceFlags(args: string[]): string[] {
  return args.filter((arg, i) => !WORKSPACE_FLAGS.some((flag) => arg === flag || arg.startsWith(`${flag}=`) || args[i - 1] === flag));
}

/** The registered ids, for a message that says which exist (empty when there are none). */
export async function workspaceIds(): Promise<string> {
  const ids = (await listWorkspaces()).filter((ws) => !ws.missing).map((ws) => ws.id);
  return ids.join(", ");
}

/**
 * The workspace the arguments name, without asking: `--dir <path>` (which may not be one yet),
 * `--workspace`/`-w <name>` (a registered one, by id or name), or the current directory when
 * it is one. Undefined when none applies: the command decides whether to offer the list.
 */
export async function locateWorkspace(args: string[]): Promise<string | undefined> {
  const dir = flagValue(args, "--dir");
  if (dir) return path.resolve(dir);
  const name = flagValue(args, "--workspace") ?? flagValue(args, "-w");
  if (name) {
    const found = await findWorkspace(name);
    if (!found) throw new Error(t().workspaceNotFound(name, await workspaceIds()));
    if (found.missing) throw new Error(t().workspaceFolderMissing(found.name, found.dir, found.id));
    return found.dir;
  }
  return (await workspaceExists(process.cwd())) ? process.cwd() : undefined;
}
