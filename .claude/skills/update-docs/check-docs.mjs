// Fails if the docs site doesn't document something the code offers, in each of its languages
// (docs/content/ in Spanish, docs/i18n/en/… in English): a skill of plugin/skills/, a command of
// plugin/commands/, a CLI subcommand of src/cli.ts, a key of the workspace config.json, of the
// global config or of agent.draftsLimits. Also fails when a Guía or Avanzado page, or the
// roadmap, has no English version (the SQL tutorial is Spanish only, on purpose). It catches the
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
const LOCALES = { es: "docs/content", en: "docs/i18n/en/docusaurus-plugin-content-docs/current" };
let problems = 0;

// What the code offers.
const skillNames = dirs("plugin/skills");
const commands = fs.readdirSync(path.join(root, "plugin/commands")).filter((f) => f.endsWith(".md")).map((file) => `/miyagi:${file.replace(/\.md$/, "")}`);
const cli = read("src/cli.ts");
const subcommands = [...cli.slice(cli.indexOf("switch (first)")).matchAll(/case "([a-z]+)":/g)].map((m) => `miyagi ${m[1]}`);
// Config keys: WorkspaceConfig (src/workspace.ts), GlobalConfig (src/globalConfig.ts), the drafts limits.
const keysOf = (source, name) => {
  const start = source.indexOf(`export interface ${name}`);
  const body = source.slice(start, source.indexOf("\n}\n", start));
  return [...body.matchAll(/^\s+([a-zA-Z]+)\??:/gm)].map((m) => m[1]);
};
const limits = read("src/drafts/files.ts").match(/DEFAULT_DRAFTS_LIMITS: DraftsLimits = \{([^}]*)\}/)[1];
const configKeys = [
  ...keysOf(read("src/workspace.ts"), "WorkspaceConfig").filter((k) => k !== "role"),
  ...keysOf(read("src/globalConfig.ts"), "GlobalConfig"),
  ...[...limits.matchAll(/([a-zA-Z]+):/g)].map((m) => m[1]),
];

for (const [locale, base] of Object.entries(LOCALES)) {
  const page = (p) => {
    const file = path.join(base, p);
    if (!fs.existsSync(path.join(root, file))) {
      console.log(`${file}: missing page`);
      problems++;
      return "";
    }
    return read(file);
  };
  const expect = (where, text, needle, what) => {
    if (!text.includes(needle)) {
      console.log(`${base}/${where}: doesn't mention ${what} (${needle})`);
      problems++;
    }
  };

  // Skills: every one, by name, in the skills guide.
  const skills = page("guia/habilidades.md");
  for (const name of skillNames) expect("guia/habilidades.md", skills, `\`${name}\``, `the skill ${name}`);

  // Commands: every /miyagi:<name> in the reference and in the chat page; subcommands in the reference.
  const reference = page("guia/referencia.md");
  const chat = page("guia/chat.md");
  for (const command of commands) {
    expect("guia/referencia.md", reference, command, "the command");
    expect("guia/chat.md", chat, command, "the command");
  }
  for (const sub of subcommands) expect("guia/referencia.md", reference, sub, "the subcommand");

  const config = page("avanzado/configuracion.md");
  for (const key of configKeys) expect("avanzado/configuracion.md", config, key, "the config key");

  // Every Guía and Avanzado page, and the roadmap, in each translation too.
  if (locale !== "es") {
    for (const section of ["guia", "avanzado"]) {
      for (const file of fs.readdirSync(path.join(root, LOCALES.es, section)).filter((f) => /\.mdx?$/.test(f))) page(path.join(section, file));
    }
    page("hoja-de-ruta.md");
  }
}

if (problems) {
  console.log(`\n${problems} gap(s) between the code and the docs site: update the pages (update-docs skill).`);
  process.exit(1);
}
console.log("docs: every skill, command, subcommand and config key is documented, in Spanish and English");
