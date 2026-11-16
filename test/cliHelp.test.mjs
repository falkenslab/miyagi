// Unit tests of the CLI's help, on the built code in dist/: -h or --help after any subcommand shows
// the help and runs nothing (`miyagi web --help` used to start the server). The home is a throwaway
// folder, so nothing touches the real ~/.miyagi. Run with `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const home = mkdtempSync(path.join(os.tmpdir(), "miyagi-help-"));
const workspace = path.join(home, "subject");
mkdirSync(workspace);
const env = { ...process.env, HOME: home, USERPROFILE: home, APPDATA: path.join(home, "AppData", "Roaming"), LOCALAPPDATA: path.join(home, "AppData", "Local"), MIYAGI_LANGUAGE: "", CLAUDE_CODE_OAUTH_TOKEN: "" };
const cli = fileURLToPath(new URL("../dist/cli.js", import.meta.url));
const miyagi = (...args) => spawnSync(process.execPath, [cli, ...args, "--language", "es"], { env, encoding: "utf8", input: "", timeout: 20000 });

test("--help shows the help and runs nothing, after any subcommand", () => {
  const help = miyagi("--help").stdout;
  assert.match(help, /miyagi \[<comando>\]/);
  for (const args of [["web", "--help"], ["web", "--port", "4999", "-h"], ["chat", "--help", "--dir", workspace], ["run", "--mode", "guided", "--help"], ["skills", "--help", "--dir", workspace], ["--mode", "guided", "--help"]]) {
    const result = miyagi(...args);
    assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
    assert.equal(result.stdout, help, `${args.join(" ")} prints the help, and only that`);
  }
});
