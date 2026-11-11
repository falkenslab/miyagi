import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { knowledgePluginRoot, type InstalledExtension } from "@falkenslab/agent-kit";
import { enabledExtensions } from "./extensions.js";
import { splitFrontmatter } from "./materials/frontmatter.js";
import { commandsDirFor, itemKind, OWN_PLUGIN, perLanguage, readParameters, type Parameter } from "./ownCommands.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginDir = path.join(__dirname, "..", "plugin");

/** Namespace the SDK gives the plugin's slash commands (`/miyagi:grade`). */
const PLUGIN_NAMESPACE = "miyagi";

/** agent-kit's built-in knowledge base plugin (skills knowledge-*, commands `/knowledge:ingest`, `/knowledge:query`, `/knowledge:lint`), loaded into every session with a knowledge base. */
const kitKnowledgeDir = knowledgePluginRoot();
const KIT_KNOWLEDGE_NAMESPACE = "knowledge";

export interface CatalogEntry {
  name: string;
  description?: string;
  origin: "builtin" | "custom" | "extension";
  /** The extension it comes from, for `origin: "extension"`. */
  extension?: string;
  /** How the page offers a command as an action (#67), from its frontmatter. */
  action?: ActionMeta;
  /** Its file, for a command (to read its instructions, #106). */
  file?: string;
}

/** Where a command's action goes in the page and what it asks for (contextual-actions #67). */
export interface ActionMeta {
  /** Its name per language (`es`, `en`, `fr`, `de`), or `*` for one name in every language. */
  label: Record<string, string>;
  icon?: string;
  group?: string;
  needsClassroom?: boolean;
  /** The items whose menu offers it: topic, material, quiz, source, page, plan, draft, text. */
  appliesTo: string[];
  /** The question it asks, per language, when launched without a value. */
  ask?: Record<string, string>;
  /** Offered in an empty conversation. */
  suggest?: boolean;
  /** A knowledge page the page opens instead of sending the command (no agent turn). */
  opens?: string;
  /** An own command's values, asked in a form (teacher-commands #68). */
  parameters?: Parameter[];
  /** What it makes: html-activity, quiz, document, page. */
  produces?: string;
}

/** A command's action metadata, or none when its frontmatter has no `label`. */
function actionMeta(markdown: string): ActionMeta | undefined {
  // YAML first (parameters are a list); a frontmatter that isn't valid YAML, by its lines.
  const split = splitFrontmatter(markdown);
  const data: Record<string, unknown> = split.error ? Object.fromEntries(["label", "icon", "group", "needs-classroom", "applies-to", "ask", "suggest", "opens", "produces"].map((key) => [key, frontmatterField(markdown, key)])) : split.data;
  const label = perLanguage(data.label);
  if (!label) return undefined;
  const text = (key: string) => (typeof data[key] === "string" ? (data[key] as string).trim() || undefined : undefined);
  const yes = (key: string) => data[key] === true || data[key] === "true";
  const { parameters } = readParameters(data.parameters);
  return {
    label,
    icon: text("icon"),
    group: text("group"),
    needsClassroom: yes("needs-classroom"),
    appliesTo: (text("applies-to") ?? "").split(",").map((one) => itemKind(one.trim())).filter(Boolean),
    ask: perLanguage(data.ask),
    suggest: yes("suggest"),
    opens: text("opens"),
    ...(parameters.length ? { parameters } : {}),
    ...(text("produces") ? { produces: text("produces") } : {}),
  };
}

/** The kit's knowledge commands, whose files aren't miyagi's: their action metadata here. */
const KIT_ACTIONS: Record<string, ActionMeta> = {
  ingest: {
    label: { es: "Incorporar mis documentos", en: "Take in my documents", fr: "Intégrer mes documents", de: "Meine Dokumente aufnehmen" },
    icon: "📥",
    group: "memory",
    appliesTo: ["source"],
    suggest: true,
  },
  lint: {
    label: { es: "Revisar su memoria", en: "Check its memory", fr: "Vérifier sa mémoire", de: "Gedächtnis prüfen" },
    icon: "🩺",
    group: "memory",
    appliesTo: [],
  },
  query: {
    label: { es: "Consultar su memoria", en: "Ask its memory", fr: "Interroger sa mémoire", de: "Gedächtnis befragen" },
    icon: "💭",
    group: "memory",
    appliesTo: [],
    ask: { es: "¿Qué quieres saber?", en: "What do you want to know?", fr: "Que veux-tu savoir ?", de: "Was möchtest du wissen?" },
  },
};

