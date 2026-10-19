#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isExitPromptError, runExtensionCommand, ui } from "@falkenslab/agent-kit";
import { runSession } from "./agent.js";
import { listCommands, listSkills, type CatalogEntry } from "./catalog.js";
import { CATALOG_TOPICS, extensionDirsFor, OFFICIAL_MARKETPLACE } from "./extensions.js";
import { globalConfigPath, migrateLegacyGlobalConfig, resolveLanguage } from "./globalConfig.js";
import { connectClassroom, promptConnectClassroom, promptExploreNow, promptInitWorkspace, promptRunKind } from "./menu.js";
import { chooseInterfaceLanguage, t } from "./messages/index.js";
import { applyTeacherTheme } from "./theme.js";
import { interfaceLanguage, readWorkspaceConfig, workspaceExists, workspaceLabel } from "./workspace.js";
import { findWorkspace, forgetWorkspace, listWorkspaces, locateWorkspace, registerWorkspace, withoutWorkspaceFlags, workspaceIds } from "./workspaces.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function printHelp(): void {
  console.log(t().help(globalConfigPath()));
}

async function installedVersion(): Promise<string> {
  const raw = await readFile(path.join(__dirname, "..", "package.json"), "utf-8");
  return (JSON.parse(raw) as { version: string }).version;
}

async function initCommand(args: string[]): Promise<void> {
  // --dir creates it there; without it, in miyagi's own folder (ADR-023).
  const located = await locateWorkspace(args);
  let workspaceDir: string;
  let config;
  if (located && (await workspaceExists(located))) {
    // A workspace without a classroom can connect one later (ADR-013); one with a classroom is done.
    const existing = await readWorkspaceConfig(located);
    workspaceDir = located;
    if (existing.classroom?.connector === "moodle-teacher") {
      // Connected through moodle-teacher: connect it again (installs it, adds the site if missing), then explore.
      config = existing;
      await connectClassroom(workspaceDir, existing.classroom.url);
    } else if (existing.classroom) {
      throw new Error(t().alreadyWorkspace(located));
    } else {
      config = await promptConnectClassroom(workspaceDir, existing);
    }
    await registerWorkspace(workspaceDir, workspaceLabel(workspaceDir, config), config.kind ?? "subject");
  } else {
    ({ dir: workspaceDir, config } = await promptInitWorkspace(located));
  }
  // Exploring needs a Moodle: without a classroom there's nothing to offer.
  if (!config.classroom || !(await promptExploreNow())) return;

  // The workspace already exists at this point: a failed exploration (wrong URL or
  // credentials) shouldn't make "init" itself look failed.
  try {
    await runSession("explore", ["--dir", workspaceDir]);
  } catch (error) {
    if (isExitPromptError(error)) throw error;
    console.log(ui.warn(t().exploreFailed(error instanceof Error ? error.message : String(error))));
  }
}

function printCatalog(title: string, entries: CatalogEntry[]): void {
  console.log(ui.heading(title));
  for (const entry of entries) {
    const origin = ui.dim(entry.origin === "builtin" ? t().catalogBuiltin : entry.origin === "extension" ? t().catalogExtension(entry.extension ?? "") : t().catalogCustom);
    const description = entry.description ? ` — ${entry.description}` : "";
    console.log(`- ${entry.name} ${origin}${description}`);
  }
}

async function skillsCommand(args: string[]): Promise<void> {
  const workspaceDir = (await locateWorkspace(args)) ?? process.cwd();
  printCatalog(t().skillsTitle(workspaceDir), await listSkills(workspaceDir));
}

async function commandsCommand(args: string[]): Promise<void> {
  const workspaceDir = (await locateWorkspace(args)) ?? process.cwd();
  printCatalog(t().commandsTitle(workspaceDir), await listCommands(workspaceDir));
}

