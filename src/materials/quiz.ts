import { splitFrontmatter, stringList } from "./frontmatter.js";
import { finding, QUESTION_LEVELS, type Finding, type Parsed, type QuestionLevel, type Quiz, type QuizPick } from "./model.js";

/**
 * A quiz, `<slug>.quiz.md` (ADR-015): what it's for and what goes in it, in the frontmatter;
 * its description for students, the body.
 *
 *     ---
 *     title: Repaso del tema 1
 *     purpose: practice            # practice, exam or diagnostic
 *     settings:                    # intent, in the teacher's words: the classroom's skill maps them
 *       attempts: unlimited
 *       time limit: none
 *     questions:
 *       - bank: tema-1.questions.md
 *         pick: all                # all, a number drawn at random, or names: [T1-01, T1-03]
 *         criteria: [1.1]          # optional, with all or a number: only these criteria
 *         level: basic             # optional: basic, intermediate or advanced
 *     ---
 *     Diez preguntas para repasar antes del examen…
 */

const PURPOSES = ["practice", "exam", "diagnostic"] as const;

export function parseQuiz(source: string): Parsed<Quiz> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, body, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const purpose = String(data.purpose ?? "practice").toLowerCase();
  if (!PURPOSES.includes(purpose as Quiz["purpose"])) errors.push(finding(1, `"purpose" is practice, exam or diagnostic, not "${String(data.purpose)}"`));
  const settings: Record<string, string> = {};
  if (data.settings && typeof data.settings === "object" && !Array.isArray(data.settings)) {
    for (const [key, value] of Object.entries(data.settings as Record<string, unknown>)) settings[key] = String(value);
  }
  const questions: QuizPick[] = [];
  const raw = Array.isArray(data.questions) ? data.questions : [];
  if (!raw.length) errors.push(finding(1, `"questions" lists where its questions come from: - bank: <file>.questions.md, pick: all | <number> | [names]`));
  raw.forEach((entry, index) => {
    const part = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
    const bank = typeof part.bank === "string" ? part.bank.trim() : "";
    if (!bank.endsWith(".questions.md")) errors.push(finding(1, `questions[${index + 1}]: "bank" names a .questions.md file`));
    let pick: QuizPick["pick"] = "all";
    if (typeof part.pick === "number") pick = part.pick;
    else if (Array.isArray(part.pick) || (typeof part.pick === "string" && part.pick.trim() !== "all" && part.pick.includes(","))) pick = stringList(part.pick);
    else if (typeof part.pick === "string" && /^\d+$/.test(part.pick.trim())) pick = Number(part.pick.trim());
    else if (part.pick !== undefined && String(part.pick).trim() !== "all") pick = stringList(part.pick);
    if (typeof pick === "number" && pick < 1) errors.push(finding(1, `questions[${index + 1}]: "pick" draws at least one question`));
    const criteria = part.criteria === undefined ? [] : stringList(part.criteria);
    const level = part.level === undefined ? undefined : String(part.level).trim().toLowerCase();
    if (level !== undefined && !QUESTION_LEVELS.includes(level as QuestionLevel)) errors.push(finding(1, `questions[${index + 1}]: unknown level "${level}" (${QUESTION_LEVELS.join(", ")})`));
    if ((criteria.length || level) && Array.isArray(pick)) warnings.push(finding(1, `questions[${index + 1}]: questions picked by name aren't filtered by criteria or level`));
    questions.push({ bank, pick, ...(criteria.length ? { criteria } : {}), ...(level && QUESTION_LEVELS.includes(level as QuestionLevel) ? { level: level as QuestionLevel } : {}) });
  });
  if (!body.trim()) warnings.push(finding(1, "no description: students start without knowing what it covers, how long it takes or how it counts"));
  return { material: { kind: "quiz", title, purpose: (PURPOSES.includes(purpose as Quiz["purpose"]) ? purpose : "practice") as Quiz["purpose"], settings, questions, description: body.trim() }, findings: { errors, warnings } };
}
