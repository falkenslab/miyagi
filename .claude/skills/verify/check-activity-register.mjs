// Checks the register of activities in progress (course/drafts, activity-lifecycle, #17): its
// phases counted from sample pages (an old one without phases included), the end-of-session
// line in Spanish, and which files plan mode lets the agent write.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-activity-register.mjs
import path from "node:path";
import { pathToFileURL } from "node:url";

const load = (file) => import(pathToFileURL(path.join(process.cwd(), "dist", file)).href);
const { countPhases, isActivityPlanFile, readPhaseCounts } = await load("activityRegister.js");
const { es } = await load("messages/es.js");

const PAGES = [
  [
    "phases",
    `# Borradores\n\nActividades en marcha.\n\n- \`planning\` Escape room de SQL — plan: drafts/escape-room/plan.md\n- \`building\` Proyecto web — drafts/proyecto-web/\n- \`building\` Glosario — drafts/glosario/\n- \`hidden\` Cuestionario del tema 2 — http://localhost/mod/quiz/view.php?id=9\n- \`served\` Taller — servido el 2026-10-22\n`,
    { planning: 1, building: 2, hidden: 1, served: 1 },
  ],
  [
    "old page, hidden items only",
    `# Borradores\n\n- [Página del tema 1](http://localhost/mod/page/view.php?id=4): falta revisar en móvil\n* Cuestionario del tema 1 (oculto)\n`,
    { planning: 0, building: 0, hidden: 2, served: 0 },
  ],
  ["empty page", `# Borradores\n\nNada en marcha.\n`, { planning: 0, building: 0, hidden: 0, served: 0 }],
];

let failures = 0;
for (const [name, text, expected] of PAGES) {
  const got = countPhases(text);
  if (JSON.stringify(got) !== JSON.stringify(expected)) {
    failures++;
    console.log(`FAIL ${name}: ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
  }
}

// A plan written in plan mode, before the page could be edited, counts as planning; a registered one doesn't twice.
const fs = await import("node:fs");
const os = await import("node:os");
const ws = fs.mkdtempSync(path.join(os.tmpdir(), "register-"));
for (const slug of ["escape-room", "proyecto-web"]) {
  fs.mkdirSync(path.join(ws, "drafts", slug), { recursive: true });
  fs.writeFileSync(path.join(ws, "drafts", slug, "plan.md"), "# Plan\n");
}
fs.mkdirSync(path.join(ws, "drafts", "sin-plan"), { recursive: true });
fs.mkdirSync(path.join(ws, "knowledge"));
fs.writeFileSync(path.join(ws, "knowledge", "drafts.md"), "- `building` Proyecto web — plan: drafts/proyecto-web/plan.md\n");
const counted = readPhaseCounts(ws);
if (counted?.planning !== 1 || counted?.building !== 1) {
  failures++;
  console.log(`FAIL unregistered plan: ${JSON.stringify(counted)}, expected 1 planning and 1 building`);
}
fs.rmSync(path.join(ws, "knowledge", "drafts.md"));
if (readPhaseCounts(ws)?.planning !== 2) {
  failures++;
  console.log("FAIL plans without a register page: expected 2 planning");
}
fs.rmSync(ws, { recursive: true, force: true });

const line = es.endInProgress({ planning: 1, building: 1, hidden: 1, served: 0 }, "drafts.md");
if (!line.startsWith("En el horno: 1 en plan, 1 cocinándose, 1 probándose oculto")) {
  failures++;
  console.log(`FAIL end of session: ${line}`);
}

const drafts = path.resolve("ws", "drafts");
const PLAN_FILES = [
  [path.join(drafts, "escape-room", "plan.md"), true],
  [path.join(drafts, "escape-room", "index.html"), false],
  [path.join(drafts, "plan.md"), false],
  [path.join(drafts, "a", "b", "plan.md"), false],
  [path.resolve("ws", "knowledge", "x", "plan.md"), false],
  [path.resolve("elsewhere", "drafts", "x", "plan.md"), false],
];
for (const [file, expected] of PLAN_FILES) {
  if (isActivityPlanFile(drafts, file) !== expected) {
    failures++;
    console.log(`FAIL plan file ${file}: expected ${expected}`);
  }
}

console.log(
  failures === 0
    ? `ok   ${PAGES.length} register pages counted, unregistered plans, end line, ${PLAN_FILES.length} plan-mode paths`
    : `${failures} activity-register check(s) failed`,
);
process.exitCode = failures === 0 ? 0 : 1;
