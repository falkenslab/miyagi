// Checks the npm package a release carries, the same on the maintainer's computer and in the
// release workflow: `node check-package.mjs <miyagi.tgz> <version>`. No node_modules inside, a
// sane size, and installed into a throwaway prefix (never the global npm) it prints the version
// and its help without running anything.
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const [tgzArg, version] = process.argv.slice(2);
if (!tgzArg || !version) {
  console.error("usage: node check-package.mjs <miyagi.tgz> <version>");
  process.exit(2);
}
const tgz = path.resolve(tgzArg);
const failures = [];
const check = (ok, what) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures.push(what);
};
// npm and the installed command are .cmd files on Windows: through the shell, one line each.
const run = (command, cwd) => spawnSync(command, { cwd, shell: true, encoding: "utf8", input: "", timeout: 900000 });
const why = (result) => result.error?.message ?? (result.signal ? `stopped by ${result.signal}` : result.stderr.trim().split("\n").at(-1));

const size = statSync(tgz).size;
// The page's assets make it hundreds of kB; tens of MB would mean dependencies got bundled.
check(size < 5 * 1024 * 1024, `size ${(size / 1024).toFixed(0)} kB, under 5 MB`);

// From its folder: Git Bash's tar takes "C:" in a path for a remote host.
const listing = run(`tar -tzf "${path.basename(tgz)}"`, path.dirname(tgz));
check(listing.status === 0, "the archive lists");
check(!/(^|\/)node_modules\//m.test(listing.stdout), "no node_modules/ inside");

const prefix = mkdtempSync(path.join(os.tmpdir(), "miyagi-pkg-"));
try {
  const install = run(`npm install -g --no-audit --no-fund --prefix "${prefix}" "${tgz}"`);
  check(install.status === 0, `installs into a throwaway prefix${install.status === 0 ? "" : `: ${why(install)}`}`);
  const bin = process.platform === "win32" ? path.join(prefix, "miyagi.cmd") : path.join(prefix, "bin", "miyagi");
  const printed = run(`"${bin}" --version`, prefix);
  check(printed.stdout.trim() === version, `miyagi --version prints ${version} (got "${printed.stdout.trim()}")`);
  const help = run(`"${bin}" web --help --language es`, prefix);
  check(help.status === 0 && /miyagi \[<comando>\]/.test(help.stdout), "miyagi web --help shows the help and runs nothing");
} finally {
  rmSync(prefix, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\npackage ok");
