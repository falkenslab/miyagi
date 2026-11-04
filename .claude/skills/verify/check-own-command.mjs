// The teacher's own command end to end (teacher-commands #68), in Chrome against the real host and
// a real Claude session: asked for by talking, approved in the dock and saved for all subjects;
// in the next conversation, in a topic's ⋯ with its form, the topic filled in; sent, it builds the
// word search in drafts/. Not part of the quick gate: it needs you signed in to Claude Code and
// Chrome, and spends several turns. Its home is a temporary folder, as check-page's.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-own-command.mjs <screenshots dir>
/* global document -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const shots = path.resolve(process.argv[2] ?? "own-command-shots");
if (process.env.CHECK_PAGE_CHILD !== "1") {
  const home = mkdtempSync(path.join(os.tmpdir(), "check-own-command-"));
  const claudeConfig = process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude");
  const { claudeSignedIn } = await import(pathToFileURL(path.join(process.cwd(), "node_modules/@falkenslab/agent-kit/dist/index.js")).href);
  process.env.CLAUDE_CONFIG_DIR = claudeConfig;
  if (!(await claudeSignedIn())) {
    console.log("skip own command: not signed in to Claude Code (claude auth login) and no API key in the environment");
    process.exit(0);
  }
  const env = { ...process.env, CHECK_PAGE_CHILD: "1", REAL_HOME: os.homedir(), HOME: home, USERPROFILE: home, CLAUDE_CONFIG_DIR: claudeConfig };
  delete env.ELECTRON_RUN_AS_NODE;
  const child = spawnSync(process.execPath, [new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), shots], { env, stdio: "inherit" });
  rmSync(home, { recursive: true, force: true });
  process.exit(child.status ?? 1);
}

setTimeout(() => {
  console.log("FAIL own command: took more than 25 minutes");
  process.exit(2);
}, 25 * 60_000).unref();
mkdirSync(shots, { recursive: true });
const { startHost } = await import(pathToFileURL(path.join(process.cwd(), "dist/host/server.js")).href);
const { listCommands } = await import(pathToFileURL(path.join(process.cwd(), "dist/catalog.js")).href);
const { chromium } = await import(pathToFileURL(path.join(process.cwd(), "node_modules/playwright-core/index.mjs")).href);
const host = await startHost(undefined, { chooseLanguage: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, env: { ...process.env, HOME: process.env.REAL_HOME, USERPROFILE: process.env.REAL_HOME } });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.setDefaultTimeout(60_000);

const failures = [];
const check = (what, ok, detail = "") => ok || failures.push(detail ? `${what} (${detail})` : what);
page.on("pageerror", (error) => failures.push(`page error: ${error.message}`));
const shot = async (name) => {
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(shots, `${name}.png`) });
};
/** Until the turn ends, answering what it asks: approvals yes, choices the first option. Returns the approvals' texts. */
const work = async () => {
  const approvals = [];
  for (;;) {
    const state = await page.evaluate(() => ({
      busy: Boolean(document.querySelector(".composer .send.stop")),
      checkpoint: Boolean(document.querySelector(".dock .checkpoint")),
      text: document.querySelector(".dock .checkpoint")?.innerText ?? "",
    }));
    if (state.checkpoint) {
      approvals.push(state.text);
      await shot(`checkpoint-${approvals.length}`);
      // A question with options: the first one, then its button.
      const option = page.locator(".dock .checkpoint label.option, .dock .checkpoint button.option").first();
      if (await option.count()) await option.click();
      const yes = page.locator(".dock .checkpoint .btn.primary").first();
      if (await yes.count()) await yes.click();
      await page.waitForTimeout(1500);
      continue;
    }
    if (!state.busy) {
      await page.waitForTimeout(2000);
      if (!(await page.$(".composer .send.stop")) && !(await page.$(".dock .checkpoint"))) return approvals;
    }
    await page.waitForTimeout(1000);
  }
};
const send = async (line) => {
  await page.fill(".composer textarea", line);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1500);
};

