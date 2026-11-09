// Unit tests of the sidebar's conversations (#84): titles, the search over what they said and the
// pinned ones, on the built code in dist/. Run with `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { conversationTitle, isOnlyGreeting, isOpening, latestRuns, quoteMatch, readPinned, searchConversations, setPinned } from "../dist/host/conversations.js";

const opening = "Saluda al docente y dile en una frase qué";
const said = (role, text) => ({ role, text });

const scratch = mkdtempSync(path.join(os.tmpdir(), "conversations-"));
after(() => rmSync(scratch, { recursive: true, force: true }));

/** A kept conversation in a subject's sessions/, as the kit writes it. */
function keep(subject, name, messages, when = "2026-11-01T10:00:00Z") {
  const dir = path.join(subject, "sessions", name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "session.json"), JSON.stringify({ sessionId: name, subagents: {} }));
  writeFileSync(path.join(dir, "conversation.jsonl"), messages.map((message, index) => JSON.stringify({ type: message.role, uuid: `${name}-${index}`, timestamp: when, message: { role: message.role, content: message.text } })).join("\n"));
  return dir;
}

test("the title is the teacher's first words, not the greeting miyagi sends itself nor an interrupted turn", () => {
  const messages = [said("user", opening), said("assistant", "Hola"), said("user", "[Request interrupted by user]"), said("user", "  Haz un  examen ")];
  assert.equal(conversationTitle(messages, opening), "Haz un examen");
});

test("a conversation with nothing but the greeting is told apart", () => {
  assert.equal(isOnlyGreeting([said("user", opening), said("assistant", "Hola")], undefined), true);
  assert.equal(isOnlyGreeting([said("user", opening), said("assistant", "Hola"), said("assistant", "Sigo")], undefined), false);
  assert.equal(isOnlyGreeting([said("user", "Hola")], "Hola"), false);
});

test("the opening miyagi sends itself is told by its first words, whatever the day's line in it says", () => {
  for (const prompt of ["chat-opening-teacher.md", "chat-opening-teacher-standalone.md"]) {
    const template = readFileSync(new URL(`../prompts/messages/${prompt}`, import.meta.url), "utf8").trim();
    const said = (line) => template.replace("{{inProgress}}", line);
    assert.equal(isOpening(said("1 being built."), said("nothing in progress.")), true, prompt);
  }
  assert.equal(isOpening("  Greet the teacher from what you already know, that day", "Greet the teacher from what you already know, today"), true);
  assert.equal(isOpening("Prepara la rúbrica", "Greet the teacher from what you already know"), false);
  assert.equal(isOpening("Greet", "Greet the teacher from what you already know"), false);
  assert.equal(isOpening("Greet the teacher from what you already know", undefined), false);
});

test("the list gives the latest ones and says whether older ones are left, with the pinned and the open one always in", () => {
  const runs = ["a", "b", "c", "d", "e"].map((dir) => ({ dir, pinned: dir === "e" }));
  assert.deepEqual(latestRuns(runs, 2, null), { runs: [runs[0], runs[1], runs[4]], more: true });
  assert.deepEqual(latestRuns(runs, 2, "d"), { runs: [runs[0], runs[1], runs[3], runs[4]], more: true });
  assert.deepEqual(latestRuns(runs, 2, "a"), { runs: [runs[0], runs[1], runs[4]], more: true }, "the open one, among the latest, takes its place");
  assert.deepEqual(latestRuns(runs, 4, null), { runs, more: false });
  assert.deepEqual(latestRuns([], 12, null), { runs: [], more: false });
});

test("a match is found whatever the case and the accents, and quoted as it was written", () => {
  const messages = [said("user", "Prepara la rúbrica del examen final de bases de datos, por favor")];
  assert.equal(quoteMatch(messages, "RUBRICA", undefined), "Prepara la rúbrica del examen final de bases de datos, por favor");
  assert.equal(quoteMatch([said("assistant", "Sin coincidencias aquí")], "rúbrica", undefined), undefined);
  assert.equal(quoteMatch(messages, "   ", undefined), undefined);
});

