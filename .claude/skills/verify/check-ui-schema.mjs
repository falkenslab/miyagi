// The page's schema (ui-schema #106): schema/ui.schema.json is what src/uiSchema.ts generates
// (`--write` regenerates it), every command in plugin/ and every own-command template names only
// variables the schema has, a bad variable is refused when an own command is checked, and an
// action's context fills its instructions from the item and the form.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-ui-schema.mjs [--write]
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const load = (p) => import(pathToFileURL(path.join(root, "dist", p)).href);
const { uiJsonSchema, checkVariables, renderVariables, fieldsOf } = await load("uiSchema.js");
const { validateCommand } = await load("ownCommands.js");
const { splitFrontmatter } = await load("materials/frontmatter.js");
const { formFromLine } = await load("actionContext.js");

let failures = 0;
const fail = (what) => {
  failures++;
  console.log(`FAIL ${what}`);
};

// The JSON file, current.
const file = path.join(root, "schema", "ui.schema.json");
const generated = `${JSON.stringify(uiJsonSchema(), null, 2)}\n`;
if (process.argv.includes("--write")) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, generated);
  console.log(`wrote ${path.relative(root, file)}`);
} else if (!fs.existsSync(file) || fs.readFileSync(file, "utf-8").replace(/\r\n/g, "\n") !== generated) fail("schema/ui.schema.json isn't current: node .claude/skills/verify/check-ui-schema.mjs --write");

// Every command and template: its {{…}} resolve against the schema.
const commands = [
  ...fs.readdirSync(path.join(root, "plugin", "commands")).map((name) => path.join(root, "plugin", "commands", name)),
  ...fs.readdirSync(path.join(root, "plugin", "command-templates")).map((name) => path.join(root, "plugin", "command-templates", name)),
];
for (const one of commands.filter((name) => name.endsWith(".md"))) {
  const { data, body } = splitFrontmatter(fs.readFileSync(one, "utf-8"));
  const kinds = typeof data["applies-to"] === "string" ? data["applies-to"].split(",").map((kind) => kind.trim()) : [];
  const names = Array.isArray(data.parameters) ? data.parameters.map((p) => p?.name).filter(Boolean) : [];
  for (const error of checkVariables(body, kinds, names)) fail(`${path.relative(root, one)}: ${error}`);
}

// A bad variable is refused, a good one isn't.
const own = (body) => `---\ndescription: Recordar una entrega\nlabel: es=Recordar la entrega\napplies-to: topic\nparameters:\n  - name: tono\n    type: choice\n    options: [amable, firme]\n---\n${body}\n`;
if (!validateCommand("recordar-x", own("Para {{item.dueDate}}, en tono {{form.tono}}.")).some((error) => error.includes("dueDate"))) fail("an unknown item field wasn't refused");
if (!validateCommand("recordar-x", own("En tono {{form.color}}.")).some((error) => error.includes("color"))) fail("an unknown form value wasn't refused");
const good = validateCommand("recordar-x", own("Sobre «{{item.title}}» ({{item.unit}}), en tono {{form.tono}}, hoy {{today}}, en {{subject.name}}."));
if (good.length) fail(`a good command was refused: ${good.join("; ")}`);
if (!fieldsOf("topic").includes("activities.title")) fail("a nested field isn't listed");

// Filled in from the item and the form.
const rendered = renderVariables("«{{item.title}}» ({{item.unit}}) en tono {{form.tono}}; actividades: {{item.activities.title}}; sin valor: {{item.status}}.", {
  item: { title: "Procesos", unit: "T2", activities: [{ id: "a", title: "P1" }, { id: "b", title: "Cuestionario" }] },
  form: formFromLine("tono: firme; dias: 2"),
});
if (rendered !== "«Procesos» (T2) en tono firme; actividades: P1, Cuestionario; sin valor: {{item.status}}.") fail(`rendering: ${rendered}`);

// What the agent gets with an action's line: the item, the form and the instructions filled in.
const { actionContextText } = await load("actionContext.js");
const os = await import("node:os");
const ws = fs.mkdtempSync(path.join(os.tmpdir(), "ui-schema-"));
fs.mkdirSync(path.join(ws, ".claude", "commands"), { recursive: true });
fs.writeFileSync(path.join(ws, ".claude", "commands", "recordar.md"), own("Recuerda «{{item.title}}» en tono {{form.tono}} ($ARGUMENTS)."));
const context = await actionContextText(ws, "Sistemas Operativos", "/recordar tono: firme", { command: "recordar", kind: "topic", item: { title: "Procesos" }, form: { tono: "firme" } });
if (!context?.includes('"title": "Procesos"') || !context.includes("Recuerda «Procesos» en tono firme (tono: firme).")) fail(`action context: ${context}`);
const fromTerminal = await actionContextText(ws, "Sistemas Operativos", "/recordar tono: amable", null);
if (!fromTerminal?.includes("en tono amable") || fromTerminal.includes("was launched on")) fail(`action context from a typed line: ${fromTerminal}`);
if ((await actionContextText(ws, "X", "/miyagi:map", null)) !== null) fail("a command without variables got a context");
fs.rmSync(ws, { recursive: true, force: true });

if (failures > 0) {
  console.log(`\n${failures} page schema check(s) failed`);
  process.exit(1);
}
console.log(`ok   page schema: current, ${commands.length} commands and templates resolve, bad variables refused, rendering`);
