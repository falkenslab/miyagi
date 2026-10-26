import { marked, type Tokens } from "marked";
import { splitFrontmatter } from "./frontmatter.js";
import { finding, type Finding, type Parsed } from "./model.js";

/**
 * A unit, `materials/<unit>/unit.md` (ADR-015): its materials in the order students meet them,
 * each with what has to happen before it opens. The classroom's skills turn it into a section,
 * its resources and activities, and their access restrictions; its dates are the materials'
 * own, resolved per group.
 *
 *     ---
 *     title: Tema 1 · Variables
 *     summary: Qué es una variable y qué tipos tiene Python.
 *     ---
 *     1. variables.notes.md
 *     2. tarea-1.assignment.md · after: variables.notes.md viewed
 *     3. repaso.quiz.md · after: tarea-1.assignment.md submitted
 */

export const CONDITIONS = ["viewed", "submitted", "passed", "completed"] as const;
export type Condition = (typeof CONDITIONS)[number];

export interface UnitStep {
  material: string;
  after?: { material: string; condition: Condition };
}

export interface Unit {
  kind: "unit";
  title: string;
  summary: string;
  steps: UnitStep[];
}

export function parseUnit(source: string): Parsed<Unit> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, body, bodyLine, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const list = marked.lexer(body).find((token) => token.type === "list") as Tokens.List | undefined;
  const steps: UnitStep[] = [];
  if (!list) errors.push(finding(bodyLine, "the unit's materials, as a numbered list in the order students meet them"));
  for (const item of list?.items ?? []) {
    const [material, ...rest] = item.text.split(/\s·\s/).map((part) => part.trim());
    const after = rest.find((part) => /^after\s*:/i.test(part));
    const step: UnitStep = { material: material!.replace(/^`|`$/g, "") };
    if (after) {
      const match = /^after\s*:\s*(\S+)\s+(\w+)$/i.exec(after);
      if (!match || !CONDITIONS.includes(match[2]!.toLowerCase() as Condition)) errors.push(finding(bodyLine, `"${step.material}": "after: <material> ${CONDITIONS.join("|")}", not "${after}"`));
      else step.after = { material: match[1]!.replace(/^`|`$/g, ""), condition: match[2]!.toLowerCase() as Condition };
    }
    if (!/\.(questions|quiz|notes|assignment)\.md$/.test(step.material)) errors.push(finding(bodyLine, `"${step.material}" isn't a material a unit takes (.notes.md, .assignment.md, .quiz.md)`));
    steps.push(step);
  }
  steps.forEach((step, index) => {
    if (!step.after) return;
    const before = steps.slice(0, index).map((other) => other.material);
    if (!before.includes(step.after.material)) errors.push(finding(bodyLine, `"${step.material}" opens after ${step.after.material}, which isn't before it in the unit`));
    if (step.after.condition === "submitted" && !step.after.material.endsWith(".assignment.md")) warnings.push(finding(bodyLine, `"${step.material}": only an assignment is submitted; ${step.after.material} is viewed or completed`));
    if (step.after.condition === "passed" && !/\.(quiz|assignment)\.md$/.test(step.after.material)) errors.push(finding(bodyLine, `"${step.material}": only a graded activity is passed`));
  });
  const names = steps.map((step) => step.material);
  if (new Set(names).size !== names.length) errors.push(finding(bodyLine, "a material is in the unit twice"));
  return { material: { kind: "unit", title, summary: typeof data.summary === "string" ? data.summary.trim() : "", steps }, findings: { errors, warnings } };
}
