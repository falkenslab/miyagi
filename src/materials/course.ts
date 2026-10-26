import { splitFrontmatter, stringList } from "./frontmatter.js";
import { finding, type Finding, type Parsed } from "./model.js";

/**
 * The course's calendar, `materials/course.md` (ADR-015): each group's start, the holidays and the
 * evaluations. It turns the materials' relative dates ("semana 3 viernes 23:59") into real dates
 * per group, so one material serves groups that start on different days; a date that falls on a
 * holiday moves to the school day before, and says so.
 *
 *     ---
 *     title: Curso 2026-2027
 *     groups:
 *       - id: A
 *         start: 2026-09-15
 *     holidays: [2026-10-12, 2026-12-07..2026-12-08]
 *     evaluations:
 *       - name: Primera evaluación
 *         end: 2026-12-19
 *     ---
 */

export interface CourseCalendar {
  kind: "course";
  title: string;
  groups: { id: string; start: string }[];
  /** Every holiday, as YYYY-MM-DD (ranges expanded). */
  holidays: string[];
  evaluations: { name: string; end: string }[];
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const day = (date: Date) => date.toISOString().slice(0, 10);
const parseDay = (text: string) => new Date(`${text}T00:00:00Z`);

function expand(spec: string): string[] {
  const range = /^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/.exec(spec);
  if (!range) return ISO.test(spec) ? [spec] : [];
  const out: string[] = [];
  for (let at = parseDay(range[1]!); at <= parseDay(range[2]!); at = new Date(at.getTime() + 86_400_000)) out.push(day(at));
  return out;
}

export function parseCourse(source: string): Parsed<CourseCalendar> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const groups: CourseCalendar["groups"] = [];
  for (const [index, raw] of (Array.isArray(data.groups) ? data.groups : []).entries()) {
    const group = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const id = String(group.id ?? "").trim();
    const start = group.start instanceof Date ? day(group.start) : String(group.start ?? "").trim();
    if (!id) errors.push(finding(1, `groups[${index + 1}] needs an "id"`));
    if (!ISO.test(start)) errors.push(finding(1, `groups[${index + 1}]: "start" is a date, YYYY-MM-DD`));
    else groups.push({ id, start });
  }
  if (!groups.length) errors.push(finding(1, `"groups" lists each group with its start: - id: A, start: 2026-09-15`));
  const holidays: string[] = [];
  for (const spec of stringList(Array.isArray(data.holidays) ? data.holidays.map((value) => (value instanceof Date ? day(value) : String(value))) : data.holidays)) {
    const days = expand(spec);
    if (!days.length) errors.push(finding(1, `holiday "${spec}" is a date (YYYY-MM-DD) or a range (YYYY-MM-DD..YYYY-MM-DD)`));
    holidays.push(...days);
  }
  const evaluations: CourseCalendar["evaluations"] = [];
  for (const raw of Array.isArray(data.evaluations) ? data.evaluations : []) {
    const evaluation = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const end = evaluation.end instanceof Date ? day(evaluation.end) : String(evaluation.end ?? "");
    if (!ISO.test(end)) warnings.push(finding(1, `the evaluation "${String(evaluation.name ?? "")}" has no "end" date`));
    else evaluations.push({ name: String(evaluation.name ?? ""), end });
  }
  return { material: { kind: "course", title, groups, holidays, evaluations }, findings: { errors, warnings } };
}

/** Weekday names in the languages miyagi speaks, Monday first. */
const WEEKDAYS = [
  ["lunes", "monday", "lundi", "montag"],
  ["martes", "tuesday", "mardi", "dienstag"],
  ["miércoles", "wednesday", "mercredi", "mittwoch", "miercoles"],
  ["jueves", "thursday", "jeudi", "donnerstag"],
  ["viernes", "friday", "vendredi", "freitag"],
  ["sábado", "saturday", "samedi", "samstag", "sabado"],
  ["domingo", "sunday", "dimanche", "sonntag"],
];

export interface Resolved {
  /** YYYY-MM-DD HH:MM. */
  date: string;
  /** Why it isn't the day written: it fell on a holiday or a weekend. */
  moved?: string;
}

/**
 * A date as written in a material, for a group: absolute as it is; relative ("semana 3 viernes
 * 23:59", "week 2 monday") from the group's week 1, the week its start is in. A holiday or a weekend
 * moves it to the school day before.
 */
export function resolveDate(spec: string, group: { start: string }, holidays: readonly string[]): Resolved {
  const absolute = /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2}:\d{2}))?$/.exec(spec.trim());
  if (absolute) return { date: `${absolute[1]} ${absolute[2] ?? "23:59"}` };
  const relative = /^(?:semana|week|semaine|woche)\s+(\d+)(?:\s+([a-záéíóúüßäö]+))?(?:\s+(\d{1,2}:\d{2}))?$/i.exec(spec.trim());
  if (!relative) throw new Error(`"${spec}" isn't a date nor "semana N <día> HH:MM"`);
  const week = Number(relative[1]);
  const weekday = relative[2] ? WEEKDAYS.findIndex((names) => names.includes(relative[2]!.toLowerCase())) : 0;
  if (weekday < 0) throw new Error(`"${relative[2]}" isn't a day of the week`);
  const start = parseDay(group.start);
  const monday = new Date(start.getTime() - ((start.getUTCDay() + 6) % 7) * 86_400_000);
  let at = new Date(monday.getTime() + ((week - 1) * 7 + weekday) * 86_400_000);
  const written = day(at);
  let moved: string | undefined;
  while (holidays.includes(day(at)) || at.getUTCDay() === 0 || at.getUTCDay() === 6) {
    moved = holidays.includes(day(at)) ? `${day(at)} is a holiday` : `${day(at)} is a weekend`;
    at = new Date(at.getTime() - 86_400_000);
  }
  return { date: `${day(at)} ${relative[3] ?? "23:59"}`, ...(moved && day(at) !== written ? { moved: `${moved}: moved to ${day(at)}` } : {}) };
}
