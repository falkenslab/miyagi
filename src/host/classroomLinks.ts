import type { TranscriptEntry } from "@falkenslab/agent-kit";

/**
 * "View in the classroom" (#77): of each call to moodle-teacher, the page it touched, from the
 * `page` moodle-mcp returns in its result's `_meta`, and only if it's on the classroom's own origin.
 * Every other `meta` is dropped: the page gets nothing else the tools return. The model never sees it.
 */
export function withClassroomPages(transcript: TranscriptEntry[], classroomUrl: string | undefined): TranscriptEntry[] {
  const origin = originOf(classroomUrl);
  return transcript.map((entry) => {
    if (entry.kind !== "tools") return entry;
    return {
      ...entry,
      calls: entry.calls.map(({ meta, ...call }) => {
        const page = origin && call.toolName.startsWith("mcp__moodle__") ? classroomPage(meta?.page, origin) : undefined;
        return page ? { ...call, page } : call;
      }),
    };
  });
}

/** The address, if it's an http(s) page of that origin. */
export function classroomPage(value: unknown, origin: string): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.origin === origin && /^https?:$/.test(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function originOf(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}
