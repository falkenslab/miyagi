import { marked, type Tokens } from "marked";
import { splitFrontmatter, stringList } from "./frontmatter.js";
import { finding, type Finding, type Parsed } from "./model.js";

/**
 * A rubric, `<slug>.rubric.md` (ADR-015): one `##` per criterion, its levels as a list with their
 * score first, the best one's sum being the activity's grade. Exported as the definition a
 * classroom's grading editor takes (criteria, each with two levels or more: definition and score)
 * and as a table to print.
 *
 *     ---
 *     title: Rúbrica de la Tarea 1
 *     total: 10                    # optional: then the criteria's best levels add up to it
 *     ---
 *     ## Explica el concepto · criteria: 1.1
 *     - 4: Explica con sus palabras qué es y para qué sirve
 *     - 2: Lo explica de forma incompleta
 *     - 0: No lo explica, o es incorrecto
 */

export interface RubricLevel {
  score: number;
  definition: string;
}

export interface RubricCriterion {
  name: string;
  criteria: string[];
  levels: RubricLevel[];
  line: number;
}

export interface Rubric {
  kind: "rubric";
  title: string;
  criteria: RubricCriterion[];
  /** The sum of each criterion's best level. */
  total: number;
}

export function parseRubric(source: string): Parsed<Rubric> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, body, bodyLine, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const criteria: RubricCriterion[] = [];
  let line = bodyLine;
  let current: RubricCriterion | null = null;
  for (const token of marked.lexer(body)) {
    if (token.type === "heading" && (token as Tokens.Heading).depth === 2) {
      const [name, ...meta] = (token as Tokens.Heading).text.split(/\s·\s/);
      const criteriaMeta = meta.find((part) => /^criteria\s*:/i.test(part.trim()));
      current = { name: name!.trim(), criteria: criteriaMeta ? stringList(criteriaMeta.slice(criteriaMeta.indexOf(":") + 1)) : [], levels: [], line };
      criteria.push(current);
    } else if (token.type === "list" && current) {
      for (const item of (token as Tokens.List).items) {
        const match = /^(-?\d+(?:[.,]\d+)?)\s*(?:pts?|puntos?|points?)?\s*[:—-]\s*([\s\S]+)$/i.exec(item.text.trim());
        if (!match) {
          errors.push(finding(line, `"${current.name}": a level is "- <score>: <what it looks like>", not "${item.text.trim().slice(0, 40)}"`));
          continue;
        }
        current.levels.push({ score: Number(match[1]!.replace(",", ".")), definition: match[2]!.trim().replace(/\s+/g, " ") });
      }
    }
    line += (token.raw.match(/\n/g) ?? []).length;
  }
  if (!criteria.length) errors.push(finding(bodyLine, "no criteria: each one starts with a ## heading and lists its levels"));
  for (const criterion of criteria) {
    if (criterion.levels.length < 2) errors.push(finding(criterion.line, `"${criterion.name}": a criterion needs two levels or more`));
    const scores = criterion.levels.map((level) => level.score);
    if (new Set(scores).size !== scores.length) errors.push(finding(criterion.line, `"${criterion.name}": two levels have the same score`));
    if (criterion.levels.some((level) => level.score < 0)) errors.push(finding(criterion.line, `"${criterion.name}": a score is negative`));
    if (!criterion.levels.some((level) => level.score === 0)) warnings.push(finding(criterion.line, `"${criterion.name}": no level scores 0: what does a missing or wrong answer get?`));
    criterion.levels.sort((a, b) => a.score - b.score);
  }
  const names = criteria.map((criterion) => criterion.name.toLowerCase());
  if (new Set(names).size !== names.length) errors.push(finding(bodyLine, "two criteria have the same name"));
  const total = Math.round(criteria.reduce((sum, criterion) => sum + Math.max(0, ...criterion.levels.map((level) => level.score)), 0) * 1000) / 1000;
  if (data.total !== undefined && Number(data.total) !== total) errors.push(finding(1, `"total" says ${String(data.total)}, but the criteria's best levels add up to ${total}`));
  return { material: { kind: "rubric", title, criteria, total }, findings: { errors, warnings } };
}

/** The definition a classroom's rubric editor takes: criteria, each with its levels (definition and score), lowest first. */
export function rubricDefinition(rubric: Rubric): { method: "rubric"; criteria: { description: string; levels: RubricLevel[] }[] } {
  return {
    method: "rubric",
    criteria: rubric.criteria.map((criterion) => ({
      description: criterion.criteria.length ? `${criterion.name} (${criterion.criteria.join(", ")})` : criterion.name,
      levels: criterion.levels.map(({ score, definition }) => ({ definition, score })),
    })),
  };
}

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** The rubric as a table, for students and to print: one row per criterion, its levels best first. */
export function rubricTable(rubric: Rubric, labels: { criterion: string; levels: string }): string {
  const rows = rubric.criteria
    .map((criterion) => `<tr><th scope="row">${escapeHtml(criterion.name)}${criterion.criteria.length ? ` <small>(${escapeHtml(criterion.criteria.join(", "))})</small>` : ""}</th><td><ul>${[...criterion.levels].reverse().map((level) => `<li><strong>${level.score}</strong>: ${escapeHtml(level.definition)}</li>`).join("")}</ul></td></tr>`)
    .join("\n");
  return `<table>\n<caption>${escapeHtml(rubric.title)} (${rubric.total})</caption>\n<thead><tr><th scope="col">${escapeHtml(labels.criterion)}</th><th scope="col">${escapeHtml(labels.levels)}</th></tr></thead>\n<tbody>\n${rows}\n</tbody>\n</table>\n`;
}
