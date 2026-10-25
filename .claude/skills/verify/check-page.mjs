// Checks miyagi's page (gui/, gui-chat #47) in Chrome against the real host and a real Claude
// session: a subject created from the page, a conversation, an approval answered and one refused
// (interactive mode asks before every tool), the mode and theme switched, the / menu without
// Claude Code's commands; and screenshots at 360, 768 and 1440 px. Not part of the quick gate: it
// needs a Claude token (the one in ~/.miyagi/config.json, or CLAUDE_CODE_OAUTH_TOKEN) and Chrome,
// and spends a few turns. Run it when gui/ or src/host/ change. Its home is a temporary folder, so
// nothing of yours is touched.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-page.mjs <screenshots dir>
/* global document, window -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const shots = path.resolve(process.argv[2] ?? "page-shots");
if (process.env.CHECK_PAGE_CHILD !== "1") {
  const home = mkdtempSync(path.join(os.tmpdir(), "check-page-"));
  let token = process.env.CLAUDE_CODE_OAUTH_TOKEN;
  try {
    token ??= JSON.parse(readFileSync(path.join(os.homedir(), ".miyagi", "config.json"), "utf8")).claudeCodeOAuthToken;
  } catch {
    // no saved token
  }
  if (!token) {
    console.log("skip page: no Claude token (CLAUDE_CODE_OAUTH_TOKEN or ~/.miyagi/config.json)");
    process.exit(0);
  }
  const env = { ...process.env, CHECK_PAGE_CHILD: "1", REAL_HOME: os.homedir(), HOME: home, USERPROFILE: home, CLAUDE_CODE_OAUTH_TOKEN: token };
  delete env.ELECTRON_RUN_AS_NODE;
  const child = spawnSync(process.execPath, [new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), shots], { env, stdio: "inherit" });
  rmSync(home, { recursive: true, force: true });
  process.exit(child.status ?? 1);
}

setTimeout(() => {
  console.log("FAIL page: took more than 15 minutes");
  process.exit(2);
}, 15 * 60_000).unref();
mkdirSync(shots, { recursive: true });
const { startHost } = await import(pathToFileURL(path.join(process.cwd(), "dist/host/server.js")).href);
const { chromium } = await import(pathToFileURL(path.join(process.cwd(), "node_modules/playwright-core/index.mjs")).href);
const host = await startHost(undefined, { chooseLanguage: true });
// Chrome needs the real profile folder; the page's data stays in the temporary home.
const browser = await chromium.launch({ channel: "chrome", headless: true, env: { ...process.env, HOME: process.env.REAL_HOME, USERPROFILE: process.env.REAL_HOME, CLAUDE_CODE_OAUTH_TOKEN: "" } });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(60_000);
const failures = [];
const check = (what, ok) => ok || failures.push(what);
page.on("pageerror", (error) => failures.push(`page error: ${error.message}`));
const shot = async (name) => {
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(shots, `${name}.png`) });
};
const idle = () => page.waitForFunction(() => !document.querySelector(".composer .send.stop") && !document.querySelector(".banner"), null, { timeout: 300_000 });
/** A line sent from the composer, and miyagi started on it. */
const send = async (line) => {
  const before = await page.locator(".msg.user").count();
  await page.fill(".composer textarea", line);
  await page.keyboard.press("Enter");
  await page.waitForFunction((n) => document.querySelectorAll(".msg.user").length > n || Boolean(document.querySelector(".scrim .dialog")), before, { timeout: 30_000 });
};
const mode = async (name) => {
  await page.click(".top .mode");
  await page.click(`.pop button:has(.sw.${name})`);
  await page.waitForSelector(`.top .mode.${name}`);
};

try {
  await page.goto(host.url);
  // A subject from the start screen, then miyagi's greeting.
  await page.waitForSelector(".new-subject input");
  await page.fill(".new-subject input >> nth=0", "Comprobación de la página");
  await page.click('.new-subject button[type="submit"]');
  await page.waitForSelector(".side .brand");
  await page.click('.nav a:has-text("Conversación"), .nav a:has-text("Conversation")');
  await page.waitForSelector(".msg.agent", { timeout: 240_000 });
  await idle();
  check("greeting", (await page.locator(".msg.agent").count()) >= 1);
  const slash = (await page.fill(".composer textarea", "/"), await page.waitForSelector(".slash"), await page.innerText(".slash"));
  check("the / menu offers miyagi's commands, not Claude Code's", /\/(knowledge|miyagi):|\/extensions/.test(slash) && !/\/(agents|batch|advisor)\b/.test(slash));
  await page.fill(".composer textarea", "");

  // Interactive mode asks before every tool: approve one, refuse the next.
  await mode("interactive");
  await send("Lee la página overview de tu base de conocimiento y dime en una línea qué dice.");
  await page.waitForSelector(".scrim .dialog", { timeout: 180_000 });
  await shot("approval-1440");
  await page.click(".scrim .dialog .acts .btn.primary");
  await page.waitForSelector(".scrim .dialog", { state: "detached", timeout: 20_000 }).catch(() => {});
  for (let i = 0; i < 6; i++) {
    const more = await Promise.race([page.waitForSelector(".scrim .dialog", { timeout: 240_000 }).then(() => true), idle().then(() => false)]);
    if (!more || !(await page.$(".scrim .dialog"))) break;
    await page.click(".scrim .dialog .acts .btn.primary");
    await page.waitForSelector(".scrim .dialog", { state: "detached", timeout: 20_000 }).catch(() => {});
  }
  await idle();
  check("an approved turn ends with a reply", (await page.locator(".msg.agent").count()) >= 2);
  await send("Busca en tu base de conocimiento la palabra rúbrica.");
  await page.waitForSelector(".scrim .dialog", { timeout: 180_000 });
  const before = await page.locator(".tool-calls li.err, .tool .badge.sun").count();
  await page.click(".scrim .dialog .acts .btn:not(.primary):not(.danger)");
  await page.waitForSelector(".scrim .dialog", { state: "detached", timeout: 20_000 }).catch(() => {});
  // Refused, it may try another way: stop it there.
  if (await page.waitForSelector(".scrim .dialog", { timeout: 8000 }).then(() => true, () => false)) await page.click(".scrim .dialog .acts .btn.danger");
  await idle();
  check("a refused tool doesn't break the conversation", !(await page.$(".scrim .dialog")) && (await page.locator(".tool-calls li.err, .tool .badge.sun").count()) >= before);
  await mode("guided");

  // The theme, and the screenshots at the three widths.
  await page.click(".side-foot .menu .ibtn");
  await page.click(".pop button >> nth=2");
  check("dark theme", (await page.getAttribute("html", "data-theme")) === "dark");
  await shot("chat-dark-1440");
  await page.click(".side-foot .menu .ibtn");
  await page.click(".pop button >> nth=0");
  for (const [width, height] of [
    [1440, 900],
    [768, 1000],
    [360, 760],
  ]) {
    await page.setViewportSize({ width, height });
    await shot(`chat-${width}`);
    check(`no horizontal scroll at ${width}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  }
} catch (error) {
  failures.push(String(error.message ?? error).split("\n")[0]);
  await shot("failure").catch(() => {});
}
await browser.close();
await host.close();
if (failures.length) {
  for (const failure of failures) console.log(`FAIL page: ${failure}`);
  process.exit(1);
}
console.log(`ok   page: subject, greeting, / menu, approval approved and refused, modes, theme, 360/768/1440 (screenshots in ${shots})`);
