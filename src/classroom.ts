import { extensionOptionStates, listInstalled, runExtensionCommand, type InstalledExtension } from "@falkenslab/agent-kit";
import { CATALOG_TOPICS, enabledExtensions, extensionDirsFor, OFFICIAL_MARKETPLACE } from "./extensions.js";
import { t } from "./messages/index.js";
import { slugify } from "./workspaces.js";

/**
 * A Moodle classroom through the moodle-teacher extension (ADR-021): moodle-mcp's tools with the
 * teacher's own session, signed in through its window; miyagi keeps only which site and course.
 */
export const MOODLE_TEACHER = "moodle-teacher";

/** Its local server is `moodle` in its `.mcp.json`: the session names its tools `mcp__moodle__<tool>`. */
export const MOODLE_TOOLS = "mcp__moodle__";

/** A site's name in moodle-teacher's `sites` option (`name=url`): its host and path, as a slug. */
export function siteName(url: string): string {
  try {
    const parsed = new URL(url);
    return slugify(`${parsed.host}${parsed.pathname}`);
  } catch {
    return slugify(url);
  }
}

/** A course's address, as moodle-teacher's `courses` option lists it. */
export function courseUrl(url: string, courseId: string): string {
  return `${url.replace(/\/+$/, "")}/course/view.php?id=${courseId}`;
}

/** The installed moodle-teacher that sessions of this workspace would run (the project's wins), if any. */
async function installedMoodleTeacher(workspaceDir: string): Promise<InstalledExtension | undefined> {
  return (await listInstalled(extensionDirsFor(workspaceDir))).find((ext) => ext.name === MOODLE_TEACHER && !ext.shadowed);
}

/** Whether moodle-teacher is installed, enabled and loadable for this workspace. */
export async function moodleTeacherActive(workspaceDir: string): Promise<boolean> {
  return (await enabledExtensions(workspaceDir)).some((ext) => ext.name === MOODLE_TEACHER);
}

/**
 * The kit's `extension` command, as `miyagi extension …` runs it; throws when it fails, with what
 * the kit said. It never asks: an option not given keeps its default (the kit's own prompt would
 * read the terminal under miyagi's wizard, and stop it). Its lines (in English, with the store's
 * paths) are kept for a failure; miyagi says the outcome in the teacher's language.
 */
async function extensionCommand(workspaceDir: string | undefined, args: string[]): Promise<void> {
  const before = process.exitCode;
  process.exitCode = undefined;
  const said: string[] = [];
  await runExtensionCommand(["extension", ...args], {
    dirs: extensionDirsFor(workspaceDir),
    command: "miyagi",
    official: OFFICIAL_MARKETPLACE,
    catalogTopics: CATALOG_TOPICS,
    write: (line) => said.push(line),
    ask: async () => "",
    askSecret: async () => "",
  });
  const failed = process.exitCode === 1;
  process.exitCode = before;
  if (failed) throw new Error(`${t().moodleTeacherInstallFailed}${said.length ? `\n${said.join("\n")}` : ""}`);
}

/**
 * Makes the site reachable through moodle-teacher: installs it for every subject (the agent's
 * scope) with this site, or adds the site to the one installed, and turns it on if it was off.
 * Its other options keep their defaults: `access: write` (it changes the course, after the
 * teacher's approval) and `student_data: pseudonymize` (students reach the model as aliases).
 */
export async function connectMoodleTeacher(workspaceDir: string, url: string, courseId: string): Promise<void> {
  const site = `${siteName(url)}=${url}`;
  const installed = await installedMoodleTeacher(workspaceDir);
  if (!installed) {
    await extensionCommand(undefined, ["add", MOODLE_TEACHER, "--set", `sites=${site}`, "--set", `courses=${courseUrl(url, courseId)}`, "--yes"]);
    return;
  }
  const sites = (await extensionOptionStates(installed)).find((state) => state.key === "sites")?.value;
  const list = Array.isArray(sites) ? sites.map(String) : typeof sites === "string" && sites ? [sites] : [];
  if (!list.some((entry) => entry.slice(entry.indexOf("=") + 1) === url)) {
    await extensionCommand(workspaceDir, ["config", MOODLE_TEACHER, `sites=${[...list, site].join(",")}`, `--${installed.scope}`]);
  }
  await ensureMoodleCourse(workspaceDir, url, courseId);
  if (installed.lock.enabled === false) await extensionCommand(workspaceDir, ["enable", MOODLE_TEACHER, `--${installed.scope}`]);
}

/**
 * Adds this subject's course to moodle-teacher's `courses` option, keeping the other subjects':
 * moodle-mcp then refuses any course of the teacher's account that isn't one of them (#54). The
 * option is the extension's, shared by every subject, so it can't narrow a session to its own
 * course: the prompts still do. Nothing to do when it's already there or moodle-teacher isn't installed.
 */
export async function ensureMoodleCourse(workspaceDir: string, url: string, courseId: string): Promise<void> {
  const installed = await installedMoodleTeacher(workspaceDir);
  if (!installed) return;
  const value = (await extensionOptionStates(installed)).find((state) => state.key === "courses")?.value;
  const list = (Array.isArray(value) ? value.map(String) : typeof value === "string" ? value.split(",") : []).map((entry) => entry.trim()).filter(Boolean);
  const course = courseUrl(url, courseId);
  if (list.includes(course)) return;
  await extensionCommand(workspaceDir, ["config", MOODLE_TEACHER, `courses=${[...list, course].join(",")}`, `--${installed.scope}`]);
}
