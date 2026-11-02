// Checks miyagi's page (gui/, gui-chat #47, organised as the Claude app #60) in Chrome against the
// real host and a real Claude session: a subject created from the page, a conversation with its
// suggestion rows, an approval answered in the dock (the conversation still readable) and one
// refused (interactive mode asks before every tool), Copy, the ↓ button, the ＋ and mode sheets, the
// mode and theme switched, the / menu without Claude Code's commands; and screenshots at 360, 390,
// 768, 1024 and 1440 px in both themes, with no horizontal scroll and 44 px targets. Not part of the quick gate: it
// needs you signed in to Claude Code (or ANTHROPIC_API_KEY / CLAUDE_CODE_OAUTH_TOKEN in your own
// environment) and Chrome, and spends a few turns. Run it when gui/ or src/host/ change. Its home
// is a temporary folder, so nothing of yours is touched; Claude Code's session is read where it
// keeps it (CLAUDE_CONFIG_DIR at your ~/.claude), never copied (ADR-026).
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-page.mjs <screenshots dir>
/* global document, window, getComputedStyle, MutationObserver -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const shots = path.resolve(process.argv[2] ?? "page-shots");
if (process.env.CHECK_PAGE_CHILD !== "1") {
  const home = mkdtempSync(path.join(os.tmpdir(), "check-page-"));
  const claudeConfig = process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude");
  const { claudeSignedIn } = await import(pathToFileURL(path.join(process.cwd(), "node_modules/@falkenslab/agent-kit/dist/index.js")).href);
  process.env.CLAUDE_CONFIG_DIR = claudeConfig;
  if (!(await claudeSignedIn())) {
    console.log("skip page: not signed in to Claude Code (claude auth login) and no API key in the environment");
    process.exit(0);
  }
  const env = { ...process.env, CHECK_PAGE_CHILD: "1", REAL_HOME: os.homedir(), HOME: home, USERPROFILE: home, CLAUDE_CONFIG_DIR: claudeConfig };
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
const browser = await chromium.launch({ channel: "chrome", headless: true, env: { ...process.env, HOME: process.env.REAL_HOME, USERPROFILE: process.env.REAL_HOME } });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
page.setDefaultTimeout(60_000);
const failures = [];
const check = (what, ok, detail = "") => ok || failures.push(detail ? `${what} (${detail})` : what);
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
  await page.waitForFunction((n) => document.querySelectorAll(".msg.user").length > n || Boolean(document.querySelector(".dock .checkpoint")), before, { timeout: 30_000 });
};
const mode = async (name) => {
  await page.click(".composer .mode");
  await page.click(`.pop button:has(.sw.${name})`);
  await page.waitForSelector(`.composer .mode.${name}`);
};
const CHECKPOINT = ".dock .checkpoint";
/** The header's and the composer's buttons smaller than a finger (44 px), by their label. */
const small = () =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll(".top button, .composer .tools-row button"))
      .filter((el) => el.offsetParent)
      .map((el) => [el.getAttribute("aria-label") || el.textContent.trim(), el.getBoundingClientRect()])
      .filter(([, box]) => box.width < 44 || box.height < 44)
      .map(([label, box]) => `${label} ${Math.round(box.width)}x${Math.round(box.height)}`),
  );

