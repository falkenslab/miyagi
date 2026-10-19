// Checks the publish gate's isPublishAction() on moodle-teacher's tools, and the gate itself.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-publish-gate.mjs
import path from "node:path";
import { pathToFileURL } from "node:url";

const { isPublishAction } = await import(pathToFileURL(path.join(process.cwd(), "dist/publishGate.js")).href);

const mt = (tool) => `mcp__moodle__${tool}`;

// [tool, publishes?] — moodle-teacher's tools (ADR-021): reading and signing in never ask,
// anything else publishes or changes the course; miyagi's own tools never do.
const CASES = [
  [mt("get_course_structure"), false],
  [mt("get_submissions"), false],
  [mt("list_assignments"), false],
  [mt("list_discussions"), false],
  [mt("browser_snapshot"), false],
  [mt("login"), false],
  [mt("use_site"), false],
  [mt("grade_submission"), true],
  [mt("create_activity"), true],
  [mt("update_activity"), true],
  [mt("import_questions"), true],
  [mt("create_discussion"), true],
  [mt("set_rubric"), true],
  [mt("browser_click"), true],
  [mt("delete_activity"), true],
  ["mcp__approvals__request_human_approval", false],
  ["mcp__drafts__drafts_zip", false],
  ["Write", false],
];

let failures = 0;
for (const [tool, expected] of CASES) {
  const got = isPublishAction(tool);
  if (got !== expected) {
    failures++;
    console.log(`FAIL ${tool} → ${got}, expected ${expected}`);
  }
}
console.log(failures === 0 ? `ok   ${CASES.length} tool calls classified as expected` : `${failures} of ${CASES.length} misclassified`);

// The gate itself, with a fake interaction port answering for the teacher: the case a real
// session can't reproduce on demand (the model publishing without asking first).
const { installPublishGate } = await import(pathToFileURL(path.join(process.cwd(), "dist/publishGate.js")).href);
const { setInteractionPort, createModeControl } = await import("@falkenslab/agent-kit");
const fs = await import("node:fs");
const os = await import("node:os");

const APPROVED = "Approved by the human. You may continue.";
const APPROVAL = "mcp__approvals__request_human_approval";
let asked = 0;
let nextAnswer = "n";
setInteractionPort({ askDecision: async () => (asked++, nextAnswer), askManualIntervention: async () => "", notify() {} });

function gate(initialMode) {
  const runDir = fs.mkdtempSync(path.join(os.tmpdir(), "publish-gate-"));
  const mode = createModeControl(initialMode);
  const options = { hooks: {} };
  installPublishGate(options, runDir, mode, APPROVED);
  const run = (event, input) => options.hooks[event].at(-1).hooks[0]({ hook_event_name: event, ...input }, undefined, { signal: new AbortController().signal });
  return {
    mode,
    save: (extra = {}) => run("PreToolUse", { tool_name: mt("grade_submission"), tool_input: { assignment: 3, grade: 8 }, ...extra }),
    remove: () => run("PreToolUse", { tool_name: mt("delete_activity"), tool_input: { cmid: 9 } }),
    look: () => run("PreToolUse", { tool_name: mt("get_course_structure"), tool_input: { courseId: 2 } }),
    ask: () => run("PreToolUse", { tool_name: APPROVAL, tool_input: { summary: "…" } }),
    answered: (text) => run("PostToolUse", { tool_name: APPROVAL, tool_response: { content: [{ type: "text", text }] } }),
    message: () => run("UserPromptSubmit", { prompt: "…" }),
  };
}
const decision = (out) => (out.continue === false ? "stop" : out.hookSpecificOutput?.permissionDecision ?? "none");

const SCENARIOS = [
  ["no approval, teacher rejects → denied", async () => { const g = gate("guided"); nextAnswer = "n"; return [decision(await g.save()), 1]; }, "deny"],
  ["no approval, teacher approves → allowed", async () => { const g = gate("guided"); nextAnswer = "y"; return [decision(await g.save()), 1]; }, "allow"],
  ["no approval, teacher stops → session stops", async () => { const g = gate("guided"); nextAnswer = "q"; return [decision(await g.save()), 1]; }, "stop"],
  ["a read that doesn't publish → not asked", async () => { const g = gate("guided"); return [decision(await g.look()), 0]; }, "none"],
  ["approved batch: three saves → not asked", async () => {
    const g = gate("guided"); await g.ask(); await g.answered(APPROVED);
    const out = [await g.save(), await g.save(), await g.save()].map(decision);
    return [out.every((d) => d === "none") ? "none" : out.join(","), 0];
  }, "none"],
  ["approved batch: a deletion → still asked", async () => {
    const g = gate("guided"); await g.ask(); await g.answered(APPROVED); nextAnswer = "n";
    return [decision(await g.remove()), 1];
  }, "deny"],
  ["rejected approval → next save asked", async () => { const g = gate("guided"); nextAnswer = "n"; await g.ask(); await g.answered("Rejected by the human."); return [decision(await g.save()), 1]; }, "deny"],
  ["approval, then a new request → the old one no longer counts", async () => { const g = gate("guided"); nextAnswer = "n"; await g.ask(); await g.answered(APPROVED); await g.ask(); return [decision(await g.save()), 1]; }, "deny"],
  ["approval, then a teacher message → no longer counts", async () => { const g = gate("guided"); nextAnswer = "n"; await g.ask(); await g.answered(APPROVED); await g.message(); return [decision(await g.save()), 1]; }, "deny"],
  ["interactive (the step gate asks) → not asked", async () => { const g = gate("guided"); g.mode.set("interactive"); return [decision(await g.save()), 0]; }, "none"],
  ["back to guided after Shift+Tab → asked", async () => { const g = gate("guided"); g.mode.set("interactive"); g.mode.set("guided"); nextAnswer = "n"; return [decision(await g.save()), 1]; }, "deny"],
  ["autonomous → not asked", async () => { const g = gate("autonomous"); return [decision(await g.save()), 0]; }, "none"],
  ["a subagent's call → not asked", async () => { const g = gate("guided"); return [decision(await g.save({ agent_id: "a1" })), 0]; }, "none"],
];

let gateFailures = 0;
for (const [name, run, expected] of SCENARIOS) {
  asked = 0;
  const [got, expectedAsks] = await run();
  if (got !== expected || asked !== expectedAsks) {
    gateFailures++;
    console.log(`FAIL ${name}: ${got} (asked ${asked}), expected ${expected} (asked ${expectedAsks})`);
  }
}
setInteractionPort(null);
console.log(gateFailures === 0 ? `ok   ${SCENARIOS.length} gate scenarios behave as expected` : `${gateFailures} of ${SCENARIOS.length} gate scenarios failed`);
process.exitCode = failures === 0 && gateFailures === 0 ? 0 : 1;