try {
  await page.goto(host.url);
  await page.waitForSelector(".new-subject input");
  await page.fill(".new-subject input >> nth=0", "Programación");
  await page.click('.new-subject button[type="submit"]');
  await page.waitForSelector(".recents a.open-conv, .recents a.on-conv", { timeout: 60_000 });
  await page.click(".recents a.open-conv");
  await page.waitForSelector(".msg.agent", { timeout: 240_000 });
  await work();
  const subjects = path.join(process.env.HOME, ".miyagi", "workspaces");
  const subject = path.join(subjects, readdirSync(subjects)[0]);
  mkdirSync(path.join(subject, "knowledge", "topics"), { recursive: true });
  writeFileSync(path.join(subject, "knowledge", "topics", "bucles.md"), "---\ntype: topic\ntitle: Bucles\n---\n\n# Bucles\n\nGlosario: bucle, iteración, contador, condición, while, for, break, continue, acumulador, centinela.\n");

  // 1. Asked for by talking, approved, saved for all subjects.
  await send("Quiero un comando para hacer sopas de letras con la temática, el número de palabras y las palabras, para todas mis asignaturas y que salga en cada tema. Parte de tu plantilla tal cual, sin cambiarle nada, y no me preguntes nada más: enséñamelo y pídeme aprobación.");
  const approvals = await work();
  await shot("saved");
  const ownDir = path.join(process.env.HOME, ".miyagi", "own", "commands");
  const saved = existsSync(ownDir) ? readdirSync(ownDir) : [];
  check("the command is saved for all subjects after the teacher's yes", saved.length === 1 && approvals.length >= 1, `${saved.join(",")} after ${approvals.length} approval(s)`);
  check("…and its approval showed its form", approvals.some((text) => /tem[aá]tica|palabras/i.test(text)), approvals.at(-1)?.slice(0, 200));
  const name = saved[0]?.replace(/\.md$/, "") ?? "";
  const other = mkdtempSync(path.join(os.tmpdir(), "other-subject-"));
  check("it's in another subject's catalog too", (await listCommands(other)).some((entry) => entry.name === `/own:${name}`));

  // 2. The next conversation knows it: a topic's ⋯, its form with the topic filled in.
  await page.click(".top .new-chat");
  await page.waitForSelector(".msg.agent", { timeout: 240_000 });
  await work();
  await page.click(".nav a:has-text('Temas')");
  const topic = page.locator(".actionable:has-text('Bucles')").first();
  await topic.locator(".more-btn").click({ timeout: 15_000 });
  const own = page.locator(`.item-pop button[data-command='own:${name}']`);
  check("the own command shows in the topic's ⋯", (await own.count()) === 1, await page.locator(".item-pop").innerText().catch(() => ""));
  await own.click();
  const filled = await page.locator(".param-form input").first().inputValue().catch(() => "");
  await shot("form");
  check("its form opens with the topic filled in", filled === "Bucles", filled);

  // 3. Sent from the form, it builds the word search in drafts/.
  await page.click(".param-form button[type=submit]");
  await page.waitForSelector(".msg.user .cmd-chip", { timeout: 20_000 });
  const raw = await page.locator(".msg.user .cmd-raw").last().innerText();
  check("the form's values reach the command", raw.startsWith(`/own:${name} topic: Bucles`), raw);
  await work();
  await shot("built");
  const drafts = path.join(subject, "drafts");
  const pages = existsSync(drafts) ? readdirSync(drafts, { recursive: true }).filter((file) => String(file).endsWith(".html")) : [];
  const html = pages[0] ? readFileSync(path.join(drafts, String(pages[0])), "utf-8") : "";
  check("the word search is built in drafts/", pages.length >= 1 && /<html/i.test(html), pages.join(","));
} catch (error) {
  failures.push(String(error.message ?? error).split("\n")[0]);
  await shot("failure").catch(() => {});
}
await browser.close();
await host.close();
if (failures.length) {
  for (const failure of failures) console.log(`FAIL own command: ${failure}`);
  process.exit(1);
}
console.log(`ok   own command: asked for, approved and saved for all subjects, in another subject's catalog, in a topic's ⋯ with its form filled in, the word search built in drafts/ (screenshots in ${shots})`);
