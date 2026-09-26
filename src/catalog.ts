import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { knowledgePluginRoot } from "@falkenslab/agent-kit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginDir = path.join(__dirname, "..", "plugin");

/** Namespace the SDK gives the plugin's slash commands (`/teacher-agent:grade`). */
const PLUGIN_NAMESPACE = "teacher-agent";

/** agent-kit's built-in knowledge base plugin (skills knowledge-*, commands `/knowledge:ingest`, `/knowledge:query`, `/knowledge:lint`), loaded into every session with a knowledge base. */
const kitKnowledgeDir = knowledgePluginRoot();
const KIT_KNOWLEDGE_NAMESPACE = "knowledge";

export interface CatalogEntry {
  name: string;
  description?: string;
  origin: "builtin" | "custom";
}

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

async function readCommands(commandsDir: string, origin: CatalogEntry["origin"], prefix: string): Promise<CatalogEntry[]> {
  const entries: CatalogEntry[] = [];
  for (const fileName of await listMarkdownFiles(commandsDir)) {
    const markdown = await readFile(path.join(commandsDir, fileName), "utf-8");
    entries.push({
      name: `/${prefix}${path.basename(fileName, ".md")}`,
      description: frontmatterField(markdown, "description"),
      origin,
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
  ];
}

/** Built-in slash commands plus the workspace's own under `<workspace>/.claude/commands/`. */
export async function listCommands(workspaceDir: string): Promise<CatalogEntry[]> {
  return [
    ...(await readCommands(path.join(pluginDir, "commands"), "builtin", `${PLUGIN_NAMESPACE}:`)),
    ...(await readCommands(path.join(kitKnowledgeDir, "commands"), "builtin", `${KIT_KNOWLEDGE_NAMESPACE}:`)),
    ...(await readCommands(path.join(workspaceDir, ".claude", "commands"), "custom", "")),
  ];
}
