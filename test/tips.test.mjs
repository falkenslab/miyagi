// Unit tests of the startup tips' parser and order (#82), on the page's own source: compiled here
// with the page's TypeScript, as the page isn't built into dist/ as modules.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "../gui/node_modules/typescript/lib/typescript.js";

const source = readFileSync(new URL("../gui/src/tips.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
const { parseTips, tipIndex, tipsLanguage, tipUrl } = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);

test("a tip has its heading, its id, its body, its image and its link", () => {
  const [tip] = parseTips("# Tips\r\n\r\n## Change the mode {#01-mode}\r\n\r\nShift+Tab goes round.\r\n\r\n![The pill](img/01-mode.webp)\r\n\r\n[Learn more](guia/chat#atajos)\r\n");
  assert.deepEqual(tip, { id: "01-mode", title: "Change the mode", body: "Shift+Tab goes round.", image: { alt: "The pill", src: "img/01-mode.webp" }, link: { label: "Learn more", page: "guia/chat#atajos" } });
});

test("the image and the link are optional, and the body keeps its lines", () => {
  const tips = parseTips("## A {#a}\n\nOne line.\nTwo lines.\n\n## B {#b}\n\nJust this. [a link](https://x) stays in the text.\n");
  assert.equal(tips.length, 2);
  assert.equal(tips[0].body, "One line.\nTwo lines.");
  assert.equal(tips[0].image, undefined);
  assert.equal(tips[1].link, undefined, "a link in the middle of the text isn't the tip's link");
  assert.match(tips[1].body, /stays in the text/);
});

test("the language picks Spanish or falls back to English", () => {
  assert.equal(tipsLanguage("es-ES"), "es");
  assert.equal(tipsLanguage("fr"), "en");
  assert.equal(tipsLanguage(undefined), "en");
});

test("the docs link goes to its language's site", () => {
  assert.equal(tipUrl("guia/chat#atajos", "es"), "https://falkenslab.github.io/miyagi/guia/chat#atajos");
  assert.equal(tipUrl("guia/chat", "en"), "https://falkenslab.github.io/miyagi/en/guia/chat");
});

test("the next tip wraps round the list", () => {
  assert.equal(tipIndex(undefined, 50), 0);
  assert.equal(tipIndex(3, 50), 3);
  assert.equal(tipIndex(50, 50), 0);
  assert.equal(tipIndex(53, 50), 3);
  assert.equal(tipIndex(-1, 50), 49);
  assert.equal(tipIndex(7, 0), 0, "no tips, no index");
});