/** `miyagi workspaces`: the registered ones; `forget <name>` drops one from the list, never its folder. */
async function workspacesCommand(args: string[]): Promise<void> {
  if (args[0] === "forget") {
    if (!args[1]) throw new Error(t().forgetUsage);
    const found = await findWorkspace(args[1]);
    if (!found) throw new Error(t().workspaceNotFound(args[1], await workspaceIds()));
    await forgetWorkspace(found.id);
    console.log(ui.success(t().workspaceForgotten(found.name, found.dir)));
    return;
  }
  const workspaces = await listWorkspaces();
  if (workspaces.length === 0) {
    console.log(t().workspacesEmpty);
    return;
  }
  console.log(ui.heading(t().workspacesTitle));
  for (const ws of workspaces) {
    const missing = ws.missing ? ` ${ui.warn(t().missingTag)}` : "";
    console.log(`- ${ws.name} ${ui.dim(`(-w ${ws.id}, ${t().kindName(ws.kind)})`)}${missing}\n  ${ui.dim(ws.dir)}`);
  }
}

/**
 * agent-kit's `extension` command (list, add, remove, enable, disable, config, update, search,
 * marketplace…) on the agent's scope and, when --dir, -w or the current directory names a
 * workspace, on its own. Without a workspace, `--project` has nowhere to go and the kit says so.
 */
async function extensionCommand(argv: string[]): Promise<void> {
  const workspaceDir = await locateWorkspace(argv);
  await runExtensionCommand(withoutWorkspaceFlags(argv), {
    dirs: extensionDirsFor(workspaceDir && (await workspaceExists(workspaceDir)) ? workspaceDir : undefined),
    command: "miyagi",
    official: OFFICIAL_MARKETPLACE,
    catalogTopics: CATALOG_TOPICS,
  });
}

/**
 * The process's language, before anything is printed: `--language`, then the workspace's
 * `agent.language`, then the global `defaultLanguage`, then the system's. agent-kit takes the
 * same one, so its texts and miyagi's always agree.
 */
async function chooseLanguage(args: string[]): Promise<void> {
  let workspaceLanguage: string | undefined;
  try {
    const workspaceDir = await locateWorkspace(args);
    if (workspaceDir && (await workspaceExists(workspaceDir))) workspaceLanguage = (await readWorkspaceConfig(workspaceDir)).agent.language;
  } catch {
    // A broken or student config.json, or an unknown -w, is reported by the command itself, in the chosen language.
  }
  const warnings = chooseInterfaceLanguage(interfaceLanguage(await resolveLanguage(workspaceLanguage)));
  for (const warning of warnings) console.error(ui.warn(warning));
}

async function main(): Promise<void> {
  const [first, ...rest] = process.argv.slice(2);
  await chooseLanguage(process.argv.slice(2));
  applyTeacherTheme();
  // Renamed from teacher-agent in 0.10: the old command still works, and the old global config
  // (Claude token, defaults) is carried over once.
  // The old command comes from the teacher-agent bridge package (.claude/skills/release/compat/).
  if (process.env.MIYAGI_LEGACY_COMMAND === "teacher-agent") console.error(ui.warn(t().renamedCommand));
  if (await migrateLegacyGlobalConfig()) console.error(ui.dim(t().globalConfigMigrated(globalConfigPath())));

  switch (first) {
    case "-h":
    case "--help":
      return printHelp();
    case "-v":
    case "--version":
      return console.log(await installedVersion());
    case "init":
      return initCommand(rest);
    case "run":
    case "chat":
    case "ingest":
    case "explore":
      return runSession(first, rest);
    case "skills":
      return skillsCommand(rest);
    case "commands":
      return commandsCommand(rest);
    case "workspaces":
      return workspacesCommand(rest);
    case "extension":
      return extensionCommand(process.argv.slice(2));
    case undefined:
      return runSession(await promptRunKind(), []);
    default:
      // Flags without a subcommand ("miyagi --mode guided") are taken as "run" flags.
      if (first.startsWith("-")) return runSession("run", process.argv.slice(2));
      console.error(ui.error(t().unknownCommand(first)));
      process.exitCode = 1;
  }
}

main().catch((error) => {
  if (isExitPromptError(error)) process.exit(0);
  console.error(ui.error(`miyagi: ${error instanceof Error ? error.message : String(error)}`));
  process.exitCode = 1;
});
