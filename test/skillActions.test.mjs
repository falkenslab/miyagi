// Unit tests of an extension's skills as actions of the page (#110), on the built code in dist/:
// a skill with a `label` is an action, sent as the command the SDK lists it as; one without stays
// out. The extension is linked into a throwaway home. Run with `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = mkdtempSync(path.join(os.tmpdir(), "miyagi-skill-actions-"));
const home = path.join(root, "home");
const workspace = path.join(root, "subject");
const ext = path.join(root, "demo-lms");
for (const dir of [home, workspace, path.join(ext, ".claude-plugin"), path.join(ext, "skills", "week"), path.join(ext, "skills", "notes")]) mkdirSync(dir, { recursive: true });
writeFileSync(path.join(ext, ".claude-plugin", "plugin.json"), JSON.stringify({ name: "demo-lms", version: "0.0.1", description: "A test extension" }));
writeFileSync(path.join(ext, "skills", "week", "SKILL.md"), "---\nname: week\ndescription: What this week holds.\nlabel: es=Esta semana | en=This week\nicon: 📅\ngroup: day\nneeds-classroom: true\n---\n\nList it.\n");
writeFileSync(path.join(ext, "skills", "notes", "SKILL.md"), "---\nname: notes\ndescription: How to write notes.\n---\n\nWrite them.\n");

const env = { ...process.env, HOME: home, USERPROFILE: home, APPDATA: path.join(home, "AppData", "Roaming"), LOCALAPPDATA: path.join(home, "AppData", "Local") };
Object.assign(process.env, env);
const cli = fileURLToPath(new URL("../dist/cli.js", import.meta.url));
const added = spawnSync(process.execPath, [cli, "extension", "add", ext, "--link", "--dir", workspace], { env, encoding: "utf8", input: "" });

test("a labelled skill of an extension is an action, as /<extension>:<skill>; one without isn't", async () => {
  assert.equal(added.status, 0, added.stderr || added.stdout);
  const { extensionSkillActions } = await import("../dist/catalog.js");
  const { pageActions } = await import("../dist/host/server.js");
  const actions = pageActions(await extensionSkillActions(workspace));
  assert.deepEqual(actions.map((action) => action.command), ["demo-lms:week"]);
  const [week] = actions;
  assert.equal(week.label.es, "Esta semana");
  assert.equal(week.group, "day");
  assert.equal(week.needsClassroom, true);
  assert.equal(week.extension, "demo-lms");
});
