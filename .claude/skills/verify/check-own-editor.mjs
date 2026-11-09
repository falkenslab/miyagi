// The own commands' editor (#78) in Chrome against the real host and a real session, in a temporary
// home: a refused save, trying it, saving it, the catalog changed in the same conversation at
// 1440 and 360 px, and a word list filled from a topic's concepts. Not part of the quick gate: it
// needs you signed in to Claude Code and Chrome, and spends the greeting's turn.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-own-editor.mjs <screenshots dir>
/* global document, innerWidth -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const shots = path.resolve(process.argv[2]);
if (process.env.OWN_CHILD !== "1") {
  const home = mkdtempSync(path.join(os.tmpdir(), "own-editor-"));
  const env = { ...process.env, OWN_CHILD: "1", REAL_HOME: os.homedir(), HOME: home, USERPROFILE: home, CLAUDE_CONFIG_DIR: process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude") };
  delete env.ELECTRON_RUN_AS_NODE;
  // A fresh home would open the guided tour (#81) over the subject: this check is about something else.
  mkdirSync(path.join(home, ".miyagi"), { recursive: true });
  writeFileSync(path.join(home, ".miyagi", "config.json"), JSON.stringify({ tourSeen: 999 }));
  const child = spawnSync(process.execPath, [fileURLToPath(import.meta.url), shots], { env, stdio: "inherit" });
  rmSync(home, { recursive: true, force: true });
  process.exit(child.status ?? 1);
}
setTimeout(() => (console.log("FAIL timeout"), process.exit(2)), 280_000).unref();
mkdirSync(shots, { recursive: true });
const { startHost } = await import(pathToFileURL(path.join(process.cwd(), "dist/host/server.js")).href);
const { chromium } = await import(pathToFileURL(path.join(process.cwd(), "node_modules/playwright-core/index.mjs")).href);
const host = await startHost(undefined, { chooseLanguage: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, env: { ...process.env, HOME: process.env.REAL_HOME, USERPROFILE: process.env.REAL_HOME } });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.setDefaultTimeout(40_000);
const failures = [];
const check = (what, ok, detail = "") => (console.log(`${ok ? "ok  " : "FAIL"} ${what}${detail ? ` | ${detail}` : ""}`), ok || failures.push(what));
page.on("pageerror", (error) => check(`page error: ${error.message}`, false));
const shot = async (name) => (await page.waitForTimeout(500), page.screenshot({ path: path.join(shots, `${name}.png`) }));
const idle = () => page.waitForFunction(() => !document.querySelector(".status-bar.on"), null, { timeout: 180_000 });
const nav = (place) => page.click(`.rail-item[data-rail="${place}"]`);
try {
  await page.goto(host.url);
  await page.waitForSelector(".new-subject input");
  await page.fill(".new-subject input >> nth=0", "Programación");
  await page.click('.new-subject button[type="submit"]');
  await page.waitForSelector(".recents a");
  await page.waitForTimeout(1500);
  await idle();
  const base = new URL(host.url);
  const api = async (action, data = {}) => (await fetch(`${base.origin}/api/${action}${base.search}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) })).json();
  const dir = ((await api("workspaces")).workspaces ?? [])[0].dir;
  const write = (file, text) => (mkdirSync(path.dirname(path.join(dir, file)), { recursive: true }), writeFileSync(path.join(dir, file), text));
  write(".claude/commands/sopa.md", "---\ndescription: Una sopa de letras\nlabel: es=Sopa | en=Word search\nicon: 🔤\ngroup: create\napplies-to: topic\nproduces: html-activity\nparameters:\n  - name: topic\n    label: es=Tema\n    type: topic\n    required: true\n  - name: count\n    label: es=Número\n    type: number\n    default: 10\n    min: 4\n    max: 20\n  - name: words\n    label: es=Palabras\n    type: words\n---\n\nHazla: $ARGUMENTS\n");
  write("knowledge/topics/variables.md", "---\ntitle: Variables\nupdated: 2026-11-01\n---\n\nEl tema. Usa [Entero](../concepts/entero.md).\n");
  write("knowledge/concepts/entero.md", "---\ntitle: Entero\nupdated: 2026-11-01\n---\n\nUn número.\n");
  write("knowledge/concepts/cadena.md", "---\ntitle: Cadena\nupdated: 2026-11-01\n---\n\nTexto, en [Variables](../topics/variables.md).\n");
  write("knowledge/concepts/ajeno.md", "---\ntitle: Ajeno\nupdated: 2026-11-01\n---\n\nSin relación.\n");
  const greeting = (await page.innerText(".main")).includes("Hola");

  // The editor: list, invalid, try, save.
  await nav("extensions");
  await page.click('.tabs button:has-text("Mis comandos")');
  await page.waitForSelector(".own-row");
  await shot("list");
  check("listed", (await page.innerText(".own-row")).includes("Sopa"));
  await page.click(".own-row .btn");
  await page.waitForSelector(".own-form");
  await shot("editor-1440");
  check("save disabled with no changes", await page.locator('.own-form .btn.primary').isDisabled());
  const instructions = page.locator(".own-instructions");
  await instructions.fill("Sin valores");
  await page.click(".own-form .btn.primary");
  await page.click(".own-form .warnbox .btn.primary");
  await page.waitForSelector(".own-form .dangerbox");
  check("no $ARGUMENTS can't be saved", (await page.innerText(".own-form .dangerbox")).includes("$ARGUMENTS"));
  await shot("refused");
  await instructions.fill("Hazla ya: $ARGUMENTS");
  await page.locator(".own-grid input").first().fill("Sopa de repaso");
  await page.locator('.own-param input[value="10"]').fill("12");
  await page.click('.own-form .acts .btn:has-text("Probar")');
  await page.waitForSelector(".param-form");
  check("try shows the form with the new default", (await page.inputValue('.param-form input[type="number"]')) === "12");
  check("try can't send unsaved", await page.locator(".param-form .btn.primary").isDisabled());
  await shot("try");
  await page.click('.param-form .btn:not(.primary)');
  await page.waitForSelector(".own-form");
  check("back from try keeps the changes", (await page.locator(".own-grid input").first().inputValue()) === "Sopa de repaso");
  await page.setViewportSize({ width: 360, height: 800 });
  await shot("editor-360");
  const scroll = await page.evaluate(() => { const d = document.querySelector(".dialog"); return { page: document.documentElement.scrollWidth > innerWidth, dialog: d.scrollWidth > d.clientWidth }; });
  check("no horizontal scroll at 360", !scroll.page && !scroll.dialog, JSON.stringify(scroll));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click(".own-form .btn.primary");
  await page.click(".own-form .warnbox .btn.primary");
  await page.waitForFunction(() => !document.querySelector(".own-form"), null, { timeout: 90_000 });
  const file = readFileSync(path.join(dir, ".claude/commands/sopa.md"), "utf8");
  check("file changed, unseen key kept", file.includes("Sopa de repaso") && file.includes("default: 12") && file.includes("produces: html-activity"), file.slice(0, 200).replace(/\n/g, " / "));

  // The same conversation, the catalog changed; a form on a topic with its concepts.
  await page.waitForTimeout(1500);
  await idle();
  await nav("course");
  await page.click(".view-tabs >> text=Temas y actividades");
  await page.waitForSelector(".actionable .more-btn");
  await page.click(".actionable .more-btn");
  await page.waitForSelector('.item-pop [data-command="sopa"]');
  const row = await page.innerText('.item-pop [data-command="sopa"]');
  check("the catalog has the new label, same conversation", row.includes("Sopa de repaso"), row);
  await page.click('.item-pop [data-command="sopa"]');
  await page.waitForSelector(".param-form textarea");
  await page.waitForFunction(() => document.querySelector(".param-form textarea").value !== "", null, { timeout: 10_000 });
  const words = await page.inputValue(".param-form textarea");
  check("words from the topic's concepts, both directions, not the others", words.includes("Entero") && words.includes("Cadena") && !words.includes("Ajeno"), words);
  await shot("words");
  await page.click('.param-form .btn:not(.primary)');
  await page.mouse.click(5, 5);
  await page.waitForTimeout(400);
  await page.click(".recents a");
  await page.waitForSelector(".msg");
  await page.waitForTimeout(800);
  const text = await page.innerText(".main");
  check("the conversation is the same", greeting && text.includes("Hola") && (await page.locator(".recents a").count()) === 1, String(await page.locator(".recents a").count()));
} catch (error) {
  check(`script: ${String(error.message).split("\n")[0]}`, false);
  await page.screenshot({ path: path.join(shots, "failure.png") }).catch(() => {});
}
await browser.close();
await host.close();
console.log(failures.length ? `FAILED ${failures.length}` : "all ok");
process.exit(failures.length ? 1 : 0);
