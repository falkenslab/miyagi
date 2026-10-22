import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * The register of activities in progress: the knowledge base's `course/drafts` page
 * (`knowledge/drafts.md`), one list item per activity, its phase first in backticks
 * (`activity-lifecycle`, #17). Pages from before the phases listed only drafts hidden in the
 * classroom, so an item without a phase counts as `hidden`.
 */

export const PHASES = ["planning", "building", "hidden", "served"] as const;
export type Phase = (typeof PHASES)[number];
export type PhaseCounts = Record<Phase, number>;

const ITEM = /^\s*[-*] +(.*)$/;
const PHASE = new RegExp("^`(" + PHASES.join("|") + ")`");

/** How many activities the page lists in each phase. */
export function countPhases(text: string): PhaseCounts {
  const counts: PhaseCounts = { planning: 0, building: 0, hidden: 0, served: 0 };
  for (const line of text.split(/\r?\n/)) {
    const item = ITEM.exec(line);
    if (!item) continue;
    const phase = PHASE.exec(item[1]!.trim());
    counts[(phase?.[1] as Phase | undefined) ?? "hidden"]++;
  }
  return counts;
}

export function registerPath(workspaceDir: string): string {
  return path.join(workspaceDir, "knowledge", "drafts.md");
}

/** The workspace's counts, or `undefined` when there's no page or nothing in it. */
export function readPhaseCounts(workspaceDir: string): PhaseCounts | undefined {
  let text: string;
  try {
    text = readFileSync(registerPath(workspaceDir), "utf-8");
  } catch {
    return undefined;
  }
  const counts = countPhases(text);
  return PHASES.some((phase) => counts[phase] > 0) ? counts : undefined;
}

/** "1 en plan, 2 cocinándose": the phases with something in them, in order, with each language's names. */
export function inOven(counts: PhaseCounts, names: Record<Phase, string>): string {
  return PHASES.filter((phase) => counts[phase] > 0).map((phase) => `${counts[phase]} ${names[phase]}`).join(", ");
}

/** An activity's plan, the only file plan mode lets the agent write: `drafts/<slug>/plan.md`. */
export function isActivityPlanFile(draftsDir: string, filePath: string): boolean {
  const relative = path.relative(draftsDir, filePath).split(path.sep);
  return relative.length === 2 && relative[0] !== ".." && relative[0] !== "" && !path.isAbsolute(relative[0]!) && relative[1] === "plan.md";
}
