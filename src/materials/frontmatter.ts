import { parse } from "yaml";

/** A Markdown file's YAML frontmatter, its body, and the line the body starts at (1-based). */
export interface Split {
  data: Record<string, unknown>;
  body: string;
  bodyLine: number;
  /** Why the frontmatter couldn't be read, if it couldn't. */
  error?: string;
}

export function splitFrontmatter(source: string): Split {
  const text = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, body: text, bodyLine: 1 };
  const bodyLine = match[0].split("\n").length - (match[0].endsWith("\n") ? 1 : 0) + 1;
  try {
    const data = parse(match[1]!) as unknown;
    return { data: data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {}, body: text.slice(match[0].length), bodyLine };
  } catch (error) {
    return { data: {}, body: text.slice(match[0].length), bodyLine, error: (error as Error).message.split("\n")[0] };
  }
}

/** A frontmatter value as a list of strings: `[a, b]`, `a, b` or a single value. */
export function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  if (typeof value === "number") return [String(value)];
  return [];
}
