// Checks the unpacked desktop app electron-builder leaves in desktop/dist/win-unpacked/, the same
// on the maintainer's computer and in the release workflow:
// `node check-desktop.mjs <win-unpacked> <version> [screenshot.png]`.
// What must be outside the asar, the locales, what afterPack removes, and the app started with a
// throwaway data folder (its home too, so the real ~/.miyagi is out of reach) until its rail shows
// the version.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const [dirArg, version, shotArg] = process.argv.slice(2);
if (!dirArg || !version) {
  console.error("usage: node check-desktop.mjs <win-unpacked> <version> [screenshot.png]");
  process.exit(2);
}
const dir = path.resolve(dirArg);
const failures = [];
const check = (ok, what) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures.push(what);
};

const unpacked = path.join(dir, "resources", "app.asar.unpacked");
// Another process runs it: it can't live inside the asar.
check(existsSync(path.join(unpacked, "node_modules", "@anthropic-ai", "claude-agent-sdk-win32-x64", "claude.exe")), "claude.exe outside the asar");
check(existsSync(path.join(unpacked, "miyagi", "plugin")), "miyagi/plugin/ outside the asar");
check(existsSync(path.join(unpacked, "miyagi", "prompts")), "miyagi/prompts/ outside the asar");

const locales = existsSync(path.join(dir, "locales")) ? readdirSync(path.join(dir, "locales")).map((file) => file.replace(/\.pak$/, "")).sort() : [];
const expected = ["de", "en-US", "es", "es-419", "fr"];
check(JSON.stringify(locales) === JSON.stringify(expected), `only the locales ${expected.join(", ")} (got ${locales.join(", ") || "none"})`);

// afterPack.cjs: WebGPU's DLLs gone and Chromium's licenses compressed.
check(!existsSync(path.join(dir, "dxcompiler.dll")) && !existsSync(path.join(dir, "dxil.dll")), "no dxcompiler.dll nor dxil.dll");
check(existsSync(path.join(dir, "LICENSES.chromium.html.gz")) && !existsSync(path.join(dir, "LICENSES.chromium.html")), "LICENSES.chromium.html.gz instead of the HTML");

const exe = path.join(dir, "miyagi.exe");
check(existsSync(exe), "miyagi.exe");
if (existsSync(exe)) {
  const data = mkdtempSync(path.join(os.tmpdir(), "miyagi-desktop-"));
  try {
    const steps = path.join(data, "steps.json");
    const shot = shotArg ? path.resolve(shotArg) : path.join(data, "start.png");
    writeFileSync(steps, JSON.stringify({ steps: [{ until: "!!document.querySelector('.rail .brand')", timeout: 90000 }, { wait: 1500 }, { shot }, { js: "document.querySelector('.rail').innerText" }] }));
    // VS Code's terminal sets it, and with it Electron runs as Node: the window never opens.
    const env = { ...process.env, MIYAGI_DESKTOP_DATA: path.join(data, "home"), MIYAGI_DESKTOP_SCRIPT: steps };
    delete env.ELECTRON_RUN_AS_NODE;
    const started = spawnSync(exe, [], { env, encoding: "utf8", timeout: 180000 });
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
