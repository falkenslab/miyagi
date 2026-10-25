import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { addMarketplace, getLanguage, inspectMarketplace, listMarketplaces, removeMarketplace, type ChatController, type ChatState } from "@falkenslab/agent-kit";
import { connectMoodleTeacher, MOODLE_TEACHER } from "../classroom.js";
import { extensionDirsFor } from "../extensions.js";
import { parseCourseUrl } from "../menu.js";
import { readWorkspaceConfig, writeWorkspaceConfig } from "../workspace.js";

/**
 * The extensions view of miyagi's page (gui-extensions #50): what miyagi can do and what it lacks,
 * the catalog, what's installed, and the repositories. Everything goes through the kit's chat
 * controller (its catalog, installs, options) or its marketplaces; the page only draws what this
 * returns. A sensitive option's value never reaches the page: the kit doesn't give it, and the
 * state the page receives keeps only names and versions of what's installed.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** miyagi's own skills, whose `requires:` say which capabilities they need. */
const SKILLS_DIR = path.join(__dirname, "..", "..", "plugin", "skills");

/** Where the marketplaces are kept: miyagi's own extensions folder, shared by every subject. */
const marketsDir = () => extensionDirsFor(undefined).agent!;

/** The extensions part of the chat's state, as the page may see it: no paths, no option values. */
export function pageExtensions(status: ChatState["extensions"]) {
  if (!status) return null;
  return {
    untrusted: status.untrusted.map(({ name, version }) => ({ name, version })),
    installed: status.installed
      .filter((ext) => !ext.shadowed)
      .map((ext) => ({
        name: ext.name,
        scope: ext.scope,
        enabled: ext.lock.enabled !== false,
        version: ext.manifest?.version ?? null,
        description: status.about[ext.name]?.description ?? ext.manifest?.descriptions[getLanguage()] ?? ext.manifest?.description ?? "",
        marketplace: ext.lock.marketplace ?? null,
      })),
    active: status.active,
    inactive: status.inactive,
  };
}

