// Drives a terminal program in a pseudo-terminal and screenshots it.
//   node driver.mjs <port> <cols> <rows> <cwd> <command> [args...]   (needs node-pty, @xterm/headless, @xterm/addon-serialize)
// HTTP API (localhost):
//   GET  /screen            -> plain text of the visible screen
//   POST /type   body=text  -> types the text (no Enter)
//   POST /key    body=name  -> enter|esc|up|down|tab|shifttab|ctrlc|backspace|space|1|2|3|y|n
//   POST /secret body=ENV   -> types the value of env var ENV (never echoed back)
//   POST /shot   body="path [full]" -> renders the screen to a PNG (trailing blank rows cropped unless "full")
//   POST /resize body=CxR
//   GET  /alive
/* global document -- used inside page.evaluate(), in the browser */
import http from "node:http";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const pty = require("node-pty");
const { Terminal } = require("@xterm/headless");
const { SerializeAddon } = require("@xterm/addon-serialize");
// playwright-core comes with miyagi's @playwright/mcp: run from the miyagi repo root, or set MIYAGI_DIR.
const pwRequire = createRequire(path.join(process.env.MIYAGI_DIR ?? process.cwd(), "package.json"));
const { chromium } = pwRequire("playwright-core");

const argv = process.argv.slice(2);
const [port, cols, rows, cwd] = argv;
const cmd = argv.slice(4);
let C = Number(cols), R = Number(rows);
const term = new Terminal({ cols: C, rows: R, allowProposedApi: true, scrollback: 0 });
const ser = new SerializeAddon();
term.loadAddon(ser);
const p = pty.spawn(cmd[0], cmd.slice(1), { name: "xterm-256color", cols: C, rows: R, cwd, env: { ...process.env, FORCE_COLOR: "3", COLORTERM: "truecolor" } });
let exited = null;
p.onData((d) => term.write(d));
p.onExit((e) => { exited = e; });

const KEYS = { enter: "\r", esc: "\x1b", up: "\x1b[A", down: "\x1b[B", right: "\x1b[C", left: "\x1b[D", tab: "\t", shifttab: "\x1b[Z", ctrlc: "\x03", backspace: "\x7f", space: " ", ctrlo: "\x0f", ctrlj: "\n", pgup: "\x1b[5~", pgdn: "\x1b[6~" };

function screenText() {
  const b = term.buffer.active;
  const lines = [];
  for (let i = 0; i < R; i++) lines.push(b.getLine(b.viewportY + i)?.translateToString(true) ?? "");
  return lines.join("\n");
}

let browser;
async function shot(file, full) {
  browser ??= await chromium.launch({ channel: "chrome", headless: true });
  const html = ser.serializeAsHTML({ onlySelection: false, includeGlobalBackground: true });
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  const body = html.replace(/<html>|<\/html>|<body>|<\/body>/g, "");
  await page.setContent(`<!doctype html><html><head><style>
    html,body{margin:0;background:#0c0c0c}
    #wrap{display:inline-block;padding:14px 16px;background:#0c0c0c}
    #wrap pre, #wrap div{font-family:'Cascadia Mono','Cascadia Code',Consolas,monospace !important;font-size:14px !important;line-height:1.3 !important}
    #wrap pre{margin:0}
  </style></head><body><div id="wrap">${body}</div></body></html>`);
  // Normalise default colours (serializer leaves default fg/bg unset)
  await page.addStyleTag({ content: "#wrap pre, #wrap pre > div { color:#cccccc; background:#0c0c0c !important; }" });
  const b = term.buffer.active; let keep = R;
  while (keep > 1 && !(b.getLine(b.viewportY + keep - 1)?.translateToString(true) ?? '').trim()) keep--;
  if (!full) await page.evaluate((k) => { const rows = document.querySelectorAll('#wrap pre > div > div'); rows.forEach((r, i) => { if (i >= k) r.remove(); }); }, keep + 1);
  const el = await page.$("#wrap");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await el.screenshot({ path: file });
  await page.close();
}

const server = http.createServer(async (req, res) => {
  let body = "";
  for await (const c of req) body += c;
  const u = new URL(req.url, "http://x");
  try {
    if (u.pathname === "/alive") return res.end(exited ? `exited ${JSON.stringify(exited)}` : "running");
    if (u.pathname === "/screen") return res.end(screenText() + (exited ? `\n[exited ${exited.exitCode}]` : ""));
    if (u.pathname === "/type") { for (const ch of body) { p.write(ch); await new Promise((r) => setTimeout(r, 8)); } return res.end("ok"); }
    if (u.pathname === "/paste") { p.write(body); return res.end("ok"); }
    if (u.pathname === "/key") { for (const k of body.trim().split(/\s+/)) { p.write(KEYS[k] ?? k); await new Promise((r) => setTimeout(r, 120)); } return res.end("ok"); }
    if (u.pathname === "/secret") { const v = process.env[body.trim()]; if (!v) throw new Error("no such env"); p.write(v); return res.end("ok"); }
    if (u.pathname === "/shot") { await shot(body.trim().replace(/ full$/,''), / full$/.test(body.trim())); return res.end("ok"); }
    if (u.pathname === "/resize") { const [c, r] = body.split("x").map(Number); C = c; R = r; p.resize(c, r); term.resize(c, r); return res.end("ok"); }
    if (u.pathname === "/quit") { res.end("bye"); p.kill(); await browser?.close(); process.exit(0); }
    res.statusCode = 404; res.end("?");
  } catch (e) { res.statusCode = 500; res.end(String(e)); }
});
server.listen(Number(port), "127.0.0.1", () => console.log(`driver on ${port}: ${cmd.join(" ")}`));
