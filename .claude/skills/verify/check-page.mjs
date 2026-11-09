// Checks miyagi's page (gui/, gui-chat #47, the guided tour #81, the startup tips #82, a three-zone frame #83, the sidebar's tools #84, the side panel #85 and the turn's activity in it #70, the desktop browser's bar and panel on a stub #86, the desktop title bar on a stub #87) in Chrome against the
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
/* global document, window, location, getComputedStyle, MutationObserver -- the callbacks of page.evaluate and waitForFunction run in the page. */
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
    Array.from(document.querySelectorAll(".top button, .composer .tools-row button, .rail button, .view-tabs button, .side-collapse, .side-tools button, .side-search, .conv-more, .conv-row a, .side-progress, .spanel-bar button, .spanel-tab button, .web-row button, .beside, .tool-head, .tool .sub-activity, .activity-head button, .recents-more"))
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
/** Where the tour's spotlight is, whether its bubble fits and what it points at, for the step on screen. */
const tourStep = () => page.evaluate(() => {
  const bubble = document.querySelector(".tour-bubble");
  const box = bubble.getBoundingClientRect();
  const ring = document.querySelector(".tour-ring")?.getBoundingClientRect();
  const id = bubble.dataset.step;
  const target = { subject: ".ws", newConversation: ".new-conv", searchBell: ".side-tools", conversations: ".recents", progress: ".side-progress", today: '.rail-item[data-rail="today"]', classroom: '.rail-item[data-rail="classroom"]', plan: ".view-tabs", materials: ".view-tabs", memory: ".view-tabs", extensions: '.rail-item[data-rail="extensions"]', composer: ".composer", approvals: ".composer .mode", statusBar: ".status-bar", sidePanel: ".top .panel-btn", browser: ".top .panel-btn", titleBar: ".titlebar", theme: ".rail-foot" }[id];
  const element = target ? document.querySelector(target)?.getBoundingClientRect() : undefined;
  const near = element && ring && Math.abs(ring.left - element.left) <= 6 && Math.abs(ring.top - element.top) <= 6 && Math.abs(ring.right - element.right) <= 6 && Math.abs(ring.bottom - element.bottom) <= 6;
  const inWindow = box.left >= 0 && box.top >= 0 && box.right <= window.innerWidth + 0.5 && box.bottom <= window.innerHeight + 0.5;
  const clear = !ring || ring.height > 400 || box.right <= ring.left || box.left >= ring.right || box.bottom <= ring.top || box.top >= ring.bottom;
  const centred = Math.abs((box.left + box.right) / 2 - window.innerWidth / 2) < 2;
  const tiny = [...bubble.querySelectorAll("button")].filter((one) => one.getBoundingClientRect().height < 44).length;
  return { id, hasTarget: Boolean(target), found: Boolean(element), near, ring: Boolean(ring), inWindow, clear, centred, tiny, focused: bubble.contains(document.activeElement), scroll: document.documentElement.scrollWidth > window.innerWidth };
});
const tipId = () => page.getAttribute(".tip-body", "data-tip");
/** The first tip (#82), right after the tour: a window with its image; Esc closes it. */
const checkFirstTip = async () => {
  await page.waitForSelector(".dialog.tips", { timeout: 15_000 });
  check("after the tour a tip shows, never both at once", (await page.locator(".tour").count()) === 0 && (await tipId()) === "01-shift-tab" && (await page.evaluate(() => { const img = document.querySelector(".tip-body img"); return img?.complete && img.naturalWidth > 0; })));
  await shot("tip-first-1440");
  // The focus stays in the tip whatever is clicked or focused behind it, so Esc reaches it (#99).
  const inTip = () => page.waitForFunction(() => document.querySelector(".dialog.tips").contains(document.activeElement), null, { timeout: 2000 }).then(() => true, () => false);
  const search = await page.locator(".side-search input").boundingBox();
  await page.mouse.click(search.x + 20, search.y + 10);
  check("a click where the search field is leaves the focus in the tip", await inTip());
  await page.evaluate(() => document.querySelector(".side-search input").focus());
  check("…and the focus sent to it comes back to the tip", await inTip());
  await page.click(".tip-text");
  check("…a click on the tip's text keeps it inside", await inTip());
  await page.keyboard.press("Escape");
  await page.waitForSelector(".dialog.tips", { state: "detached" });
};
/** The tips (#82) over the next opens: the next one each time, "Don't show" keeps it closed, the menu reopens it; every width and theme. */
const checkTips = async () => {
  await page.reload();
  await page.waitForSelector(".dialog.tips", { timeout: 15_000 });
  check("the next open shows the next tip", (await tipId()) === "02-slash-menu", await tipId());
  await page.click(".tip-next");
  check("Next tip moves on", (await tipId()) === "03-plus-menu", await tipId());
  await page.click(".tip-prev");
  check("Previous goes back", (await tipId()) === "02-slash-menu", await tipId());
  await page.click(".tip-next");
  await page.evaluate(() => {
    window.__open = window.open;
    window.open = (url) => (window.__opened = url);
  });
  await page.click(".tip-more");
  const opened = await page.evaluate(() => {
    window.open = window.__open;
    return window.__opened;
  });
  check("Learn more opens the tip's docs page", opened === "https://falkenslab.github.io/miyagi/avanzado/navegador", opened);
  check("the tip's dialog names itself and keeps the focus", await page.evaluate(() => Boolean(document.querySelector('.dialog.tips[role="dialog"][aria-modal="true"]')) && document.querySelector(".dialog.tips").contains(document.activeElement)));
  // Sizes: the image above and scaled at 360, nothing overflows.
  for (const scheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const [width, height] of [
      [360, 760],
      [768, 1000],
      [1440, 900],
    ]) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(shots, `tip-${scheme}-${width}.png`) });
      const fit = await page.evaluate(() => {
        const dialog = document.querySelector(".dialog.tips").getBoundingClientRect();
        const img = document.querySelector(".tip-body img")?.getBoundingClientRect();
        const text = document.querySelector(".tip-text").getBoundingClientRect();
        const tiny = [...document.querySelectorAll(".tip-acts button, .tip-more")].filter((one) => one.getBoundingClientRect().height < 44).length;
        return { inWindow: dialog.left >= 0 && dialog.right <= window.innerWidth + 0.5 && dialog.bottom <= window.innerHeight + 0.5, above: img ? img.bottom <= text.top + 1 : null, imgFits: img ? img.right <= dialog.right + 1 : true, tiny, scroll: document.documentElement.scrollWidth > window.innerWidth };
      });
      check(`the tips' window fits at ${width} (${scheme})`, fit.inWindow && !fit.scroll && fit.imgFits && !fit.tiny, JSON.stringify(fit));
      if (width === 360) check("…with the image above the text", fit.above === true, JSON.stringify(fit));
    }
  }
  await page.emulateMedia({ colorScheme: null });
  await page.setViewportSize({ width: 1440, height: 900 });
  // "Don't show" keeps it closed; the menu reopens it, and unticking brings it back.
  await page.check(".tip-off input");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".dialog.tips", { state: "detached" });
  await page.reload();
  await page.waitForSelector(".recents a.open-conv, .recents a.on-conv");
  await page.waitForTimeout(1500);
  check("with Don't show ticked, no tip on the next open", (await page.locator(".dialog.tips").count()) === 0);
  await page.click(".rail-foot .help-btn");
  await page.click('.pop [data-help="tips"]');
  await page.waitForSelector(".dialog.tips");
  check("the menu reopens the tips even when turned off, the box still ticked", await page.isChecked(".tip-off input"));
  await shot("tips-from-menu-1440");
  await page.uncheck(".tip-off input");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".dialog.tips", { state: "detached" });
  await page.waitForTimeout(300);
  await page.reload();
  await page.waitForSelector(".dialog.tips", { timeout: 15_000 });
  check("turned back on from the menu, the tips open again", true);
  await page.check(".tip-off input");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".dialog.tips", { state: "detached" });
};
/** «Vincular ya» on creating the subject (#96): the wizard alone, and the tour once it's closed. */
const checkTourWaitsForWizard = async () => {
  await page.waitForSelector(".dialog .steps", { timeout: 120_000 });
  await page.waitForSelector(RAIL("today"), { timeout: 120_000 });
  await page.waitForTimeout(3000);
  await shot("wizard-before-tour-1440");
  check("with the classroom's wizard open neither the tour nor a tip starts", (await page.locator(".tour").count()) === 0 && (await page.locator(".dialog.tips").count()) === 0);
  await page.click(".dialog .acts .btn.ghost");
  await page.waitForSelector(".dialog .steps", { state: "detached" });
};
/** The tour (#81) on this fresh home, before anything else on the page: it starts when the subject opens, and Skip closes it for good. */
const skipTour = async () => {
  await page.waitForSelector(".tour-bubble", { timeout: 120_000 });
  check("on a fresh home, the tour starts when the subject is open", true);
  await shot("tour-start-1440");
  check("the sidebar's foot shows the tour's step while it's on", /1 de/.test(await page.innerText(".side-progress")));
  await page.click(".tour-skip");
  await page.waitForSelector(".tour", { state: "detached" });
  await page.waitForTimeout(300);
  check("Skip closes the tour and leaves the view as it was", (await page.locator('.rail-item[data-rail="today"][aria-current="page"]').count()) === 1);
};
/** The tour (#81) from the rail's foot: not again on the next open, every step at 360, 768 and 1440 px in both themes, the keys and the end. */
const checkTour = async () => {
  await page.reload();
  await page.waitForSelector(".recents a.open-conv, .recents a.on-conv");
  await page.waitForTimeout(1500);
  check("skipped, it doesn't appear on the next open", (await page.locator(".tour").count()) === 0);
  check("…the sidebar's foot shows no tour", (await page.locator(".side-progress").count()) === 0);
  await page.click(".rail-foot .help-btn");
  await shot("tour-menu-1440");
  await page.click('.pop [data-help="tour"]');
  await page.waitForSelector(".tour-bubble");
  check("the rail's foot opens it again, closing its menu", (await page.locator(".pop").count()) === 0);
  const total = await page.evaluate(() => Number(/de (\d+)/.exec(document.querySelector(".tour-count").textContent)[1]));
  check("the tour counts its steps", total >= 12, String(total));
  const widths = [
    [360, 760],
    [768, 1000],
    [1440, 900],
  ];
  for (const scheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const [width, height] of widths) {
      await page.setViewportSize({ width, height });
      for (let n = 1; n <= total; n++) {
        await page.waitForTimeout(650);
        const here = await tourStep();
        await page.screenshot({ path: path.join(shots, `tour-${scheme}-${width}-${String(n).padStart(2, "0")}-${here.id}.png`) });
        check(`tour step ${here.id} points at its element at ${width} (${scheme})`, here.hasTarget && here.found ? here.near : !here.ring && here.centred, JSON.stringify(here));
        check(`tour step ${here.id}: the bubble inside the window, clear of the target, 44 px, no scroll, focus inside, at ${width} (${scheme})`, here.inWindow && here.clear && !here.tiny && !here.scroll && here.focused, JSON.stringify(here));
        if (n < total) await page.click(".tour-next");
      }
      // Back to the start for the next width: with the ← key.
      for (let n = 1; n < total; n++) await page.keyboard.press("ArrowLeft");
    }
  }
  await page.emulateMedia({ colorScheme: null });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(() => document.querySelector(".tour-bubble")?.dataset.step === "welcome", null, { timeout: 5000 });
  const count = () => page.evaluate(() => document.querySelector(".tour-bubble").dataset.step);
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(() => document.querySelector(".tour-bubble")?.dataset.step === "subject", null, { timeout: 5000 });
  check("→ moves forward", (await count()) === "subject");
  await page.keyboard.press("ArrowLeft");
  await page.waitForFunction(() => document.querySelector(".tour-bubble")?.dataset.step === "welcome", null, { timeout: 5000 });
  check("← moves back", (await count()) === "welcome");
  check("the focus stays in the bubble, with its keys", await page.evaluate(() => document.querySelector(".tour-bubble").contains(document.activeElement)));
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  check("Tab stays inside the bubble", await page.evaluate(() => document.querySelector(".tour-bubble").contains(document.activeElement)));
  // The focus sent to the search field comes back to the bubble (#99): the tour hears its keys on the document.
  await page.evaluate(() => document.querySelector(".side-search input").focus());
  await page.waitForFunction(() => document.querySelector(".tour-bubble").contains(document.activeElement), null, { timeout: 2000 });
  // Esc skips it, and the last step's button finishes.
  await page.keyboard.press("Escape");
  await page.waitForSelector(".tour", { state: "detached" });
  check("Esc skips it", (await page.locator(".tour").count()) === 0);
  await page.click(".rail-foot .help-btn");
  await page.click('.pop [data-help="tour"]');
  for (let n = 1; n < total; n++) await page.click(".tour-next");
  check("the last step says it finishes", (await page.locator(".tour-next").innerText()).length > 0 && (await count()) === "theme");
  await page.keyboard.press("Enter");
  await page.waitForSelector(".tour", { state: "detached" });
  check("Finish closes it", (await page.locator(".tour").count()) === 0);
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

