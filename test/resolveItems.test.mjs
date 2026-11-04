// Unit tests of the items named in the chat that the page links (#66), on the built code in
// dist/: what exists inside sources/, materials/, drafts/ and the knowledge base, and nothing
// else. Run with `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { resolveItems } from "../dist/host/course.js";

const dir = mkdtempSync(path.join(os.tmpdir(), "miyagi-resolve-"));
for (const folder of ["sources", "materials/ut2", "drafts/juego", "knowledge/topics"]) mkdirSync(path.join(dir, folder), { recursive: true });
writeFileSync(path.join(dir, "sources", "programacion.pdf"), "%PDF");
writeFileSync(path.join(dir, "materials", "ut2", "banco.questions.md"), "#");
writeFileSync(path.join(dir, "materials", ".publications.json"), "{}");
writeFileSync(path.join(dir, "drafts", "juego", "index.html"), "<p>");
writeFileSync(path.join(dir, "config.json"), "{}");
const pages = new Set(["course/teaching-plan", "course/drafts", "topic/ut2-modelo-er"]);
const store = { types: () => [{ type: "course", dir: "" }, { type: "topic", dir: "topics" }], read: async (id) => (pages.has(id) ? { id } : null) };
const chat = { api: () => ({ knowledgeStore: store }) };

test("what exists opens in its view", async () => {
  const items = await resolveItems(chat, dir, [
    "sources/programacion.pdf",
    "materials/ut2/banco.questions.md",
    "drafts/juego/index.html",
    "course/teaching-plan",
    "course/drafts",
    "topic/ut2-modelo-er",
    "knowledge/topics/ut2-modelo-er.md",
    "knowledge/teaching-plan.md",
  ]);
  assert.deepEqual(items, {
    "sources/programacion.pdf": { view: "sources", item: "programacion.pdf" },
    "materials/ut2/banco.questions.md": { view: "materials", item: "materials/ut2/banco.questions.md" },
    "drafts/juego/index.html": { view: "materials", item: "drafts/juego/index.html" },
    "course/teaching-plan": { view: "plan" },
    "course/drafts": { view: "oven" },
    "topic/ut2-modelo-er": { view: "knowledge", item: "topic/ut2-modelo-er" },
    "knowledge/topics/ut2-modelo-er.md": { view: "knowledge", item: "topic/ut2-modelo-er" },
    "knowledge/teaching-plan.md": { view: "plan" },
  });
});

test("nothing that doesn't exist, is hidden or is outside the four folders", async () => {
  const items = await resolveItems(chat, dir, [
    "sources/otro.pdf",
    "topic/no-existe",
    "materials/.publications.json",
    "materials/../config.json",
    "sources/../config.json",
    "config.json",
    ".env",
    "drafts/juego",
    "/etc/passwd",
    "C:/Windows/win.ini",
  ]);
  assert.deepEqual(items, {});
});
