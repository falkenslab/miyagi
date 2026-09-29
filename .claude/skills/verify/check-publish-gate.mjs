// Checks the publish gate's isPublishAction() against real tool calls from test sessions.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-publish-gate.mjs
import path from "node:path";
import { pathToFileURL } from "node:url";

const { isPublishAction } = await import(pathToFileURL(path.join(process.cwd(), "dist/publishGate.js")).href);

const pw = (tool) => `mcp__playwright__browser_${tool}`;
const click = (element, target = "e1") => [pw("click"), { element, target }];

// [tool, input, publishes?] — taken from the transcripts of tests/2026-09-28T01-10-ink-chat-fullscreen
// and of the chat session that published a File resource without approval (2026-09-28).
const CASES = [
  // Published something students see.
  [...click("Save and display button", "f16e287"), true],
  [...click("Save and display", "#id_submitbutton"), true],
  [...click("Save changes", "button[name=savechanges]"), true],
  [...click("Post to forum", "#id_submitbutton"), true],
  [...click("Hide menu item", "f21e1459"), true],
  [...click("Show on course page option", "f21e1521"), true],
  [...click("Save and show next"), true],
  [...click("Save rubric and make it ready"), true],
  [...click("Botón Guardar cambios y mostrar"), true],
  [...click("Guardar cambios y regresar al curso"), true],
  [...click("Enviar al foro"), true],
  [...click("Opción Mostrar en la página del curso"), true],
  [...click("Ocultar"), true],
  [...click("Duplicar"), true],
  [...click("Ampliar plazo"), true],
  [...click("Importar"), true],
  [...click("Make available"), true],
  [...click("Delete"), true],
  [...click("an element", "getByRole('button', { name: 'Save changes' })"), true],
  [pw("evaluate"), { function: "() => document.querySelector('button[name=savechanges]').click()" }, true],
  [pw("evaluate"), { function: "() => document.getElementById('mform1').requestSubmit()" }, true],
  [pw("evaluate"), { function: "async () => fetch('/lib/ajax/service.php?sesskey=x', { method: 'POST', body: '[]' })" }, true],
  [pw("navigate"), { url: "http://localhost:8081/course/mod.php?sesskey=abc&hide=47" }, true],
  [pw("type"), { element: "Subject textbox", target: "e5", text: "Hola", submit: true }, true],

  // Didn't publish anything.
  [...click("Log in button", "e42"), false],
  [...click("Edit mode checkbox", "f14e16"), false],
  [...click("Botón Insert content in section 'UT6. Proyecto final: mi sitio web'", "f15e1346"), false],
  [...click("Activity or resource menu item", "text=Activity or resource"), false],
  [...click("File activity type link in modal", "getByRole('link', { name: 'File' })"), false],
  [...click("Add button", "Add"), false],
  [...click("Appearance section header (expand)", "f16e211"), false],
  [...click("Edit menu button for the activity (to unhide)", "f21e1258"), false],
  [...click("Availability button (Hidden from students)", "f21e1495"), false],
  [...click("Expand Feedback types", "f7e451"), false],
  [...click("Feedback comments checkbox", "#id_assignfeedback_comments_enabled"), false],
  [...click("View full text button"), false],
  [...click("Botón Reiniciar del editor HTML", "#reset-html"), false],
  [...click("Cancel"), false],
  [...click("Show more"), false],
  [...click("Show parent"), false],
  // Opens the reply form (a false positive in a 2026-09-29 chat, whose panel then timed out).
  [...click("Reply link on Sara Gil's post", "f8e117"), false],
  [...click("Reply to this post"), false],
  [...click("Search forums button"), false],
  [pw("evaluate"), { function: "() => { const ed = tinymce.get('id_assignfeedbackcomments_editor'); ed.setContent('<p>Nota</p>'); ed.save(); return 'ok' }" }, false],
  [pw("evaluate"), { function: "async () => { const r = await fetch('/mod/forum/discuss.php?d=7'); return (await r.text()).length }" }, false],
  [pw("evaluate"), { function: "() => document.body.innerText.slice(0,5000)" }, false],
  [pw("navigate"), { url: "http://localhost:8081/mod/assign/view.php?id=47&action=grader&userid=5" }, false],
  [pw("type"), { element: "Name textbox", target: "f16e119", text: "Reto de repaso" }, false],
  [pw("type"), { element: "Search box", target: "e9", text: "variables", submit: true }, false],
  // The login, typed with Enter into an unnamed field (a false positive in the draft-testing run).
  [pw("type"), { target: "f1e36", text: "MOODLE_PASSWORD", submit: true }, false],
  [pw("type"), { element: "Password textbox", target: "e36", text: "x", submit: true }, false],
  [pw("type"), { element: "Username or email textbox", target: "e32", text: "profesor", submit: true }, false],
  [pw("fill_form"), { fields: [{ name: "Username", type: "textbox", value: "profesor" }] }, false],
  ["mcp__approvals__request_human_approval", { summary: "Save changes" }, false],
  ["Write", { file_path: "knowledge/log.md", content: "Save and display" }, false],
];

let failures = 0;
for (const [tool, input, expected] of CASES) {
  const got = isPublishAction(tool, input);
  if (got !== expected) {
    failures++;
    console.log(`FAIL ${tool} ${JSON.stringify(input).slice(0, 120)} → ${got}, expected ${expected}`);
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
    save: (extra = {}) => run("PreToolUse", { tool_name: pw("click"), tool_input: { element: "Save and display", target: "e1" }, ...extra }),
    look: () => run("PreToolUse", { tool_name: pw("click"), tool_input: { element: "Expand Feedback types", target: "e2" } }),
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
  ["a click that doesn't publish → not asked", async () => { const g = gate("guided"); return [decision(await g.look()), 0]; }, "none"],
  ["approved batch: three saves → not asked", async () => {
    const g = gate("guided"); await g.ask(); await g.answered(APPROVED);
    const out = [await g.save(), await g.save(), await g.save()].map(decision);
    return [out.every((d) => d === "none") ? "none" : out.join(","), 0];
  }, "none"],
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
