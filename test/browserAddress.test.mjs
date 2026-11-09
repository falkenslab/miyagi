// Unit tests of which addresses the desktop app's browser opens (#86), on the built code in dist/.
// Run with `npm test`, after `npm run build`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { refusedUrl, webAddress } from "../dist/host/browser.js";

const OWN = "http://127.0.0.1:43210";

test("an http(s) address is a page, as written or with its scheme assumed", () => {
  assert.equal(webAddress("https://moodle.org/es", OWN).url, "https://moodle.org/es");
  assert.equal(webAddress("  campus.example.org/moodle  ", OWN).url, "https://campus.example.org/moodle");
  assert.equal(webAddress("localhost:8080/login", OWN).url, "http://localhost:8080/login");
  assert.equal(webAddress("127.0.0.1:8080", OWN).url, "http://127.0.0.1:8080/");
  assert.equal(webAddress("http://intranet/moodle", OWN).url, "http://intranet/moodle", "a bare name with a scheme is an address");
});

test("the disk and the host's own address are refused, under any of its names", () => {
  for (const url of ["file:///C:/Windows/win.ini", "file:/etc/passwd", "FILE:///x", `${OWN}/?token=abc`, "http://localhost:43210/", "http://[::1]:43210/", "http://127.1:43210/", "http://0x7f.0.0.1:43210/", "http://0.0.0.0:43210/", "http://app.localhost:43210/", "http://[::ffff:127.0.0.1]:43210/"]) {
    assert.equal(webAddress(url, OWN).error, "refused", url);
    assert.ok(refusedUrl(url, OWN), url);
  }
  assert.ok(!refusedUrl("http://localhost:8080/", OWN), "another port of this computer is another site");
  assert.ok(!refusedUrl("https://moodle.org/", OWN));
  assert.ok(!refusedUrl("data:image/png;base64,AAAA", OWN), "what a page embeds isn't refused");
});

test("what isn't an http(s) page isn't an address", () => {
  for (const text of ["", "   ", "hola mundo", "palabra", "javascript:alert(1)", "data:text/html,x", "about:blank", "chrome://settings", "mailto:a@b.c", "https://"]) {
    assert.equal(webAddress(text, OWN).error, "invalid", text);
  }
});
