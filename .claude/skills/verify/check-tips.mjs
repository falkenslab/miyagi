// Checks the startup tips (#82, gui/tips/): 50 tips in each language with the same ids, in the same
// order, one to three lines each, every image there and under 150 kB, the same images in both, and
// every link resolving to a page of the docs site that exists in that language, with its heading.
// Usage (from the repo root): node .claude/skills/verify/check-tips.mjs
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import ts from "../../../gui/node_modules/typescript/lib/typescript.js";

const root = process.cwd();
const source = readFileSync(path.join(root, "gui/src/tips.ts"), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
const { parseTips } = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);

const TIPS = 50;
const MAX_IMAGE = 150 * 1024;
const LOCALES = { es: "docs/content", en: "docs/i18n/en/docusaurus-plugin-content-docs/current" };
const problems = [];
const problem = (what) => problems.push(what);

/** The headings of a docs page, as the anchors the site gives them. */
function anchors(text) {
  const found = new Set();
  for (const line of text.replace(/\r/g, "").split("\n")) {
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (!heading) continue;
    const explicit = /\{#([^}]+)\}\s*$/.exec(heading[1]);
    if (explicit) found.add(explicit[1]);
    else found.add(heading[1].trim().toLowerCase().replace(/`/g, "").replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-"));
  }
  return found;
}

const all = {};
for (const [language, base] of Object.entries(LOCALES)) {
  const tips = parseTips(readFileSync(path.join(root, "gui/tips", `tips.${language}.md`), "utf8"));
  all[language] = tips;
  if (tips.length !== TIPS) problem(`${language}: ${tips.length} tips, not ${TIPS}`);
  const ids = new Set();
  for (const tip of tips) {
    const name = `${language} ${tip.id || `"${tip.title}"`}`;
    if (!tip.id) problem(`${name}: no id`);
    if (ids.has(tip.id)) problem(`${name}: a repeated id`);
    ids.add(tip.id);
    const lines = tip.body.split("\n").filter(Boolean).length;
    if (lines < 1 || lines > 3) problem(`${name}: ${lines} lines of text`);
    if (!tip.title.trim()) problem(`${name}: no title`);
    if (tip.image) {
      const file = path.join(root, "gui/tips", tip.image.src);
      if (!existsSync(file)) problem(`${name}: no image at ${tip.image.src}`);
      else if (statSync(file).size >= MAX_IMAGE) problem(`${name}: ${tip.image.src} is ${statSync(file).size} bytes`);
      if (!tip.image.alt.trim()) problem(`${name}: its image has no alternative text`);
    }
    if (!tip.link) problem(`${name}: no docs link`);
    else {
      const [page, anchor] = tip.link.page.split("#");
      const file = [".md", ".mdx", "/index.md"].map((ending) => path.join(root, base, page + ending)).find((candidate) => existsSync(candidate));
      if (!file) problem(`${name}: the docs page ${page} doesn't exist in ${base}`);
      else if (anchor && !anchors(readFileSync(file, "utf8")).has(anchor)) problem(`${name}: no heading #${anchor} in ${path.relative(root, file)}`);
    }
  }
}

// Both files say the same tips: ids, order and images.
const pairs = Math.min(all.es.length, all.en.length);
for (let i = 0; i < pairs; i++) {
  const [es, en] = [all.es[i], all.en[i]];
  if (es.id !== en.id) problem(`tip ${i + 1}: es is ${es.id}, en is ${en.id}`);
  if (es.image?.src !== en.image?.src) problem(`${es.id}: its image differs (${es.image?.src} / ${en.image?.src})`);
}

// Nothing left over in the folder of images.
const used = new Set(all.es.flatMap((tip) => (tip.image ? [path.basename(tip.image.src)] : [])));
const dir = path.join(root, "gui/tips/img");
for (const file of existsSync(dir) ? readdirSync(dir) : []) if (!used.has(file)) problem(`gui/tips/img/${file} isn't used by any tip`);

if (problems.length) {
  for (const one of problems) console.log(`FAIL tips: ${one}`);
  process.exit(1);
}
console.log(`ok   tips: ${TIPS} in es and en with the same ids, ${used.size} images, every docs link resolves`);
