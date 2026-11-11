import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";
import { splitFrontmatter, stringList } from "./materials/frontmatter.js";

/**
 * The teacher's own commands (teacher-commands #68): instructions with the parameters they need,
 * written by talking (the `command-authoring` skill) and launched from the page with a form. A
 * command is instructions, not code: it runs under the same approvals, file scope and gates as
 * any turn. What could make it more than that is refused when it's saved: granting tools
 * (`allowed-tools`), running a shell line (!`…`), pulling a file in (@path).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type CommandScope = "subject" | "all";

/** The plugin that holds the commands for all the teacher's subjects; its commands are `/own:<name>`. */
export const OWN_PLUGIN = "own";

/** `~/.miyagi/own/`: a plugin every session loads, so its commands reach every subject. */
export function ownPluginDir(): string {
  return path.join(os.homedir(), ".miyagi", OWN_PLUGIN);
}

/** Where a scope's commands are. */
export function commandsDirFor(scope: CommandScope, workspaceDir: string): string {
  return scope === "all" ? path.join(ownPluginDir(), "commands") : path.join(workspaceDir, ".claude", "commands");
}

/** The starting templates (word search, crossword…), copied and adapted, never commands themselves. */
export const templatesDir = path.join(__dirname, "..", "plugin", "command-templates");

export const PARAMETER_TYPES = ["text", "number", "choice", "words", "topic", "source", "page"] as const;
export const GROUPS = ["day", "create", "plan", "memory", "classroom"];
export const ITEM_KINDS = ["topic", "material", "quiz", "source", "page", "plan", "draft", "text"];

/** An item kind as a command names it: `oven` is the drafts' old name (#105), still read. */
export const itemKind = (kind: string) => (kind === "oven" ? "draft" : kind);
export const PRODUCES = ["html-activity", "quiz", "document", "page"];

/** Claude Code's and the kit's own commands, and miyagi's namespaces: a subject's command can't take these names. */
const RESERVED = new Set(["help", "clear", "compact", "config", "plan", "resume", "extensions", "model", "init", "review", "agents", "batch", "miyagi", "knowledge", OWN_PLUGIN]);

export interface Parameter {
  name: string;
  /** Per language, or `{ "*": … }` for one in every language. */
  label: Record<string, string>;
  type: (typeof PARAMETER_TYPES)[number];
  required: boolean;
  default?: string | number;
  min?: number;
  max?: number;
  options?: string[];
  help?: Record<string, string>;
}

/** `es=… | en=…` as `{ es, en }`; a plain text as `{ "*": text }`. */
export function perLanguage(value: unknown): Record<string, string> | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const pairs = value.split("|").map((part) => /^\s*([a-z]{2})=(.*)$/.exec(part));
  if (pairs.every((match) => match !== null)) return Object.fromEntries(pairs.map((match) => [match![1], match![2].trim()]));
  return { "*": value.trim() };
}

/** A command's parameters as its frontmatter declares them, and what's wrong with them. */
export function readParameters(value: unknown): { parameters: Parameter[]; errors: string[] } {
  const errors: string[] = [];
  if (value === undefined) return { parameters: [], errors };
  if (!Array.isArray(value)) return { parameters: [], errors: ["`parameters` must be a list"] };
  if (value.length > 8) errors.push("at most 8 parameters");
  const parameters: Parameter[] = [];
  const seen = new Set<string>();
  for (const [index, raw] of value.entries()) {
    const where = `parameter ${index + 1}`;
    if (!raw || typeof raw !== "object") {
      errors.push(`${where}: not a parameter`);
      continue;
    }
    const p = raw as Record<string, unknown>;
    const name = typeof p.name === "string" ? p.name : "";
    if (!/^[a-z][a-z0-9_]{0,30}$/.test(name)) errors.push(`${where}: \`name\` must be lowercase letters, digits or _ (got "${String(p.name ?? "")}")`);
    else if (seen.has(name)) errors.push(`${where}: \`${name}\` is repeated`);
    seen.add(name);
    const type = (p.type ?? "text") as Parameter["type"];
    if (!PARAMETER_TYPES.includes(type)) errors.push(`${name || where}: type must be one of ${PARAMETER_TYPES.join(", ")}`);
    const label = perLanguage(p.label) ?? { "*": name };
    const options = Array.isArray(p.options) ? p.options.map(String) : undefined;
    if (type === "choice" && !options?.length) errors.push(`${name}: a choice needs \`options\``);
    const min = typeof p.min === "number" ? p.min : undefined;
    const max = typeof p.max === "number" ? p.max : undefined;
    if (min !== undefined && max !== undefined && min > max) errors.push(`${name}: min is above max`);
    const fallback = typeof p.default === "number" || typeof p.default === "string" ? p.default : undefined;
    if (type === "number" && fallback !== undefined && typeof fallback !== "number") errors.push(`${name}: its default must be a number`);
    if (type === "choice" && fallback !== undefined && !options?.includes(String(fallback))) errors.push(`${name}: its default isn't one of its options`);
    parameters.push({ name, label, type, required: p.required === true, default: fallback, min, max, options, help: perLanguage(p.help) });
  }
  return { parameters, errors };
}