/** A SKILL.md's `requires:` (`a`, `[a, b]` or `a, b`), as the kit reads it. */
function requiresOf(skill: string): string[] {
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(skill)?.[1] ?? "";
  const line = /^requires:\s*(.*)$/m.exec(front)?.[1] ?? "";
  return line
    .replace(/[[\]]/g, "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

/** miyagi's skills that need a capability, by folder: what each requires. */
async function skillRequirements(): Promise<{ skill: string; requires: string[] }[]> {
  const folders = await readdir(SKILLS_DIR).catch(() => [] as string[]);
  const skills = await Promise.all(
    folders.map(async (skill) => ({ skill, requires: requiresOf(await readFile(path.join(SKILLS_DIR, skill, "SKILL.md"), "utf8").catch(() => "")) })),
  );
  return skills.filter((skill) => skill.requires.length);
}

/**
 * What miyagi can do now and what's missing, in the teacher's language: the capabilities of the
 * extensions running (and what this computer keeps them from), and each capability miyagi's skills
 * need that none provides, with the catalog's extensions that would.
 */
export async function capabilities(chat: ChatController) {
  const status = chat.getState().extensions;
  const about = status?.about ?? {};
  const provided = new Set(Object.values(about).flatMap((ext) => ext.provides));
  const needed = new Map<string, string[]>();
  for (const { skill, requires } of await skillRequirements()) {
    for (const id of requires) if (!provided.has(id)) needed.set(id, [...(needed.get(id) ?? []), skill]);
  }
  const catalog = needed.size ? await chat.extensionCatalog() : [];
  return {
    have: Object.entries(about)
      .filter(([, ext]) => ext.capabilities.length || ext.unavailable.length)
      .map(([name, ext]) => ({
        extension: name,
        capabilities: ext.capabilities.map(({ id, label, description }) => ({ id, label, description })),
        unavailable: ext.unavailable.map(({ id, label, reason }) => ({ id, label, reason })),
      })),
    missing: [...needed].map(([id, skills]) => {
      const offers = catalog.flatMap((entry) => {
        const capability = entry.capabilities.find((offered) => offered.id === id);
        return capability ? [{ spec: entry.spec, name: entry.plugin.name, label: capability.label, description: capability.description, installed: Boolean(entry.installed) }] : [];
      });
      return { id, skills, label: offers[0]?.label ?? id, description: offers[0]?.description ?? "", offers };
    }),
    classroomExtension: MOODLE_TEACHER,
  };
}

/** The catalog as the page draws it: whether each has a logo, never where it is. */
export async function catalog(chat: ChatController, words: string) {
  return (await chat.extensionCatalog(words.split(/\s+/).filter(Boolean))).map((entry) => ({
    spec: entry.spec,
    name: entry.plugin.name,
    marketplace: entry.marketplace,
    official: entry.official,
    version: entry.version ?? null,
    description: entry.description,
    installed: Boolean(entry.installed),
    update: entry.update,
    capabilities: entry.capabilities.map(({ id, label, description }) => ({ id, label, description })),
    requirements: entry.requirements,
    remote: entry.remote,
    logo: Boolean(entry.logo),
  }));
}

/** The repositories miyagi knows: the official one first, fixed. */
export async function marketplaces() {
  return (await listMarketplaces(marketsDir()))
    .sort((a, b) => Number(b.official) - Number(a.official))
    .map((market) => ({
      name: market.name,
      source: market.source,
      official: market.official,
      updated: market.updated,
      owner: market.manifest?.owner.name ?? null,
      description: market.manifest?.description ?? null,
      extensions: market.manifest?.plugins.length ?? null,
    }));
}

/** A repository the teacher wants to add, read without adding it: what the warning shows. */
export async function inspect(source: string) {
  const manifest = await inspectMarketplace(source.trim());
  return { name: manifest.name, owner: manifest.owner.name, description: manifest.description ?? null, extensions: manifest.plugins.length };
}

/**
 * Adds a repository, as the kit's command does: only when the teacher typed its name, read again
 * here (the page's word isn't enough). Never the official one's name: that one stays as it is.
 */
export async function addRepository(source: string, typed: string) {
  const manifest = await inspectMarketplace(source.trim());
  if (typed.trim() !== manifest.name) return { error: "name mismatch" };
  if ((await listMarketplaces(marketsDir())).some((market) => market.official && market.name === manifest.name)) return { error: "official" };
  const result = await addMarketplace(source.trim(), marketsDir());
  return { name: result.name };
}

/** Forgets a repository (its extensions stay installed); the official one can't be removed. */
export async function removeRepository(name: string) {
  const market = (await listMarketplaces(marketsDir())).find((known) => known.name === name);
  if (!market) return { error: "unknown repository" };
  if (market.official) return { error: "official" };
  await removeMarketplace(marketsDir(), name);
  return {};
}

/**
 * Connects the subject to a Moodle course from the page, as `miyagi init` does: moodle-teacher
 * installed (or given this site and course) first, and only then the classroom in the subject's
 * config, so a failure leaves the subject as it was. The teacher signs in later, through the
 * extension's own window, the first time miyagi reaches the course: no password goes through here.
 */
export async function connectClassroom(workspaceDir: string, address: string, givenCourse: string) {
  const parsed = parseCourseUrl(address);
  const courseId = (parsed.courseId ?? givenCourse).trim();
  if (!/^https?:\/\/\S+$/.test(parsed.url) || !/^\d+$/.test(courseId)) return { error: "invalid" };
  const url = parsed.url.replace(/\/+$/, "");
  await connectMoodleTeacher(workspaceDir, url, courseId);
  const { label, description, ...config } = await readWorkspaceConfig(workspaceDir);
  const before = config.classroom;
  // A classroom from before moodle-teacher kept a username and password: not any more (ADR-021).
  const classroom = {
    label: before?.label ?? label ?? path.basename(path.resolve(workspaceDir)),
    ...((before?.description ?? description) ? { description: before?.description ?? description } : {}),
    url,
    courseId,
    connector: "moodle-teacher" as const,
  };
  await writeWorkspaceConfig(workspaceDir, { ...config, classroom });
  return {};
}
