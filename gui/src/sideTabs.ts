// The side panel's tabs (#85), the page's own state: what the teacher is looking at beside the
// conversation, kept until the page is closed. Each kind adds its data here: a file, or the turn's
// activity (#70), of which there's one, on the turn the teacher opened (null: the running one).

import type { TranscriptCall, TranscriptEntry } from "./types";

export type SideTab = { id: string; kind: "file"; title: string; file: string } | { id: string; kind: "activity"; turn: number | null };

export interface SideTabs {
  list: SideTab[];
  active: string | null;
}

export const NO_TABS: SideTabs = { list: [], active: null };

/** The types the host serves from materials/ and drafts/ and `Preview` draws. */
const PREVIEWED = new Set([".html", ".htm", ".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".md", ".txt", ".gift", ".csv", ".json", ".xml"]);

export const canPreview = (file: string) => PREVIEWED.has(file.slice(file.lastIndexOf(".")).toLowerCase());

export const fileTab = (file: string): SideTab => ({ id: `file:${file}`, kind: "file", title: file.slice(file.lastIndexOf("/") + 1), file });

export const ACTIVITY_TAB = "activity";

export const activityTab = (turn: number | null): SideTab => ({ id: ACTIVITY_TAB, kind: "activity", turn });

/** A tab opened, or brought forward if it was already open (with what it now shows). */
export function addTab(tabs: SideTabs, tab: SideTab): SideTabs {
  const known = tabs.list.some((one) => one.id === tab.id);
  return { list: known ? tabs.list.map((one) => (one.id === tab.id ? tab : one)) : [...tabs.list, tab], active: tab.id };
}

export const selectTab = (tabs: SideTabs, id: string): SideTabs => ({ ...tabs, active: id });

/** A tab closed; the one after it takes its place if it was the one on screen, and none is left closing the last. */
export function closeTab(tabs: SideTabs, id: string): SideTabs {
  const at = tabs.list.findIndex((one) => one.id === id);
  if (at === -1) return tabs;
  const list = tabs.list.filter((one) => one.id !== id);
  return { list, active: tabs.active === id ? (list[at]?.id ?? list[at - 1]?.id ?? null) : tabs.active };
}

/** A prepared file a line of text names (`drafts/x/plan.md`, as the oven's register does), that the panel can show. */
export function namedFile(text: string): string | undefined {
  return text.match(/(?:drafts|materials)\/[^\s`)'"]+\.[a-z0-9]+/gi)?.find(canPreview);
}

/** A turn of the conversation: its entries, its tool calls in order and, once it ended, how long it took. */
export interface Turn {
  id: number;
  entries: number[];
  calls: TranscriptCall[];
  seconds: number | null;
}

/** The conversation's turns: each ends at its summary, and a new line of the teacher starts another. */
export function turnsOf(transcript: TranscriptEntry[]): Turn[] {
  const turns: Turn[] = [];
  let now: Turn | undefined;
  for (const entry of transcript) {
    if (!now || (entry.kind === "user" && now.entries.length)) {
      now = { id: entry.id, entries: [], calls: [], seconds: null };
      turns.push(now);
    }
    now.entries.push(entry.id);
    if (entry.kind === "tools") now.calls.push(...entry.calls);
    if (entry.kind === "turn-summary") {
      now.seconds = entry.seconds;
      now = undefined;
    }
  }
  return turns;
}

/** Which turn opening an entry's actions shows: the one it belongs to, or null if it's the latest, which then follows the conversation. */
export function turnOfEntry(transcript: TranscriptEntry[], entry: number): number | null {
  const turns = turnsOf(transcript);
  const turn = turns.find((one) => one.entries.includes(entry));
  return turn && turn !== turns.at(-1) ? turn.id : null;
}

/** The turn the panel shows: the chosen one; otherwise the running one, or the last that did something. */
export function shownTurn(turns: Turn[], chosen: number | null, busy: boolean): Turn | undefined {
  return turns.find((one) => one.id === chosen) ?? (busy ? turns.at(-1) : (turns.filter((one) => one.calls.length).at(-1) ?? turns.at(-1)));
}
