// SANDBOX ONLY. node approve-loop.mjs <port> <tag> [maxMinutes]
// Every approval panel: screenshot (shots/approvals/<tag>-NN.png), log (approvals-<tag>.log), press 1.
// Exits (printing the screen) when the chat has been idle for ~15 s, or on timeout.
import fs from "node:fs";
import path from "node:path";
// Output (screenshots, logs) goes to OUT_DIR; WORKSPACE is the course folder whose sessions/ it watches.
const D = process.env.OUT_DIR ?? process.cwd();
const [port, tag, maxMin = "115"] = process.argv.slice(2);
const base = `http://127.0.0.1:${port}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (p) => { try { return await (await fetch(base + p, { signal: AbortSignal.timeout(20000) })).text(); } catch { return ""; } };
const post = async (p, body) => { try { return await (await fetch(base + p, { method: "POST", body, signal: AbortSignal.timeout(60000) })).text(); } catch { return ""; } };
const PANEL = /^│ (Hace falta confirmación humana|Publicación sin aprobación previa)/m;
const WORKING = /^(·|✢|✳|✶|✻|✽|✱|✺|✷|✸|✹|\*) (?!Trabajó)/m;
fs.mkdirSync(`${D}/shots/approvals`, { recursive: true });
let n = fs.readdirSync(`${D}/shots/approvals`).filter((f) => f.startsWith(`${tag}-`)).length;
const end = Date.now() + Number(maxMin) * 60000;
let idle = 0;
const SESS = path.join(process.env.WORKSPACE ?? ".", "sessions");
const lastActivity = () => { try { const d = fs.readdirSync(SESS).sort().at(-1); return fs.statSync(SESS + "/" + d + "/transcript.jsonl").mtimeMs; } catch { return 0; } };
while (Date.now() < end) {
  const s = await get("/screen");
  if (!s) { await sleep(3000); continue; }
  if (PANEL.test(s)) {
    n++;
    const f = `${D}/shots/approvals/${tag}-${String(n).padStart(2, "0")}.png`;
    await post("/shot", `${f} full`);
    const box = s.split("\n").filter((l) => l.startsWith("│")).map((l) => l.replace(/^│ ?/, "").replace(/\s*│\s*$/, "")).join("\n");
    fs.appendFileSync(`${D}/approvals-${tag}.log`, `=== ${tag} #${n} ${new Date().toTimeString().slice(0, 8)}\n${box}\n`);
    await post("/key", "1");
    for (let i = 0; i < 40 && PANEL.test(await get("/screen")); i++) await sleep(1000);
    idle = 0;
    continue;
  }
  idle = WORKING.test(s) || Date.now() - lastActivity() < 90000 ? 0 : idle + 1;
  if (idle >= 5) { console.log(s.split("\n").slice(-60).join("\n")); break; }
  await sleep(3000);
}
console.log(`approvals so far for ${tag}: ${n}`);
