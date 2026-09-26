import path from "node:path";
import { writeFile } from "node:fs/promises";

/** The secret name the model types literally into the password field — @playwright/mcp
 * substitutes the real value inside the browser process; it never reaches the model's
 * own context. */
export const MOODLE_PASSWORD_SECRET_NAME = "MOODLE_PASSWORD";

/**
 * Deterministic from `runDir` alone, so `AgentSpec.buildMcpServers()` (synchronous, no
 * access to the async `writePlaywrightConfig()` write below) can reference the same path
 * `agent.ts` writes the file to just before `buildSessionOptions()` runs, without a
 * closure.
 */
export function playwrightConfigPathFor(runDir: string): string {
  return path.join(runDir, "playwright-mcp-config.json");
}

/**
 * `--config` is the only way to set `contextOptions.viewport: null` (not available as a
 * CLI flag on `@playwright/mcp`), and `secrets` is the mechanism that lets the model type the literal
 * string `MOODLE_PASSWORD` into the password field without ever seeing the real value —
 * @playwright/mcp substitutes it inside the browser process itself.
 */
export async function writePlaywrightConfig(runDir: string, moodlePassword?: string): Promise<string> {
  const configPath = playwrightConfigPathFor(runDir);
  const config: Record<string, unknown> = {
    browser: {
      launchOptions: { args: ["--window-size=1280,800"] },
      contextOptions: { viewport: null },
    },
  };
  if (moodlePassword) {
    config.secrets = { [MOODLE_PASSWORD_SECRET_NAME]: moodlePassword };
  }
  await writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
  return configPath;
}
