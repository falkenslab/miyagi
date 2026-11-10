// Unit tests of the page's settings in the global config, on the built code in dist/. Run with
// `npm test` after `npm run build`. Its home is a temporary folder.
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const home = mkdtempSync(path.join(os.tmpdir(), "miyagi-page-settings-"));
process.env.HOME = home;
process.env.USERPROFILE = home;
const { readPageSettings, savePageSettings } = await import("../dist/globalConfig.js");

test("two settings saved at once both stay (the tour skipped while the first tip moves on)", async () => {
  try {
    await Promise.all([savePageSettings({ tourSeen: 1 }), savePageSettings({ tipsNext: 2 }), savePageSettings({ showTips: true })]);
    assert.deepEqual(await readPageSettings(), { tourSeen: 1, showTips: true, tipsNext: 2 });
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});
