// Unit tests of the guided tour's steps and of where its bubble goes (#81), on the page's own source:
// the page isn't built into dist/ as modules, so its file is compiled here with the page's TypeScript.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "../gui/node_modules/typescript/lib/typescript.js";

const source = readFileSync(new URL("../gui/src/tour.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
const { highlight, placeBubble, spotlightPath, stepsFor, TOUR_STEPS, TOUR_VERSION, viewAt } = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);

const bubble = { width: 360, height: 200 };
const view = { width: 1440, height: 900 };

test("the steps a browser has leave out the desktop app's", () => {
  const ids = stepsFor({}).map((step) => step.id);
  assert.ok(!ids.includes("browser") && !ids.includes("titleBar"));
  assert.ok(ids.includes("sidePanel"), "the side panel exists in the browser too");
  const app = stepsFor({ browser: true, frame: true }).map((step) => step.id);
  assert.deepEqual(app, TOUR_STEPS.map((step) => step.id));
  assert.equal(new Set(app).size, app.length, "every step once");
  assert.ok(TOUR_VERSION >= 1);
});

test("the tour starts and ends where it must", () => {
  const steps = stepsFor({ browser: true, frame: true });
  assert.equal(steps[0].id, "welcome");
  assert.equal(steps[0].target, undefined, "the welcome has no element: it's centred");
  assert.equal(steps.at(-1).id, "theme", "the last one says where to reopen it");
});

test("a step without a view keeps the last one declared, going forward or back", () => {
  const steps = [{ id: "a", view: "plan" }, { id: "b" }, { id: "c", view: "chat" }, { id: "d" }];
  assert.equal(viewAt(steps, 1), "plan");
  assert.equal(viewAt(steps, 3), "chat");
  assert.equal(viewAt([{ id: "a" }], 0), "today", "today, with none declared");
});

test("the bubble goes beside a sidebar element, and clear of it", () => {
  const target = { left: 70, top: 300, width: 260, height: 48 };
  const { left, top } = placeBubble(target, bubble, view);
  assert.ok(left >= target.left + target.width, "to its right");
  assert.ok(top >= 12 && top + bubble.height <= view.height - 12);
});

test("to the left of what's on the window's right edge", () => {
  const target = { left: 1370, top: 60, width: 60, height: 44 };
  const { left } = placeBubble(target, bubble, view);
  assert.ok(left + bubble.width <= target.left);
});

test("on a phone, above or below, without covering the target or leaving the window", () => {
  const phone = { width: 360, height: 760 };
  const wide = { width: 336, height: 220 };
  const composer = { left: 10, top: 640, width: 340, height: 100 };
  const up = placeBubble(composer, wide, phone);
  assert.ok(up.top + wide.height <= composer.top, "above the composer");
  assert.ok(up.left >= 12 && up.left + wide.width <= phone.width - 12 + 1e-6);
  const tabs = { left: 0, top: 60, width: 360, height: 44 };
  assert.ok(placeBubble(tabs, wide, phone).top >= tabs.top + tabs.height, "below the tabs");
});

test("a target too big to clear leaves the bubble inside the window", () => {
  const phone = { width: 360, height: 760 };
  const wide = { width: 336, height: 220 };
  const { left, top } = placeBubble({ left: 0, top: 80, width: 340, height: 620 }, wide, phone);
  assert.ok(left >= 12 && top >= 12 && top + wide.height <= phone.height - 12);
});

test("without a target the bubble is centred", () => {
  assert.deepEqual(placeBubble(null, bubble, view), { left: 540, top: 350 });
});

test("the spotlight's outline has a hole only for a target", () => {
  const none = spotlightPath(null, view);
  assert.match(none, /^path\(evenodd, "M0 0H1440V900H0Z"\)$/);
  const hole = spotlightPath({ left: 10, top: 20, width: 100, height: 40 }, view);
  assert.ok(hole.startsWith('path(evenodd, "M0 0H1440V900H0ZM20 20'), hole);
  assert.ok(hole.endsWith('Z")'));
});

test("the highlight has some air and stays in the window", () => {
  assert.deepEqual(highlight({ left: 100, top: 100, width: 50, height: 20 }, view), { left: 96, top: 96, width: 58, height: 28 });
  assert.deepEqual(highlight({ left: 0, top: 0, width: 1440, height: 40 }, view), { left: 0, top: 0, width: 1440, height: 44 });
});