/** The turn's activity (#70), left open by the subagent's turn: live, in every width and theme, Esc to close, and an approval still in the composer's place. */
const checkActivity = async (actionsGrew) => {
  check("the subagent's line opens the panel with its actions appearing as they happen", await actionsGrew);
  await shot("activity-1440");
  check("…each call with its mark and label", (await page.innerText(".spanel .tool-calls > li .mark")).trim() === "✓" && (await page.locator(".spanel .tool-calls > li").count()) >= 1);
  check("…and the turn's time", /\d/.test(await page.innerText(".spanel .activity-head")));
  await checkPanelSizes("activity");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".spanel", { state: "detached", timeout: 5000 }).catch(() => {});
  check("Esc closes the activity", (await page.locator(".spanel").count()) === 0);
  // Remembered per conversation for this visit, also over a reload; closed, it stays closed.
  await page.click(".tool .tool-head >> nth=-1");
  await page.waitForSelector(".spanel .activity-list");
  await page.reload();
  await page.waitForSelector(".recents a.open-conv");
  check("the activity comes back with its conversation after a reload", await page.waitForSelector(".spanel .activity-list", { timeout: 10_000 }).then(() => true, () => false));
  await page.click(".recents .open-conv");
  await page.waitForSelector(".msgs");
  await page.focus(".composer textarea");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".spanel", { state: "detached", timeout: 5000 }).catch(() => {});
  check("…closed, it stays closed", (await page.locator(".spanel").count()) === 0);
  // An older turn's line opens that turn; its ✕ closes it.
  await page.click(".tool .tool-head >> nth=0");
  await page.waitForSelector(".spanel .activity-list");
  check("an older turn's line opens that turn", (await page.locator(".spanel .tool-calls > li").count()) >= 1);
  await page.click(".spanel-tab .spanel-x");
  await page.waitForSelector(".spanel", { state: "detached" });
  // An approval asked while the panel is open stays in the composer's place.
  await page.click(".tool .tool-head >> nth=-1");
  await page.waitForSelector(".spanel .activity-list");
  await mode("interactive");
  await send("Lee la página overview de tu base de conocimiento y dime en una línea qué dice.");
  await page.waitForSelector(CHECKPOINT, { timeout: 180_000 });
  check("an approval asked with the activity open shows in the composer's place", Boolean(await page.$(".spanel .activity-list")) && !(await page.$(".spanel .checkpoint")) && Boolean(await page.$(CHECKPOINT)));
  await shot("activity-approval-1440");
  await page.click(`${CHECKPOINT} .acts .btn.danger`);
  await page.waitForSelector(CHECKPOINT, { state: "detached", timeout: 20_000 }).catch(() => {});
  await idle();
  await mode("guided");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".spanel", { state: "detached", timeout: 5000 }).catch(() => {});
};
/** The side panel (#85): opened from Materials, the oven and a link in the chat, the conversation going on beside it. */
const PANEL_OPEN = (name) => `.tbl tr:has-text('${name}') .beside`;
const tabs = () => page.locator(".spanel-tab").count();
const panelRects = () => page.evaluate(() => {
  const rect = (el) => (el && el.offsetParent !== null ? el.getBoundingClientRect() : null);
  const [main, panel, msgs] = [".main", ".spanel", ".msgs"].map((sel) => rect(document.querySelector(sel)));
  return { main: main && Math.round(main.right), mainWidth: main && Math.round(main.width), panel: panel && Math.round(panel.left), panelWidth: panel && Math.round(panel.width), msgs: Boolean(msgs), innerWidth: window.innerWidth };
});
const servedFrame = () => page.evaluate(async () => {
  const frame = document.querySelector(".spanel-page:not([hidden]) iframe");
  const answer = await fetch(frame.getAttribute("src"));
  return { sandbox: frame.getAttribute("sandbox"), status: answer.status, type: answer.headers.get("content-type"), csp: answer.headers.get("content-security-policy") ?? "" };
});
/**
 * The desktop browser's bar and panel (#86) on a stub of the native side, against a host that has one:
 * the panel offers it, an address is refused or goes, a link in the chat opens a tab (Ctrl+click
 * leaves), and the view follows the panel and gives way to a still under a menu.
 */
