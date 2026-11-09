import type { TranscriptEntry } from "./types";

/**
 * What Today says as miyagi's greeting (#98): its reply to the opening miyagi sends itself, which
 * is whatever it said before the teacher's first message or the first turn's end, its last words
 * there if it worked in between. Nothing if the conversation has no greeting, or the greeting
 * failed: the last message of a conversation may be the answer to a rejected or failed turn.
 */
export function greetingOf(transcript: TranscriptEntry[]): string {
  let text = "";
  for (const entry of transcript) {
    if (entry.kind === "user" || entry.kind === "turn-summary") break;
    if (entry.kind === "notice" && entry.tone === "error") return "";
    if (entry.kind === "agent") text = entry.text;
  }
  return text.length > 700 ? `${text.slice(0, 700).replace(/\s\S*$/, "")}…` : text;
}
