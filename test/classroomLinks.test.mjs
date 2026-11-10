// Unit tests of "View in the classroom" (#77), on the built code in dist/. Run with `npm test`
// after `npm run build`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { classroomPage, withClassroomPages } from "../dist/host/classroomLinks.js";

const ROOM = "https://moodle.example.org/moodle";
const call = (toolName, meta) => ({ id: "1", toolName, label: toolName, result: { isError: false, text: "" }, meta, children: [] });
const pages = (calls, room = ROOM) => withClassroomPages([{ id: 1, kind: "tools", calls }], room)[0].calls.map((one) => one.page);

test("a moodle call's page on the classroom's origin is offered", () => {
  assert.deepEqual(pages([call("mcp__moodle__create_page", { page: "https://moodle.example.org/mod/page/view.php?id=7" })]), ["https://moodle.example.org/mod/page/view.php?id=7"]);
});

test("a page on another origin, scheme or port is not", () => {
  for (const page of ["https://evil.example.org/mod/page/view.php?id=7", "http://moodle.example.org/x", "https://moodle.example.org:8443/x", "javascript:alert(1)", "not a url", 42]) {
    assert.deepEqual(pages([call("mcp__moodle__create_page", { page })]), [undefined], String(page));
  }
});

test("other tools' meta, and the rest of meta, never reach the page", () => {
  const [moodle, other] = withClassroomPages([{ id: 1, kind: "tools", calls: [call("mcp__moodle__x", { page: `${new URL(ROOM).origin}/a`, secret: 1 }), call("mcp__drafts__x", { page: `${new URL(ROOM).origin}/a` })] }], ROOM)[0].calls;
  assert.equal("meta" in moodle, false);
  assert.equal(moodle.page, "https://moodle.example.org/a");
  assert.equal("meta" in other, false);
  assert.equal(other.page, undefined);
});

test("without a classroom, nothing is offered", () => {
  assert.equal(withClassroomPages([{ id: 1, kind: "tools", calls: [call("mcp__moodle__x", { page: "https://moodle.example.org/a" })] }], undefined)[0].calls[0].page, undefined);
  assert.equal(classroomPage("https://moodle.example.org/a", "https://moodle.example.org"), "https://moodle.example.org/a");
});
