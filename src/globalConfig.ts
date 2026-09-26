import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseEnv } from "node:util";
import { ensureClaudeAuth } from "@falkenslab/agent-kit";

/**
 * ~/.teacher-agent/config.json — the only config not tied to a workspace: the Claude token
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
  return path.join(os.homedir(), ".teacher-agent", "config.json");
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
