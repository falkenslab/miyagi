import os from "node:os";
import path from "node:path";
import { listInstalled, type ExtensionDirs, type InstalledExtension } from "@falkenslab/agent-kit";

/**
 * miyagi's policy on agent-kit's extensions (ADR-021); the mechanism is the kit's (its ADR-025).
 * The official repository, shared with the other agents on the kit: installed from without a
 * confirmation. Any other is added by hand, after the kit's warning.
 */
export const OFFICIAL_MARKETPLACE = "https://github.com/falkenslab/agent-extensions.git";

/** The catalog shows only the extensions tagged for miyagi. */
export const CATALOG_TOPICS = ["miyagi"];

/** `~/.miyagi/extensions/` for every subject, and the workspace's `extensions/` (its lock) for one, which wins. */
export function extensionDirsFor(workspaceDir: string | undefined): ExtensionDirs {
  return {
    agent: path.join(os.homedir(), ".miyagi", "extensions"),
    ...(workspaceDir ? { project: path.join(workspaceDir, "extensions") } : {}),
  };
}

/** The installed extensions a session of this workspace runs: enabled, not shadowed by the project's copy. */
export async function enabledExtensions(workspaceDir: string): Promise<InstalledExtension[]> {
  return (await listInstalled(extensionDirsFor(workspaceDir))).filter((ext) => ext.lock.enabled !== false && !ext.shadowed && ext.manifest);
}
