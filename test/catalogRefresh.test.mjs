// Unit tests of the catalogs' background refresh (#101), on the built code in dist/. Run with
// `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { CATALOG_MAX_AGE_MS, refreshCatalogs } from "../dist/host/catalogRefresh.js";

const now = Date.parse("2026-11-10T12:00:00Z");
const ago = (ms) => new Date(now - ms).toISOString();

test("only copies older than a day are taken again, and one that fails is left for the next check", async () => {
  const asked = [];
  const list = async () => [
    { name: "fresh", updated: ago(60_000) },
    { name: "old", updated: ago(CATALOG_MAX_AGE_MS + 1) },
    { name: "never" },
    { name: "offline", updated: ago(3 * CATALOG_MAX_AGE_MS) },
  ];
  const update = async (_dir, name) => {
    asked.push(name);
    if (name === "offline") throw new Error("getaddrinfo ENOTFOUND github.com");
  };
  assert.deepEqual(await refreshCatalogs("x", { now, list, update }), ["old", "never"]);
  assert.deepEqual(asked, ["old", "never", "offline"]);
});

test("no marketplaces folder, nothing to do", async () => {
  assert.deepEqual(await refreshCatalogs("x", { now, list: async () => { throw new Error("ENOENT"); } }), []);
});
