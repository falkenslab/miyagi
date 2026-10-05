// Fails if the docs site (docs/content/) doesn't document something the code offers: a skill
// of plugin/skills/, a command of plugin/commands/, a CLI subcommand of src/cli.ts, a key of
// the workspace config.json, of the global config or of agent.draftsLimits. It catches the
// drift a new or renamed thing leaves behind; what a page *says* about it is the update-docs
// skill's job.
// Usage (from the repo root): node .claude/skills/update-docs/check-docs.mjs
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
// Line endings normalized: with core.autocrlf a checkout may be CRLF, and keysOf() looks for
// the interface's closing brace on a line of its own.
const read = (p) => fs.readFileSync(path.join(root, p), "utf8").replace(/\r\n/g, "\n");
const dirs = (p) => fs.readdirSync(path.join(root, p), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const page = (p) => {
  const file = path.join("docs/content", p);
  if (!fs.existsSync(path.join(root, file))) {
    console.log(`${file}: missing page`);
    problems++;
    return "";
  }
  return read(file);
};
let problems = 0;
const expect = (where, text, needle, what) => {
  if (!text.includes(needle)) {
    console.log(`docs/content/${where}: doesn't mention ${what} (${needle})`);
    problems++;
  }
};

// Skills: every one, by name, in the skills guide.
const skills = page("guia/habilidades.md");
for (const name of dirs("plugin/skills")) expect("guia/habilidades.md", skills, `\`${name}\``, `the skill ${name}`);

// Commands: every /miyagi:<name> in the reference and in the chat page.
const reference = page("guia/referencia.md");
const chat = page("guia/chat.md");
for (const file of fs.readdirSync(path.join(root, "plugin/commands")).filter((f) => f.endsWith(".md"))) {
  const command = `/miyagi:${file.replace(/\.md$/, "")}`;
  expect("guia/referencia.md", reference, command, "the command");
  expect("guia/chat.md", chat, command, "the command");
}

// CLI subcommands: the cases of main()'s switch in src/cli.ts.
const cli = read("src/cli.ts");
const main = cli.slice(cli.indexOf("switch (first)"));
for (const [, sub] of main.matchAll(/case "([a-z]+)":/g)) expect("guia/referencia.md", reference, `miyagi ${sub}`, "the subcommand");

// Config keys: WorkspaceConfig (src/workspace.ts), GlobalConfig (src/globalConfig.ts), the drafts limits.
const keysOf = (source, name) => {
  const start = source.indexOf(`export interface ${name}`);
  const body = source.slice(start, source.indexOf("\n}\n", start));
  return [...body.matchAll(/^\s+([a-zA-Z]+)\??:/gm)].map((m) => m[1]);
};
const config = page("avanzado/configuracion.md");
const workspaceKeys = keysOf(read("src/workspace.ts"), "WorkspaceConfig").filter((k) => k !== "role");
const globalKeys = keysOf(read("src/globalConfig.ts"), "GlobalConfig");
const limits = read("src/drafts/files.ts").match(/DEFAULT_DRAFTS_LIMITS: DraftsLimits = \{([^}]*)\}/)[1];
const limitKeys = [...limits.matchAll(/([a-zA-Z]+):/g)].map((m) => m[1]);
for (const key of [...workspaceKeys, ...globalKeys, ...limitKeys]) expect("avanzado/configuracion.md", config, key, "the config key");

if (problems) {
  console.log(`\n${problems} gap(s) between the code and the docs site: update the pages (update-docs skill).`);
  process.exit(1);
}
console.log("docs: every skill, command, subcommand and config key is documented");
