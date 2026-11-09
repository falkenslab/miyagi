// Unit tests of the desktop app's ← → over the views visited (#87), on the page's own source.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "../gui/node_modules/typescript/lib/typescript.js";

const source = readFileSync(new URL("../gui/src/viewHistory.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
const { canBack, canForward, NO_HISTORY, step, visit } = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);

const path = (...views) => views.reduce(visit, NO_HISTORY);

test("the views visited, and the one already on changes nothing", () => {
  const history = path("today", "chat", "chat", "plan");
  assert.deepEqual(history.list, ["today", "chat", "plan"]);
  assert.equal(history.at, 2);
});

test("back and forward walk them, disabled at either end", () => {
  let now = path("today", "chat", "plan");
  assert.ok(canBack(now) && !canForward(now));
  now = step(now, -1);
  assert.equal(now.list[now.at], "chat");
  assert.ok(canBack(now) && canForward(now));
  now = step(step(now, -1), -1);
  assert.equal(now.at, 0, "at the start it stays");
  assert.ok(!canBack(now));
  now = step(step(step(now, 1), 1), 1);
  assert.equal(now.at, 2, "at the end it stays");
  assert.ok(!canForward(now));
});

test("a new visit forgets what was ahead, and going back to a view isn't a visit", () => {
  const back = step(path("today", "chat", "plan"), -1);
  assert.equal(visit(back, "chat"), back, "the view it's on");
  assert.deepEqual(visit(back, "oven").list, ["today", "chat", "oven"]);
});

test("the history doesn't grow without end", () => {
  let now = NO_HISTORY;
  for (let i = 0; i < 120; i++) now = visit(now, `view${i}`);
  assert.equal(now.list.length, 50);
  assert.equal(now.list.at(-1), "view119");
});