const checkBrowser = async (subject) => {
  const calls = [];
  const webTabs = [];
  const listeners = [];
  const notify = () => listeners.forEach(({ onChange }) => onChange());
  const fake = {
    list: () => webTabs,
    subscribe: (onChange, onRefused) => (listeners.push({ onChange, onRefused }), () => undefined),
    open: (address) => {
      const id = String(webTabs.length + 1);
      webTabs.push({ id, title: address ? "Campus" : "", url: address ?? "", loading: false, canBack: false, canForward: false, failed: false });
      calls.push(["open", address]);
      notify();
      return id;
    },
    close: (id) => {
      webTabs.splice(webTabs.findIndex((tab) => tab.id === id), 1);
      calls.push(["close", id]);
      notify();
    },
    select: (id) => calls.push(["select", id]),
    navigate: (id, address) => {
      Object.assign(webTabs.find((tab) => tab.id === id), { url: address, title: "Página" });
      calls.push(["navigate", id, address]);
      notify();
    },
    back: (id) => calls.push(["back", id]),
    forward: (id) => calls.push(["forward", id]),
    reload: (id) => calls.push(["reload", id]),
    bounds: (rect) => calls.push(["bounds", rect]),
    capture: async () => {
      calls.push(["capture"]);
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    },
    external: (id) => calls.push(["external", id]),
    zoom: (id, delta) => calls.push(["zoom", id, delta]),
  };
  await host.close();
  const roles = [];
  const withBrowser = await startHost(subject, { chooseLanguage: true, browser: fake, frame: { devTools: true, role: (name) => roles.push(name), colors: () => undefined } });
  const own = new URL(withBrowser.url);
  const lastBounds = () => calls.filter(([what]) => what === "bounds").at(-1)?.[1];
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(withBrowser.url);
  await page.waitForSelector(".top .panel-btn", { timeout: 240_000 });
  await page.waitForSelector(".recents a.open-conv", { timeout: 240_000 });
  await idle();
  await page.waitForSelector(".titlebar");
  // The tour's steps that only the desktop app has (#81): the browser's button and the title bar.
  await page.click(".rail-foot .help-btn");
  await page.click('.pop [data-help="tour"]');
  await page.waitForSelector(".tour-bubble");
  for (const wanted of ["browser", "titleBar"]) {
    while ((await page.getAttribute(".tour-bubble", "data-step")) !== wanted) await page.click(".tour-next");
    await page.waitForTimeout(650);
    const here = await tourStep();
    check(`the app's tour step ${wanted} points at its element`, here.found && here.near && here.inWindow, JSON.stringify(here));
    await shot(`tour-app-${wanted}-1440`);
  }
  await page.keyboard.press("Escape");
  await page.waitForSelector(".tour", { state: "detached" });
  check("the desktop app has its title bar, at the first view's start", (await page.locator(".tb-back:disabled").count()) === 1 && (await page.locator(".tb-forward:disabled").count()) === 1);
  await page.click(RAIL("course"));
  await page.click(".view-tabs button >> nth=1");
  await page.waitForFunction(() => document.querySelector(".tb-back:not(:disabled)"), null, { timeout: 5000 });
  await page.click(".tb-back");
  await page.waitForTimeout(150);
  check("← goes back through the views, → forward", (await page.getAttribute(".view-tabs button >> nth=0", "aria-selected")) === "true" && (await page.locator(".tb-forward:not(:disabled)").count()) === 1);
  await page.click(".tb-forward");
  await page.waitForFunction(() => document.querySelector(".tb-forward:disabled"), null, { timeout: 5000 });
  check("…and → stops at the end", (await page.getAttribute(".view-tabs button >> nth=1", "aria-selected")) === "true");
  await page.click(".titlebar .tb-menu >> nth=2");
  await page.click(".titlebar .pop button >> nth=2");
  await page.waitForTimeout(150);
  check("a menu entry carries out its role through the host", roles.includes("zoomIn"), roles.join(","));
  // The menu's initial is in the page's language.
  await page.keyboard.press(`Alt+${(await page.innerText(".titlebar .tb-menu >> nth=0"))[0].toLowerCase()}`);
  await page.waitForSelector(".titlebar .pop", { timeout: 3000 });
  check("Alt and a menu's initial opens it", (await page.locator(".titlebar .pop button").count()) === 1);
  await page.keyboard.press("Escape");
  await page.click(".titlebar .tb-menu >> nth=3");
  check("Help is there", (await page.locator(".titlebar .pop button").count()) === 2);
  await page.keyboard.press("Escape");
  await page.click(".tb-side");
  await page.waitForTimeout(150);
  check("the sidebar's button collapses it", (await page.locator(".side-open").count()) === 1);
  await page.click(".tb-side");
  check("the bar is drawn in the theme, draggable, its buttons not", await page.evaluate(() => getComputedStyle(document.querySelector(".titlebar")).getPropertyValue("-webkit-app-region") === "drag" && getComputedStyle(document.querySelector(".tb-back")).getPropertyValue("-webkit-app-region") === "no-drag"));
  await page.click(".recents a.open-conv");
  await page.waitForSelector(".composer textarea");
  await shot("titlebar-1440");
  check("the desktop app's header offers the browser, with no tab open", (await page.locator(".spanel").count()) === 0);
  await page.click(".top .panel-btn");
  await page.waitForSelector(".web-row");
  await page.waitForFunction(() => document.activeElement === document.querySelector(".web-address input"), null, { timeout: 5000 }).catch(() => {});
  check("a new tab, the address waiting and the page's place empty", (await page.locator(".spanel-tab").count()) === 1 && (await page.evaluate(() => document.activeElement === document.querySelector(".web-address input"))) && (await page.locator(".web-empty").count()) === 1);
  await shot("browser-new-1440");
  const typed = async (text) => {
    await page.fill(".web-address input", text);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250);
  };
  for (const [text, message] of [["una palabra", "isn't"], ["file:///C:/Windows/win.ini", "refused"], [`${own.origin}/`, "refused"], ["javascript:alert(1)", "isn't"]]) {
    await typed(text);
    const said = (await page.locator(".web-refusal").count()) === 1;
    check(`refused with a message: ${text}`, said && !calls.some(([what, , address]) => what === "navigate" && address?.includes(text)), message);
  }
  await typed("campus.example.org/moodle");
  await page.waitForFunction(() => document.querySelector(".web-address input")?.value.includes("campus.example.org"), null, { timeout: 5000 }).catch(() => {});
  check("a page goes, the refusal gone and its address shown", calls.some(([what, , address]) => what === "navigate" && address === "https://campus.example.org/moodle") && (await page.locator(".web-refusal").count()) === 0 && (await page.inputValue(".web-address input")).includes("campus.example.org"));
  check("back and forward start disabled", (await page.locator(".web-back:disabled").count()) === 1 && (await page.locator(".web-forward:disabled").count()) === 1);
  await page.waitForFunction(() => document.querySelector(".web-page")?.getBoundingClientRect().width > 0);
  await page.waitForFunction(() => !document.querySelector(".web-still"), null, { timeout: 5000 });
  await page.waitForTimeout(400);
  const placed = await page.evaluate(() => {
    const box = document.querySelector(".web-page").getBoundingClientRect();
    return { x: Math.round(box.left), y: Math.round(box.top), width: Math.round(box.width), height: Math.round(box.height) };
  });
  check("the view is placed over the panel", JSON.stringify(lastBounds()) === JSON.stringify(placed), JSON.stringify([lastBounds(), placed]));
  await dragPanel(-180);
  await page.waitForTimeout(300);
  check("…and follows its divider", lastBounds()?.width === placed.width + 180, JSON.stringify(lastBounds()));
  await page.dblclick(".spanel .side-handle");
  await page.waitForTimeout(300);
  await page.click(".spanel-expand");
  await page.waitForTimeout(300);
  check("…expanding it", lastBounds()?.width > placed.width + 300, JSON.stringify(lastBounds()));
  await page.click(".spanel-expand");
  await page.waitForTimeout(300);
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.waitForTimeout(300);
  check("…and the window's size", lastBounds() === null || lastBounds()?.x >= 0, JSON.stringify(lastBounds()));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  // The ⋯ opens a menu over the view: it gives way to a still, and comes back when the menu closes.
  await page.click(".web-more");
  await page.waitForSelector(".web-still", { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(200);
  check("the ⋯ doesn't fall under the view: a still in its place", (await page.locator(".web-still").count()) === 1 && calls.some(([what]) => what === "capture") && lastBounds() === null, JSON.stringify(lastBounds()));
  await shot("browser-menu-1440");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector(".web-still"), null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(200);
  check("…and the view comes back", (await page.locator(".web-still").count()) === 0 && lastBounds() !== null);
  await page.click(".web-more");
  await page.click(".pop button >> nth=2");
  await page.waitForTimeout(200);
  check("the ⋯ acts on the tab", calls.some(([what, , delta]) => what === "zoom" && delta === 1));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  webTabs[0].canBack = true;
  notify();
  await page.waitForSelector(".web-back:not(:disabled)", { timeout: 5000 });
  await page.click(".web-back");
  await page.click(".web-reload");
  await page.click(".web-external");
  await page.waitForTimeout(200);
  check("back, reload and the system's browser reach the tab", ["back", "reload", "external"].every((name) => calls.some(([what, id]) => what === name && id === webTabs[0].id)));
  const narrow = await page.evaluate(() => getComputedStyle(document.querySelector(".web-external")).display);
  check("at the panel's width the row keeps the system browser's button", narrow !== "none", narrow);
  await checkPanelSizes("browser");
  await page.setViewportSize({ width: 1440, height: 900 });
  // A link in the chat opens a tab; Ctrl+click leaves it to the browser, as before.
  await page.click(".spanel-close").catch(() => {});
  await send("Sin usar herramientas, responde solo con este enlace en una línea: https://example.org/pagina");
  await idle();
  const opensBefore = calls.filter(([what]) => what === "open").length;
  const link = page.locator('.msg.agent a[href="https://example.org/pagina"]').last();
  await link.waitFor({ timeout: 15_000 });
  await link.click();
  await page.waitForFunction(() => document.querySelectorAll(".spanel-tab").length >= 2, null, { timeout: 5000 }).catch(() => {});
  check("a link in the chat opens a tab", calls.some(([what, address]) => what === "open" && address === "https://example.org/pagina") && (await page.locator(".spanel-tab").count()) >= 2);
  const opensAfter = calls.filter(([what]) => what === "open").length;
  const [popup] = await Promise.all([page.context().waitForEvent("page"), link.click({ modifiers: ["Control"] })]);
  await popup.close();
  check("Ctrl+click doesn't open a tab here", calls.filter(([what]) => what === "open").length === opensAfter && opensAfter === opensBefore + 1);
  check("the chat's state knows no address of the browser", !(await page.evaluate(() => JSON.stringify(window.__lastState ?? ""))).includes("campus.example.org"));
  await page.click(".spanel-tab .spanel-x >> nth=0");
  await page.waitForFunction(() => document.querySelectorAll(".spanel-tab").length === 1, null, { timeout: 5000 }).catch(() => {});
  check("closing a tab reaches the native side", calls.some(([what]) => what === "close") && (await page.locator(".spanel-tab").count()) === 1);
  await withBrowser.close();
};

/** Drags the panel's divider by `by` pixels (to the left widens it). */
const dragPanel = async (by) => {
  const box = await page.locator(".spanel .side-handle").boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + by / 2, y);
  await page.mouse.move(x + by, y);
  await page.mouse.up();
};
/** Every width and theme: beside the chat when there's room, in its place under 1100 px, the whole screen at 760 or less. */
const checkPanelSizes = async (name) => {
  for (const [theme, nth] of [
    ["light", 1],
    ["dark", 2],
  ]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.click(".rail-foot .theme-btn");
    await page.click(`.pop button >> nth=${nth}`);
    for (const [width, height] of [
      [1920, 1080],
      [1440, 900],
      [1024, 768],
      [768, 1000],
      [390, 844],
      [360, 760],
    ]) {
      await page.setViewportSize({ width, height });
      await shot(`${name}-${theme}-${width}`);
      const box = await panelRects();
      const place = width > 1100 ? box.msgs && box.main <= box.panel + 1 : width > 760 ? box.main === null && box.panel !== null : box.main === null && box.panel === 0 && box.panelWidth === width;
      check(`${name}: its place at ${width} (${theme})`, place, JSON.stringify(box));
      check(`${name}: no horizontal scroll at ${width} (${theme})`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      const tiny = await small();
      check(`${name}: 44 px targets at ${width}`, !tiny.length, tiny.join(", "));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  await page.click(".rail-foot .theme-btn");
  await page.click(".pop button >> nth=0");
};
const checkSidePanel = async (subject) => {
  const drafts = path.join(subject, "drafts");
  mkdirSync(path.join(drafts, "tarea"), { recursive: true });
  writeFileSync(path.join(drafts, "guion.pdf"), "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 200]>>endobj\ntrailer<</Root 1 0 R>>\n");
  writeFileSync(path.join(drafts, "pagina.html"), "<h1>Actividad</h1><script>parent.postMessage('ran', '*')</script>");
  writeFileSync(path.join(drafts, "tarea", "plan.md"), "# Plan\n\nSemana uno de la tarea.\n");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    window.__ran = 0;
    window.addEventListener("message", () => window.__ran++);
  });
  await page.click(RAIL("course"));
  await page.click(".view-tabs button >> nth=2");
  await page.waitForSelector(PANEL_OPEN("guion.pdf"));
  await page.click(PANEL_OPEN("guion.pdf"));
  await page.waitForSelector(".spanel iframe");
  const beside = await panelRects();
  check("a PDF opens beside the chat, with the conversation next to it", beside.panel !== null && beside.msgs && beside.main <= beside.panel + 1 && beside.mainWidth >= 360, JSON.stringify(beside));
  const pdf = await servedFrame();
  check("…the host serves it as a PDF", pdf.status === 200 && pdf.type.startsWith("application/pdf"), JSON.stringify(pdf));
  await shot("panel-pdf-1440");
  // The conversation goes on with the panel open; a file named in the chat opens another tab.
  await send("Sin usar herramientas, responde solo esta línea, tal cual: «Está `drafts/pagina.html`».");
  await idle();
  const line = page.locator(".msg.agent").last();
  await line.locator("a.page-link").first().waitFor({ timeout: 10_000 }).catch(() => {});
  check("the conversation goes on with the panel open", (await page.locator(".spanel iframe").count()) === 1 && (await line.innerText()).includes("drafts/pagina.html"));
  await line.locator("a.page-link").first().click();
  await page.waitForFunction(() => document.querySelectorAll(".spanel-tab").length === 2, null, { timeout: 10_000 }).catch(() => {});
  check("a file named in the chat opens a tab, without leaving the chat", (await tabs()) === 2 && Boolean(await page.$(".msgs")));
  check("…the one on screen", (await page.innerText(".spanel-tab.on [role=tab]")) === "pagina.html");
  const html = await servedFrame();
  check("an HTML draft stays sandboxed", html.sandbox === "" && html.status === 200 && /sandbox/.test(html.csp), JSON.stringify(html));
  await page.waitForTimeout(800);
  check("…its scripts don't run", (await page.evaluate(() => window.__ran)) === 0);
  await shot("panel-html-1440");
  // Back to the first tab, kept mounted; closing one leaves the other.
  await page.click(".spanel-tab:has-text('guion.pdf') [role=tab]");
  check("changing tab shows the other file", (await page.getAttribute(".spanel-tab:has-text('guion.pdf') [role=tab]", "aria-selected")) === "true" && (await page.locator(".spanel-page:not([hidden]) iframe").count()) === 1);
  // The oven's register names a plan: it opens beside the chat too.
  await page.click(RAIL("course"));
  await page.click(".view-tabs button >> nth=3");
  await page.waitForSelector(".oven .it .beside", { timeout: 10_000 });
  await page.click(".oven .it:has-text('plan.md') .beside");
  await page.waitForFunction(() => /Semana uno/.test(document.querySelector(".spanel-page:not([hidden]) .preview.md")?.textContent ?? ""), null, { timeout: 10_000 });
  check("the oven's plan opens beside the chat, and shows the chat", (await tabs()) === 3 && Boolean(await page.$(".msgs")));
  // Resized with the mouse, within its limits, the width kept over a reload.
  await dragPanel(-100);
  const wide = (await panelRects()).panelWidth;
  check("dragging the divider widens the panel", wide === 580, String(wide));
  await page.reload();
  await page.waitForSelector(".recents a.open-conv");
  await page.click(RAIL("course"));
  await page.click(".view-tabs button >> nth=2");
  await page.waitForSelector(PANEL_OPEN("guion.pdf"));
  check("tabs last until the page is closed", (await page.locator(".spanel").count()) === 0);
  await page.click(PANEL_OPEN("guion.pdf"));
  await page.waitForSelector(".spanel iframe");
  check("the width survives a reload", (await panelRects()).panelWidth === 580, String((await panelRects()).panelWidth));
  await page.dblclick(".spanel .side-handle");
  check("a double click returns it to its default", (await panelRects()).panelWidth === 480, String((await panelRects()).panelWidth));
  await page.evaluate(() => localStorage.removeItem("miyagi.panelWidth"));
  // Closed and brought back from the header, its tabs still there.
  await page.click(".spanel-close");
  await page.waitForSelector(".spanel", { state: "detached" });
  await page.click(".top .panel-btn");
  check("the header brings the panel back", (await page.locator(".spanel").count()) === 1 && (await tabs()) === 1);
  check("in the browser, the panel offers no browser and no title bar", (await page.locator(".spanel-new, .web-row, .titlebar").count()) === 0);
  // Expanded it takes the conversation's column; an approval brings the conversation back at once.
  await mode("interactive");
  await page.click(".spanel-expand");
  const expanded = await panelRects();
  check("expanded, the panel takes the conversation's column", expanded.main === null && expanded.panel !== null, JSON.stringify(expanded));
  await shot("panel-expanded-1440");
  await page.evaluate(() => fetch(`api/send?token=${new URLSearchParams(location.search).get("token")}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ line: "Lee la página overview de tu base de conocimiento y dime en una línea qué dice." }) }));
  await page.waitForSelector(CHECKPOINT, { timeout: 180_000 });
  const seen = await panelRects();
  check("an approval with the panel expanded is seen at once", seen.msgs && seen.main !== null, JSON.stringify(seen));
  await shot("panel-approval-1440");
  for (const [width, height] of [
    [1024, 768],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await shot(`panel-approval-${width}`);
    const narrow = await panelRects();
    check(`at ${width} the approval takes the panel's place`, narrow.msgs && narrow.panel === null, JSON.stringify(narrow));
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click(`${CHECKPOINT} .acts .btn.danger`);
  await page.waitForSelector(CHECKPOINT, { state: "detached", timeout: 20_000 }).catch(() => {});
  await idle();
  check("…and once answered the panel is back", (await panelRects()).main === null);
  await page.click(".spanel-expand");
  await mode("guided");
  await checkPanelSizes("panel");
  // On a phone the way back returns to the conversation; the header offers the panel again.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click(".spanel-back");
  await page.waitForSelector(".msgs");
  check("the way back returns to the conversation", (await panelRects()).panel === null);
  await page.click(".top .panel-btn");
  await page.waitForSelector(".spanel");
  await page.setViewportSize({ width: 1440, height: 900 });
  // Closing the last tab closes the panel.
  await page.click(".spanel-tab .spanel-x");
  await page.waitForSelector(".spanel", { state: "detached" });
  check("closing the last tab closes the panel, and the header's button goes", (await page.locator(".panel-btn").count()) === 0);
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
  await page.check('.new-subject input[type="checkbox"]');
  await page.click('.new-subject button[type="submit"]');
  await page.waitForSelector(".rail .brand");
  // That sentence is only on screen in the chat, and the checks of the wizard and the tour can
  // outlast the start: look at the chat while it's starting, and go back to Today.
  await page.waitForSelector(".recents a.open-conv, .recents a.on-conv", { state: "attached", timeout: 60_000 });
  await page.evaluate(() => document.querySelector(".recents a.open-conv")?.click());
  await page.waitForFunction(() => window.__waits.some((text) => /Arrancando miyagi|Starting miyagi/.test(text)) || document.querySelector(".msg.agent"), null, { timeout: 60_000 });
  await page.evaluate(() => document.querySelector('.rail-item[data-rail="today"]')?.click());
  await checkTourWaitsForWizard();
  await skipTour();
  await checkFirstTip();
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
  await checkTips();
  await checkTour();
  await page.click(".recents a.open-conv");
  await page.waitForSelector(".suggest button");
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
  // The last thing said is the answer to that refusal, not a greeting (#98): Today keeps the greeting.
  const greeted = (await page.locator(".msg.agent >> nth=0").innerText()).trim();
  const lastSaid = (await page.locator(".msg.agent >> nth=-1").innerText()).trim();
  await page.click(RAIL("today"));
  await page.waitForSelector(".card.hello");
  const hello = (await page.innerText(".card.hello .grow")).trim();
  check("after a refused turn, Today shows the greeting and not the reply to it", hello.slice(0, 40) === greeted.slice(0, 40) && (lastSaid.slice(0, 60) === greeted.slice(0, 60) || !hello.includes(lastSaid.slice(0, 60))), hello.slice(0, 80));
  await shot("today-after-refusal-1440");
  await page.click(".recents .open-conv");
  await page.waitForSelector(".composer textarea");
  await mode("guided");
  // A subagent at work says what it's doing, for how long and how many actions (#63).
  await send("Pide al subagente pedagogy-reviewer que lea la página overview de tu base de conocimiento y te diga en una frase qué mejoraría. No hagas nada más.");
  const sub = await page.waitForSelector(".tool .sub-activity", { timeout: 180_000 }).catch(() => null);
  const firstSub = sub ? await sub.innerText() : "";
  // Its line opens the turn's activity in the panel, where its actions appear as they happen (#70).
  await page.click(".tool .sub-activity");
  await page.waitForSelector(".spanel .activity-list");
  const actionsAtOpen = await page.locator(".spanel .tool-calls ul li").count();
  const actionsGrew = page.waitForFunction((n) => document.querySelectorAll(".spanel .tool-calls ul li").length > n, actionsAtOpen, { timeout: 120_000 }).then(() => true, () => false);
  // Its first action, with the count: what tells a long research from a stuck one.
  const acting = await page.waitForFunction(() => /\d+ (acci|action)/.test(document.querySelector(".tool .sub-activity")?.textContent ?? ""), null, { timeout: 120_000 }).then(() => true, () => false);
  const seenSub = acting ? await page.innerText(".tool .sub-activity") : "";
  await shot("subagent-1440");
  await idle();
  check("a working subagent shows its current action, time and count under its line", /\d+ (s|min)/.test(firstSub) && acting && seenSub !== firstSub, `${firstSub} → ${seenSub}`);
  check("the subagent's line goes once it's done", (await page.locator(".tool .sub-activity").count()) === 0);
  await checkActivity(actionsGrew);
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
  await checkSidePanel(subject);
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
  // The turn's activity shows its task list too (#70).
  await send("Lee la página overview de tu base de conocimiento. No hagas nada más; no toques las tareas.");
  await idle();
  await page.click(".tool .tool-head >> nth=-1");
  await page.waitForSelector(".spanel .activity-list");
  check("the activity shows the turn's task list", (await page.locator(".spanel .todos .box span").count()) === 2);
  await shot("activity-tasks-1440");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".spanel", { state: "detached", timeout: 5000 }).catch(() => {});
  await send("Usa TodoWrite para marcar las dos tareas como completadas. No hagas nada más.");
  await idle();
  check("…and goes when none is under way", (await page.locator(".side-progress").count()) === 0);

  // More conversations than the list shows (#97): the oldest is reached with "see more".
  const keepConversation = (name, when, lines) => {
    const dir = path.join(subject, "sessions", name);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "session.json"), JSON.stringify({ sessionId: `11111111-2222-4333-8444-${String(when.getTime()).padStart(12, "0").slice(-12)}`, subagents: {} }));
    writeFileSync(path.join(dir, "conversation.jsonl"), lines.map(([type, text], index) => JSON.stringify({ type, uuid: `${name}-${index}`, timestamp: new Date(when.getTime() + index * 1000).toISOString(), message: { role: type, content: text } })).join("\n"));
  };
  for (let n = 1; n <= 30; n++) keepConversation(`2026-01-${String(n).padStart(2, "0")}T10-00-00-000Z`, new Date(Date.UTC(2026, 0, n, 10)), [["user", `Sembrada ${n}`], ["assistant", `De acuerdo, ${n}.`]]);
  await page.reload();
  await page.waitForSelector(".recents .recents-more", { timeout: 30_000 });
  const listed = () => page.locator(".recents .conv-row").count();
  const recentRows = () => page.locator(".recents h6:last-of-type ~ .conv-row").count();
  check("the list starts with the latest twelve", (await recentRows()) === 12, String(await recentRows()));
  check("…without the oldest", (await page.locator('.recents a[title$="Sembrada 1"]').count()) === 0);
  await shot("recents-more-1440");
  check("…and See more is a 44 px target", (await page.locator(".recents-more").boundingBox()).height >= 44);
  const before12 = await listed();
  await page.click(".recents-more");
  await page.waitForFunction((n) => document.querySelectorAll(".recents .conv-row").length > n, before12, { timeout: 10_000 });
  check("See more adds older ones", (await listed()) > before12, String(await listed()));
  while (await page.locator(".recents-more").count()) {
    const now = await listed();
    await page.click(".recents-more");
    await page.waitForFunction((n) => document.querySelectorAll(".recents .conv-row").length > n, now, { timeout: 10_000 });
  }
  check("…down to the oldest, and the button goes", (await page.locator('.recents a[title$="Sembrada 1"]').count()) === 1);
  await page.click('.recents a[title$="Sembrada 1"]');
  await page.waitForFunction(() => [...document.querySelectorAll(".msg.user")].some((one) => one.textContent.includes("Sembrada 1")), null, { timeout: 30_000 });
  check("…and it opens from the list", true);
  // A conversation opened on a day with other activities in the oven (#100): its opening, kept
  // as it was, isn't today's and is still not something the teacher wrote.
  keepConversation(new Date().toISOString().replace(/[:.]/g, "-"), new Date(), [["user", "Greet the teacher from what you already know: 1 activity being built that day."], ["assistant", "Hola, sigo con la actividad."], ["user", "Prepara la rúbrica"], ["assistant", "Hecha."]]);
  await page.reload();
  await page.waitForSelector('.recents a[title$="Prepara la rúbrica"]', { timeout: 30_000 });
  await page.click('.recents a[title$="Prepara la rúbrica"]');
  await page.waitForFunction(() => [...document.querySelectorAll(".msg.agent")].some((one) => one.textContent.includes("Hecha.")), null, { timeout: 30_000 });
  const bubbles = await page.locator(".msg.user").allInnerTexts();
  check("a resumed conversation doesn't show its opening as the teacher's", bubbles.length === 1 && bubbles[0].includes("Prepara la rúbrica"), bubbles.join(" | ").slice(0, 100));
  await page.click(RAIL("today"));
  await page.waitForSelector(".card.hello");
  check("…and Today shows the greeting that opening got", (await page.innerText(".card.hello .grow")).includes("Hola, sigo con la actividad"), await page.innerText(".card.hello .grow"));
  await page.click(".recents .open-conv");
  await page.waitForSelector(".composer textarea");
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
  await checkBrowser(subject);
} catch (error) {
  failures.push(String(error.message ?? error).split("\n")[0]);
  await shot("failure").catch(() => {});
}
await browser.close();
await host.close().catch(() => {});
if (failures.length) {
  for (const failure of failures) console.log(`FAIL page: ${failure}`);
  process.exit(1);
}
console.log(`ok   page: the guided tour, the startup tips, subject, greeting, suggestions, ＋ and mode sheets, / menu, approval in the dock approved and refused, Copy, links to the items named in the chat, actions on a topic and on selected text, the catalog, ↓, modes, themes, the desktop browser's bar and title bar on stubs, 360/390/768/1024/1440 (screenshots in ${shots})`);
