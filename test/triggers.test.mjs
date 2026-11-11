// Unit tests of the actions that run on their own (action-triggers #108), on the built code in
// dist/: what a `trigger:` may say, and when a schedule was last due. Run with `npm test` after
// `npm run build`.
import assert from "node:assert/strict";
import { test } from "node:test";

const { parseTrigger, lastDue } = await import("../dist/triggerSpec.js");
const { validateCommand } = await import("../dist/ownCommands.js");

test("a trigger is a daily or weekly time, or an event", () => {
  assert.deepEqual(parseTrigger("daily 07:30"), { kind: "daily", hour: 7, minute: 30 });
  assert.deepEqual(parseTrigger("Weekly MON 08:00"), { kind: "weekly", day: 1, hour: 8, minute: 0 });
  assert.deepEqual(parseTrigger("on draft.published"), { kind: "event", event: "draft.published" });
  assert.equal(typeof parseTrigger("daily 25:00"), "string");
  assert.equal(typeof parseTrigger("weekly lun 08:00"), "string");
  assert.equal(typeof parseTrigger("on grade.saved"), "string");
  assert.equal(typeof parseTrigger("every 5m"), "string");
});

test("a schedule's last due time, at or before now", () => {
  // Wednesday 11 November 2026, 10:15 local time.
  const now = new Date(2026, 10, 11, 10, 15);
  assert.equal(lastDue({ kind: "daily", hour: 7, minute: 30 }, now).getTime(), new Date(2026, 10, 11, 7, 30).getTime());
  assert.equal(lastDue({ kind: "daily", hour: 18, minute: 0 }, now).getTime(), new Date(2026, 10, 10, 18, 0).getTime());
  assert.equal(lastDue({ kind: "weekly", day: 1, hour: 8, minute: 0 }, now).getTime(), new Date(2026, 10, 9, 8, 0).getTime());
  assert.equal(lastDue({ kind: "weekly", day: 3, hour: 11, minute: 0 }, now).getTime(), new Date(2026, 10, 4, 11, 0).getTime());
  assert.equal(lastDue({ kind: "event", event: "post.new" }, now), null);
});

test("an own command's trigger is checked when it's saved", () => {
  const command = (trigger) => `---\ndescription: Repaso semanal\nlabel: es=Repaso semanal\ntrigger: ${trigger}\n---\nPrepara el repaso de la semana.\n`;
  assert.deepEqual(validateCommand("repaso-semanal", command("weekly fri 14:00")), []);
  assert.match(validateCommand("repaso-semanal", command("cada viernes")).join(), /trigger/);
});
