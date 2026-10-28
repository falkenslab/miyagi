import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseEnv } from "node:util";
import { claudeSignedIn, ensureClaudeAuth } from "@falkenslab/agent-kit";
import { chooseInterfaceLanguage } from "./messages/index.js";
import { interfaceLanguage, readWorkspaceConfig, workspaceExists } from "./workspace.js";

/**
 * ~/.miyagi/config.json — the only config not tied to a workspace: a Claude API key, if the
 * teacher pasted one, and per-user defaults for workspaces that don't set their own. A Claude
 * account's session is never here: Claude Code keeps it (ADR-026).
 */
export interface GlobalConfig {
  /** A subscription token saved by miyagi before ADR-026: removed on the next start. */
  claudeCodeOAuthToken?: string;
  /** An API key the teacher pasted (`sk-ant-api…`), billed to their Console account. */
  anthropicApiKey?: string;
  /** SDK autocompact when the context fills up. On unless set to false here. */
  autoCompactEnabled?: boolean;
  /** Fallback for workspaces with no `agent.language` of their own. */
  defaultLanguage?: string;
}

export function globalConfigPath(): string {
  return path.join(os.homedir(), ".miyagi", "config.json");
}

/**
 * Files outside the workspace that hold a secret the model must never read (ADR-004): the
 * global config (`anthropicApiKey`) and the Claude Agent SDK's own
 * credentials. Denied to the file tools in every session, existing or not. Only these files:
 * `~/.miyagi/` and `~/.claude/` also hold things the agent may need to read.
 */
export function secretFilePaths(): string[] {
  return [globalConfigPath(), path.join(os.homedir(), ".claude", ".credentials.json")];
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
 * Loads `<workspace>/.env`, if any, overriding variables already set. A subscription token in
 * it is left out: miyagi never hands one to Claude (ADR-026), the teacher signs in instead.
 */
export async function loadWorkspaceEnv(workspaceDir: string): Promise<void> {
  let raw: string;
  try {
    raw = await readFile(path.join(workspaceDir, ".env"), "utf-8");
  } catch {
    return;
  }
  const values = parseEnv(raw);
  delete values.CLAUDE_CODE_OAUTH_TOKEN;
  Object.assign(process.env, values);
}

/**
 * Removes the subscription token miyagi saved before ADR-026 (`claudeCodeOAuthToken`): the
 * terms don't allow miyagi to keep one. Returns true when there was one, so the caller tells
 * the teacher, once, to sign in with their Claude account.
 */
export async function forgetSavedClaudeToken(): Promise<boolean> {
  const config = await readGlobalConfig();
  if (!config.claudeCodeOAuthToken) return false;
  delete config.claudeCodeOAuthToken;
  await writeGlobalConfig(config);
  return true;
}

/** The API key the teacher pasted, if any, for this process: the SDK reads it from the environment. */
async function applySavedApiKey(): Promise<void> {
  const config = await readGlobalConfig();
  if (config.anthropicApiKey && !process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = config.anthropicApiKey;
}

/**
 * In a terminal: signed in to Claude, or an API key, before a session. Without either, the
 * kit's `ensureClaudeAuth()` runs Claude Code's own sign-in (`claude auth login`, Anthropic's
 * page in the browser); Claude Code keeps the session, miyagi never sees it.
 */
export async function ensureClaudeReady(): Promise<void> {
  await applySavedApiKey();
  await ensureClaudeAuth();
}

/**
 * The API key a teacher pasted in the GUI (`sk-ant-api…`), set for this process and saved for
 * the next. Anything else is refused, a subscription token (`sk-ant-oat…`) among them: that
 * one is signed in with, never pasted (ADR-026).
 */
export async function saveClaudeKey(pasted: string): Promise<boolean> {
  const value = pasted.trim();
  if (!value.startsWith("sk-ant-api") || /\s/.test(value)) return false;
  process.env.ANTHROPIC_API_KEY = value;
  const config = await readGlobalConfig();
  await writeGlobalConfig({ ...config, anthropicApiKey: value });
  return true;
}

/** Whether a session can start without asking: signed in to Claude, or an API key (the environment's or the one pasted). */
export async function claudeAuthAvailable(): Promise<boolean> {
  await applySavedApiKey();
  return claudeSignedIn();
}

/** The workspace's `agent.language`, then `defaultLanguage`, then undefined (mirror the human). */
/**
 * Chooses miyagi's interface language for a subject (or none): its own language, else the default
 * one in `~/.miyagi/config.json`, else the computer's. The terminal and the GUI's host both call
 * it, so the app shows the teacher's language from its very first screen. Returns the warnings.
 */
export async function chooseLanguageFor(workspaceDir: string | undefined): Promise<string[]> {
  let workspaceLanguage: string | undefined;
  try {
    if (workspaceDir && (await workspaceExists(workspaceDir))) workspaceLanguage = (await readWorkspaceConfig(workspaceDir)).agent.language;
  } catch {
    // A broken or student config.json is reported by whoever opens it, in the chosen language.
  }
  return chooseInterfaceLanguage(interfaceLanguage(await resolveLanguage(workspaceLanguage)));
}

export async function resolveLanguage(workspaceValue: string | undefined): Promise<string | undefined> {
  if (workspaceValue !== undefined) return workspaceValue;
  return (await readGlobalConfig()).defaultLanguage;
}

export async function isAutoCompactEnabled(): Promise<boolean> {
  return (await readGlobalConfig()).autoCompactEnabled ?? true;
}