/** The frontmatter keys an own command may carry; anything else is refused (`allowed-tools` above all). */
const KEYS = new Set(["description", "argument-hint", "label", "icon", "group", "needs-classroom", "applies-to", "ask", "suggest", "produces", "parameters"]);

/** What's wrong with an own command, before it's saved: nothing means it can be. */
export function validateCommand(name: string, markdown: string): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 40) errors.push("the name must be kebab-case (letters, digits and hyphens), at most 40 characters");
  if (RESERVED.has(name)) errors.push(`"${name}" is one of miyagi's or Claude Code's own names`);
  if (markdown.length > 20_000) errors.push("too long: at most 20,000 characters");
  const { data, body, error } = splitFrontmatter(markdown);
  if (error) return [...errors, `the frontmatter isn't valid YAML: ${error}`];
  if (!/^---\r?\n/.test(markdown.replace(/^\uFEFF/, ""))) errors.push("it needs a frontmatter block (--- … ---) with at least `description` and `label`");
  for (const key of Object.keys(data)) if (!KEYS.has(key)) errors.push(`\`${key}\` isn't allowed in an own command${key === "allowed-tools" ? ": it would give the command tools beyond the session's" : ""}`);
  if (typeof data.description !== "string" || !data.description.trim()) errors.push("`description` is missing");
  if (!perLanguage(data.label)) errors.push("`label` is missing: the name the teacher sees");
  if (data.group !== undefined && !GROUPS.includes(String(data.group))) errors.push(`\`group\` must be one of ${GROUPS.join(", ")}`);
  for (const kind of typeof data["applies-to"] === "string" ? data["applies-to"].split(",").map((one) => one.trim()) : []) if (!ITEM_KINDS.includes(itemKind(kind))) errors.push(`\`applies-to\`: "${kind}" isn't one of ${ITEM_KINDS.join(", ")}`);
  if (data.produces !== undefined && !PRODUCES.includes(String(data.produces))) errors.push(`\`produces\` must be one of ${PRODUCES.join(", ")}`);
  const { parameters, errors: parameterErrors } = readParameters(data.parameters);
  errors.push(...parameterErrors);
  if (!body.trim()) errors.push("the instructions (after the frontmatter) are empty");
  if (parameters.length && !body.includes("$ARGUMENTS")) errors.push("with parameters, the instructions must say where their values go: $ARGUMENTS");
  if (/!`/.test(body)) errors.push("a line like !`…` would run a shell command: not allowed");
  if (/(^|\s)@[~.\w-]*[\\/]/m.test(body)) errors.push("@path would pull a file into the command: name the file instead, and let the session read it");
  return errors;
}

/** The values from the page's form as the command's line: `name: value` pairs, one line. */
export function argumentsLine(values: Record<string, string>): string {
  return Object.entries(values)
    .filter(([, value]) => value.trim())
    .map(([name, value]) => `${name}: ${value.replace(/\s+/g, " ").trim()}`)
    .join("; ");
}

async function markdownFiles(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir)).filter((file) => file.endsWith(".md")).sort();
  } catch {
    return [];
  }
}

/** The own commands in both scopes, and the templates to start from. */
export async function listOwn(workspaceDir: string) {
  const describe = async (dir: string, file: string) => {
    const { data } = splitFrontmatter(await readFile(path.join(dir, file), "utf-8"));
    return { name: path.basename(file, ".md"), description: typeof data.description === "string" ? data.description : "" };
  };
  const all = async (dir: string) => Promise.all((await markdownFiles(dir)).map((file) => describe(dir, file)));
  return { subject: await all(commandsDirFor("subject", workspaceDir)), all: await all(commandsDirFor("all", workspaceDir)), templates: await all(templatesDir) };
}

/** An own command's file, or a template's. */
export async function readOwn(workspaceDir: string, name: string, from: CommandScope | "template"): Promise<string> {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error("not a command name");
  return readFile(path.join(from === "template" ? templatesDir : commandsDirFor(from, workspaceDir), `${name}.md`), "utf-8");
}

/** Saves an own command once it validates; for all subjects, the plugin that holds them is made the first time. */
export async function saveOwn(workspaceDir: string, scope: CommandScope, name: string, markdown: string): Promise<string> {
  const errors = validateCommand(name, markdown);
  if (errors.length) throw new Error(`the command wasn't saved:\n- ${errors.join("\n- ")}`);
  const dir = commandsDirFor(scope, workspaceDir);
  await mkdir(dir, { recursive: true });
  if (scope === "all") {
    const manifest = path.join(ownPluginDir(), ".claude-plugin", "plugin.json");
    await mkdir(path.dirname(manifest), { recursive: true });
    await writeFile(manifest, JSON.stringify({ name: OWN_PLUGIN, description: "The teacher's own commands, for all their subjects." }, null, 2), { flag: "wx" }).catch(() => {});
  }
  const file = path.join(dir, `${name}.md`);
  await writeFile(file, markdown.replace(/\r\n/g, "\n"), "utf-8");
  return scope === "all" ? `/${OWN_PLUGIN}:${name}` : `/${name}`;
}

