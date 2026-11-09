// Unit tests of the side panel's tab model (#85) and of the turns its activity shows (#70), on the page's own source: the page isn't built into
// dist/ as modules, so its file is compiled here with the page's TypeScript (`npm run build` installs it).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "../gui/node_modules/typescript/lib/typescript.js";

const source = readFileSync(new URL("../gui/src/sideTabs.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
const { ACTIVITY_TAB, activityTab, addTab, canPreview, closeTab, fileTab, namedFile, NO_TABS, selectTab, shownTurn, turnOfEntry, turnsOf } = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);

const pdf = fileTab("drafts/guion.pdf");
const html = fileTab("drafts/web/pagina.html");
const notes = fileTab("materials/apuntes.md");

test("a file's tab is named by its file, and the same file opens the same tab", () => {
  assert.equal(pdf.title, "guion.pdf");
  assert.equal(html.title, "pagina.html");
  assert.equal(pdf.kind, "file");
  const two = addTab(addTab(NO_TABS, pdf), html);
  assert.deepEqual(two.list.map((tab) => tab.id), [pdf.id, html.id]);
  assert.equal(two.active, html.id);
  const again = addTab(two, pdf);
  assert.equal(again.list.length, 2, "not a second tab");
  assert.equal(again.active, pdf.id, "brought forward");
});

test("closing a tab leaves the next one on screen, and the last one leaves none", () => {
  const three = addTab(addTab(addTab(NO_TABS, pdf), html), notes);
  const middle = closeTab(selectTab(three, html.id), html.id);
  assert.equal(middle.active, notes.id, "the one after it");
  const end = closeTab(middle, notes.id);
  assert.equal(end.active, pdf.id, "the one before it, at the end of the row");
  const other = closeTab(selectTab(three, pdf.id), notes.id);
  assert.equal(other.active, pdf.id, "closing another leaves the one on screen");
  const none = closeTab(end, pdf.id);
  assert.deepEqual(none, { list: [], active: null });
  assert.equal(closeTab(none, "nada"), none, "an unknown tab changes nothing");
});

test("only what the host serves and the page draws opens in the panel", () => {
  for (const file of ["a.html", "a.HTM", "a.pdf", "a.png", "a.jpg", "a.svg", "a.md", "a.txt", "a.gift", "a.csv", "a.json", "a.xml"]) assert.ok(canPreview(file), file);
  for (const file of ["a.docx", "a.zip", "a.mbz", "Makefile"]) assert.ok(!canPreview(file), file);
});

test("the oven's lines name the file that opens beside the chat", () => {
  assert.equal(namedFile("Proyecto web — plan: drafts/proyecto-web/plan.md — source: drafts/proyecto-web/ — next: comparar"), "drafts/proyecto-web/plan.md");
  assert.equal(namedFile("`drafts/tarea/guion.pdf`."), "drafts/tarea/guion.pdf");
  assert.equal(namedFile("drafts/archivo.docx y materials/banco.gift"), "materials/banco.gift", "the first the panel can show");
  assert.equal(namedFile("Tarea de normalización"), undefined);
  assert.equal(namedFile("drafts/proyecto-web/"), undefined, "a folder isn't a file");
  assert.equal(namedFile("sources/temario.pdf"), undefined, "sources/ isn't served");
});

test("the activity is one tab, on the turn asked for", () => {
  const tab = addTab(NO_TABS, activityTab(4));
  assert.equal(tab.list[0].id, ACTIVITY_TAB);
  assert.equal(tab.list[0].turn, 4);
  const again = addTab(tab, activityTab(null));
  assert.equal(again.list.length, 1);
  assert.equal(again.list[0].turn, null, "brought forward on the new turn");
});

const call = (label, done = true) => ({ toolName: "Read", label, result: done ? { isError: false, text: "" } : null, children: [] });
const transcript = [
  { id: 1, kind: "agent", text: "Hola" },
  { id: 2, kind: "tools", calls: [call("uno")] },
  { id: 3, kind: "turn-summary", seconds: 3 },
  { id: 4, kind: "user", text: "lee" },
  { id: 5, kind: "tools", calls: [call("dos")] },
  { id: 6, kind: "agent", text: "..." },
  { id: 7, kind: "tools", calls: [call("tres", false)] },
];

test("a transcript splits into turns, each with its calls and, once ended, its time", () => {
  const turns = turnsOf(transcript);
  assert.deepEqual(turns.map((turn) => turn.id), [1, 4]);
  assert.deepEqual(turns[0].calls.map((one) => one.label), ["uno"]);
  assert.equal(turns[0].seconds, 3);
  assert.deepEqual(turns[1].calls.map((one) => one.label), ["dos", "tres"]);
  assert.equal(turns[1].seconds, null, "still running");
  const noSummaries = turnsOf([{ id: 1, kind: "user", text: "a" }, { id: 2, kind: "tools", calls: [] }, { id: 3, kind: "user", text: "b" }]);
  assert.equal(noSummaries.length, 2, "a reopened conversation splits at the teacher's lines");
});

test("the turn shown: the one chosen, otherwise the running one or the last that did something", () => {
  const turns = turnsOf(transcript);
  assert.equal(turnOfEntry(transcript, 2), 1, "an older turn stays chosen");
  assert.equal(turnOfEntry(transcript, 5), null, "the latest follows the conversation");
  assert.equal(shownTurn(turns, 1, true).id, 1);
  assert.equal(shownTurn(turns, null, true).id, 4);
  assert.equal(shownTurn(turns, 99, true).id, 4, "a turn no longer there falls back to the running one");
  const silent = [...transcript, { id: 8, kind: "turn-summary", seconds: 2 }, { id: 9, kind: "user", text: "gracias" }, { id: 10, kind: "agent", text: "de nada" }, { id: 11, kind: "turn-summary", seconds: 1 }];
  assert.equal(shownTurn(turnsOf(silent), null, false).id, 4, "idle, the last turn that did something");
});
