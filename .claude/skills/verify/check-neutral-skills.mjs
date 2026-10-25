// miyagi's skills and commands say the teaching act, never the platform (ADR-021) nor a country's
// education law (ADR-025): the classroom extension says how it's done in Moodle, and the norms
// come from the teacher's sources. Fails if a file in plugin/skills/ or plugin/commands/ names Moodle, a Moodle URL, a
// moodle-mcp tool, a browser action or a country's education framework.
// Usage (from the repo root): node .claude/skills/verify/check-neutral-skills.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
// The knowledge base page `course/moodle-capabilities` is a name, not a platform instruction.
const ALLOWED = /course\/moodle-capabilities/g;
const FORBIDDEN = [
  [/moodle/i, "names Moodle"],
  [/\.php\b/, "a Moodle URL"],
  [/\b(mcp__moodle__|get_course_structure|grade_submission|import_questions|create_activity)\b/, "a moodle-mcp tool"],
  [/\bbrowser_[a-z_]+|\bsnapshot\b|\bTinyMCE\b|Switch role to/i, "a browser action"],
  [/\b(BOE|LOMLOE|Real Decreto|bolet[ií]n|situaci[oó]n de aprendizaje|intermodular|ESO|Bachillerato|RA\d|CE\d+[a-z]\b)/, "a country's education framework"],
];

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? files(full) : full.endsWith(".md") ? [full] : [];
  });
}

let failures = 0;
const checked = [...files(path.join(root, "plugin", "skills")), ...files(path.join(root, "plugin", "commands"))];
for (const file of checked) {
  const lines = readFileSync(file, "utf-8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const text = line.replace(ALLOWED, "");
    for (const [re, what] of FORBIDDEN) {
      if (re.test(text)) {
        failures++;
        console.log(`FAIL ${path.relative(root, file)}:${i + 1} ${what}: ${line.trim().slice(0, 100)}`);
      }
    }
  });
}
if (failures > 0) {
  console.log(`\n${failures} platform or country mention(s) in miyagi's skills: say the teaching act; the platform is the extension's, a country's law the teacher's sources`);
  process.exit(1);
}
console.log(`ok   ${checked.length} skill and command files name no platform nor country`);