/** An own command as the page's editor shows it and sends it back (#78). */
export interface CommandDraft {
  description: string;
  label: Record<string, string>;
  icon?: string;
  group?: string;
  appliesTo: string[];
  parameters: Parameter[];
  instructions: string;
}

/** What the editor doesn't show and a save keeps; anything else, `allowed-tools` above all, doesn't survive one. */
const KEPT_KEYS = ["argument-hint", "needs-classroom", "ask", "suggest", "produces"];

/** `{ es, en }` as `es=… | en=…`, `{ "*": text }` as the text; the empty ones left out. */
function languagePairs(text: Record<string, string> | undefined): string {
  const pairs = Object.entries(text ?? {}).filter(([, value]) => String(value).trim());
  const every = pairs.find(([language]) => language === "*");
  if (every) return every[1].trim();
  return pairs.map(([language, value]) => `${language}=${value.trim().replace(/\|/g, "/")}`).join(" | ");
}

function draftOf(markdown: string): CommandDraft {
  const { data, body } = splitFrontmatter(markdown);
  const text = (key: string) => (typeof data[key] === "string" ? data[key] : undefined);
  return {
    description: text("description") ?? "",
    label: perLanguage(data.label) ?? {},
    icon: text("icon"),
    group: text("group"),
    appliesTo: stringList(data["applies-to"]).map(itemKind),
    parameters: readParameters(data.parameters).parameters,
    instructions: body.trim(),
  };
}

/** A draft as the command's file, with what the editor doesn't show taken from the file it replaces. */
function markdownOf(draft: CommandDraft, previous: string): string {
  const { data } = splitFrontmatter(previous);
  const parameters = (draft.parameters ?? []).map((one) => ({
    name: one.name,
    label: languagePairs(one.label),
    type: one.type,
    ...(one.required ? { required: true } : {}),
    ...(one.default !== undefined ? { default: one.default } : {}),
    ...(one.min !== undefined ? { min: one.min } : {}),
    ...(one.max !== undefined ? { max: one.max } : {}),
    ...(one.options ? { options: one.options } : {}),
    ...(languagePairs(one.help) ? { help: languagePairs(one.help) } : {}),
  }));
  const frontmatter = {
    description: String(draft.description ?? "").trim(),
    label: languagePairs(draft.label),
    ...(draft.icon?.trim() ? { icon: draft.icon.trim() } : {}),
    ...(draft.group ? { group: draft.group } : {}),
    ...(draft.appliesTo?.length ? { "applies-to": draft.appliesTo.join(", ") } : {}),
    ...Object.fromEntries(KEPT_KEYS.filter((key) => data[key] !== undefined).map((key) => [key, data[key]])),
    ...(parameters.length ? { parameters } : {}),
  };
  return `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n${String(draft.instructions ?? "").trim()}\n`;
}

/** The own commands of both scopes, for the page's editor. */
export async function ownCommands(workspaceDir: string) {
  const inScope = async (scope: CommandScope) =>
    Promise.all(
      (await markdownFiles(commandsDirFor(scope, workspaceDir))).map(async (file) => {
        const name = path.basename(file, ".md");
        return { name, scope, command: scope === "all" ? `${OWN_PLUGIN}:${name}` : name, draft: draftOf(await readFile(path.join(commandsDirFor(scope, workspaceDir), file), "utf-8")) };
      }),
    );
  return [...(await inScope("subject")), ...(await inScope("all"))];
}

/** Deletes an own command's file. */
export async function deleteOwn(workspaceDir: string, scope: CommandScope, name: string): Promise<{ errors: string[] }> {
  if (!/^[a-z0-9-]+$/.test(name)) return { errors: ["not a command name"] };
  return unlink(path.join(commandsDirFor(scope, workspaceDir), `${name}.md`)).then(
    () => ({ errors: [] }),
    () => ({ errors: ["that command no longer exists"] }),
  );
}

/** Saves what the editor changed on an existing command, under the same checks as `commands_save`; `previous` is its name before. */
export async function saveDraft(workspaceDir: string, scope: CommandScope, name: string, draft: CommandDraft, previous: string): Promise<{ errors: string[] }> {
  const old = await readOwn(workspaceDir, previous, scope).catch(() => undefined);
  if (old === undefined) return { errors: ["that command no longer exists"] };
  if (name !== previous && /^[a-z0-9-]+$/.test(name) && (await readOwn(workspaceDir, name, scope).catch(() => undefined)) !== undefined) return { errors: [`there's already a command called "${name}"`] };
  const markdown = markdownOf(draft, old);
  const errors = validateCommand(name, markdown);
  if (errors.length) return { errors };
  await saveOwn(workspaceDir, scope, name, markdown);
  if (name !== previous) await deleteOwn(workspaceDir, scope, previous);
  return { errors: [] };
}
