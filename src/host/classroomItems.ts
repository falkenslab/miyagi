import { readFile } from "node:fs/promises";
import path from "node:path";
import { readPublications } from "../materials/publications.js";

/**
 * The classroom's activities the page can offer actions on (action-anchors #107), without asking
 * the classroom: what miyagi published (the publication record, ADR-015) and what the course map
 * links to (`course/course-map`, written when it reads the course). Each with its id, its type and
 * its name as those say it; the classroom itself stays the agent's to read.
 */

export interface ClassroomItem {
  id: number;
  type: string;
  title?: string;
  url: string;
}

/** A classroom activity's address: `/mod/<type>/view.php?id=<n>`, on the classroom's site. */
const ACTIVITY = /^(https?:\/\/[^\s)]+?)\/mod\/([a-z0-9_]+)\/view\.php\?id=(\d+)/i;

/** A name from a publication's `where`: what's in «…» or "…", if anything. */
function nameIn(where: string): string | undefined {
  return /«([^»]+)»|"([^"]+)"/.exec(where)?.slice(1).find(Boolean);
}

export async function classroomItems(materialsDir: string, knowledgeDir: string, site: string | undefined): Promise<ClassroomItem[]> {
  const found = new Map<number, ClassroomItem>();
  const add = (url: string, title?: string) => {
    const match = ACTIVITY.exec(url);
    if (!match) return;
    if (site && match[1]!.replace(/\/+$/, "") !== site.replace(/\/+$/, "")) return;
    const id = Number(match[3]);
    const before = found.get(id);
    found.set(id, { id, type: match[2]!.toLowerCase(), url: match[0], title: before?.title ?? title?.trim() });
  };
  for (const one of await readPublications(materialsDir)) if (one.url) add(one.url, nameIn(one.where));
  const map = await readFile(path.join(knowledgeDir, "course", "course-map.md"), "utf8").catch(() => "");
  for (const link of map.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) add(link[2]!, link[1]);
  return [...found.values()].sort((a, b) => a.id - b.id);
}
