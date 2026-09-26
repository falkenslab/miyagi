// Screenshots of a whole course as built by teacher-agent: its front page (as admin and as a
// student), every activity and resource in course order, and each quiz's question list.
// Run from the teacher-agent repo root:
//   (cd ../moodle-sandbox && npm run --silent info -- --json) | node .claude/skills/simulate-course/capture-course.mjs <outDir> <courseId> ["Student Name"]
// Credentials come from stdin and are never printed. Writes <outDir>/shots.json with a
// caption per image, in reading order.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "package.json"));
const { chromium } = require("playwright-core");

const [outDir, courseId, studentName = "Alumno Demo"] = process.argv.slice(2);
if (!outDir || !courseId) throw new Error("usage: capture-course.mjs <outDir> <courseId> [\"Student Name\"]");
fs.mkdirSync(outDir, { recursive: true });
const info = JSON.parse(fs.readFileSync(0, "utf-8"));
const base = info.url;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: "en-GB" })).newPage();
const shots = [];
let n = 1;

async function dismissTour() {
  for (const name of [/End tour/i, /Skip tour/i, /Got it/i]) {
    const button = page.getByRole("button", { name }).first();
    if (await button.isVisible().catch(() => false)) await button.click().catch(() => {});
  }
}

async function shot(slug, url, caption) {
  await page.goto(url.startsWith("http") ? url : `${base}${url}`, { waitUntil: "networkidle" });
  await dismissTour();
  // The course index drawer and the sticky footer are position: fixed and cover full-page captures.
  await page.addStyleTag({ content: `
    #theme_boost-drawers-courseindex, .drawer-toggles, #sticky-footer, .sticky-footer { display: none !important; }
    #page.drawers.show-drawer-left { margin-left: 0 !important; }
    #page.drawers { padding-left: 1rem !important; }` });
  await page.waitForTimeout(700);
  const file = `${String(n++).padStart(2, "0")}-${slug}.png`;
  await page.screenshot({ path: path.join(outDir, file), fullPage: true });
  shots.push({ file, url, caption });
  console.log(`ok ${file}`);
}

const slugify = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

await page.goto(`${base}/login/index.php`);
await page.fill("#username", info.admin.username);
await page.fill("#password", info.admin.password);
await Promise.all([page.waitForNavigation(), page.click("#loginbtn")]);

await shot("curso", `/course/view.php?id=${courseId}`, "Portada del curso (vista del profesor)");

// Every activity/resource link in the course content, in order, once.
const modules = await page.locator('#region-main a[href*="/mod/"][href*="view.php?id="]').evaluateAll((as) => {
  const seen = new Set();
  return as.flatMap((a) => {
    const url = new URL(a.href);
    const key = `${url.pathname}?${url.searchParams.get("id")}`;
    if (seen.has(key)) return [];
    seen.add(key);
    const name = (a.querySelector(".instancename")?.firstChild?.textContent ?? a.textContent).trim();
    return [{ href: `${url.origin}${url.pathname}?id=${url.searchParams.get("id")}`, type: url.pathname.split("/")[2], name }];
  });
});
for (const m of modules) {
  await shot(`${m.type}-${slugify(m.name)}`, m.href, `${m.type}: ${m.name}`);
  if (m.type === "quiz") {
    const cmid = new URL(m.href).searchParams.get("id");
    await shot(`quiz-preguntas-${slugify(m.name)}`, `/mod/quiz/edit.php?cmid=${cmid}`, `Preguntas del cuestionario "${m.name}"`);
  }
}

// The course as a student sees it (admin "Log in as").
const sesskey = await page.evaluate(() => globalThis.M?.cfg?.sesskey);
await page.goto(`${base}/user/index.php?id=${courseId}&perpage=100`, { waitUntil: "networkidle" });
const participants = await page.locator('a[href*="/user/view.php?id="]').evaluateAll((as) => as.map((a) => [a.textContent.trim(), a.href]));
// Link text carries the avatar initials glued on ("ADAlumno Demo").
const student = participants.find(([text]) => text.endsWith(studentName));
if (student) {
  const studentId = new URL(student[1]).searchParams.get("id");
  await page.goto(`${base}/course/loginas.php?id=${courseId}&user=${studentId}&sesskey=${sesskey}`, { waitUntil: "networkidle" });
  await shot("curso-vista-alumno", `/course/view.php?id=${courseId}`, `Portada del curso vista por ${studentName}`);
} else {
  console.log(`skip student view: ${studentName} is not a participant`);
}

fs.writeFileSync(path.join(outDir, "shots.json"), JSON.stringify(shots, null, 2));
await browser.close();
