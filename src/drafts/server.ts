import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { createSdkMcpServer, tool } from "@falkenslab/agent-kit";
import { z } from "zod";
import { fetchSite, toPdf } from "./browser.js";
import { checkUrl, copyEntry, deleteEntry, download, fileInfo, listEntries, moveEntry, unzip, zip, type DraftsLimits } from "./files.js";
import { resolveInDrafts, shown } from "./paths.js";

/**
 * The drafts toolbox: file operations the agent needs to build what it uploads to Moodle
 * (download a site, copy, zip a SCORM package, print a PDF), as code inside teacher-agent's
 * own process instead of a shell (ADR-003). Every path is checked to stay inside drafts/
 * (paths.ts); URLs are http(s) only; downloads and unzips have limits; nothing it handles is
 * ever executed. Registered in run and chat, as the in-process MCP server "drafts".
 *
 * Optional parameters are `.optional()` with the default applied here: with zod's `.default()`
 * the SDK's validation treats them as required, and a call that leaves one out is rejected.
 */

type Result = { content: { type: "text"; text: string }[]; isError?: boolean };
const ok = (text: string): Result => ({ content: [{ type: "text", text }] });
const fail = (error: unknown): Result => ({ content: [{ type: "text", text: `Refused: ${error instanceof Error ? error.message : String(error)}` }], isError: true });

async function guarded(run: () => Promise<string>): Promise<Result> {
  try {
    return ok(await run());
  } catch (error) {
    return fail(error);
  }
}

export const DRAFTS_SERVER = "drafts";

