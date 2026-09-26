// Checks a workspace's knowledge base. Exits 1 on broken links, pages missing from index.md, or
// (with --names) a student's name in any page; everything else is reported for review.
// Usage: node .claude/skills/smoke-ingest/check-knowledge.mjs <workspace> [--names "Ana,Luis,..."]
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const namesIdx = args.indexOf("--names");
const names = namesIdx === -1 ? [] : (args[namesIdx + 1] ?? "").split(",").map((n) => n.trim()).filter(Boolean);
const ws = path.resolve(args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--names") ?? ".");
const kb = path.join(ws, "knowledge");
const legacy = path.join(ws, "knowledge-legacy");
const sources = path.join(ws, "sources");

const files = (dir) =>
  !fs.existsSync(dir)
    ? []
    : fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const f = path.join(dir, e.name);
        return e.isDirectory() ? files(f) : [f];
      });
const rel = (f) => path.relative(kb, f).split(path.sep).join("/");

const pages = files(kb).filter((f) => f.endsWith(".md"));
if (pages.length === 0) {
  console.log(`no knowledge base in ${kb}`);
  process.exit(1);
}
const text = new Map(pages.map((f) => [f, fs.readFileSync(f, "utf8")]));
const allText = [...text.values()].join("\n");

const byFolder = {};
for (const f of pages) {
  const parts = rel(f).split("/");
  byFolder[parts.length > 1 ? parts[0] : "(root)"] = (byFolder[parts.length > 1 ? parts[0] : "(root)"] ?? 0) + 1;
}
console.log(`pages: ${pages.length} ${JSON.stringify(byFolder)}`);

// Links.
let links = 0;
const broken = [];
const toLegacy = [];
for (const [f, t] of text) {
  for (const m of t.matchAll(/\]\(([^)#\s]+)\)/g)) {
    if (/^(https?|mailto):/.test(m[1])) continue;
    links++;
    const target = path.resolve(path.dirname(f), decodeURI(m[1]));
    if (target.startsWith(legacy)) toLegacy.push(`${rel(f)} -> ${m[1]}`);
    else if (!fs.existsSync(target)) broken.push(`${rel(f)} -> ${m[1]}`);
  }
}
console.log(`links: ${links}, broken: ${broken.length}, into knowledge-legacy/: ${toLegacy.length}`);
[...broken, ...toLegacy].slice(0, 15).forEach((l) => console.log(`  ${l}`));

// index.md lists every page.
const index = text.get(path.join(kb, "index.md")) ?? "";
const unindexed = pages.filter((f) => !["index.md", "log.md"].includes(rel(f)) && !index.includes(rel(f)));
console.log(`pages missing from index.md: ${unindexed.length}`);
unindexed.slice(0, 15).forEach((f) => console.log(`  ${rel(f)}`));

// Originals in sources/ that no page mentions (by file name).
const originals = files(sources);
const unreferenced = originals.filter((f) => !allText.includes(path.basename(f)));
console.log(`originals in sources/: ${originals.length}, not mentioned by any page: ${unreferenced.length}`);
unreferenced.slice(0, 15).forEach((f) => console.log(`  ${path.relative(ws, f)}`));

// URLs of the old notes (only while knowledge-legacy/ exists). An URL counts as kept if the
// knowledge base has it whole, or its path (Moodle pages are often kept relative), or, for
// a file, its name.
if (fs.existsSync(legacy)) {
  const clean = (u) => u.replace(/[*.,;:)\]>]+$/, "");
  const urls = [...new Set(files(legacy).filter((f) => f.endsWith(".md")).flatMap((f) => (fs.readFileSync(f, "utf8").match(/https?:\/\/[^\s)>"'`\]]+/g) ?? []).map(clean)))];
  const kept = (u) => {
    if (allText.includes(u) || allText.includes(u.replace(/\/$/, ""))) return true;
    const { pathname, search } = new URL(u);
    const tail = pathname.split("/").filter(Boolean).slice(-2).join("/") + search;
    return tail.length > 3 && allText.includes(tail);
  };
  const lost = urls.filter((u) => !kept(u));
  console.log(`URLs in the old notes: ${urls.length}, not found in the knowledge base: ${lost.length}`);
  lost.forEach((u) => console.log(`  ${u}`));
}

// The teacher's knowledge base keeps class-level patterns, never a record of a named student.
const named = [];
for (const [f, t] of text) {
  for (const name of names) {
    // Letter boundaries by hand: \b doesn't treat accented letters (Lucía) as word characters.
    if (new RegExp(`(?<!\\p{L})${name}(?!\\p{L})`, "u").test(t)) named.push(`${rel(f)}: ${name}`);
  }
}
if (names.length > 0) {
  console.log(`pages naming a student: ${named.length}`);
  named.slice(0, 15).forEach((l) => console.log(`  ${l}`));
}

// Histories keep dated entries instead of being rewritten.
for (const history of ["progress.md", "course-audit.md"]) {
  const t = text.get(path.join(kb, history));
  if (t) console.log(`${history}: ${(t.match(/\d{4}-\d{2}-\d{2}/g) ?? []).length} dated entries`);
}

if (broken.length > 0 || unindexed.length > 0 || named.length > 0) process.exit(1);
