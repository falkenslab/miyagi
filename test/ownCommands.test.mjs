// Unit tests of the teacher's own commands (#68), on the built code in dist/: what can't be saved,
// the templates, the two scopes, and the gate that saves only after the teacher's yes. Its home is
// a temporary folder. Run with `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readdirSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const home = mkdtempSync(path.join(os.tmpdir(), "miyagi-own-home-"));
process.env.HOME = home;
process.env.USERPROFILE = home;
const { argumentsLine, listOwn, readParameters, saveOwn, templatesDir, validateCommand } = await import("../dist/ownCommands.js");
const { listCommands } = await import("../dist/catalog.js");
const { installCommandsGate } = await import("../dist/commandsServer.js");

const command = (extra = "", body = "Make it. The values: $ARGUMENTS") =>
  `---\ndescription: A word search\nlabel: es=Sopa de letras | en=Word search\n${extra}parameters:\n  - name: topic\n    type: topic\n    required: true\n---\n\n${body}\n`;

test("every template is a valid command, with its form", () => {
  const files = readdirSync(templatesDir);
  assert.equal(files.length, 5);
  for (const file of files) {
    const markdown = readFileSync(path.join(templatesDir, file), "utf-8");
    assert.deepEqual(validateCommand(path.basename(file, ".md"), markdown), [], file);
  }
});

test("what would make a command more than instructions is refused", () => {
  assert.deepEqual(validateCommand("sopa", command()), []);
  assert.match(validateCommand("sopa", command("allowed-tools: Bash\n")).join(), /allowed-tools/);
  assert.match(validateCommand("sopa", command("", "Run !`ls` with $ARGUMENTS")).join(), /shell/);
  assert.match(validateCommand("sopa", command("", "Read @~/.ssh/id_rsa and $ARGUMENTS")).join(), /@path/);
  assert.match(validateCommand("sopa", command("", "No values here")).join(), /\$ARGUMENTS/);
  assert.match(validateCommand("help", command()).join(), /own names/);
  assert.match(validateCommand("Sopa Letras", command()).join(), /kebab-case/);
  assert.match(validateCommand("sopa", "Just instructions").join(), /frontmatter/);
});

test("parameters: names, types, choices and ranges", () => {
  assert.deepEqual(readParameters([{ name: "count", type: "number", default: 10, min: 4, max: 20, label: "es=Número | en=Number" }]).errors, []);
  assert.match(readParameters([{ name: "Count" }]).errors.join(), /lowercase/);
  assert.match(readParameters([{ name: "a" }, { name: "a" }]).errors.join(), /repeated/);
  assert.match(readParameters([{ name: "kind", type: "choice" }]).errors.join(), /options/);
  assert.match(readParameters([{ name: "n", type: "number", min: 5, max: 1 }]).errors.join(), /min/);
  assert.match(readParameters([{ name: "n", type: "color" }]).errors.join(), /type/);
  // The form's newer fields (#107): a date, several options, an activity, a file, and show-if.
  assert.deepEqual(readParameters([{ name: "d", type: "date", default: "2027-01-15" }, { name: "m", type: "multichoice", options: ["a", "b"] }, { name: "x", type: "activity" }, { name: "f", type: "file" }]).errors, []);
  assert.match(readParameters([{ name: "d", type: "date", default: "15/01" }]).errors.join(), /YYYY-MM-DD/);
  assert.match(readParameters([{ name: "m", type: "multichoice" }]).errors.join(), /options/);
  assert.deepEqual(readParameters([{ name: "tone", type: "choice", options: ["kind", "firm"] }, { name: "why", "show-if": "tone=firm" }]).parameters[1].showIf, { name: "tone", value: "firm" });
  assert.match(readParameters([{ name: "why", "show-if": "later=yes" }, { name: "later" }]).errors.join(), /earlier/);
  assert.equal(argumentsLine({ topic: "UT3  Modelo ER", count: "10", words: "" }), "topic: UT3 Modelo ER; count: 10");
});

test("saved for this subject or for all, it's in the catalog with its form", async () => {
  const subject = mkdtempSync(path.join(os.tmpdir(), "miyagi-own-subject-"));
  assert.equal(await saveOwn(subject, "subject", "sopa", command()), "/sopa");
  assert.equal(await saveOwn(subject, "all", "tarjetas", command()), "/own:tarjetas");
  assert.ok(existsSync(path.join(home, ".miyagi", "own", ".claude-plugin", "plugin.json")));
  await assert.rejects(saveOwn(subject, "subject", "mala", command("allowed-tools: Bash\n")), /allowed-tools/);
  const other = mkdtempSync(path.join(os.tmpdir(), "miyagi-own-other-"));
  const names = (await listCommands(other)).map((entry) => entry.name);
  assert.ok(names.includes("/own:tarjetas") && !names.includes("/sopa"), "the command for all subjects shows in another one");
  const own = (await listCommands(subject)).find((entry) => entry.name === "/sopa");
  assert.equal(own.action.label.es, "Sopa de letras");
  assert.equal(own.action.parameters[0].type, "topic");
  assert.equal((await listOwn(subject)).templates.length, 5);
});

test("commands_save runs only right after an approval that names the command", async () => {
  const options = {};
  installCommandsGate(options, "Approved by the human. You may continue.");
  const [pre] = options.hooks.PreToolUse[0].hooks;
  const [post] = options.hooks.PostToolUse[0].hooks;
  const save = (name) => pre({ tool_name: "mcp__commands__commands_save", tool_input: { name } });
  const denied = async (name) => (await save(name)).hookSpecificOutput?.permissionDecision === "deny";
  const approval = async (summary, yes) => {
    await pre({ tool_name: "mcp__approvals__request_human_approval", tool_input: { summary } });
    await post({ tool_name: "mcp__approvals__request_human_approval", tool_response: [{ type: "text", text: yes ? "Approved by the human. You may continue." : "Rejected by the human." }] });
  };
  assert.ok(await denied("sopa"), "without an approval");
  await approval("Guardar el comando sopa (Sopa de letras) en esta asignatura", false);
  assert.ok(await denied("sopa"), "after a no");
  await approval("Guardar el comando sopa (Sopa de letras) en esta asignatura", true);
  assert.ok(await denied("tarjetas"), "an approval for another command");
  await approval("Guardar el comando sopa (Sopa de letras) en esta asignatura", true);
  assert.ok(!(await denied("sopa")), "right after its yes");
  assert.ok(await denied("sopa"), "one yes, one save");
});
