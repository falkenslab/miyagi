// The drafts toolbox's limits and a round trip of its operations, in a throwaway drafts/:
// paths outside drafts/ ("..", absolute, through a link), file:// URLs, a zip-slip archive,
// a download and an unzip over the limits, and deleting drafts/ itself must be refused;
// copy, zip, unzip, info and (when Chrome is there) a PDF must work.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-drafts-toolbox.mjs
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { zipSync } from "fflate";

const root = process.cwd();
const load = (p) => import(pathToFileURL(path.join(root, "dist/drafts", p)).href);
const { resolveInDrafts } = await load("paths.js");
const { checkUrl, copyEntry, download, fileInfo, unzip, zip, DEFAULT_DRAFTS_LIMITS } = await load("files.js");

const base = fs.mkdtempSync(path.join(os.tmpdir(), "drafts-check-"));
const drafts = path.join(base, "drafts");
const outside = path.join(base, "outside");
fs.mkdirSync(path.join(drafts, "site", "css"), { recursive: true });
fs.mkdirSync(outside);
fs.writeFileSync(path.join(drafts, "site", "index.html"), "<!doctype html><html lang=es><body><h1>Hola</h1></body></html>");
fs.writeFileSync(path.join(drafts, "site", "css", "a.css"), "h1{color:red}");
fs.writeFileSync(path.join(drafts, "notes.md"), "# Apuntes\n\nUn **bucle** repite:\n\n```python\nfor i in range(3):\n    print(i)\n```\n");

let failures = 0;
const refused = async (what, run) => {
  try {
    await run();
    failures++;
    console.log(`FAIL not refused: ${what}`);
  } catch {
    // refused, as it should
  }
};
const works = async (what, run) => {
  try {
    await run();
  } catch (error) {
    failures++;
    console.log(`FAIL ${what}: ${error.message}`);
  }
};

// Paths.
await refused('".." out of drafts/', () => resolveInDrafts(drafts, "../outside/x.txt"));
await refused("an absolute path elsewhere", () => resolveInDrafts(drafts, path.join(outside, "x.txt")));
await refused("drafts/ itself as a target (delete)", () => resolveInDrafts(drafts, "."));
await refused("an empty path", () => resolveInDrafts(drafts, ""));
fs.symlinkSync(outside, path.join(drafts, "link"), "junction");
await refused("a link that leads out of drafts/", () => resolveInDrafts(drafts, "link/x.txt"));
await works("a path inside drafts/", () => resolveInDrafts(drafts, "site/index.html"));
await works("drafts/ itself when allowed (list)", () => resolveInDrafts(drafts, ".", true));

// URLs.
await refused("a file:// URL", () => checkUrl("file:///etc/passwd"));
await refused("a data: URL", () => checkUrl("data:text/plain,hi"));
await works("an https URL", () => checkUrl("https://example.com/a.js"));

// Downloads over the limit, from a local server.
const server = http.createServer((req, res) => {
  const size = req.url === "/big" ? 2 * 1024 * 1024 : 100;
  res.writeHead(200, { "content-type": "application/octet-stream", ...(req.url === "/chunked" ? {} : { "content-length": size }) });
  res.end(Buffer.alloc(req.url === "/chunked" ? 2 * 1024 * 1024 : size));
}).listen(0);
const port = server.address().port;
const oneMB = { ...DEFAULT_DRAFTS_LIMITS, downloadMB: 1 };
await refused("a download over the limit (declared size)", () => download(new URL(`http://127.0.0.1:${port}/big`), path.join(drafts, "big.bin"), oneMB.downloadMB));
await refused("a download over the limit (no declared size)", () => download(new URL(`http://127.0.0.1:${port}/chunked`), path.join(drafts, "big2.bin"), oneMB.downloadMB));
await works("a small download", () => download(new URL(`http://127.0.0.1:${port}/small`), path.join(drafts, "small.bin"), oneMB.downloadMB));
server.close();

// Archives.
fs.writeFileSync(path.join(drafts, "slip.zip"), zipSync({ "ok.txt": new Uint8Array([65]), "../evil.txt": new Uint8Array([66]) }));
await refused("a zip-slip archive", () => unzip(path.join(drafts, "slip.zip"), path.join(drafts, "slip"), DEFAULT_DRAFTS_LIMITS));
if (fs.existsSync(path.join(drafts, "evil.txt")) || fs.existsSync(path.join(base, "evil.txt"))) {
  failures++;
  console.log("FAIL the zip-slip entry was written");
}
const many = {};
for (let i = 0; i < 30; i++) many[`f${i}.txt`] = new Uint8Array([i]);
fs.writeFileSync(path.join(drafts, "many.zip"), zipSync(many));
await refused("an unzip over the file limit", () => unzip(path.join(drafts, "many.zip"), path.join(drafts, "many"), { ...DEFAULT_DRAFTS_LIMITS, unzipFiles: 10 }));
fs.writeFileSync(path.join(drafts, "bomb.zip"), zipSync({ "zeros.bin": new Uint8Array(3 * 1024 * 1024) }, { level: 9 }));
await refused("an unzip over the size limit", () => unzip(path.join(drafts, "bomb.zip"), path.join(drafts, "bomb"), { ...DEFAULT_DRAFTS_LIMITS, unzipMB: 1 }));

// Round trip: copy, zip with the folder's files at the root, unzip, info.
await works("copy a folder", () => copyEntry(path.join(drafts, "site"), path.join(drafts, "copy")));
await works("zip a folder", () => zip(path.join(drafts, "copy"), path.join(drafts, "pkg.zip")));
await works("unzip it", () => unzip(path.join(drafts, "pkg.zip"), path.join(drafts, "unpacked"), DEFAULT_DRAFTS_LIMITS));
if (!fs.existsSync(path.join(drafts, "unpacked", "index.html")) || !fs.existsSync(path.join(drafts, "unpacked", "css", "a.css"))) {
  failures++;
  console.log("FAIL the zip didn't keep the folder's files at its root");
}
const info = await fileInfo(path.join(drafts, "pkg.zip"));
if (info.type !== "application/zip") {
  failures++;
  console.log(`FAIL info says ${info.type} for a zip`);
}

// PDF, when there's a Chrome to print with (CI images have one; skip otherwise).
let pdf = "skipped (no Chrome)";
try {
  const { toPdf } = await load("browser.js");
  await toPdf(path.join(drafts, "notes.md"), path.join(drafts, "notes.pdf"));
  const kind = (await fileInfo(path.join(drafts, "notes.pdf"))).type;
  if (kind !== "application/pdf") {
    failures++;
    console.log(`FAIL the PDF is ${kind}`);
  }
  pdf = "ok";
} catch (error) {
  if (!/executable|chrome|browser/i.test(error.message)) {
    failures++;
    console.log(`FAIL pdf: ${error.message}`);
  }
}

fs.rmSync(base, { recursive: true, force: true });
if (failures > 0) {
  console.log(`\n${failures} drafts toolbox check(s) failed`);
  process.exit(1);
}
console.log(`ok   drafts toolbox: 13 refusals, copy/zip/unzip/info round trip, PDF ${pdf}`);
