import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { finding, type Bank, type Finding, type Material, type Parsed, type Question, type Quiz, type ValidationResult } from "./model.js";
import { parseQuestions } from "./questions.js";
import { parseAssignment } from "./assignment.js";
import { parseCourse } from "./course.js";
import { parseGrading } from "./grading.js";
import { parseNotes } from "./notes.js";
import { parseRubric } from "./rubric.js";
import { parseUnit } from "./unit.js";
import { parseQuiz } from "./quiz.js";

/**
 * Reading `materials/`: a material by its path, what a quiz takes from its banks, and the
 * checks that need more than one file (a bank that exists, names that exist, criteria the
 * teacher's plan has). Every path stays inside the folder.
 */

export const MATERIAL_SUFFIXES = [".questions.md", ".quiz.md", ".notes.md", ".assignment.md", ".rubric.md", "grading.md", "course.md", "unit.md"] as const;

/** A path inside materials/, never out of it: the material's absolute path. */
export function inMaterials(materialsDir: string, relative: string): string {
  const resolved = path.resolve(materialsDir, relative.replace(/^materials[\\/]/, ""));
  const root = path.resolve(materialsDir);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) throw new Error(`${relative} is outside materials/`);
  return resolved;
}

export const shownPath = (materialsDir: string, file: string) => path.relative(materialsDir, file).split(path.sep).join("/");

export function kindOf(file: string): Material["kind"] | undefined {
  if (file.endsWith(".questions.md")) return "questions";
  if (file.endsWith(".quiz.md")) return "quiz";
  if (file.endsWith(".notes.md")) return "notes";
  if (file.endsWith(".assignment.md")) return "assignment";
  if (file.endsWith(".rubric.md")) return "rubric";
  if (path.basename(file) === "grading.md") return "grading";
  if (path.basename(file) === "course.md") return "course";
  if (path.basename(file) === "unit.md") return "unit";
  return undefined;
}

export function parseMaterial(file: string, source: string): Parsed<Material> {
  const kind = kindOf(file);
  if (kind === "questions") return parseQuestions(source);
  if (kind === "quiz") return parseQuiz(source);
  if (kind === "notes") return parseNotes(source, file);
  if (kind === "assignment") return parseAssignment(source);
  if (kind === "rubric") return parseRubric(source);
  if (kind === "grading") return parseGrading(source);
  if (kind === "course") return parseCourse(source);
  if (kind === "unit") return parseUnit(source);
  return { findings: { errors: [finding(1, `${path.basename(file)} isn't a material miyagi knows (${MATERIAL_SUFFIXES.join(", ")})`)], warnings: [] } };
}

export async function loadMaterial(materialsDir: string, relative: string): Promise<Parsed<Material> & { file: string }> {
  const file = inMaterials(materialsDir, relative);
  const source = await readFile(file, "utf8").catch(() => undefined);
  if (source === undefined) return { file, findings: { errors: [finding(1, `${relative} doesn't exist in materials/`)], warnings: [] } };
  return { file, ...parseMaterial(file, source) };
}

/** Every material in the folder, relative paths, but the hidden files (the publication record). */
export async function listMaterials(materialsDir: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(path.join(materialsDir, prefix), { withFileTypes: true }).catch(() => []);
  const out: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await listMaterials(materialsDir, relative)));
    else if (kindOf(entry.name)) out.push(relative);
  }
  return out.sort();
}

/** What a quiz takes, bank by bank: the questions themselves, or a number to draw at random. */
export interface ResolvedPick {
  bankFile: string;
  bank: Bank;
  questions: Question[];
  /** Drawn at random by the classroom from the bank's category: how many. */
  random?: number;
}

/** A quiz's parts read from their banks (relative to the quiz's folder, else to materials/). */
export async function resolveQuiz(materialsDir: string, quizFile: string, quiz: Quiz): Promise<{ picks: ResolvedPick[]; findings: ValidationResult }> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const picks: ResolvedPick[] = [];
  for (const pick of quiz.questions) {
    const near = path.join(path.dirname(quizFile), pick.bank);
    const relative = shownPath(materialsDir, near);
    let loaded = await loadMaterial(materialsDir, relative).catch(() => undefined);
    if (!loaded?.material) loaded = await loadMaterial(materialsDir, pick.bank).catch(() => undefined);
    if (!loaded?.material || loaded.material.kind !== "questions") {
      errors.push(finding(1, `the bank ${pick.bank} doesn't exist or can't be read`));
      continue;
    }
    if (loaded.findings.errors.length) errors.push(finding(1, `the bank ${pick.bank} has errors: validate it first`));
    const bank = loaded.material;
    if (pick.pick === "all") picks.push({ bankFile: shownPath(materialsDir, loaded.file), bank, questions: bank.questions });
    else if (typeof pick.pick === "number") {
      if (pick.pick > bank.questions.length) errors.push(finding(1, `${pick.bank} has ${bank.questions.length} questions; the quiz draws ${pick.pick}`));
      picks.push({ bankFile: shownPath(materialsDir, loaded.file), bank, questions: bank.questions, random: pick.pick });
    } else {
      const chosen: Question[] = [];
      for (const name of pick.pick) {
        const question = bank.questions.find((one) => one.name.toLowerCase() === name.toLowerCase());
        if (question) chosen.push(question);
        else errors.push(finding(1, `${pick.bank} has no question named "${name}"`));
      }
      picks.push({ bankFile: shownPath(materialsDir, loaded.file), bank, questions: chosen });
    }
  }
  const names = picks.flatMap((pick) => (pick.random ? [] : pick.questions.map((question) => question.name.toLowerCase())));
  if (new Set(names).size !== names.length) warnings.push(finding(1, "a question is in the quiz twice"));
  return { picks, findings: { errors, warnings } };
}

/**
 * The criteria a material names that the teacher's plan doesn't have: looked for in the
 * knowledge base's curriculum pages and assessment matrix. Nothing to compare with (no such
 * pages yet): no finding. Their format is the teacher's norms', never assumed (ADR-025).
 */
export async function unknownCriteria(knowledgeDir: string, criteria: string[]): Promise<string[]> {
  if (!criteria.length) return [];
  const texts: string[] = [];
  const read = async (dir: string) => {
    for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
      if (entry.isFile() && entry.name.endsWith(".md")) texts.push(await readFile(path.join(dir, entry.name), "utf8").catch(() => ""));
    }
  };
  await read(path.join(knowledgeDir, "curriculum"));
  texts.push(await readFile(path.join(knowledgeDir, "assessment-matrix.md"), "utf8").catch(() => ""));
  texts.push(await readFile(path.join(knowledgeDir, "teaching-plan.md"), "utf8").catch(() => ""));
  const all = texts.join("\n");
  if (!all.trim()) return [];
  return [...new Set(criteria)].filter((id) => !new RegExp(`(^|[^\\w])${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\w]|$)`).test(all));
}