/** Reads `key:` from a markdown file's leading `---` frontmatter block — single-line values only. */
function frontmatterField(markdown: string, key: string): string | undefined {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown);
  if (!match) return undefined;
  const line = match[1].split(/\r?\n/).find((l) => l.startsWith(`${key}:`));
  return line?.slice(key.length + 1).trim() || undefined;
}

async function listDirs(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    return [];
  }
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => e.name).sort();
  } catch {
    return [];
  }
}

async function readSkills(skillsDir: string, origin: CatalogEntry["origin"]): Promise<CatalogEntry[]> {
  const entries: CatalogEntry[] = [];
  for (const dirName of await listDirs(skillsDir)) {
    let markdown: string;
    try {
      markdown = await readFile(path.join(skillsDir, dirName, "SKILL.md"), "utf-8");
    } catch {
      continue;
    }
    entries.push({
      name: frontmatterField(markdown, "name") ?? dirName,
      description: frontmatterField(markdown, "description"),
      origin,
    });
  }
  return entries;
}

async function readCommands(commandsDir: string, origin: CatalogEntry["origin"], prefix: string, actions: Record<string, ActionMeta> = {}): Promise<CatalogEntry[]> {
  const entries: CatalogEntry[] = [];
  for (const fileName of await listMarkdownFiles(commandsDir)) {
    const markdown = await readFile(path.join(commandsDir, fileName), "utf-8");
    const base = path.basename(fileName, ".md");
    entries.push({
      name: `/${prefix}${base}`,
      description: frontmatterField(markdown, "description"),
      origin,
      action: actionMeta(markdown) ?? actions[base],
      file: path.join(commandsDir, fileName),
    });
  }
  return entries;
}

/** Built-in skills plus the workspace's own under `<workspace>/.claude/skills/`. */
export async function listSkills(workspaceDir: string): Promise<CatalogEntry[]> {
  return [
    ...(await readSkills(path.join(pluginDir, "skills"), "builtin")),
    ...(await readSkills(path.join(kitKnowledgeDir, "skills"), "builtin")),
    ...(await readSkills(path.join(workspaceDir, ".claude", "skills"), "custom")),
    ...(await extensionEntries(workspaceDir, (ext) => readSkills(path.join(ext.dir, "skills"), "extension"), (ext, s) => `${ext.manifest!.name}:${s.name}`)),
  ];
}

/**
 * The skills a session offers (agent-kit's `AgentSpec.skills`): this plugin's, as
 * `miyagi:<name>`, and the workspace's own. The kit adds the knowledge base's. Leaves
 * out the SDK's own (pdf, docx…), which run scripts through a shell the main agent doesn't
 * have, and which cost context on every turn.
 */
export async function sessionSkills(workspaceDir: string): Promise<string[]> {
  return [
    ...(await readSkills(path.join(pluginDir, "skills"), "builtin")).map((s) => `${PLUGIN_NAMESPACE}:${s.name}`),
    ...(await readSkills(path.join(workspaceDir, ".claude", "skills"), "custom")).map((s) => s.name),
  ];
}

/** Built-in slash commands plus the workspace's own under `<workspace>/.claude/commands/` and the teacher's for all subjects. */
export async function listCommands(workspaceDir: string): Promise<CatalogEntry[]> {
  return [
    ...(await readCommands(path.join(pluginDir, "commands"), "builtin", `${PLUGIN_NAMESPACE}:`)),
    ...(await readCommands(path.join(kitKnowledgeDir, "commands"), "builtin", `${KIT_KNOWLEDGE_NAMESPACE}:`, KIT_ACTIONS)),
    ...(await readCommands(path.join(workspaceDir, ".claude", "commands"), "custom", "")),
    // The teacher's commands for all their subjects (#68), as the session loads them: `/own:<name>`.
    ...(await readCommands(commandsDirFor("all", workspaceDir), "custom", `${OWN_PLUGIN}:`)),
    ...(await extensionEntries(workspaceDir, (ext) => readCommands(path.join(ext.dir, "commands"), "extension", `${ext.manifest!.name}:`), (_ext, c) => c.name)),
  ];
}

/** One extension's skills or commands, tagged with it; the kit offers them in the session by itself. */
async function extensionEntries(
  workspaceDir: string,
  read: (ext: InstalledExtension) => Promise<CatalogEntry[]>,
  name: (ext: InstalledExtension, entry: CatalogEntry) => string,
): Promise<CatalogEntry[]> {
  const entries: CatalogEntry[] = [];
  for (const ext of await enabledExtensions(workspaceDir)) {
    for (const entry of await read(ext)) entries.push({ ...entry, name: name(ext, entry), extension: ext.manifest!.name });
  }
  return entries;
}
