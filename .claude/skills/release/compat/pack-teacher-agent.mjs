// Builds teacher-agent.tgz: a bridge package still called teacher-agent, so the install command
// from before the rename (…/releases/latest/download/teacher-agent.tgz) replaces the old
// package cleanly and its teacher-agent command runs this release of miyagi.
// Usage: node .claude/skills/release/compat/pack-teacher-agent.mjs <version> <miyagi.tgz spec> <out dir>
//   <miyagi.tgz spec>: the release's miyagi.tgz URL, or file:<absolute path> to test locally.
import { execSync } from "node:child_process";
import { copyFileSync, mkdtempSync, renameSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [version, miyagi, outDir] = process.argv.slice(2);
if (!version || !miyagi || !outDir) throw new Error("usage: pack-teacher-agent.mjs <version> <miyagi.tgz spec> <out dir>");
const here = path.dirname(fileURLToPath(import.meta.url));
const dir = mkdtempSync(path.join(os.tmpdir(), "teacher-agent-bridge-"));
copyFileSync(path.join(here, "cli.js"), path.join(dir, "cli.js"));
writeFileSync(path.join(dir, "package.json"), JSON.stringify({
  name: "teacher-agent",
  version,
  description: "teacher-agent is now miyagi: this package installs miyagi and keeps the teacher-agent command working.",
  type: "module",
  bin: { "teacher-agent": "./cli.js" },
  files: ["cli.js"],
  dependencies: { miyagi: miyagi },
  engines: { node: ">=20" },
  license: "MIT",
}, null, 2));
execSync(`npm pack --pack-destination "${outDir}"`, { cwd: dir, stdio: "ignore" });
renameSync(path.join(outDir, `teacher-agent-${version}.tgz`), path.join(outDir, "teacher-agent.tgz"));
console.log(path.join(outDir, "teacher-agent.tgz"));
