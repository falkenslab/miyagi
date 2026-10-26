import type { Assignment } from "./assignment.js";
import { stringList } from "./frontmatter.js";
import { finding, type Finding, type Question, type Quiz } from "./model.js";

/**
 * An activity's variants set in what the group cares about (#39): the same activity told in
 * another context, each in its own file, listed by the neutral one (`variants: [...]`). Only the
 * context may change: the comparisons below say what else did, and that's an error, since
 * students choosing different contexts must be assessed the same.
 */

export const MIN_VARIANTS = 2;
export const MAX_VARIANTS = 4;

/** A frontmatter's `variants`: the files, each a material of the same kind; checked for their number. */
export function variantsOf(data: Record<string, unknown>, suffix: string, errors: Finding[]): string[] | undefined {
  if (data.variants === undefined) return undefined;
  const files = stringList(data.variants);
  for (const file of files.filter((one) => !one.endsWith(suffix))) errors.push(finding(1, `"variants": ${file} isn't a ${suffix} file`));
  if (files.length < MIN_VARIANTS || files.length > MAX_VARIANTS) errors.push(finding(1, `"variants": ${MIN_VARIANTS} to ${MAX_VARIANTS} contexts besides this neutral one, not ${files.length}`));
  return files;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const sorted = (list: string[]) => [...list].sort();

/** What a variant of an assignment changes besides its context: nothing, or the differences. */
export function compareAssignments(base: Assignment, variant: Assignment): string[] {
  const differences: string[] = [];
  if (base.grade !== variant.grade) differences.push(`grade ${variant.grade}, not ${base.grade}`);
  if (base.rubric !== variant.rubric) differences.push(`rubric ${variant.rubric ?? "none"}, not ${base.rubric ?? "none"}`);
  if (!same(sorted(base.criteria), sorted(variant.criteria))) differences.push(`criteria ${variant.criteria.join(", ") || "none"}, not ${base.criteria.join(", ") || "none"}`);
  if (base.submission !== variant.submission || base.files !== variant.files || !same(sorted(base.formats), sorted(variant.formats))) differences.push("what's handed in (submission, files, formats)");
  if (base.due !== variant.due || base.cutoff !== variant.cutoff) differences.push("its dates");
  if (base.group !== variant.group) differences.push("group or individual");
  if (variant.variants) differences.push("it lists variants of its own");
  return differences;
}

/** What a variant of a quiz changes besides its context: its purpose, settings, or any slot's type, points or criteria. */
export function compareQuizzes(base: Quiz, baseQuestions: Question[], variant: Quiz, variantQuestions: Question[]): string[] {
  const differences: string[] = [];
  if (base.purpose !== variant.purpose) differences.push(`purpose ${variant.purpose}, not ${base.purpose}`);
  if (!same(base.settings, variant.settings)) differences.push("its settings");
  if (baseQuestions.length !== variantQuestions.length) differences.push(`${variantQuestions.length} questions, not ${baseQuestions.length}`);
  else {
    baseQuestions.forEach((question, index) => {
      const other = variantQuestions[index]!;
      if (question.type !== other.type) differences.push(`question ${index + 1} is ${other.type}, not ${question.type}`);
      if (question.points !== other.points) differences.push(`question ${index + 1} is worth ${other.points}, not ${question.points}`);
      if (!same(sorted(question.criteria), sorted(other.criteria))) differences.push(`question ${index + 1}'s criteria`);
      if (question.level !== other.level) differences.push(`question ${index + 1}'s level`);
    });
  }
  if (variant.variants) differences.push("it lists variants of its own");
  return differences;
}
