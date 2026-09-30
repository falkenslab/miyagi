import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { marked } from "marked";
import { checkUrl, type DraftsLimits } from "./files.js";
import { DraftsPathError } from "./paths.js";

/**
 * The two toolbox operations that need a real browser — saving a web page with everything it
 * loads, and printing HTML or Markdown to PDF — with the same playwright-core and system
 * Chrome the Playwright MCP server uses, always headless, in their own short-lived browser.
 */

interface Browser { newPage(): Promise<Page>; close(): Promise<void> }
interface Response { url(): string; status(): number; body(): Promise<Buffer>; request(): { resourceType(): string } }
interface Page {
  on(event: "response", listener: (r: Response) => void): void;
  goto(url: string, options: { waitUntil: "networkidle" | "load"; timeout: number }): Promise<unknown>;
  pdf(options: { path: string; format: string; printBackground: boolean; margin: Record<string, string> }): Promise<unknown>;
  setContent(html: string, options: { waitUntil: "load" }): Promise<void>;
  waitForTimeout(ms: number): Promise<void>;
}

const MB = 1024 * 1024;

/** playwright-core as @playwright/mcp installs it, so there's only one copy to keep up to date. */
function chromium(): { launch(options: { channel: string; headless: boolean }): Promise<Browser> } {
  const mcp = createRequire(import.meta.url).resolve("@playwright/mcp/package.json");
  return createRequire(mcp)("playwright-core").chromium;
}

async function withBrowser<T>(run: (browser: Browser) => Promise<T>): Promise<T> {
  const browser = await chromium().launch({ channel: "chrome", headless: true });
  try {
    return await run(browser);
  } finally {
    await browser.close();
  }
}

/** The longest common directory of some URL paths ("/a/b/x.html", "/a/c/y.js" -> "/a/"). */
function commonDir(paths: string[]): string {
  const split = paths.map((p) => p.split("/").slice(0, -1));
  const first = split[0] ?? [];
  let n = first.length;
  for (const parts of split) {
    let i = 0;
    while (i < n && parts[i] === first[i]) i++;
    n = i;
  }
  return first.slice(0, n).join("/") + "/";
}

/**
 * Loads `rawUrl` and saves every same-host response it loaded under `targetDir`, mirroring
 * the URL paths from their common root, so relative links keep working. Other hosts are
 * listed, not saved, unless `otherHosts`.
 */
export async function fetchSite(rawUrl: string, targetDir: string, limits: DraftsLimits, otherHosts: boolean): Promise<string> {
  const start = checkUrl(rawUrl);
  const responses: Response[] = [];
  // Bodies are only readable while the browser is open: read each one as it arrives.
  const bodies = new Map<Response, Promise<Buffer | null>>();
  await withBrowser(async (browser) => {
    const page = await browser.newPage();
    page.on("response", (r) => {
      responses.push(r);
      bodies.set(r, r.body().catch(() => null));
    });
    await page.goto(start.href, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(1500);
    await Promise.all(bodies.values());
  });
  const saved: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];
  const same = responses.filter((r) => {
    let u: URL;
    try { u = new URL(r.url()); } catch { return false; }
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (u.host !== start.host && !otherHosts) {
      skipped.push(u.href);
      return false;
    }
    return r.status() >= 200 && r.status() < 300;
  });
  const byHost = new Map<string, Response[]>();
  for (const r of same) {
    const host = new URL(r.url()).host;
    byHost.set(host, [...(byHost.get(host) ?? []), r]);
  }
  let total = 0;
  for (const [host, list] of byHost) {
    const root = commonDir(list.map((r) => new URL(r.url()).pathname));
    const base = host === start.host ? targetDir : path.join(targetDir, "_other", host);
    for (const r of list) {
      const u = new URL(r.url());
      let rel = decodeURIComponent(u.pathname.slice(root.length));
      if (rel === "" || rel.endsWith("/")) rel += "index.html";
      const dest = path.resolve(base, rel);
      if (path.relative(base, dest).startsWith("..")) continue;
      const body = await bodies.get(r);
      if (!body) {
        failed.push(u.href);
        continue;
      }
      if (body.length > limits.downloadMB * MB) throw new DraftsPathError(`${u.href} is over the ${limits.downloadMB} MB limit`);
      total += body.length;
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, body);
      saved.push(path.relative(targetDir, dest).split(path.sep).join("/"));
    }
  }
  const startRel = path.relative(targetDir, path.resolve(targetDir, decodeURIComponent(start.pathname.slice(commonDir((byHost.get(start.host) ?? []).map((r) => new URL(r.url()).pathname)).length)) || "index.html")).split(path.sep).join("/");
  return [
    `Saved ${saved.length} files (${(total / MB).toFixed(2)} MB). The page itself is ${startRel || "index.html"}.`,
    saved.map((s) => `- ${s}`).join("\n"),
    skipped.length ? `From other sites, not saved (pass otherHosts to save them): ${[...new Set(skipped)].slice(0, 30).join(", ")}` : "",
    failed.length ? `Couldn't read: ${failed.join(", ")}` : "",
    "Only what the page loaded on its own was saved: anything it loads later (on a click, a later level) isn't here; fetch it with drafts_download.",
  ].filter(Boolean).join("\n");
}

/** Prints an HTML or Markdown file to PDF (A4, backgrounds on). Relative images and styles load from its folder. */
export async function toPdf(source: string, target: string): Promise<void> {
  const ext = path.extname(source).toLowerCase();
  await mkdir(path.dirname(target), { recursive: true });
  await withBrowser(async (browser) => {
    const page = await browser.newPage();
    if (ext === ".md" || ext === ".markdown") {
      const md = await readFile(source, "utf-8");
      const body = await marked.parse(md);
      const base = pathToFileURL(path.dirname(source) + path.sep).href;
      const html = `<!doctype html><html><head><meta charset="utf-8"><base href="${base}"><style>body{font:11pt/1.5 system-ui,sans-serif;max-width:48rem;margin:0 auto}pre,code{font-family:ui-monospace,Consolas,monospace}pre{background:#f4f4f4;padding:.6rem;white-space:pre-wrap}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3rem .5rem}</style></head><body>${body}</body></html>`;
      await page.setContent(html, { waitUntil: "load" });
    } else if (ext === ".html" || ext === ".htm") {
      await page.goto(pathToFileURL(source).href, { waitUntil: "load", timeout: 60_000 });
    } else {
      throw new DraftsPathError("only .html, .htm, .md and .markdown files can be printed to PDF");
    }
    await page.pdf({ path: target, format: "A4", printBackground: true, margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" } });
  });
}
