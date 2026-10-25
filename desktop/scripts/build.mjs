// Prepares the desktop app (`npm run build`): miyagi compiled (its page included), copied into
// miyagi/ with everything it reads next to it (its plugin, its prompts, its package.json), and its
// dependencies installed here at the exact versions miyagi pins, agent-kit's from npm. Run it again
// after changing miyagi.
import { execSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const desktop = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(desktop, "..");
// One command line through the shell (npm is a .cmd file on Windows).
const run = (command, cwd) => execSync(command, { cwd, stdio: "inherit" });

// miyagi, built: TypeScript into dist/ and the page (gui/) into dist/gui/.
run("npm run build", root);

// The app's version and dependencies are miyagi's: written here, so the installer can't say
// another version nor ship another kit.
const miyagi = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const manifestFile = path.join(desktop, "package.json");
const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
manifest.version = miyagi.version;
manifest.dependencies = miyagi.dependencies;
writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`version ${miyagi.version}, agent-kit ${miyagi.dependencies["@falkenslab/agent-kit"]}`);
run("npm install --no-audit --no-fund", desktop);

// What miyagi reads, next to its code.
const out = path.join(desktop, "miyagi");
rmSync(out, { recursive: true, force: true });
for (const item of ["package.json", "dist", "plugin", "prompts"]) {
  const from = path.join(root, item);
  if (!existsSync(from)) throw new Error(`missing ${from}`);
  cpSync(from, path.join(out, item), { recursive: true });
}
if (!existsSync(path.join(out, "dist", "gui", "index.html"))) throw new Error("the page wasn't built (dist/gui/index.html)");
console.log(`miyagi: copied into ${path.relative(desktop, out)}/`);
