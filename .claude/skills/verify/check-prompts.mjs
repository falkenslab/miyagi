// Renders the system prompt for every session kind from dist/ and checks it.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-prompts.mjs
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { buildSystemPrompt } = await import(pathToFileURL(path.join(root, "dist/systemPrompt.js")).href);
const { toSessionConfig } = await import(pathToFileURL(path.join(root, "dist/workspace.js")).href);

const browser = (c) => c.kind !== "ingest";
const course = (c) => c.kind !== "explore";

// Marker text of each conditional section -> in which renders it must appear.
const SECTIONS = {
  "teacher run": { text: "Manage the given course the way a real teacher would", when: (c) => c.kind === "run" },
  "teacher chat": { text: "You are a conversational assistant for a teacher", when: (c) => c.kind === "chat" },
  "browser on demand": { text: "Don't open the browser at the start", when: (c) => c.kind === "chat" },
  "teacher ingest": { text: "You maintain the knowledge base of a teacher", when: (c) => c.kind === "ingest" },
  "explore": { text: "exploring the capabilities of a specific Moodle installation", when: (c) => c.kind === "explore" },
  "file-name safety": { text: "Never pass a `filename` to a Playwright tool", when: browser },
  "migration": { text: "Pending: rebuild the knowledge base", when: (c) => c.migrationPending && course(c) },
  "course knowledge": { text: "The knowledge base of this course", when: course },
  "sources": { text: "## Course sources", when: course },
  "navigation map": { text: "Course navigation map", when: (c) => browser(c) && course(c) },
  "language": { text: "español is this human's usual language", when: course },
  "persona": { text: "warm", when: course, loose: true },
  "custom instructions": { text: "Additional instructions from the teacher", when: course },
  "approval before publishing": { text: "request_human_approval", when: (c) => c.kind === "chat" || (c.kind === "run" && c.mode === "guided") },
  "credentials": { text: "MOODLE_PASSWORD", when: browser },
  "subagents": { text: "## Helpers you can delegate to", when: (c) => c.kind === "run" || c.kind === "chat" },
  "practice runner": { text: "## Checking practical activities in Docker", when: (c) => c.allowPracticeRunner && (c.kind === "run" || c.kind === "chat") },
};

const workspace = (practice) => ({
  classroom: { label: "check", url: "https://moodle.example.com", courseId: "1", username: "u", password: "p" },
  agent: { role: "teacher", language: "español", persona: "warm", allowPracticeRunner: practice },
});

const MODES = { run: ["guided", "interactive", "autonomous"], chat: ["guided"], ingest: ["autonomous"], explore: ["guided"] };

let failures = 0;
for (const [kind, modes] of Object.entries(MODES)) {
  for (const mode of modes) {
    for (const [migrationPending, practice] of [[false, false], [true, false], [false, true]]) {
      const config = toSessionConfig("C:/ws", workspace(practice), {
        mode, kind, headless: false, migrationPending, language: "español", instructions: "Puntúa sobre 10.",
      });
      const prompt = buildSystemPrompt(config);
      const label = `${kind} ${mode} migration=${migrationPending} practice=${practice}`;
      const problems = [];
      const left = prompt.match(/\{\{[^}]+\}\}/g);
      if (left) problems.push(`unsubstituted: ${[...new Set(left)].join(", ")}`);
      if (/\bstudent-agent\b|moodle-agent|context\/|knowledge\/README\.md|save_to_knowledge/.test(prompt)) {
        problems.push("mentions a student-agent/moodle-agent leftover");
      }
      for (const [name, { text, when, loose }] of Object.entries(SECTIONS)) {
        const expected = Boolean(when(config));
        const present = prompt.includes(text);
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
// The chat opens from the knowledge base: its opening message must not send it to Moodle.
const opening = readFileSync(path.join(root, "prompts/messages/chat-opening-teacher.md"), "utf-8");
if (/log into moodle|log in to moodle|enter the given course/i.test(opening)) {
  failures++;
  console.log("FAIL chat opening message still logs into Moodle");
} else {
  console.log("ok   chat opening message greets from the knowledge base, no login");
}
if (failures > 0) {
  console.log(`\n${failures} render(s) failed`);
  process.exit(1);
}