export function createDraftsServer(draftsDir: string, limits: DraftsLimits) {
  const inDrafts = (p: string, allowRoot = false) => resolveInDrafts(draftsDir, p, allowRoot);
  const rel = (abs: string) => shown(draftsDir, abs);
  const pathArg = (what: string) => z.string().describe(`${what}, relative to drafts/ (e.g. "my-game/index.html")`);

  return createSdkMcpServer({
    name: DRAFTS_SERVER,
    version: "1.0.0",
    tools: [
      tool("drafts_list", "List a folder in drafts/: each entry's path, size and date. Use \".\" for drafts/ itself.", {
        path: pathArg("The folder (default: drafts/ itself)").optional(),
        recursive: z.boolean().optional().describe("Include subfolders (up to 2000 entries); default false"),
      }, (a) => guarded(async () => {
        const dir = inDrafts(a.path ?? ".", true);
        const entries = await listEntries(dir, a.recursive ?? false);
        if (entries.length === 0) return `${rel(dir)} is empty.`;
        return entries.map((e) => `${e.dir ? "[dir] " : ""}${e.path}${e.dir ? "" : `  ${e.size} B`}  ${e.modified}`).join("\n");
      })),

      tool("drafts_mkdir", "Create a folder (and its parents) in drafts/.", { path: pathArg("The folder to create") }, (a) => guarded(async () => {
        const dir = inDrafts(a.path);
        const { mkdir } = await import("node:fs/promises");
        await mkdir(dir, { recursive: true });
        return `Created ${rel(dir)}.`;
      })),

      tool("drafts_copy", "Copy a file or a folder (binaries too) inside drafts/. Overwrites the destination.", {
        from: pathArg("What to copy"),
        to: pathArg("Where to"),
      }, (a) => guarded(async () => {
        const from = inDrafts(a.from);
        const to = inDrafts(a.to);
        await copyEntry(from, to);
        return `Copied ${rel(from)} to ${rel(to)}.`;
      })),

      tool("drafts_move", "Move or rename a file or a folder inside drafts/.", {
        from: pathArg("What to move"),
        to: pathArg("Where to"),
      }, (a) => guarded(async () => {
        const from = inDrafts(a.from);
        const to = inDrafts(a.to);
        await moveEntry(from, to);
        return `Moved ${rel(from)} to ${rel(to)}.`;
      })),

      tool("drafts_delete", "Delete a file or a folder in drafts/, permanently (there's no bin). drafts/ itself can't be deleted.", {
        path: pathArg("What to delete"),
      }, (a) => guarded(async () => {
        const target = inDrafts(a.path);
        await deleteEntry(target);
        return `Deleted ${rel(target)}.`;
      })),

      tool("drafts_download", `Download one http(s) URL to a file in drafts/ (up to ${limits.downloadMB} MB, 60 s). Reports its size and content type.`, {
        url: z.string().describe("An http or https URL"),
        to: pathArg("The file to save it as"),
      }, (a) => guarded(async () => {
        const url = checkUrl(a.url);
        const to = inDrafts(a.to);
        const r = await download(url, to, limits.downloadMB);
        return `Saved ${rel(to)}: ${r.bytes} bytes, ${r.type}${r.finalUrl !== url.href ? ` (redirected to ${r.finalUrl})` : ""}.`;
      })),

      tool("drafts_fetch_site", "Load a web page in a headless browser and save it with everything it loaded (HTML, CSS, JS, images, fonts, data) into a folder in drafts/, mirroring the URL paths from their common root so relative links keep working. Other sites' files are listed, not saved, unless otherHosts.", {
        url: z.string().describe("The page, http or https"),
        to: pathArg("The folder to save it into"),
        otherHosts: z.boolean().optional().describe("Also save files from other sites (under _other/<host>/); default false"),
      }, (a) => guarded(async () => {
        const to = inDrafts(a.to);
        return `Into ${rel(to)}:\n${await fetchSite(a.url, to, limits, a.otherHosts ?? false)}`;
      })),

      tool("drafts_unzip", `Unzip an archive in drafts/ into a folder in drafts/. Refuses entries that would land outside the folder, and archives over ${limits.unzipMB} MB or ${limits.unzipFiles} files once expanded.`, {
        archive: pathArg("The .zip file"),
        to: pathArg("The folder to unzip into"),
      }, (a) => guarded(async () => {
        const archive = inDrafts(a.archive);
        const to = inDrafts(a.to);
        const r = await unzip(archive, to, limits);
        return `Unzipped ${r.files} files (${r.bytes} bytes) into ${rel(to)}.`;
      })),

      tool("drafts_zip", "Zip the contents of a folder in drafts/ into a .zip in drafts/, with the folder's files at the archive's root (a SCORM package's imsmanifest.xml must be directly in that folder).", {
        folder: pathArg("The folder whose contents go in the archive"),
        to: pathArg("The .zip file to write"),
      }, (a) => guarded(async () => {
        const folder = inDrafts(a.folder);
        const to = inDrafts(a.to);
        if (!(await stat(folder)).isDirectory()) throw new Error(`${rel(folder)} isn't a folder`);
        const r = await zip(folder, to);
        const manifest = existsSync(path.join(folder, "imsmanifest.xml")) ? " imsmanifest.xml is at its root." : "";
        return `Wrote ${rel(to)}: ${r.files} files, ${r.bytes} bytes.${manifest}`;
      })),

      tool("drafts_pdf", "Print an HTML or Markdown file in drafts/ to a PDF in drafts/ (A4), with a headless browser; relative images and styles load from its folder.", {
        from: pathArg("The .html or .md file"),
        to: pathArg("The .pdf to write"),
      }, (a) => guarded(async () => {
        const from = inDrafts(a.from);
        const to = inDrafts(a.to);
        await toPdf(from, to);
        return `Wrote ${rel(to)} (${(await stat(to)).size} bytes).`;
      })),

      tool("drafts_info", "A file's real type (from its content, not its name), size, image dimensions and SHA-256.", {
        path: pathArg("The file"),
      }, (a) => guarded(async () => {
        const file = inDrafts(a.path);
        const info = await fileInfo(file);
        return `${rel(file)}: ${Object.entries(info).map(([k, v]) => `${k} ${v}`).join(", ")}`;
      })),
    ],
  });
}
