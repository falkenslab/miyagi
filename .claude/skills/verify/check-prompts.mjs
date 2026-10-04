// Renders the system prompt for every session kind from dist/ and checks it.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-prompts.mjs
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { buildSystemPrompt } = await import(pathToFileURL(path.join(root, "dist/systemPrompt.js")).href);
const { toSessionConfig } = await import(pathToFileURL(path.join(root, "dist/workspace.js")).href);

// A browser only with a classroom (ADR-013), and never in ingest.
const browser = (c) => c.kind !== "ingest" && c.hasMoodle;
const moodle = (c) => c.hasMoodle;
// Since agent-kit 0.16 the knowledge base is reached only through its knowledge_* tools: no
// prompt, skill or command may send the agent to its files (index.md, log.md, a page's path).
const KNOWLEDGE_FILES = /\b(index|log|overview|orientation|course-map|moodle-capabilities|teaching-plan|progress|course-audit|drafts)\.md\b|knowledge\/(topics|activities|summaries|concepts|entities|syntheses)\b|\bknowledge\/[a-z-]+\.md/;
const course = (c) => c.kind !== "explore";

// Marker text of each conditional section -> in which renders it must appear.
const SECTIONS = {
  "teacher run": { text: "Manage the given course the way a real teacher would", when: (c) => c.kind === "run" && moodle(c) },
  "teacher chat": { text: "assistant for a teacher in an experimental Moodle", when: (c) => c.kind === "chat" && moodle(c) },
  "browser on demand": { text: "Don't open the browser at the start", when: (c) => c.kind === "chat" && moodle(c) },
  "teacher ingest": { text: "knowledge base of a teacher managing a Moodle course", when: (c) => c.kind === "ingest" && moodle(c) },
  "no classroom": { text: "No virtual classroom is connected to this workspace", when: (c) => course(c) && !moodle(c) },
  "classroom knowledge": { text: "### Classroom pages", when: (c) => course(c) && moodle(c) },
  "explore": { text: "exploring the capabilities of a specific Moodle installation", when: (c) => c.kind === "explore" },
  "file-name safety": { text: "Never pass a `filename` to a Playwright tool", when: browser },
  "migration": { text: "Pending: rebuild the knowledge base", when: (c) => c.migrationPending && course(c) },
  "course knowledge": { text: "The knowledge base of this course", when: course },
  "sources": { text: "## Course sources", when: course },
  "navigation map": { text: "Course navigation map", when: (c) => browser(c) && course(c) },
  "language": { text: "español is this human's usual language", when: course },
  "persona": { text: "warm", when: course, loose: true },
  "custom instructions": { text: "Additional instructions from the teacher", when: course },
  "approval before publishing": { text: "request_human_approval", when: (c) => moodle(c) && (c.kind === "chat" || (c.kind === "run" && c.mode === "guided")) },
  "credentials": { text: "MOODLE_PASSWORD", when: browser },
  "subagents": { text: "## Helpers you can delegate to", when: (c) => c.kind === "run" || c.kind === "chat" },
  "practice runner": { text: "## Checking practical activities in Docker", when: (c) => c.allowPracticeRunner && (c.kind === "run" || c.kind === "chat") },
};

// With a Moodle classroom, and without one (ADR-013: label at the root, no browser).
const workspace = (practice, classroom) => ({
  ...(classroom
    ? { classroom: { label: "check", url: "https://moodle.example.com", courseId: "1", username: "u", password: "p" } }
    : { label: "check" }),
  agent: { role: "teacher", language: "español", persona: "warm", allowPracticeRunner: practice },
});

const MODES = { run: ["guided", "interactive", "autonomous"], chat: ["guided"], ingest: ["autonomous"], explore: ["guided"] };

let failures = 0;
for (const classroom of [true, false]) {
for (const [kind, modes] of Object.entries(MODES)) {
  // Without a classroom, explore stops before building a prompt.
  if (!classroom && kind === "explore") continue;
  for (const mode of modes) {
    for (const [migrationPending, practice] of [[false, false], [true, false], [false, true]]) {
      const config = toSessionConfig("C:/ws", workspace(practice, classroom), {
        mode, kind, headless: false, migrationPending, language: "español", instructions: "Puntúa sobre 10.",
      });
      const prompt = buildSystemPrompt(config);
      const label = `${classroom ? "moodle" : "no classroom"} ${kind} ${mode} migration=${migrationPending} practice=${practice}`;
      const problems = [];
      const left = prompt.match(/\{\{[^}]+\}\}/g);
      if (left) problems.push(`unsubstituted: ${[...new Set(left)].join(", ")}`);
      if (/\bstudent-agent\b|moodle-agent|teacher-agent|context\/|knowledge\/README\.md|save_to_knowledge/.test(prompt)) {
        problems.push("mentions a student-agent/moodle-agent/teacher-agent leftover");
      }
      const file = prompt.match(KNOWLEDGE_FILES);
      if (file) problems.push(`sends the agent to a knowledge file (${file[0]}) instead of the knowledge_* tools`);
      for (const [name, { text, when, loose }] of Object.entries(SECTIONS)) {
        const expected = Boolean(when(config));
        // Markers are matched with whitespace normalized: prompts wrap lines anywhere.
        const present = prompt.replace(/\s+/g, " ").includes(text);
        // "loose" markers may appear elsewhere too: only their absence is checked.
        if (loose ? expected && !present : present !== expected) problems.push(`${name} ${expected ? "missing" : "should not be there"}`);
      }
      if (problems.length > 0) {
        failures++;
        console.log(`FAIL ${label}: ${problems.join("; ")}`);
      } else {
        console.log(`ok   ${label} (${prompt.length} chars)`);
      }
    }
  }
}
}
// The chat opens from the knowledge base: its opening message must not send it to Moodle.
const opening = readFileSync(path.join(root, "prompts/messages/chat-opening-teacher.md"), "utf-8");
if (/log into moodle|log in to moodle|enter the given course/i.test(opening)) {
  failures++;
  console.log("FAIL chat opening message still logs into Moodle");
} else {
  console.log("ok   chat opening message greets from the knowledge base, no login");
}
// The same for the plugin's skills and commands, and every prompt file.
const mdFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? mdFiles(path.join(dir, e.name)) : e.name.endsWith(".md") ? [path.join(dir, e.name)] : []));
const leftovers = [...mdFiles(path.join(root, "plugin")), ...mdFiles(path.join(root, "prompts"))]
  .map((f) => [path.relative(root, f), readFileSync(f, "utf-8").match(KNOWLEDGE_FILES)?.[0]])
  .filter(([, hit]) => hit);
if (leftovers.length > 0) {
  failures++;
  for (const [f, hit] of leftovers) console.log(`FAIL ${f}: knowledge file ${hit} instead of the knowledge_* tools`);
} else {
  console.log("ok   no skill, command or prompt sends the agent to a knowledge file");
}
if (failures > 0) {
  console.log(`\n${failures} render(s) failed`);
  process.exit(1);
}
