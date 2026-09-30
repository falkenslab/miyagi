import { existsSync, realpathSync } from "node:fs";
import path from "node:path";

/**
 * Every path the drafts toolbox touches goes through here: resolved against drafts/, and
 * refused unless it stays inside it — no "..", no absolute path elsewhere, no symlink or
 * junction that leads out. This is the limit itself, not a prompt rule (ADR-003).
 */
export class DraftsPathError extends Error {}

/** `draftsDir` with symlinks resolved, so comparisons see the real location. */
function realRoot(draftsDir: string): string {
  return realpathSync.native(draftsDir);
}

/** The real path of `target`, or of its nearest existing ancestor plus the rest. */
function realpathLoose(target: string): string {
  let existing = target;
  const rest: string[] = [];
  while (!existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) break;
    rest.unshift(path.basename(existing));
    existing = parent;
  }
  return path.join(realpathSync.native(existing), ...rest);
}

function inside(root: string, candidate: string): boolean {
  const rel = path.relative(root, candidate);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

/**
 * `relative` (relative to drafts/, or absolute inside it) as an absolute path inside
 * drafts/. `allowRoot`: whether drafts/ itself is acceptable (listing it is; deleting it isn't).
 */
export function resolveInDrafts(draftsDir: string, relative: string, allowRoot = false): string {
  if (typeof relative !== "string" || relative.trim() === "") throw new DraftsPathError("empty path");
  if (relative.includes("\0")) throw new DraftsPathError("invalid path");
  const root = realRoot(draftsDir);
  const target = path.resolve(root, relative);
  if (!inside(root, target)) throw new DraftsPathError(`"${relative}" is outside drafts/`);
  const real = realpathLoose(target);
  if (!inside(root, real)) throw new DraftsPathError(`"${relative}" leads outside drafts/ through a link`);
  if (!allowRoot && path.relative(root, real) === "") throw new DraftsPathError("drafts/ itself can't be the target");
  return real;
}

/** A path as the model should see it: relative to drafts/, with forward slashes. */
export function shown(draftsDir: string, absolute: string): string {
  return path.relative(realRoot(draftsDir), absolute).split(path.sep).join("/") || ".";
}
