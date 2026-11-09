import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { listRuns, readConversation, type ConversationMessage } from "@falkenslab/agent-kit";
import { sessionsDirFor } from "../workspace.js";

/**
 * The sidebar's conversations (sidebar-tools #84): their titles, the ones the teacher pinned and
 * the search over what they said. All of it reads the kept conversations as they are, on the
 * computer: nothing is indexed and nothing reaches the model.
 */

/** The most results a search returns. */
const MAX_RESULTS = 30;

/** Pinned conversations by their folder's name, so a subject that moves keeps them; in sessions/, outside the knowledge base. */
const pinnedFile = (workspaceDir: string) => path.join(sessionsDirFor(workspaceDir), "pinned.json");

/** Which of the teacher's messages are really theirs: not the greeting miyagi sends itself, nor the SDK's mark for an interrupted turn. */
const isTeachers = (text: string, opening: string | undefined) => Boolean(text) && !text.startsWith("[Request interrupted") && !(opening && opening.startsWith(text.slice(0, 20)));

/**
 * A conversation's title: the teacher's first words in it, which don't change with every message
 * as the kit's last one does; never the greeting miyagi sends itself to open a conversation.
 */
export function conversationTitle(messages: ConversationMessage[], opening: string | undefined): string | undefined {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.text.replace(/\s+/g, " ").trim())
    .find((text) => isTeachers(text, opening));
}

/** A conversation with nothing but that greeting (one is kept each time the subject opens). */
export const isOnlyGreeting = (messages: ConversationMessage[], title: string | undefined) => !title && messages.filter((message) => message.role === "assistant").length <= 1;

/**
 * The part of the sidebar's list it asked for (#97): the `limit` latest ones, and the pinned and
 * the open one wherever they fall, which the sidebar always shows; and whether older ones are left.
 */
export function latestRuns<Listed extends { dir: string; pinned: boolean }>(runs: Listed[], limit: number, currentDir: string | null) {
  let left = limit;
  const shown = runs.filter((run) => run.pinned || left-- > 0 || run.dir === currentDir);
  return { runs: shown, more: shown.length < runs.length };
}

/** Lowercase and without accents: a teacher looking for "rubrica" means "rúbrica". */
const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** The text folded, and where each of its characters was: what lets a match be quoted as it was written. */
function foldKeepingPlaces(text: string): { folded: string; places: number[] } {
  let folded = "";
  const places: number[] = [];
  for (let at = 0; at < text.length; at++) {
    const piece = fold(text[at]!);
    folded += piece;
    for (let n = 0; n < piece.length; n++) places.push(at);
  }
  return { folded, places };
}

/** The first message that says `query`, quoted around it; undefined if none does. The greeting miyagi sends itself isn't searched. */
export function quoteMatch(messages: ConversationMessage[], query: string, opening: string | undefined): string | undefined {
  const wanted = fold(query.replace(/\s+/g, " ").trim());
  if (!wanted) return undefined;
  for (const message of messages) {
    const text = message.text.replace(/\s+/g, " ").trim();
    if (message.role === "user" && !isTeachers(text, opening)) continue;
    const { folded, places } = foldKeepingPlaces(text);
    const found = folded.indexOf(wanted);
    if (found === -1) continue;
    const start = Math.max(0, places[found]! - 30);
    const end = Math.min(text.length, places[found + wanted.length - 1]! + 61);
    return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
  }
  return undefined;
}

/** The folder names of the conversations pinned in this subject. */
export async function readPinned(workspaceDir: string): Promise<string[]> {
  try {
    const names: unknown = JSON.parse(await readFile(pinnedFile(workspaceDir), "utf8"));
    return Array.isArray(names) ? names.filter((name): name is string => typeof name === "string") : [];
  } catch {
    return [];
  }
}

/** Pins or unpins one of this subject's kept conversations; any other folder is refused. */
export async function setPinned(workspaceDir: string, dir: string, pinned: boolean): Promise<{ error?: string }> {
  const run = (await listRuns(sessionsDirFor(workspaceDir))).find((one) => path.resolve(one.dir) === path.resolve(dir));
  if (!run) return { error: "unknown conversation" };
  const name = path.basename(run.dir);
  const others = (await readPinned(workspaceDir)).filter((one) => one !== name);
  await mkdir(sessionsDirFor(workspaceDir), { recursive: true });
  await writeFile(pinnedFile(workspaceDir), `${JSON.stringify(pinned ? [name, ...others] : others)}\n`, "utf8");
  return {};
}

/** The conversations of this subject that say `query`, newest first, each with where it says it; those the list doesn't show aren't found either. */
export async function searchConversations(workspaceDir: string, query: string, opening: string | undefined, currentDir: string | undefined) {
  const results: { dir: string; title?: string; date: string; snippet: string; pinned: boolean }[] = [];
  if (!query.trim()) return results;
  const pinned = await readPinned(workspaceDir);
  for (const run of await listRuns(sessionsDirFor(workspaceDir))) {
    const messages = await readConversation(run.dir).catch(() => []);
    const title = conversationTitle(messages, opening);
    const isPinned = pinned.includes(path.basename(run.dir));
    if (isOnlyGreeting(messages, title) && run.dir !== currentDir && !isPinned) continue;
    const snippet = quoteMatch(messages, query, opening);
    if (snippet === undefined) continue;
    results.push({ dir: run.dir, title, date: run.updatedAt.toISOString(), snippet, pinned: isPinned });
    if (results.length === MAX_RESULTS) break;
  }
  return results;
}
