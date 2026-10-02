// Screenshots of Moodle pages as a given user, in Spanish, for the docs tutorial.
//   node shoot.mjs <who> <outFile> <path> [--full] [--clip=<css selector>] [--width=1280] [--height=860]
// <who>: profesor | alumno | lucia.martin | marcos.lopez | sara.gil | admin. Credentials from the
// sandbox's info (never printed). Sessions are kept per user in ./state-<who>.json.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.env.MIYAGI_DIR ?? process.cwd(), "package.json"));
const { chromium } = require("playwright-core");
const here = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, "$1");

const [who, outFile, urlPath, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const info = JSON.parse(execSync("npm run --silent info -- --json", { cwd: process.env.MOODLE_SANDBOX_DIR ?? "../moodle-sandbox" }).toString());
const users = { profesor: info.teacher, alumno: info.student, admin: info.admin };
for (const s of info.students ?? []) users[s.username] = s;
const cred = users[who];
if (!cred) throw new Error(`unknown user ${who}`);

const stateFile = path.join(here, `state-${who}.json`);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: Number(opt.width ?? 1280), height: Number(opt.height ?? 860) },
  locale: "es-ES", deviceScaleFactor: 1.5,
  ...(fs.existsSync(stateFile) ? { storageState: stateFile } : {}),
});
const page = await context.newPage();
page.setDefaultTimeout(90000);

async function login() {
  await page.goto(`${info.url}/login/index.php`, { waitUntil: "domcontentloaded" });
  if (!(await page.locator("#username").count())) return;
  await page.fill("#username", cred.username);
  await page.fill("#password", cred.password);
  await Promise.all([page.waitForNavigation(), page.click("#loginbtn")]);
  await context.storageState({ path: stateFile });
}

await page.goto(`${info.url}${urlPath}`, { waitUntil: "networkidle" });
if (page.url().includes("/login/")) {
  await login();
  await page.goto(`${info.url}${urlPath}`, { waitUntil: "networkidle" });
}
for (const name of [/Finalizar tour|End tour/i, /Saltar|Skip tour/i, /Entendido|Got it/i]) {
  const b = page.getByRole("button", { name }).first();
  if (await b.isVisible().catch(() => false)) await b.click().catch(() => {});
}
await page.addStyleTag({ content: `
  #sticky-footer, .sticky-footer, .btn-footer-popover, .footer-popover { display: none !important; }
  ${opt.noindex ? "#theme_boost-drawers-courseindex, .drawer-toggles { display:none !important } #page.drawers.show-drawer-left { margin-left:0 !important }" : ""}` });
if (opt.wait) await page.waitForSelector(opt.wait).catch(() => {});
await page.waitForTimeout(Number(opt.delay ?? 800));
fs.mkdirSync(path.dirname(outFile), { recursive: true });
if (opt.clip) await page.locator(opt.clip).first().screenshot({ path: outFile });
else await page.screenshot({ path: outFile, fullPage: Boolean(opt.full) });
console.log(`ok ${outFile} (${page.url()})`);
await browser.close();
