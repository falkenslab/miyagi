import { readdir, readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import type { ChatController, KnowledgeStore } from "@falkenslab/agent-kit";
import { readRegister } from "../activityRegister.js";
import { draftsDirFor, knowledgeDirFor, sourcesDirFor } from "../workspace.js";

/**
 * The course views of miyagi's page (gui-course-views #51): Hoy, the teaching plan, the topics,
 * the materials in drafts/, what's in the oven, the sources and the knowledge base. Read only:
 * every change goes through the chat, where the agent asks for approval. The knowledge base is
 * read through the kit's store (never its files, but for its log); sources/ and drafts/ are
 * listed and read only inside their own folders.
 */

/** The kit's store of the open chat's knowledge base. */
function storeOf(chat: ChatController): KnowledgeStore | undefined {
  return chat.api<{ knowledgeStore: KnowledgeStore }>("knowledge")?.knowledgeStore;
}

/** A path inside `base` (the real one, links resolved), or undefined: no `..`, no absolute path, no link out. */
export async function inside(base: string, relative: string): Promise<string | undefined> {
  if (!relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes("..")) return undefined;
  const root = await realpath(base).catch(() => undefined);
  const file = await realpath(path.join(base, relative)).catch(() => undefined);
  if (!root || !file || (file !== root && !file.startsWith(root + path.sep))) return undefined;
  return file;
}

/** Every file under a folder, relative to it, but the kit's own (`.agent-kit`) and hidden ones. */
async function filesUnder(dir: string, prefix = ""): Promise<{ path: string; size: number; changed: string }[]> {
  const entries = await readdir(path.join(dir, prefix), { withFileTypes: true }).catch(() => []);
  const files: { path: string; size: number; changed: string }[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await filesUnder(dir, relative)));
    else if (entry.isFile()) {
      const info = await stat(path.join(dir, relative));
      files.push({ path: relative, size: info.size, changed: info.mtime.toISOString() });
    }
  }
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

/** The knowledge base's index for the page: its pages by section, and what its check finds. */
export async function knowledgeIndex(chat: ChatController) {
  const store = storeOf(chat);
  if (!store) return { error: "no knowledge base" };
  const [pages, report] = await Promise.all([store.list(), store.check()]);
  const sections = store.types().map((type) => ({ type: type.type, section: type.indexSection }));
  return {
    sections,
    pages: pages.filter((page) => page.status === "active").map(({ id, type, title, description, fields }) => ({ id, type, title, description, updated: fields.updated ?? null })),
    problems: report.brokenLinks.length + report.linksToRetired.length,
  };
}

/** One page, rendered by the page from its markdown. */
export async function knowledgePage(chat: ChatController, id: string) {
  const page = await storeOf(chat)?.read(id);
  return page ? { id: page.id, type: page.type, title: page.title, fields: page.fields, content: page.content, linkedFrom: page.linkedFrom } : { error: "no such page" };
}

export async function knowledgeSearch(chat: ChatController, query: string) {
  return { hits: query.trim() ? ((await storeOf(chat)?.search(query, 20)) ?? []) : [] };
}

/**
 * The sources and what the knowledge base knows of each: ingested (a summary page with its
 * `file`), changed since (the file is newer than the summary's `ingested`), or new.
 */
export async function sourcesList(chat: ChatController, workspaceDir: string) {
  const files = await filesUnder(sourcesDirFor(workspaceDir));
  const summaries = ((await storeOf(chat)?.list()) ?? []).filter((page) => page.type === "summary" && page.fields.file);
  // An original and the markdown made from it (a web page's .html and its .md) share their name:
  // the summary names one of them, and both are taken in.
  const stem = (file: string) => file.replace(/\.[^./]+$/, "");
  return {
    sources: files.map((file) => {
      const summary = summaries.find((page) => page.fields.file === file.path) ?? summaries.find((page) => stem(page.fields.file!) === stem(file.path));
      const ingested = summary?.fields.ingested ?? summary?.fields.updated;
      const state = !summary ? "new" : ingested && file.changed > new Date(ingested).toISOString() ? "changed" : "ingested";
      return { ...file, state, page: summary?.id ?? null };
    }),
  };
}

/** What's in drafts/: the files, by folder. */
export async function draftsList(workspaceDir: string) {
  return { files: await filesUnder(draftsDirFor(workspaceDir)) };
}

/** The activities in progress, by phase (the `course/drafts` register). */
export function oven(workspaceDir: string) {
  return { items: readRegister(workspaceDir) };
}

/** The knowledge base's latest log entries ("## [date] op | what"), newest first. */
async function recentLog(workspaceDir: string, count: number) {
  const text = await readFile(path.join(knowledgeDirFor(workspaceDir), "log.md"), "utf8").catch(() => "");
  return [...text.matchAll(/^## \[([^\]]+)\] ([^|\n]+)\|\s*(.+)$/gm)]
    .map((match) => ({ date: match[1]!, operation: match[2]!.trim(), what: match[3]!.trim() }))
    .reverse()
    .slice(0, count);
}

/** Hoy: what the page's first view needs in one call. */
export async function today(chat: ChatController, workspaceDir: string) {
  const store = storeOf(chat);
  const pages = (await store?.list()) ?? [];
  const sources = (await sourcesList(chat, workspaceDir)).sources;
  const drafts = await filesUnder(draftsDirFor(workspaceDir));
  return {
    pages: pages.filter((page) => page.status === "active").length,
    topics: pages.filter((page) => page.type === "topic" && page.status === "active").length,
    activities: pages.filter((page) => page.type === "activity" && page.status === "active").length,
    teachingPlan: pages.some((page) => page.id === "course/teaching-plan"),
    sources: { total: sources.length, pending: sources.filter((source) => source.state !== "ingested").length },
    drafts: drafts.length,
    oven: readRegister(workspaceDir),
    log: await recentLog(workspaceDir, 6),
  };
}

/** The topics, each with the activities its page links to. */
export async function topics(chat: ChatController) {
  const store = storeOf(chat);
  if (!store) return { topics: [] };
  const pages = (await store.list()).filter((page) => page.status === "active");
  const activities = new Map(pages.filter((page) => page.type === "activity").map((page) => [page.id, page]));
  const result = [];
  for (const topic of pages.filter((page) => page.type === "topic")) {
    const read = await store.read(topic.id);
    const linked = [...new Set([...(read?.content ?? "").matchAll(/\]\((activity\/[\w-]+)\)/g)].map((match) => match[1]!))];
    result.push({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      status: topic.fields.status ?? null,
      activities: linked.filter((id) => activities.has(id)).map((id) => ({ id, title: activities.get(id)!.title })),
    });
  }
  return { topics: result };
}

/** The types a material is previewed as: what a browser shows, and nothing it would run. */
export const PREVIEW_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".gift": "text/plain; charset=utf-8",
  ".csv": "text/plain; charset=utf-8",
  ".json": "text/plain; charset=utf-8",
  ".xml": "text/plain; charset=utf-8",
};
