// Captures the final Moodle state of the sandbox course for a test report: the course, the
// assignment's submissions and grader, the gradebook, every forum thread, the quiz, and what
// one student sees (admin "Log in as"). Run from the miyagi repo root:
//   (cd ../moodle-sandbox && npm run --silent info -- --json) | node .claude/skills/sandbox-e2e/capture-moodle.mjs <outDir> ["Student Name"]
// Credentials come from stdin and are never printed. Uses the playwright-core that comes with
// @playwright/mcp, driving the system's Chrome.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "package.json"));
const { chromium } = require("playwright-core");

const outDir = process.argv[2];
const studentName = process.argv[3] ?? "Sara Gil";
fs.mkdirSync(outDir, { recursive: true });
const info = JSON.parse(fs.readFileSync(0, "utf-8"));
const base = info.url;
const courseId = info.course.id;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: "en-GB" });
const page = await context.newPage();
const shots = [];

async function dismissTour() {
  for (const name of [/End tour/i, /Skip tour/i, /Got it/i]) {
    const button = page.getByRole("button", { name });
    if (await button.first().isVisible().catch(() => false)) {
      await button.first().click().catch(() => {});
      await page.waitForTimeout(300);
    }
  }
}

async function shot(file, url, { full = true, wait, caption } = {}) {
  await page.goto(`${base}${url}`, { waitUntil: "networkidle" });
  await dismissTour();
  if (wait) await page.waitForSelector(wait, { timeout: 15000 }).catch(() => {});
  // The course index drawer and the sticky footer are position: fixed, so on a full-page
  // capture they cover the start of the content: hide them for the screenshot.
  await page.addStyleTag({ content: `
    #theme_boost-drawers-courseindex, .drawer-toggles, #sticky-footer, .sticky-footer { display: none !important; }
    #page.drawers.show-drawer-left { margin-left: 0 !important; }
    #page.drawers { padding-left: 1rem !important; }` });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, file), fullPage: full });
  shots.push({ file, url, caption });
  console.log(`ok ${file}`);
}

// Admin session.
await page.goto(`${base}/login/index.php`);
await page.fill("#username", info.admin.username);
await page.fill("#password", info.admin.password);
await Promise.all([page.waitForNavigation(), page.click("#loginbtn")]);

const cmid = async (mod) => {
  await page.goto(`${base}/course/view.php?id=${courseId}`, { waitUntil: "networkidle" });
  const href = await page.locator(`a[href*="/mod/${mod}/view.php?id="]`).first().getAttribute("href");
  return new URL(href).searchParams.get("id");
};
const assignCm = await cmid("assign");
const quizCm = await cmid("quiz");
const forumCm = await cmid("forum");
const listParticipants = async () => {
  await page.goto(`${base}/user/index.php?id=${courseId}&perpage=50`, { waitUntil: "networkidle" });
  const links = await page.locator('a[href*="/user/view.php?id="]').evaluateAll((as) => as.map((a) => [a.textContent.trim(), a.href]));
  return links;
};
const participants = await listParticipants();

await shot("01-curso.png", `/course/view.php?id=${courseId}`, { caption: "El curso visto por el profesor" });
await shot("02-entregas.png", `/mod/assign/view.php?id=${assignCm}&action=grading`, { caption: "Tabla de entregas de la Tarea 1" });
// Link text carries the avatar initials first ("LM Lucía Martín").
const idOf = (fullname) => new URL(participants.find(([n]) => n.endsWith(fullname))[1]).searchParams.get("id");
// The students seeded by `npm run activity`; link texts carry the avatar initials glued on.
const SEEDED = /Lucía Martín|Marcos López|Sara Gil/;
const submitters = participants.map(([n]) => n.match(SEEDED)?.[0]).filter(Boolean).sort();
let g = 3;
for (const name of submitters) {
  const slug = name.split(" ")[0].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  await shot(`${String(g++).padStart(2, "0")}-calificador-${slug}.png`,
    `/mod/assign/view.php?id=${assignCm}&action=grader&userid=${idOf(name)}`,
    { full: false, wait: '[data-region="grade-panel"]', caption: `Calificador: ${name}` });
}
await shot(`${String(g++).padStart(2, "0")}-libro-calificaciones.png`, `/grade/report/grader/index.php?id=${courseId}`, { caption: "Libro de calificaciones" });
await page.goto(`${base}/mod/forum/view.php?id=${forumCm}`, { waitUntil: "networkidle" });
// The same thread is linked several times (title, last post...): dedupe by its id.
const discussions = [...new Set(await page.locator('a[href*="/mod/forum/discuss.php?d="]')
  .evaluateAll((as) => as.map((a) => new URL(a.href).searchParams.get("d"))))].map((d) => `${base}/mod/forum/discuss.php?d=${d}`);
let i = g;
for (const href of discussions) {
  const d = new URL(href).searchParams.get("d");
  await shot(`${String(i++).padStart(2, "0")}-foro-hilo-${d}.png`, `/mod/forum/discuss.php?d=${d}`, { caption: `Hilo del foro ${d}` });
}
await shot(`${String(i++).padStart(2, "0")}-cuestionario-preguntas.png`, `/mod/quiz/edit.php?cmid=${quizCm}`, { caption: "Preguntas del cuestionario" });
await shot(`${String(i++).padStart(2, "0")}-cuestionario-portada.png`, `/mod/quiz/view.php?id=${quizCm}`, { caption: "Portada del cuestionario" });

// What a student sees: log in as Sara (admin "Log in as").
const sesskey = await page.evaluate(() => globalThis.M?.cfg?.sesskey);
await page.goto(`${base}/course/loginas.php?id=${courseId}&user=${idOf(studentName)}&sesskey=${sesskey}`, { waitUntil: "networkidle" });
await shot(`${String(i++).padStart(2, "0")}-alumno-tarea.png`, `/mod/assign/view.php?id=${assignCm}`, { caption: `Lo que ve ${studentName} en la tarea` });
await shot(`${String(i).padStart(2, "0")}-alumno-foro.png`, `/mod/forum/discuss.php?d=${new URL(discussions.at(-1)).searchParams.get("d")}`, { caption: `Lo que ve ${studentName} en el foro` });

fs.writeFileSync(path.join(outDir, "shots.json"), JSON.stringify(shots, null, 2));
await browser.close();