test("words already decomposed and split by line breaks are found too", () => {
  assert.match(quoteMatch([said("assistant", "la rúbrica\ndel   examen")], "rúbrica del examen", undefined), /brica del examen/);
});

test("a long message is quoted around the match, not whole", () => {
  const long = `${"antes ".repeat(40)}zanahoria${" después".repeat(40)}`;
  const quote = quoteMatch([said("assistant", long)], "zanahoria", undefined);
  assert.ok(quote.startsWith("…") && quote.endsWith("…") && quote.includes("zanahoria") && quote.length < 120, quote);
});

test("the greeting miyagi sends itself isn't searched, but its reply is", () => {
  const messages = [said("user", opening), said("assistant", "Buenos días, Paco")];
  assert.equal(quoteMatch(messages, "docente", opening), undefined);
  assert.match(quoteMatch(messages, "paco", opening), /Paco/);
});

test("a search finds only this subject's conversations, newest first, and marks the pinned ones", async () => {
  const subject = path.join(scratch, "a");
  const older = keep(subject, "2026-10-01", [said("user", "Pregunta por la zanahoria")], "2026-10-01T10:00:00Z");
  const newer = keep(subject, "2026-11-01", [said("user", "Otra zanahoria")], "2026-11-01T10:00:00Z");
  keep(path.join(scratch, "b"), "2026-11-02", [said("user", "zanahoria de otra asignatura")]);
  await setPinned(subject, older, true);
  const results = await searchConversations(subject, "ZANAHORIA", undefined, undefined);
  assert.deepEqual(results.map((one) => [one.dir, one.pinned]), [[newer, false], [older, true]]);
  assert.deepEqual(await searchConversations(subject, "   ", undefined, undefined), []);
});

test("a greeting-only conversation isn't found unless it's the open one or pinned, as the list doesn't show it", async () => {
  const subject = path.join(scratch, "greeting");
  const dir = keep(subject, "2026-09-09", [said("user", opening), said("assistant", "Hola, Marta")]);
  assert.deepEqual(await searchConversations(subject, "marta", opening, undefined), []);
  assert.equal((await searchConversations(subject, "marta", opening, dir)).length, 1);
  await setPinned(subject, dir, true);
  assert.equal((await searchConversations(subject, "marta", opening, undefined)).length, 1);
});

test("pinning keeps the folder's name in the subject's sessions/, and unpinning takes it away", async () => {
  const subject = path.join(scratch, "pins");
  const first = keep(subject, "2026-09-01", [said("user", "Hola")]);
  assert.deepEqual(await setPinned(subject, first, true), {});
  assert.deepEqual(JSON.parse(readFileSync(path.join(subject, "sessions", "pinned.json"), "utf8")), ["2026-09-01"]);
  await setPinned(subject, first, true);
  assert.deepEqual(await readPinned(subject), ["2026-09-01"]);
  await setPinned(subject, first, false);
  assert.deepEqual(await readPinned(subject), []);
});

test("only a kept conversation of this subject can be pinned", async () => {
  const subject = path.join(scratch, "only-own");
  const other = keep(path.join(scratch, "other"), "2026-09-01", [said("user", "Hola")]);
  assert.deepEqual(await setPinned(subject, other, true), { error: "unknown conversation" });
  assert.deepEqual(await setPinned(subject, path.join(subject, "sessions", "not-there"), true), { error: "unknown conversation" });
  assert.deepEqual(await readPinned(subject), []);
});

test("a damaged list of pins counts as none", async () => {
  const subject = path.join(scratch, "damaged");
  mkdirSync(path.join(subject, "sessions"), { recursive: true });
  writeFileSync(path.join(subject, "sessions", "pinned.json"), "{not json");
  assert.deepEqual(await readPinned(subject), []);
});