try {
  await page.goto(host.url);
  // A subject from the start screen, then miyagi's greeting.
  await page.waitForSelector(".new-subject input");
  await page.fill(".new-subject input >> nth=0", "Comprobación de la página");
  // Every wait from "Crear" to the greeting says what it waits for (#59): the sentences seen, in order.
  await page.evaluate(() => {
    window.__waits = [];
    const seen = () => document.querySelectorAll(".waiting").forEach((el) => {
      const text = el.textContent.trim();
      if (text && window.__waits.at(-1) !== text) window.__waits.push(text);
    });
    new MutationObserver(seen).observe(document.body, { childList: true, subtree: true, characterData: true });
  });
  await page.click('.new-subject button[type="submit"]');
  await page.waitForSelector(".side .brand");
  // The current conversation, from the recent ones.
  await page.click(".recents a.on-conv");
  if (await page.waitForSelector(".welcome .waiting", { timeout: 20_000 }).catch(() => null)) await page.screenshot({ path: path.join(shots, "starting-1440.png") });
  await page.waitForSelector(".msg.agent", { timeout: 240_000 });
  await idle();
  check("greeting", (await page.locator(".msg.agent").count()) >= 1);
  const waits = await page.evaluate(() => window.__waits);
  check("the wait until the greeting says what it waits for", waits.some((text) => /Arrancando miyagi|Starting miyagi/.test(text)), waits.join(" → "));
  check("no wait left once miyagi greeted", (await page.locator(".waiting").count()) === 0);
  check("a new conversation offers the quick actions as rows", (await page.locator(".suggest button").count()) >= 3);
  await page.setViewportSize({ width: 390, height: 844 });
  await shot("new-390");
  await page.click(".composer .plus");
  check("＋ opens add a file, capabilities, the actions and the commands", (await page.locator(".pop .more-tiles button").count()) === 2 && (await page.locator(".pop button").count()) >= 6);
  await shot("more-390");
  await page.keyboard.press("Escape");
  await page.click(".composer .mode");
  await shot("mode-390");
  await page.keyboard.press("Escape");
  await page.click(".top .burger");
  await shot("menu-390");
  // The scrim to the right of the open menu closes it.
  await page.click(".side-scrim", { position: { x: 370, y: 400 } });
  await page.setViewportSize({ width: 1440, height: 900 });
  const slash = (await page.fill(".composer textarea", "/"), await page.waitForSelector(".slash"), await page.innerText(".slash"));
  check("the / menu offers miyagi's commands, not Claude Code's", /\/(knowledge|miyagi):|\/extensions/.test(slash) && !/\/(agents|batch|advisor)\b/.test(slash));
  await page.fill(".composer textarea", "");

  // Interactive mode asks before every tool: approve one, refuse the next.
  await mode("interactive");
  await send("Lee la página overview de tu base de conocimiento y dime en una línea qué dice.");
  await page.waitForSelector(CHECKPOINT, { timeout: 180_000 });
  // The checkpoint takes the composer's place; the conversation stays there to read, at every width.
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
  // The spinner of a working conversation keeps moving when less motion is asked (#61): a fade, no turn.
  const spinning = () => page.evaluate(() => getComputedStyle(document.querySelector(".recents .spinner")).animationName);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const calm = await spinning();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  check("with less motion the spinner fades instead of standing still", calm === "breathe" && (await spinning()) === "spin", calm);
    await page.setViewportSize({ width, height });
    await shot(`approval-${width}`);
    const seen = await page.evaluate(() => ({ msgs: document.querySelector(".msgs")?.clientHeight ?? 0, scrim: Boolean(document.querySelector(".scrim")), composer: Boolean(document.querySelector(".composer")?.offsetParent) }));
    check(`an approval leaves the conversation readable at ${width}`, seen.msgs >= 200 && !seen.scrim && !seen.composer, JSON.stringify(seen));
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click(`${CHECKPOINT} .acts .btn.primary`);
  await page.waitForSelector(CHECKPOINT, { state: "detached", timeout: 20_000 }).catch(() => {});
  for (let i = 0; i < 6; i++) {
    const more = await Promise.race([page.waitForSelector(CHECKPOINT, { timeout: 240_000 }).then(() => true), idle().then(() => false)]);
    if (!more || !(await page.$(CHECKPOINT))) break;
    await page.click(`${CHECKPOINT} .acts .btn.primary`);
    await page.waitForSelector(CHECKPOINT, { state: "detached", timeout: 20_000 }).catch(() => {});
  }
  await idle();
  check("an approved turn ends with a reply", (await page.locator(".msg.agent").count()) >= 2);
  // Copy puts the reply's markdown on the clipboard.
  await page.click(".turn-summary .copy >> nth=-1");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  const words = (await page.locator(".msg.agent >> nth=-1").innerText()).split(/\s+/).filter((word) => /^[\p{L}\d]{4,}$/u.test(word)).slice(0, 3);
  check("Copy copies the reply", copied.trim().length > 0 && words.every((word) => copied.includes(word)), copied.slice(0, 80));
  await send("Busca en tu base de conocimiento la palabra rúbrica.");
  await page.waitForSelector(CHECKPOINT, { timeout: 180_000 });
  const before = await page.locator(".tool-calls li.err, .tool .badge.sun").count();
  await page.click(`${CHECKPOINT} .acts .btn:not(.primary):not(.danger)`);
  await page.waitForSelector(CHECKPOINT, { state: "detached", timeout: 20_000 }).catch(() => {});
  // Refused, it may try another way: stop it there.
  if (await page.waitForSelector(CHECKPOINT, { timeout: 8000 }).then(() => true, () => false)) await page.click(`${CHECKPOINT} .acts .btn.danger`);
  await idle();
  check("a refused tool doesn't break the conversation", !(await page.$(CHECKPOINT)) && (await page.locator(".tool-calls li.err, .tool .badge.sun").count()) >= before);
  await mode("guided");
  // ↓ shows once the person scrolls up, and takes them back to the end.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.querySelector(".msgs").scrollTo({ top: 0 }));
  const down = await page.waitForSelector(".to-end", { timeout: 5000 }).catch(() => null);
  check("↓ shows after scrolling up", Boolean(down));
  await shot("conversation-390");
  if (down) {
    await down.click();
    check("↓ goes back to the end", await page.waitForSelector(".to-end", { state: "detached", timeout: 5000 }).then(() => true, () => false));
  }
  await page.setViewportSize({ width: 1440, height: 900 });

  // Both themes, and the screenshots at every width: no horizontal scroll, 44 px targets.
  for (const [theme, nth] of [
    ["light", 1],
    ["dark", 2],
  ]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.click(".side-foot .menu .ibtn");
    await page.click(`.pop button >> nth=${nth}`);
    check(`${theme} theme`, (await page.getAttribute("html", "data-theme")) === theme);
    for (const [width, height] of [
      [1440, 900],
      [1024, 768],
      [768, 1000],
      [390, 844],
      [360, 760],
    ]) {
      await page.setViewportSize({ width, height });
      await shot(`chat-${theme}-${width}`);
      check(`no horizontal scroll at ${width} (${theme})`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      const tiny = await small();
      check(`44 px targets at ${width}`, !tiny.length, tiny.join(", "));
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click(".side-foot .menu .ibtn");
  await page.click(".pop button >> nth=0");
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
console.log(`ok   page: subject, greeting, suggestions, ＋ and mode sheets, / menu, approval in the dock approved and refused, Copy, ↓, modes, themes, 360/390/768/1024/1440 (screenshots in ${shots})`);
