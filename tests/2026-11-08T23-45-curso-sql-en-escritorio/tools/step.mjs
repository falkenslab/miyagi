// Runs one step against the app: node step.mjs <step file.mjs> — its default export gets
// { page, shot, log }, and screenshots go to shots/ at the size of the docs' captures.
import path from "node:path";
import { pathToFileURL } from "node:url";
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const { chromium } = await import(pathToFileURL("<miyagi>/node_modules/playwright-core/index.mjs").href);
const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
let page;
for (let i = 0; i < 60 && !page; i++) {
  page = browser.contexts().flatMap((c) => c.pages()).find((p) => p.url().startsWith("http://127.0.0.1"));
  if (!page) await new Promise((r) => setTimeout(r, 1000));
}
page.setDefaultTimeout(60_000);
await page.setViewportSize({ width: 1440, height: 900 }).catch((e) => console.log("viewport", e.message));
const shot = async (name, opts = {}) => { await page.waitForTimeout(500); await page.screenshot({ path: path.join(here, "shots", `${name}.png`), ...opts }); console.log("shot", name); };
const log = (...a) => console.log(...a);
const step = await import(pathToFileURL(path.resolve(process.argv[2])).href);
try { await step.default({ page, shot, log }); } catch (e) { console.log("STEP ERROR", e.message); await shot("error-" + path.basename(process.argv[2], ".mjs")); process.exitCode = 1; }
process.exit();
