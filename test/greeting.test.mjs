// Unit tests of the greeting Today shows (#98), on the page's own source: the page isn't built into
// dist/ as modules, so its file is compiled here with the page's TypeScript.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "../gui/node_modules/typescript/lib/typescript.js";

const source = readFileSync(new URL("../gui/src/greeting.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
const { greetingOf } = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);

const agent = (text) => ({ id: 1, kind: "agent", text });
const user = (text) => ({ id: 2, kind: "user", text });
const tools = { id: 3, kind: "tools", calls: [] };
const end = { id: 4, kind: "turn-summary", seconds: 3 };

test("the greeting is what miyagi said before the teacher's first message, not its last reply", () => {
  const refused = [agent("Hola, sé de la asignatura."), end, user("Publica el tema"), agent("De acuerdo, no lo publico."), end];
  assert.equal(greetingOf(refused), "Hola, sé de la asignatura.");
});

test("a greeting that worked in between is its last words, up to the turn's end", () => {
  assert.equal(greetingOf([agent("Miro la base."), tools, agent("Hola, ya la he leído."), end, agent("Otra cosa")]), "Hola, ya la he leído.");
});

test("a resumed conversation, without the turn's end, still has its greeting", () => {
  assert.equal(greetingOf([agent("Hola."), user("Prepara la rúbrica"), agent("Hecha.")]), "Hola.");
});

test("no greeting when the teacher spoke first, when nothing was said yet, or when the greeting failed", () => {
  assert.equal(greetingOf([user("Prepara la rúbrica"), agent("Hecha.")]), "");
  assert.equal(greetingOf([]), "");
  assert.equal(greetingOf([{ id: 5, kind: "notice", tone: "error", text: "Sin red" }, end]), "");
  assert.equal(greetingOf([agent("Hola"), { id: 5, kind: "notice", tone: "error", text: "Sin red" }, end]), "");
});

test("a notice that isn't an error doesn't take the greeting away", () => {
  assert.equal(greetingOf([{ id: 5, kind: "notice", tone: "warn", text: "Tarda" }, agent("Hola.")]), "Hola.");
});

test("a long greeting is cut at a word", () => {
  const text = greetingOf([agent(`${"palabra ".repeat(120)}fin`)]);
  assert.ok(text.endsWith("palabra…") && text.length <= 701, text.slice(-20));
});
