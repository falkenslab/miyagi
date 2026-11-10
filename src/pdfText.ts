import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Options } from "@falkenslab/agent-kit";
import { extractText, getDocumentProxy } from "unpdf";

/**
 * A PDF copied into sources/ gets its text next to it, as markdown with a heading per page
 * (#64). agent-kit keeps a markdown copy of a downloaded web page, not of a PDF, so a long
 * norm or annex was read again with WebFetch (a small model's summary of a cut copy) or a few
 * pages at a time with Read. With the text in a file, the agent greps it and quotes it
 * literally, and the ingest reads it whole. Runs after the kit's tools that add a file; the
 * markdown is written straight into sources/, where the kit lists it as an original of its own.
 */

type Hooks = NonNullable<Options["hooks"]>;
type HookCallback = NonNullable<Hooks[keyof Hooks]>[number]["hooks"][number];

const ADDING_TOOLS = new Set(["download_to_sources", "save_to_sources", "request_file"].map((name) => `mcp__sourceFiles__${name}`));

/** Under this many characters a page has no text layer worth keeping (a scan). */
const MIN_TEXT = 20;

/** The PDF a tool's reply says is in sources/ ("Saved to sources/x.pdf.", "already in sources/x.pdf: ..."). */
export function pdfInReply(response: unknown): string | undefined {
  const text = typeof response === "string" ? response : JSON.stringify(response ?? "");
  return /sources\/(.+?\.pdf)(?=[.:\s"\\]|$)/i.exec(text)?.[1];
}

/** A PDF's text as markdown, a section per page; null when it has no text layer. */
export async function pdfToMarkdown(file: string, from?: string): Promise<string | null> {
  const pdf = await getDocumentProxy(new Uint8Array(await readFile(file)));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  if (text.join("").replace(/\s/g, "").length < MIN_TEXT) return null;
  const pages = text.map((page, i) => `## Page ${i + 1}\n\n${page.trim()}`);
  const head = [`# ${path.basename(file)}`, ...(from ? [`Source: ${from}`] : []), `${totalPages} pages, as text: tables come out as rows of text, images are left out.`];
  return `${[...head, ...pages].join("\n\n")}\n`;
}

/**
 * What a PDF miyagi printed holds, to check it without opening it (Read can't always render a
 * PDF): its pages and how each one begins. A page with no text says so (an image, or empty).
 */
export async function pdfPreview(file: string, perPage = 160, maxPages = 15): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(await readFile(file)));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  const lines = text.slice(0, maxPages).map((page, i) => {
    const flat = page.replace(/\s+/g, " ").trim();
    return `p. ${i + 1}: ${flat ? `${flat.slice(0, perPage)}${flat.length > perPage ? "…" : ""}` : "(no text)"}`;
  });
  return [`${totalPages} page${totalPages === 1 ? "" : "s"}.`, ...lines, ...(totalPages > maxPages ? [`…and ${totalPages - maxPages} more.`] : [])].join("\n");
}

const exists = (file: string) => access(file).then(() => true, () => false);

export function installPdfText(options: Options, sourcesDir: string): void {
  const postToolUse: HookCallback = async (raw) => {
    const input = raw as { tool_name?: string; tool_input?: { url?: unknown }; tool_response?: unknown };
    if (!input.tool_name || !ADDING_TOOLS.has(input.tool_name)) return {};
    const rel = pdfInReply(input.tool_response);
    if (!rel) return {};
    const mdRel = rel.replace(/\.pdf$/i, ".md");
    const md = path.join(sourcesDir, mdRel);
    let line: string;
    try {
      if (await exists(md)) {
        line = `Its text is in sources/${mdRel}: grep and read that one.`;
      } else {
        const markdown = await pdfToMarkdown(path.join(sourcesDir, rel), typeof input.tool_input?.url === "string" ? input.tool_input.url : undefined);
        if (markdown) {
          await writeFile(md, markdown, { flag: "wx" });
          line = `Its text is in sources/${mdRel}, a "## Page N" heading per page: grep and read that one, and quote from it, instead of reading the PDF again (with Read or WebFetch). Check a table against the PDF's page when its columns matter.`;
        } else {
          line = `The PDF has no text to extract (a scan?): read it with Read, in parts.`;
        }
      }
    } catch (error) {
      line = `Its text couldn't be extracted (${error instanceof Error ? error.message : String(error)}): read it with Read, in parts.`;
    }
    return { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: line } };
  };
  const hooks: Hooks = (options.hooks ??= {});
  (hooks.PostToolUse ??= []).push({ hooks: [postToolUse] });
}
