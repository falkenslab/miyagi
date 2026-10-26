import { splitFrontmatter, stringList } from "./frontmatter.js";
import { finding, type Finding, type Parsed } from "./model.js";
import { variantsOf } from "./variants.js";

/**
 * An assignment, `<slug>.assignment.md` (ADR-015): its statement for students as the body, and
 * what it asks for in the frontmatter, the teacher's intent the classroom's assignment skill maps.
 * Its dates are a day and time, or relative to a group's start ("semana 3 viernes 23:59"), which
 * `materials/course.md` turns into real dates per group.
 *
 *     ---
 *     title: "Tarea 1: explica qué es una variable"
 *     grade: 10
 *     rubric: tarea-1.rubric.md
 *     submission: file          # file, text or both
 *     files: 1
 *     formats: [pdf]
 *     due: semana 3 viernes 23:59
 *     cutoff: semana 4 viernes 23:59
 *     group: false
 *     criteria: [1.1, 1.2]
 *     ---
 *     ## Qué tienes que hacer
 *     …
 */

export interface Assignment {
  kind: "assignment";
  title: string;
  grade: number;
  rubric?: string;
  submission: "file" | "text" | "both";
  files: number;
  formats: string[];
  /** As written: an ISO date and time, or relative to a group's start. */
  due?: string;
  cutoff?: string;
  group: boolean;
  criteria: string[];
  statement: string;
  /** Its variants in other contexts (#39): this file is the neutral one. */
  variants?: string[];
}

const SUBMISSIONS = ["file", "text", "both"] as const;

/** A date as written: absolute (2026-11-20 23:59) or relative (semana 3 viernes 23:59, week 3 friday). */
export function isDateSpec(text: string): boolean {
  return /^\d{4}-\d{2}-\d{2}([ T]\d{1,2}:\d{2})?$/.test(text) || /^(semana|week|semaine|woche)\s+\d+\b/i.test(text);
}

export function parseAssignment(source: string): Parsed<Assignment> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, body, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const grade = data.grade === undefined ? 10 : Number(data.grade);
  if (!(grade > 0)) errors.push(finding(1, `"grade" is the maximum grade, a number above 0`));
  const submission = String(data.submission ?? "file").toLowerCase();
  if (!SUBMISSIONS.includes(submission as Assignment["submission"])) errors.push(finding(1, `"submission" is file, text or both, not "${String(data.submission)}"`));
  const files = data.files === undefined ? 1 : Number(data.files);
  if (submission !== "text" && !(files >= 1)) errors.push(finding(1, `"files" is how many files a student can upload, 1 or more`));
  const due = data.due === undefined ? undefined : String(data.due).trim();
  const cutoff = data.cutoff === undefined ? undefined : String(data.cutoff).trim();
  for (const [key, value] of [["due", due], ["cutoff", cutoff]] as const) {
    if (value !== undefined && !isDateSpec(value)) errors.push(finding(1, `"${key}" is a date and time (2026-11-20 23:59) or relative to a group's start (semana 3 viernes 23:59), not "${value}"`));
  }
  if (due && cutoff && /^\d{4}/.test(due) && /^\d{4}/.test(cutoff) && cutoff < due) errors.push(finding(1, `"cutoff" (${cutoff}) is before "due" (${due})`));
  if (!due) warnings.push(finding(1, "no due date: students won't know when it's expected"));
  if (!body.trim()) errors.push(finding(1, "no statement: the body is what students read"));
  else if (body.trim().length < 120) warnings.push(finding(1, "a very short statement: does it say what to do, what to hand in and how it's graded?"));
  const rubric = typeof data.rubric === "string" && data.rubric.trim() ? data.rubric.trim() : undefined;
  if (rubric && !rubric.endsWith(".rubric.md")) errors.push(finding(1, `"rubric" names a .rubric.md file`));
  if (!rubric) warnings.push(finding(1, "no rubric: how it's graded is only in the statement (rubric-design)"));
  const variants = variantsOf(data, ".assignment.md", errors);
  return {
    material: {
      kind: "assignment",
      title,
      grade: grade > 0 ? grade : 10,
      ...(rubric ? { rubric } : {}),
      submission: (SUBMISSIONS.includes(submission as Assignment["submission"]) ? submission : "file") as Assignment["submission"],
      files: files >= 1 ? files : 1,
      formats: stringList(data.formats).map((format) => format.replace(/^\./, "").toLowerCase()),
      ...(due ? { due } : {}),
      ...(cutoff ? { cutoff } : {}),
      group: data.group === true,
      criteria: stringList(data.criteria),
      statement: body.trim(),
      ...(variants ? { variants } : {}),
    },
    findings: { errors, warnings },
  };
}
