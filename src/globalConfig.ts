import { existsSync } from "node:fs";
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseEnv } from "node:util";
import { ensureClaudeAuth } from "@falkenslab/agent-kit";

/**
 * ~/.miyagi/config.json — the only config not tied to a workspace: the Claude token
 * and per-user defaults for workspaces that don't set their own.
 */
export interface GlobalConfig {
  claudeCodeOAuthToken?: string;
  /** SDK autocompact when the context fills up. On unless set to false here. */
  autoCompactEnabled?: boolean;
  /** Fallback for workspaces with no `agent.headless` of their own. */
  defaultHeadless?: boolean;
  /** Fallback for workspaces with no `agent.language` of their own. */
  defaultLanguage?: string;
}

export function globalConfigPath(): string {
  return path.join(os.homedir(), ".miyagi", "config.json");
}

/** Where it lived while the project was called teacher-agent (before 0.10). */
function legacyGlobalConfigPath(): string {
  return path.join(os.homedir(), ".teacher-agent", "config.json");
}

/**
 * Files outside the workspace that hold a secret the model must never read (ADR-004): the
 * global config and its legacy copy (`claudeCodeOAuthToken`), and the Claude Agent SDK's own
 * credentials. Denied to the file tools in every session, existing or not. Only these files:
 * `~/.miyagi/` and `~/.claude/` also hold things the agent may need to read.
 */
export function secretFilePaths(): string[] {
  return [globalConfigPath(), legacyGlobalConfigPath(), path.join(os.homedir(), ".claude", ".credentials.json")];
}

/**
 * Well-known places outside the workspace that hold other credentials (SSH and cloud keys,
 * git and npm tokens, browser profiles with their cookies and passwords), denied to the
 * file tools too. A stopgap until agent-kit lets Read and Glob be allow-listed
 * (falkenslab/agent-kit#28): a deny-list can't cover student data kept elsewhere nor every
 * spelling of a path, and the kit's Glob doesn't check it yet. All three OSes' paths are
 * listed whatever the OS: a path that doesn't exist denies nothing.
 */
export function sensitivePaths(): string[] {
  const home = os.homedir();
  const appData = process.env.APPDATA ?? path.join(home, "AppData", "Roaming");
  const localAppData = process.env.LOCALAPPDATA ?? path.join(home, "AppData", "Local");
  const macSupport = path.join(home, "Library", "Application Support");
  return [
    // Keys and tokens.
    ...[".ssh", ".aws", ".azure", ".gnupg", ".kube", ".npmrc", ".git-credentials", ".netrc", ".pypirc"].map((p) => path.join(home, p)),
    path.join(home, ".config", "gh"),
    path.join(home, ".docker", "config.json"),
    path.join(home, "Library", "Keychains"),
    // Browser profiles (cookies, saved passwords).
    path.join(localAppData, "Google", "Chrome", "User Data"),
    path.join(localAppData, "Microsoft", "Edge", "User Data"),
    path.join(appData, "Mozilla", "Firefox"),
    path.join(macSupport, "Google", "Chrome"),
    path.join(macSupport, "Microsoft Edge"),
    path.join(macSupport, "Firefox"),
    ...["google-chrome", "chromium", "microsoft-edge"].map((p) => path.join(home, ".config", p)),
    path.join(home, ".mozilla"),
  ];
}

/**
 * Copies ~/.teacher-agent/config.json to ~/.miyagi/config.json the first time, so an upgraded
 * install keeps its Claude token and defaults. Returns whether it copied. The old file stays.
 */
export async function migrateLegacyGlobalConfig(): Promise<boolean> {
  if (existsSync(globalConfigPath()) || !existsSync(legacyGlobalConfigPath())) return false;
  try {
    await writeGlobalConfig(JSON.parse(await readFile(legacyGlobalConfigPath(), "utf-8")) as GlobalConfig);
    return true;
  } catch {
    return false;
  }
}

export async function readGlobalConfig(): Promise<GlobalConfig> {
  try {
    return JSON.parse(await readFile(globalConfigPath(), "utf-8")) as GlobalConfig;
  } catch {
    return {};
  }
}

async function writeGlobalConfig(config: GlobalConfig): Promise<void> {
  const file = globalConfigPath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(config, null, 2), "utf-8");
  // The token is as sensitive as a password. No-op on Windows.
  await chmod(file, 0o600).catch(() => {});
}

/**
 * Loads `<workspace>/.env`, if any, overriding variables already set — so a workspace's own
 * CLAUDE_CODE_OAUTH_TOKEN wins over the environment and over the global config.
 */
export async function loadWorkspaceEnv(workspaceDir: string): Promise<void> {
  let raw: string;
  try {
    raw = await readFile(path.join(workspaceDir, ".env"), "utf-8");
  } catch {
    return;
  }
  Object.assign(process.env, parseEnv(raw));
}

/**
 * agent-kit's ensureClaudeAuth() fed with the token saved globally, and persisting the one
 * it generates (via "claude setup-token") so it isn't asked for again next time.
 */
export async function ensureClaudeAuthPersisted(): Promise<void> {
  const config = await readGlobalConfig();
  const generated = await ensureClaudeAuth({ claudeCodeOAuthToken: config.claudeCodeOAuthToken });
  if (generated) await writeGlobalConfig({ ...config, claudeCodeOAuthToken: generated });
}

/** --headless (if passed), then the workspace's `agent.headless`, then `defaultHeadless`, then false. */
export async function resolveHeadless(cliValue: boolean | undefined, workspaceValue: boolean | undefined): Promise<boolean> {
  if (cliValue !== undefined) return cliValue;
  if (workspaceValue !== undefined) return workspaceValue;
  return (await readGlobalConfig()).defaultHeadless ?? false;
}

/** The workspace's `agent.language`, then `defaultLanguage`, then undefined (mirror the human). */
export async function resolveLanguage(workspaceValue: string | undefined): Promise<string | undefined> {
  if (workspaceValue !== undefined) return workspaceValue;
  return (await readGlobalConfig()).defaultLanguage;
}

export async function isAutoCompactEnabled(): Promise<boolean> {
  return (await readGlobalConfig()).autoCompactEnabled ?? true;
}
