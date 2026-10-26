import { marked, type Tokens } from "marked";
import { splitFrontmatter } from "./frontmatter.js";
import { finding, type Finding, type Parsed } from "./model.js";

/**
 * How the subject is graded, `materials/grading.md` (ADR-015): its categories with their weights,
 * which must add up to 100 %, and the materials each one takes. Exported as the gradebook's plan
 * for the classroom's gradebook skill and as a spreadsheet to grade outside it, with no student
 * in it: the teacher fills in the names.
 *
 *     ---
 *     title: Calificación del módulo
 *     ---
 *     | Categoría | Peso | Actividades |
 *     | --- | --- | --- |
 *     | Tareas | 40 % | tema-1/tarea-1.assignment.md, tema-2/tarea-2.assignment.md |
 *     | Cuestionarios | 30 % | tema-1/repaso.quiz.md |
 *     | Proyecto | 30 % | |
 */

export interface GradingCategory {
  name: string;
  weight: number;
  items: string[];
}

export interface Grading {
  kind: "grading";
  title: string;
  categories: GradingCategory[];
}

export function parseGrading(source: string): Parsed<Grading> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, body, bodyLine, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const table = marked.lexer(body).find((token) => token.type === "table") as Tokens.Table | undefined;
  const categories: GradingCategory[] = [];
  if (!table || table.header.length < 2) errors.push(finding(bodyLine, "a table of the categories: | Categoría | Peso | Actividades |"));
  else {
    for (const row of table.rows) {
      const name = row[0]?.text.trim() ?? "";
      const weight = Number((row[1]?.text ?? "").replace("%", "").replace(",", ".").trim());
      if (!name) continue;
      if (!(weight >= 0)) errors.push(finding(bodyLine, `"${name}": its weight is a percentage, not "${row[1]?.text ?? ""}"`));
      categories.push({ name, weight: weight >= 0 ? weight : 0, items: (row[2]?.text ?? "").split(/[,;]/).map((item) => item.trim()).filter(Boolean) });
    }
  }
  const sum = Math.round(categories.reduce((total, category) => total + category.weight, 0) * 1000) / 1000;
  if (categories.length && sum !== 100) errors.push(finding(bodyLine, `the weights add up to ${sum} %, not 100 %`));
  for (const category of categories) if (!category.items.length) warnings.push(finding(bodyLine, `"${category.name}" has no activities yet`));
  return { material: { kind: "grading", title, categories }, findings: { errors, warnings } };
}

/** A spreadsheet to grade outside the classroom: a row of weights, the activities as columns, no students. */
export function gradingSheet(grading: Grading, studentLabel: string, finalLabel: string): string {
  const quote = (text: string) => (/[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text);
  const columns = grading.categories.flatMap((category) => (category.items.length ? category.items.map((item) => `${category.name}: ${item.replace(/^.*\//, "").replace(/\.(assignment|quiz)\.md$/, "")}`) : [category.name]));
  const weights = grading.categories.flatMap((category) => {
    const count = Math.max(1, category.items.length);
    return Array.from({ length: count }, () => String(Math.round((category.weight / count) * 1000) / 1000));
  });
  return `${[studentLabel, ...columns, finalLabel].map(quote).join(",")}\n${["%", ...weights, "100"].map(quote).join(",")}\n`;
}
