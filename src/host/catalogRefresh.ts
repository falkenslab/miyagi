import { extensionCatalog, listMarketplaces, updateMarketplace, type ExtensionDirs } from "@falkenslab/agent-kit";

/**
 * The catalogs' copies, renewed in the background (#101): the page compares each installed
 * extension with its marketplace's local copy, which otherwise only changes when something is
 * updated, so a new version went unnoticed. A copy older than a day is taken again; one that
 * can't be (no network) is tried at the next check. Nothing waits for it.
 */
export const CATALOG_MAX_AGE_MS = 24 * 60 * 60_000;
export const CATALOG_CHECK_EVERY_MS = 6 * 60 * 60_000;

interface Known {
  name: string;
  updated?: string;
}

/** The marketplaces whose copy was renewed. */
export async function refreshCatalogs(
  dir: string,
  { now = Date.now(), maxAge = CATALOG_MAX_AGE_MS, list = listMarketplaces as (dir: string) => Promise<Known[]>, update = updateMarketplace as (dir: string, name: string) => Promise<unknown> } = {},
): Promise<string[]> {
  const renewed: string[] = [];
  for (const marketplace of await list(dir).catch(() => [])) {
    const at = Date.parse(marketplace.updated ?? "");
    if (Number.isFinite(at) && now - at < maxAge) continue;
    try {
      await update(dir, marketplace.name);
      renewed.push(marketplace.name);
    } catch {
      // offline, or the repository moved: the copy stays as it was
    }
  }
  return renewed;
}

/** The installed extensions with a newer version in the copies already here: no network. */
export async function extensionUpdates(dirs: ExtensionDirs): Promise<string[]> {
  const entries = await extensionCatalog(dirs).catch(() => []);
  return entries.filter((entry) => entry.installed && entry.update).map((entry) => entry.plugin.name);
}
