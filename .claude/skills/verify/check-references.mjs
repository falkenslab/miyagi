// Fails if a skill, command or prompt names a skill or subagent that doesn't exist - the
// kind of dangling reference a merge or rename leaves behind.
// Usage (from the repo root): node .claude/skills/verify/check-references.mjs
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dirs = (p) => fs.readdirSync(path.join(root, p), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const files = (p) => fs.readdirSync(path.join(root, p), { recursive: true }).map((f) => path.join(p, f)).filter((f) => f.endsWith(".md"));

const skills = new Set(dirs("plugin/skills"));
const known = new Set([
  ...skills,
  ...dirs(".claude/skills"),
  "knowledge-ingest", "knowledge-pages", "knowledge-query", "knowledge-lint", // agent-kit's plugin
  "practice-runner", "pedagogy-reviewer", "researcher", // subagents
]);
// Backticked names that look like a skill but aren't one: repos, courses, other projects' skills.
const notSkills = new Set(["student-agent", "moodle-agent", "moodle-sandbox-troubleshooting", "sandbox-course", "docker-intro", "datos-web"]);

let problems = 0;
for (const file of [...files("plugin"), ...files("prompts")]) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const [, name] of text.matchAll(/`([a-z]+(?:-[a-z]+)+)`/g)) {
    if (known.has(name) || notSkills.has(name)) continue;
    // Only flag what reads like a reference to a skill.
    if (/(skill|use|apply|with|see|\()/i.test(text.slice(Math.max(0, text.indexOf(`\`${name}\``) - 40), text.indexOf(`\`${name}\``)))) {
      console.log(`${file}: \`${name}\` is not a skill, command or subagent`);
      problems++;
    }
  }
}
for (const cmd of fs.readdirSync(path.join(root, "plugin/commands"))) {
  const text = fs.readFileSync(path.join(root, "plugin/commands", cmd), "utf8");
  for (const [, name] of text.matchAll(/Apply the `([a-z-]+)`/g)) {
    if (!skills.has(name)) { console.log(`plugin/commands/${cmd}: applies missing skill \`${name}\``); problems++; }
  }
}
console.log(problems === 0 ? `ok   ${skills.size} skills, every reference resolves` : `\n${problems} dangling reference(s)`);
process.exit(problems === 0 ? 0 : 1);
