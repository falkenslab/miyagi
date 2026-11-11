// Unit tests of miyagi's commands as actions of the page (#67), on the built code in dist/: every
// command carries what the page needs to offer it, and an own command without it still shows in
// the catalog. Run with `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { listCommands } from "../dist/catalog.js";
import { pageActions } from "../dist/host/server.js";

const LANGUAGES = ["es", "en", "fr", "de"];
const GROUPS = ["day", "create", "plan", "memory", "classroom"];
const KINDS = ["topic", "material", "quiz", "source", "page", "plan", "draft", "text"];

const dir = mkdtempSync(path.join(os.tmpdir(), "miyagi-actions-"));
mkdirSync(path.join(dir, ".claude", "commands"), { recursive: true });
writeFileSync(path.join(dir, ".claude", "commands", "sopa-de-letras.md"), "---\ndescription: A word search\n---\n\nMake one: $ARGUMENTS\n");

test("every command of miyagi and of the knowledge base is an action, in the four languages", async () => {
  const entries = (await listCommands(dir)).filter((entry) => entry.origin === "builtin");
  assert.ok(entries.length >= 17);
  for (const { name, action } of entries) {
    assert.ok(action, `${name} has no action metadata`);
    for (const language of LANGUAGES) assert.ok(action.label[language], `${name} has no label in ${language}`);
    assert.ok(action.icon, `${name} has no icon`);
    assert.ok(GROUPS.includes(action.group), `${name}: unknown group ${action.group}`);
    for (const kind of action.appliesTo) assert.ok(KINDS.includes(kind), `${name}: unknown item ${kind}`);
    if (action.ask) for (const language of LANGUAGES) assert.ok(action.ask[language], `${name} doesn't ask in ${language}`);
  }
});

test("where the page offers them: a topic, selected text, the map's page", async () => {
  const actions = pageActions(await listCommands(dir));
  const on = (kind) => actions.filter((action) => action.appliesTo?.includes(kind)).map((action) => action.command);
  assert.deepEqual(on("topic").sort(), ["miyagi:align", "miyagi:build-unit", "miyagi:quiz", "miyagi:research"]);
  assert.deepEqual(on("text").sort(), ["miyagi:quiz", "miyagi:research"]);
  assert.equal(actions.find((action) => action.command === "miyagi:map")?.opens, "course/course-map");
  assert.ok(actions.find((action) => action.command === "miyagi:grade")?.needsClassroom);
  assert.ok(!actions.find((action) => action.command === "miyagi:quiz")?.needsClassroom);
});

test("an own command without metadata is in the catalog, by its name only", async () => {
  const own = pageActions(await listCommands(dir)).find((action) => action.command === "sopa-de-letras");
  assert.ok(own);
  assert.equal(own.label, undefined);
  assert.equal(own.appliesTo, undefined);
});
