// Checks the unpacked desktop app electron-builder leaves in desktop/dist/, on the system that built
// it (Windows: win-unpacked/, macOS: mac-arm64/ or mac/, Linux: linux-unpacked/), the same on the
// maintainer's computer and in the release workflow:
// `node check-desktop.mjs <unpacked folder> <version> [screenshot.png]`.
// The Claude SDK's binary of this platform outside the asar, miyagi's plugin and prompts, the
// locales, what afterPack removes, and the app started with a throwaway data folder (its home too, so
// the real ~/.miyagi is out of reach) until its rail shows the version.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const [dirArg, version, shotArg] = process.argv.slice(2);
if (!dirArg || !version) {
  console.error("usage: node check-desktop.mjs <unpacked folder> <version> [screenshot.png]");
  process.exit(2);
}
const dir = path.resolve(dirArg);
const failures = [];
const check = (ok, what) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures.push(what);
};

// Where each system's build keeps the app's resources and its executable.
const platform = process.platform;
const app = platform === "darwin" ? path.join(dir, "miyagi.app") : dir;
const resources = platform === "darwin" ? path.join(app, "Contents", "Resources") : path.join(dir, "resources");
const exe = platform === "darwin" ? path.join(app, "Contents", "MacOS", "miyagi") : path.join(dir, platform === "win32" ? "miyagi.exe" : "miyagi");
console.log(`     ${platform}-${process.arch}: ${path.relative(process.cwd(), app) || app}`);

const unpacked = path.join(resources, "app.asar.unpacked");
// The SDK installs only the binary of the platform npm ran on: the one this app was built on.
// Another process runs it, so it can't live inside the asar.
const claude = path.join(unpacked, "node_modules", "@anthropic-ai", `claude-agent-sdk-${platform}-${process.arch}`, platform === "win32" ? "claude.exe" : "claude");
check(existsSync(claude), `the Claude SDK's binary for ${platform}-${process.arch} outside the asar`);
check(existsSync(path.join(unpacked, "miyagi", "plugin")), "miyagi/plugin/ outside the asar");
check(existsSync(path.join(unpacked, "miyagi", "prompts")), "miyagi/prompts/ outside the asar");

const expected = ["de", "en-US", "es", "es-419", "fr"];
if (platform === "darwin") {
  console.log("     locales: in the bundle's .lproj folders, not checked");
} else {
  const folder = path.join(dir, "locales");
  const locales = existsSync(folder) ? readdirSync(folder).map((file) => file.replace(/\.pak$/, "")).sort() : [];
  check(JSON.stringify(locales) === JSON.stringify(expected), `only the locales ${expected.join(", ")} (got ${locales.join(", ") || "none"})`);
  // afterPack.cjs: Chromium's licenses compressed (and, on Windows, WebGPU's DLLs gone).
  check(existsSync(path.join(dir, "LICENSES.chromium.html.gz")) && !existsSync(path.join(dir, "LICENSES.chromium.html")), "LICENSES.chromium.html.gz instead of the HTML");
}
if (platform === "win32") check(!existsSync(path.join(dir, "dxcompiler.dll")) && !existsSync(path.join(dir, "dxil.dll")), "no dxcompiler.dll nor dxil.dll");

check(existsSync(exe), `the app's executable (${path.basename(exe)})`);
if (existsSync(exe)) {
  const data = mkdtempSync(path.join(os.tmpdir(), "miyagi-desktop-"));
  try {
    const steps = path.join(data, "steps.json");
    const shot = shotArg ? path.resolve(shotArg) : path.join(data, "start.png");
    writeFileSync(steps, JSON.stringify({ steps: [{ until: "!!document.querySelector('.rail .brand')", timeout: 90000 }, { wait: 1500 }, { shot }, { js: "document.querySelector('.rail').innerText" }] }));
    // VS Code's terminal sets it, and with it Electron runs as Node: the window never opens.
    const env = { ...process.env, MIYAGI_DESKTOP_DATA: path.join(data, "home"), MIYAGI_DESKTOP_SCRIPT: steps };
    delete env.ELECTRON_RUN_AS_NODE;
    // An unpacked Linux build has no SUID chrome-sandbox (the .deb sets it up when installed): for this check only.
    const args = platform === "linux" ? ["--no-sandbox"] : [];
    const started = spawnSync(exe, args, { env, encoding: "utf8", timeout: 180000 });
    const out = `${started.stdout ?? ""}${started.stderr ?? ""}`;
    check(/until met/.test(out), "the app starts and shows its page");
    const rail = /^js: (.*)$/m.exec(out)?.[1];
    const text = rail ? JSON.parse(rail) : "";
    check(text.split("\n").some((line) => line.trim() === version), `its rail shows ${version}`);
    if (/^shot /m.test(out)) console.log(`     screenshot: ${shot}`);
    else console.log("     no screenshot (not a failure)");
    if (failures.length) console.log(out.trim().split("\n").slice(-15).join("\n"));
  } finally {
    // The screenshot stays where it was asked for; the rest goes.
    rmSync(data, { recursive: true, force: true });
  }
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\ndesktop ok");
