// Checks miyagi's page (gui/, gui-chat #47, a three-zone frame #83, the sidebar's tools #84) in Chrome against the
// real host and a real Claude session: a subject created from the page, the rail's places and their
// tabs, the sidebar collapsed and resized, a conversation with its suggestion rows, an approval answered in the dock (the conversation still readable) and one
// refused (interactive mode asks before every tool), Copy, the ↓ button, the ＋ and mode sheets, the
// mode and theme switched, the / menu without Claude Code's commands, a topic's actions (⋯, right click, Shift+F10,
// a sheet on a phone) and the catalog in ＋; and screenshots at 360, 390,
// 768, 1024, 1440 and 1920 px in both themes, with no horizontal scroll and 44 px targets. Not part of the quick gate: it
// needs you signed in to Claude Code (or ANTHROPIC_API_KEY / CLAUDE_CODE_OAUTH_TOKEN in your own
// environment) and Chrome, and spends a few turns. Run it when gui/ or src/host/ change. Its home
// is a temporary folder, so nothing of yours is touched; Claude Code's session is read where it
// keeps it (CLAUDE_CONFIG_DIR at your ~/.claude), never copied (ADR-026).
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-page.mjs <screenshots dir>
/* global document, window, getComputedStyle, MutationObserver -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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
    Array.from(document.querySelectorAll(".top button, .composer .tools-row button, .rail button, .view-tabs button, .side-collapse, .side-tools button, .side-search, .conv-more, .conv-row a, .side-progress"))
      .filter((el) => el.offsetParent)
      .map((el) => [el.getAttribute("aria-label") || el.textContent.trim(), el.getBoundingClientRect()])
      .filter(([, box]) => box.width < 44 || box.height < 44)
      .map(([label, box]) => `${label} ${Math.round(box.width)}x${Math.round(box.height)}`),
  );

const RAIL = (place) => `.rail-item[data-rail="${place}"]`;
const sideWidth = () => page.evaluate(() => Math.round(document.querySelector(".side").getBoundingClientRect().width));
/** Neither the page nor the view next to the sidebar scrolls sideways. */
const fits = () => page.evaluate(() => {
  const view = document.querySelector(".view");
  return document.documentElement.scrollWidth <= window.innerWidth && view.scrollWidth <= view.clientWidth;
});
/** Drags the sidebar's edge by `by` pixels. */
const drag = async (by) => {
  const box = await page.locator(".side-handle").boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + by / 2, y);
  await page.mouse.move(x + by, y);
  await page.mouse.up();
};
/** The frame (#83): the rail's places, their tabs, the ⋯, and the sidebar collapsed and resized, kept over a reload. */
const checkFrame = async () => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click(".top .more-btn");
  check("the conversation's ⋯ offers a new conversation", (await page.locator(".top .pop button").count()) === 1);
  await page.keyboard.press("Escape");
  for (const [place, tabs] of [
    ["today", 0],
    ["course", 4],
    ["memory", 2],
    ["classroom", 0],
    ["extensions", 0],
  ]) {
    await page.click(RAIL(place));
    const here = await page.evaluate((name) => ({ current: document.querySelector(`.rail-item[data-rail="${name}"]`).getAttribute("aria-current"), tabs: document.querySelectorAll(".view-tabs button").length }), place);
    check(`the rail reaches ${place}`, here.current === "page" && here.tabs === tabs, JSON.stringify(here));
  }
  await page.click(RAIL("course"));
  for (const nth of [0, 1, 2, 3]) {
    await page.click(`.view-tabs button >> nth=${nth}`);
    check(`the course's tab ${nth} opens its view`, (await page.getAttribute(`.view-tabs button >> nth=${nth}`, "aria-selected")) === "true" && (await page.locator(".view .wrap, .view .card").count()) > 0);
  }
  await page.click(".view-tabs button >> nth=1");
  await page.click(RAIL("memory"));
  await page.click(".view-tabs button >> nth=1");
  await page.click(RAIL("course"));
  check("a group remembers its last view", (await page.getAttribute(".view-tabs button >> nth=1", "aria-selected")) === "true");
  await page.click(RAIL("memory"));
  check("…each its own", (await page.getAttribute(".view-tabs button >> nth=1", "aria-selected")) === "true");
  await shot("frame-tabs-1440");
  // Collapsed, and still so after a reload.
  await page.click(".side-collapse");
  check("collapsed, the sidebar goes and the header offers it back", !(await page.locator(".side").isVisible()) && (await page.locator(".top .side-open").isVisible()));
  await page.reload();
  await page.waitForSelector(".top .side-open");
  check("the sidebar stays collapsed after a reload", !(await page.locator(".side").isVisible()));
  await shot("frame-collapsed-1440");
  await page.click(".top .side-open");
  await page.waitForSelector(".side-handle");
  check("expanded, the header's button goes", !(await page.locator(".top .side-open").isVisible()));
  // Resized with the mouse, within its limits, and kept.
  await drag(60);
  check("dragging the edge widens the sidebar", (await sideWidth()) === 332, String(await sideWidth()));
  await page.reload();
  await page.waitForSelector(".side-handle");
  check("the width survives a reload", (await sideWidth()) === 332, String(await sideWidth()));
  await drag(400);
  check("…up to its maximum", (await sideWidth()) === 420, String(await sideWidth()));
  await page.click(RAIL("course"));
  check("the view next to the widest sidebar doesn't overflow", await fits());
  await shot("frame-wide-1440");
  await drag(-400);
  check("…and down to its minimum", (await sideWidth()) === 220, String(await sideWidth()));
  // With the keyboard, as a separator; a double click puts it back.
  await page.focus(".side-handle");
  await page.keyboard.press("ArrowRight");
  check("→ widens it", (await sideWidth()) === 236 && (await page.getAttribute(".side-handle", "aria-valuenow")) === "236", String(await sideWidth()));
  await page.keyboard.press("ArrowLeft");
  check("← narrows it", (await sideWidth()) === 220, String(await sideWidth()));
  await page.dblclick(".side-handle");
  check("a double click returns it to its default", (await sideWidth()) === 272, String(await sideWidth()));
  // At the narrowest wide layout, the widest sidebar leaves the view its room.
  await page.evaluate(() => localStorage.setItem("miyagi.sideWidth", "420"));
  await page.reload();
  await page.waitForSelector(".side-handle");
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.click(RAIL("course"));
  check("at 768 the view keeps its room next to the widest sidebar", (await fits()) && (await page.evaluate(() => document.querySelector(".main").getBoundingClientRect().width)) >= 360);
  await shot("frame-wide-768");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => localStorage.removeItem("miyagi.sideWidth"));
  await page.reload();
  await page.waitForSelector(".recents a.open-conv");
};

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
  await page.waitForSelector(".rail .brand");
  // In Today, the open conversation is marked but not selected: one item looks selected (#65).
  await page.waitForSelector(".recents a.open-conv, .recents a.on-conv", { timeout: 60_000 });
  const marks = await page.evaluate(() => ({ selected: document.querySelectorAll('.rail [aria-current="page"], .recents [aria-current="page"]').length, conv: document.querySelectorAll(".recents .on-conv").length, open: document.querySelectorAll(".recents .open-conv").length }));
  check("outside the chat, the open conversation isn't highlighted as the view", marks.selected === 1 && marks.conv === 0 && marks.open === 1, JSON.stringify(marks));
  // The current conversation, from the recent ones.
  await page.click(".recents a.open-conv");
  check("in the chat, the open conversation is the one highlighted", (await page.locator(".recents .on-conv").count()) === 1 && (await page.locator('.rail [aria-current="page"], .recents [aria-current="page"]').count()) === 1);
  if (await page.waitForSelector(".welcome .waiting", { timeout: 20_000 }).catch(() => null)) await page.screenshot({ path: path.join(shots, "starting-1440.png") });
  await page.waitForSelector(".msg.agent", { timeout: 240_000 });
  await idle();
  check("greeting", (await page.locator(".msg.agent").count()) >= 1);
  const waits = await page.evaluate(() => window.__waits);
  check("the wait until the greeting says what it waits for", waits.some((text) => /Arrancando miyagi|Starting miyagi/.test(text)), waits.join(" → "));
  check("no wait left once miyagi greeted", (await page.locator(".waiting").count()) === 0);
  check("a new conversation offers the quick actions as rows", (await page.locator(".suggest button").count()) >= 3);
  await checkFrame();
  await page.click(".recents a.open-conv");
  await page.waitForSelector(".suggest button");
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
  const drawer = await page.evaluate(() => ({ rail: Boolean(document.querySelector(".rail")?.offsetParent), side: Boolean(document.querySelector(".side")?.offsetParent), handle: Boolean(document.querySelector(".side-handle")?.offsetParent), collapse: Boolean(document.querySelector(".side-collapse")?.offsetParent), right: Math.round(document.querySelector(".frame").getBoundingClientRect().right) }));
  check("at 390 the drawer holds the rail and the sidebar, without the handle or the collapse button", drawer.rail && drawer.side && !drawer.handle && !drawer.collapse && drawer.right <= 390, JSON.stringify(drawer));
  // The scrim to the right of the open menu closes it.
  await page.click(".side-scrim", { position: { x: 370, y: 400 } });
  await page.setViewportSize({ width: 1440, height: 900 });
  const slash = (await page.fill(".composer textarea", "/"), await page.waitForSelector(".slash"), await page.innerText(".slash"));
  check("the / menu offers miyagi's commands, not Claude Code's", /\/(knowledge|miyagi):|\/extensions/.test(slash) && !/\/(agents|batch|advisor)\b/.test(slash));
  await page.fill(".composer textarea", "");

  // Interactive mode asks before every tool: approve one, refuse the next.
  await mode("interactive");
  await send("Lee la página overview de tu base de conocimiento y dime en una línea qué dice.");
  // From another view: the approval brings the conversation forward.
  if (!(await page.$(CHECKPOINT))) await page.click(RAIL("today"));
  await page.waitForSelector(CHECKPOINT, { timeout: 180_000 });
  check("an approval brings the conversation forward", Boolean(await page.$(".msgs")));
  // The spinner of a working conversation keeps moving when less motion is asked (#61): a fade, no turn.
  const spinning = () => page.evaluate(() => getComputedStyle(document.querySelector(".recents .spinner")).animationName);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const calm = await spinning();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  check("with less motion the spinner fades instead of standing still", calm === "breathe" && (await spinning()) === "spin", calm);
  // The checkpoint takes the composer's place; the conversation stays there to read, at every width.
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await shot(`approval-${width}`);
    const seen = await page.evaluate(() => ({ msgs: document.querySelector(".msgs")?.clientHeight ?? 0, scrim: Boolean(document.querySelector(".scrim")), composer: Boolean(document.querySelector(".composer")?.offsetParent) }));
    check(`an approval leaves the conversation readable at ${width}`, seen.msgs >= 200 && !seen.scrim && !seen.composer, JSON.stringify(seen));
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  // The bell says what waits (#84), and takes the teacher to it.
  await page.click(".side-tools .bell");
  check("the bell shows an approval while it waits", (await page.locator('.pop [data-notice="approval"]').count()) === 1 && Number(await page.innerText(".bell-count")) >= 1);
  await shot("bell-approval-1440");
  await page.click('.pop [data-notice="approval"]');
  check("…and goes to where it's answered", Boolean(await page.$(CHECKPOINT)) && !(await page.$(".notice-pop")));
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
  await page.click(".side-tools .bell");
  check("the bell stops showing the approval once it's answered", (await page.locator('.pop [data-notice="approval"]').count()) === 0);
  await page.keyboard.press("Escape");
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
  // A subagent at work says what it's doing, for how long and how many actions (#63).
  await send("Pide al subagente pedagogy-reviewer que lea la página overview de tu base de conocimiento y te diga en una frase qué mejoraría. No hagas nada más.");
  const sub = await page.waitForSelector(".tool .sub-activity", { timeout: 180_000 }).catch(() => null);
  const firstSub = sub ? await sub.innerText() : "";
  // Its first action, with the count: what tells a long research from a stuck one.
  const acting = await page.waitForFunction(() => /\d+ (acci|action)/.test(document.querySelector(".tool .sub-activity")?.textContent ?? ""), null, { timeout: 120_000 }).then(() => true, () => false);
  const seenSub = acting ? await page.innerText(".tool .sub-activity") : "";
  await shot("subagent-1440");
  await idle();
  check("a working subagent shows its current action, time and count under its line", /\d+ (s|min)/.test(firstSub) && acting && seenSub !== firstSub, `${firstSub} → ${seenSub}`);
  check("the subagent's line goes once it's done", (await page.locator(".tool .sub-activity").count()) === 0);
  // What miyagi names of the subject links to its view; what doesn't exist stays text (#66).
  const subjects = path.join(os.homedir(), ".miyagi", "workspaces");
  const subject = path.join(subjects, readdirSync(subjects)[0]);
  mkdirSync(path.join(subject, "sources"), { recursive: true });
  writeFileSync(path.join(subject, "sources", "temario.txt"), "Tema 1: variables.");
  mkdirSync(path.join(subject, "knowledge", "topics"), { recursive: true });
  writeFileSync(path.join(subject, "knowledge", "topics", "tema-1.md"), "---\ntype: topic\ntitle: Tema 1\n---\n\n# Tema 1\n\nVariables.\n");
  await send("Sin leer nada, responde solo esta línea, tal cual: «Están [el temario](sources/temario.txt), `sources/temario.txt`, [el tema](topic/tema-1) y `sources/no-existe.pdf`».");
  await idle();
  const reply = page.locator(".msg.agent").last();
  // The links come once the host says what exists: a moment after the reply.
  await reply.locator("a.page-link").first().waitFor({ timeout: 10_000 }).catch(() => {});
  await shot("links-1440");
  const linked = await reply.locator("a.page-link").allInnerTexts();
  check("the items named in the chat are links, and only those that exist", linked.includes("el temario") && linked.includes("sources/temario.txt") && linked.includes("el tema") && !linked.some((text) => text.includes("no-existe")), linked.join(" | "));
  await reply.locator("a.page-link", { hasText: "el temario" }).click();
  check("…a source opens Sources at it", await page.waitForSelector(".tbl tr.on code:text('temario.txt')", { timeout: 10_000 }).then(() => true, () => false));
  // Back to the open conversation, from Recents.
  await page.click(".recents .open-conv").catch(() => {});
  await page.waitForSelector(".msg.agent a.page-link", { timeout: 10_000 }).catch(() => {});
  await shot("links-back-1440");
  await page.locator(".msg.agent").last().locator("a.page-link", { hasText: /^el tema$/ }).click({ timeout: 10_000 }).catch((error) => console.log("page link:", error.message.split("\n")[0]));
  await page.waitForTimeout(1500);
  await shot("links-page-1440");
  check("…a page opens the knowledge base at it", await page.waitForFunction(() => /Variables/.test(document.querySelector("main .card.page")?.textContent ?? "") && Boolean(document.querySelector(".page.md, .card.page")), null, { timeout: 10_000 }).then(() => true, () => false));
  await page.click(".recents .open-conv");
  await page.waitForSelector(".msgs");
  // The bell's other notices (#84): a source not taken in and an activity in the oven, each to its view.
  writeFileSync(path.join(subject, "knowledge", "drafts.md"), "# En el horno\n\n- `building` Tarea de normalización\n");
  await page.click(".side-tools .bell");
  await page.waitForSelector('.pop [data-notice="oven"]', { timeout: 10_000 });
  await shot("bell-1440");
  check("the bell counts the sources not taken in and the oven's activities", (await page.locator('.pop [data-notice="sources"]').count()) === 1 && (await page.innerText(".bell-count")) === "2", await page.innerText(".bell-count"));
  await page.click('.pop [data-notice="sources"]');
  check("…the sources' notice opens Sources", (await page.getAttribute(".view-tabs button >> nth=1", "aria-selected")) === "true");
  await page.click(".side-tools .bell");
  await page.waitForSelector('.pop [data-notice="oven"]', { timeout: 10_000 });
  await page.click('.pop [data-notice="oven"]');
  check("…the oven's notice opens the oven", (await page.getAttribute(".view-tabs button >> nth=3", "aria-selected")) === "true");
  await page.click(".recents .open-conv");
  await page.waitForSelector(".msgs");
  // Selected text in a reply: research it, questions about it, quote it (#67).
  await page.evaluate(() => {
    const body = [...document.querySelectorAll(".msg.agent .body")].at(-1);
    const range = document.createRange();
    range.selectNodeContents(body);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    body.dispatchEvent(new window.MouseEvent("mouseup", { bubbles: true }));
  });
  check("selected text in the chat gets its menu", await page.waitForSelector(".select-menu", { timeout: 5000 }).then(async () => (await page.locator(".select-menu button").count()) === 3, () => false));
  await page.evaluate(() => window.getSelection().removeAllRanges());
  await page.mouse.click(5, 5);
  // miyagi's commands as actions (#67): a topic's ⋯, its right click and Shift+F10 open the same menu.
  await page.click(RAIL("course"));
  await page.click(".view-tabs button:has-text('Temas')");
  const topic = page.locator(".actionable:has-text('Tema 1')").first();
  await topic.locator(".more-btn").click({ timeout: 15_000 });
  const offered = await page.locator(".item-pop button[data-command]").evaluateAll((rows) => rows.map((row) => `${row.dataset.command}${row.disabled ? "(off)" : ""}`));
  await shot("topic-menu-1440");
  check("a topic's ⋯ offers its actions, the classroom's off without one", ["miyagi:build-unit", "miyagi:quiz", "miyagi:research", "miyagi:align(off)"].every((one) => offered.includes(one)), offered.join(" "));
  check("…and asking miyagi about it", (await page.locator(".item-pop button:not([data-command])").count()) === 1);
  await page.keyboard.press("Escape");
  await topic.click({ button: "right", position: { x: 40, y: 20 } });
  check("right click opens the same menu where it was", (await page.locator(".item-pop.at-point button[data-command]").count()) === offered.length);
  await page.keyboard.press("Escape");
  await topic.locator("button.btn").first().focus();
  await page.keyboard.press("Shift+F10");
  check("Shift+F10 opens it from the keyboard", (await page.locator(".item-pop button[data-command]").count()) === offered.length);
  await page.setViewportSize({ width: 390, height: 844 });
  await shot("topic-menu-390");
  const sheet = await page.evaluate(() => {
    const box = document.querySelector(".item-pop").getBoundingClientRect();
    const tiny = [...document.querySelectorAll(".item-pop button")].filter((one) => one.getBoundingClientRect().height < 44).length;
    return { bottom: Math.round(window.innerHeight - box.bottom), width: Math.round(box.width), tiny, scroll: document.documentElement.scrollWidth > window.innerWidth };
  });
  check("on a phone the menu is a sheet from the bottom, 44 px rows, no horizontal scroll", sheet.bottom === 0 && sheet.width === 390 && !sheet.tiny && !sheet.scroll, JSON.stringify(sheet));
  await page.setViewportSize({ width: 1440, height: 900 });
  // "Make a quiz" sends its command with the topic, shown as the action in the conversation.
  await page.click(".item-pop button[data-command='miyagi:quiz']");
  await page.waitForSelector(".msg.user .cmd-chip", { timeout: 20_000 }).catch(() => {});
  const sent = await page.locator(".msg.user").last().innerText().catch(() => "");
  await shot("action-sent-1440");
  check("an action sends its command with the item, shown by its name", /Tema 1/.test(sent) && !sent.includes("/miyagi:"), sent);
  await page.click(".composer .send.stop").catch(() => {});
  await idle();
  // ＋ is the catalog: grouped, the classroom's actions off without one.
  await page.click(".composer .plus");
  const groups = await page.locator(".pop [role=group]").count();
  const gradeOff = await page.locator(".pop button[data-command='miyagi:grade']").isDisabled();
  await shot("catalog-1440");
  check("＋ lists the catalog in groups, grading off without a classroom", groups >= 4 && gradeOff, `${groups} groups`);
  await page.keyboard.press("Escape");
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

  // The sidebar's tools (#84): a word said only in an old conversation finds it and opens it, the
  // result and a pinned one wait while miyagi works, a pin survives a reload, the task at the foot.
  await send("Sin usar herramientas, responde solo esta línea, tal cual: «La palabra clave es zanahoria-pleistoceno».");
  await idle();
  check("no progress at the sidebar's foot with no task under way", (await page.locator(".side-progress").count()) === 0);
  await page.click(".new-conv");
  await page.waitForSelector(".suggest button", { timeout: 240_000 });
  await idle();
  await page.fill(".side-search input", "PLEISTOCENO");
  await page.waitForSelector(".results .result", { timeout: 10_000 });
  await shot("search-1440");
  check("a word said only in an old conversation finds it", (await page.locator(".results .result").count()) === 1 && (await page.innerText(".results .result small")).includes("pleistoceno"), await page.innerText(".results"));
  await page.fill(".side-search input", "palabraquenadiehadicho");
  await page.waitForSelector(".results .muted", { timeout: 10_000 });
  check("a word nobody said finds nothing", (await page.locator(".results .result").count()) === 0);
  await page.fill(".side-search input", "PLEISTOCENO");
  await page.waitForSelector(".results .result", { timeout: 10_000 });
  await page.click(".results .result");
  check("…and the result opens it", await page.waitForFunction(() => /zanahoria-pleistoceno/.test(document.querySelector(".msgs")?.textContent ?? ""), null, { timeout: 30_000 }).then(() => true, () => false));
  check("…closing the search", (await page.inputValue(".side-search input")) === "" && (await page.locator(".recents").count()) === 1);
  await page.waitForSelector(".recents .conv-row:has(a.on-conv) .conv-more");
  const openRow = page.locator(".recents .conv-row:has(a.on-conv)");
  await openRow.hover();
  await openRow.locator(".conv-more").click();
  await shot("pin-menu-1440");
  await page.click(".conv-pop button");
  const pinnedFirst = () => page.waitForFunction(() => /fijadas/i.test(document.querySelector(".recents h6")?.textContent ?? ""), null, { timeout: 30_000 }).then(() => true, () => false);
  check("a pinned conversation goes to its section", await pinnedFirst());
  await page.reload();
  check("…and stays pinned after a reload", await pinnedFirst());
  await shot("pinned-1440");
  // A long turn in another conversation: neither the result nor the pinned one interrupts it.
  await page.click(".new-conv");
  await page.waitForSelector(".suggest button", { timeout: 30_000 });
  await send("Sin usar herramientas, cuenta del 1 al 600, un número por línea.");
  await page.waitForSelector(".composer .send.stop", { timeout: 30_000 });
  await page.fill(".side-search input", "PLEISTOCENO");
  await page.waitForSelector(".results .result", { timeout: 10_000 });
  check("while miyagi works, a result waits, saying why", await page.locator(".results .result").isDisabled() && Boolean(await page.getAttribute(".results .result", "title")));
  await page.fill(".side-search input", "");
  const pinnedRow = page.locator(".recents .conv-row:not(:has(a.on-conv))").first();
  await pinnedRow.locator("a").click();
  await page.waitForTimeout(1000);
  check("…and a pinned conversation doesn't interrupt the turn", Boolean(await page.$(".composer .send.stop")) && (await page.locator(".recents a.on-conv .spinner").count()) === 1);
  await page.click(".composer .send.stop");
  await idle();
  check("the pinned section is above the recent ones", (await page.locator(".recents h6").allInnerTexts()).map((text) => text.toLowerCase()).join() === "fijadas,recientes", (await page.locator(".recents h6").allInnerTexts()).join());
  // The task under way, at the sidebar's foot, and gone when none is.
  await send("Usa la herramienta TodoWrite (no hagas nada más) para crear exactamente estas dos tareas: «Leer el tema uno» en curso y «Leer el tema dos» pendiente.");
  await page.waitForSelector(".side-progress", { timeout: 120_000 }).catch(() => {});
  await idle();
  const foot = (await page.locator(".side-progress").count()) ? await page.innerText(".side-progress") : "";
  check("the sidebar's foot shows the task and its place", /tema uno/i.test(foot) && /1 de 2/.test(foot), foot);
  await shot("progress-1440");
  await send("Usa TodoWrite para marcar las dos tareas como completadas. No hagas nada más.");
  await idle();
  check("…and goes when none is under way", (await page.locator(".side-progress").count()) === 0);

  // Both themes, and the screenshots at every width: no horizontal scroll, 44 px targets.
  for (const [theme, nth] of [
    ["light", 1],
    ["dark", 2],
  ]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.click(".rail-foot .theme-btn");
    await page.click(`.pop button >> nth=${nth}`);
    check(`${theme} theme`, (await page.getAttribute("html", "data-theme")) === theme);
    for (const [width, height] of [
      [1920, 1080],
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
  await page.click(".rail-foot .theme-btn");
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
console.log(`ok   page: subject, greeting, suggestions, ＋ and mode sheets, / menu, approval in the dock approved and refused, Copy, links to the items named in the chat, actions on a topic and on selected text, the catalog, ↓, modes, themes, 360/390/768/1024/1440 (screenshots in ${shots})`);
