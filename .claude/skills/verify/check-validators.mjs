// Runs the upload validators (GIFT, HTML) on fixtures with a known answer: real files from
// sandbox tests, the GIFT whose indentation Moodle lost (tests/2026-09-28T15-41-draft-testing)
// before and after its fix, and files broken on purpose.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-validators.mjs
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { validateUpload } = await import(pathToFileURL(path.join(root, "dist/uploadGate.js")).href);
const dir = path.join(root, ".claude/skills/verify/fixtures/validators");

// file -> expected errors (each: line and a word of its message) and number of warnings.
const CASES = {
  "loops-original.gift": { errors: [[5, "indentation"], [6, "indentation"], [15, "indentation"]], warnings: 0 },
  "loops-fixed.gift": { errors: [], warnings: 0 },
  "escape-room.gift": { errors: [], warnings: 0 },
  "valid-types.gift": { errors: [], warnings: 0 },
  "three-errors.gift": { errors: [[4, "unescaped"], [9, "no right answer"], [14, "repeated"]], warnings: 0 },
  "other-errors.gift": { errors: [[2, "comma"], [4, "more than one"], [11, "indentation"]], warnings: 0 },
  "page/good.html": { errors: [], warnings: 0 },
  "page/bad.html": { errors: [[1, "viewport"], [5, "falta.png"]], warnings: 2 },
};

let failures = 0;
for (const [file, expected] of Object.entries(CASES)) {
  const result = validateUpload(path.join(dir, file));
  const problems = [];
  if (!result) {
    problems.push("not validated at all");
  } else {
    const got = result.errors.map((e) => `${e.line}: ${e.message}`);
    if (result.errors.length !== expected.errors.length) problems.push(`${result.errors.length} errors, expected ${expected.errors.length}`);
    for (const [line, word] of expected.errors) {
      if (!result.errors.some((e) => e.line === line && e.message.includes(word))) problems.push(`missing error on line ${line} (${word})`);
    }
    if (result.warnings.length !== expected.warnings) problems.push(`${result.warnings.length} warnings, expected ${expected.warnings}`);
    if (problems.length > 0) problems.push(`got: ${got.join(" | ") || "no errors"}`);
  }
  if (problems.length > 0) {
    failures++;
    console.log(`FAIL ${file}: ${problems.join("; ")}`);
  }
}
if (validateUpload(path.join(dir, "..", "..", "SKILL.md")) !== null) {
  failures++;
  console.log("FAIL a file that isn't GIFT or HTML should pass untouched");
}
// The gate itself: the hook denies the broken upload with its lines, lets the fixed one through.
const { installUploadGate } = await import(pathToFileURL(path.join(root, "dist/uploadGate.js")).href);
const options = {};
installUploadGate(options);
const hook = options.hooks.PreToolUse[0].hooks[0];
const upload = (file) => hook({ tool_name: "mcp__playwright__browser_file_upload", tool_input: { paths: [path.join(dir, file)] } });
const denied = (await upload("loops-original.gift")).hookSpecificOutput;
if (denied?.permissionDecision !== "deny" || !/line 5:/.test(denied.permissionDecisionReason)) {
  failures++;
  console.log("FAIL the gate should deny loops-original.gift, citing line 5");
}
if ((await upload("loops-fixed.gift")).hookSpecificOutput) {
  failures++;
  console.log("FAIL the gate should let loops-fixed.gift through untouched");
}
const warned = (await upload("page/good.html")).hookSpecificOutput;
if (warned) {
  failures++;
  console.log("FAIL good.html has nothing to report");
}
if (failures > 0) {
  console.log(`\n${failures} validator case(s) failed`);
  process.exit(1);
}
console.log(`ok   ${Object.keys(CASES).length} GIFT/HTML files validated as expected`);
