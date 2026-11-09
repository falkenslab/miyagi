// The packaged desktop app for the docs' captures: a data folder of its own (its home too), the
// real Claude sign-in (CLAUDE_CONFIG_DIR, never copied), driven over its debugging port.
// Usage: node app.mjs <app exe> <data dir>
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
const [exe, data] = process.argv.slice(2);
const env = { ...process.env, MIYAGI_DESKTOP_DATA: data, CLAUDE_CONFIG_DIR: process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude") };
delete env.ELECTRON_RUN_AS_NODE;
const app = spawn(exe, ["--remote-debugging-port=9333"], { env, cwd: path.dirname(exe), stdio: "ignore" });
app.on("exit", (code) => { console.log("app exited", code); process.exit(0); });
console.log("started", app.pid);
