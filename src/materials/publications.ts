import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * The publication record (ADR-015): where each material went and the hash of the version
 * published, kept by code in `materials/.publications.json`, so "changed since it was published"
 * is a fact and not the model's memory. One subject has one classroom; `where` says which part of
 * it (a bank's category, a quiz's name, a section).
 */

export interface Publication {
  material: string;
  hash: string;
  where: string;
  url?: string;
  at: string;
}

const recordFile = (materialsDir: string) => path.join(materialsDir, ".publications.json");

export async function readPublications(materialsDir: string): Promise<Publication[]> {
  try {
    const data = JSON.parse(await readFile(recordFile(materialsDir), "utf8")) as { publications?: Publication[] };
    return Array.isArray(data.publications) ? data.publications : [];
  } catch {
    return [];
  }
}

export async function recordPublication(materialsDir: string, publication: Publication): Promise<void> {
  const all = await readPublications(materialsDir);
  // The latest publication of a material to the same place replaces the one before.
  const kept = all.filter((one) => !(one.material === publication.material && one.where === publication.where));
  await writeFile(recordFile(materialsDir), `${JSON.stringify({ publications: [...kept, publication] }, null, 2)}\n`);
}

export type PublicationState = "not published" | "published" | "changed since published";

export function stateOf(publications: Publication[], material: string, hash: string): { state: PublicationState; last?: Publication } {
  const mine = publications.filter((one) => one.material === material).sort((a, b) => b.at.localeCompare(a.at));
  if (!mine.length) return { state: "not published" };
  return { state: mine[0]!.hash === hash ? "published" : "changed since published", last: mine[0] };
}
