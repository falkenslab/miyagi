import { marked, type Tokens } from "marked";
import { splitFrontmatter } from "./frontmatter.js";
import { finding, type Finding, type Parsed } from "./model.js";

/**
 * An interests survey, `materials/surveys/<slug>.survey.md` (#39, ADR-018): what a group cares
 * about, to set an activity's variants in it, never who answered what. It says what it's for and
 * that it's anonymous, and it can't ask anything that identifies a student or that's sensitive
 * (health, beliefs, origin...): the validator refuses it. Its answers are kept only in aggregate,
 * each category with at least three answers (aggregateSurvey()).
 *
 *     ---
 *     title: ¿Qué os interesa?
 *     purpose: Saber qué temas os interesan para ambientar en ellos las actividades del tema 3.
 *     anonymous: true
 *     group: A                 # optional: a group of materials/course.md
 *     ---
 *     ## Temas
 *     type: multiple
 *
 *     ¿Sobre qué te gustaría que fueran los ejemplos? Marca los que quieras.
 *
 *     - Videojuegos
 *     - Deporte
 *     - Música
 *
 *     ## Algo más
 *     type: text
 */

export const SURVEY_TYPES = ["single", "multiple", "text"] as const;
export type SurveyQuestionType = (typeof SURVEY_TYPES)[number];

export interface SurveyQuestion {
  name: string;
  type: SurveyQuestionType;
  text: string;
  options: string[];
  line: number;
}

export interface Survey {
  kind: "survey";
  title: string;
  /** What students read first: what it's for, and that it's anonymous and voluntary. */
  purpose: string;
  group?: string;
  questions: SurveyQuestion[];
}

/** The fewest answers a category needs to be kept: below it, a student could be recognised. */
export const MIN_ANSWERS = 3;

/** What identifies a student, in the languages miyagi speaks. */
const IDENTIFYING = /\b(nombre y apellidos|tu nombre|apellidos?|full name|your name|surname|nom et prénom|ton nom|vor- und nachname|dein name|e-?mail|correo|courriel|tel[eé]fono|phone|t[eé]l[eé]phone|telefon|direcci[oó]n|address|adresse|anschrift|dni|nie|nif|pasaporte|passport|fecha de nacimiento|date of birth|birthday|date de naissance|geburtsdatum|cumpleaños|n[uú]mero de (lista|matr[ií]cula|expediente)|student (id|number)|usuario|username|login)\b/i;
/** What's sensitive about a person, whoever asks it. */
const SENSITIVE = /\b(salud|health|sant[eé]|gesundheit|enfermedad|illness|maladie|krankheit|discapacidad|disability|handicap|behinderung|diagn[oó]stic\w*|diagnos\w*|medicaci[oó]n|medication|religi\w*|creencias?|beliefs?|croyances?|glaube|etnia|[eé]tnic\w*|ethnic\w*|raza|rasse|orientaci[oó]n sexual|sexual\w*|identidad de g[eé]nero|gender|identit[eé] de genre|geschlecht|pol[ií]tic\w*|politi\w*|sindica\w*|trade union|ingresos|income|revenus|einkommen|renta|salario|nacionalidad|nationality|nationalit[eé]|staatsangeh[oö]rigkeit|inmigra\w*|immigra\w*|país de origen|country of origin|divorci\w*|separaci[oó]n de tus padres|antecedentes)\b/i;

export function parseSurvey(source: string): Parsed<Survey> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, body, bodyLine, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const purpose = typeof data.purpose === "string" ? data.purpose.trim() : "";
  if (purpose.length < 30) errors.push(finding(1, `"purpose" says students what it's for and what will be done with it, in a sentence or two`));
  if (data.anonymous !== true) errors.push(finding(1, `"anonymous: true": an interests survey is always anonymous, so nobody's answers can be told apart`));
  const group = data.group === undefined ? undefined : String(data.group).trim();

  const questions: SurveyQuestion[] = [];
  let current: SurveyQuestion | null = null;
  let line = bodyLine;
  for (const token of marked.lexer(body)) {
    const at = line;
    line += (token.raw.match(/\n/g) ?? []).length;
    if (token.type === "heading" && (token as Tokens.Heading).depth === 2) {
      current = { name: (token as Tokens.Heading).text.trim(), type: "single", text: "", options: [], line: at };
      questions.push(current);
      continue;
    }
    if (!current || token.type === "space") continue;
    const meta = /^type\s*:\s*(\w+)\s*$/i.exec(token.raw.trim());
    if (meta) {
      const type = meta[1]!.toLowerCase();
      if (SURVEY_TYPES.includes(type as SurveyQuestionType)) current.type = type as SurveyQuestionType;
      else errors.push(finding(at, `"${current.name}": unknown type "${type}" (${SURVEY_TYPES.join(", ")})`));
    } else if (token.type === "list") current.options.push(...(token as Tokens.List).items.map((item) => item.text.trim()));
    else current.text = `${current.text}\n\n${token.raw.trim()}`.trim();
  }
  if (!questions.length) errors.push(finding(bodyLine, `no questions: each one starts with a "## name" heading`));
  for (const question of questions) {
    if (question.type !== "text" && question.options.length < 2) errors.push(finding(question.line, `"${question.name}": a ${question.type} question needs two options or more, as a list`));
    if (question.type === "text" && question.options.length) warnings.push(finding(question.line, `"${question.name}": a text question has no options; they're ignored`));
    if (question.type === "text") warnings.push(finding(question.line, `"${question.name}": free text is summarised in themes, never quoted; ask about interests, not about people`));
    const all = [question.name, question.text, ...question.options].join("\n");
    if (IDENTIFYING.test(all)) errors.push(finding(question.line, `"${question.name}": it asks something that identifies a student ("${IDENTIFYING.exec(all)![0]}"); an interests survey is anonymous`));
    if (SENSITIVE.test(all)) errors.push(finding(question.line, `"${question.name}": it asks about something sensitive ("${SENSITIVE.exec(all)![0]}"); only interests and preferences go in a survey`));
  }
  if (questions.length > 8) warnings.push(finding(1, `${questions.length} questions: a short survey (three to five) gets more answers`));
  return { material: { kind: "survey", title, purpose, ...(group ? { group } : {}), questions }, findings: { errors, warnings } };
}

/** A question's results as the classroom reports them: each option's count, or how many wrote text. */
export interface SurveyResult {
  text: string;
  options?: { text: string; count: number }[];
  textAnswers?: number;
}

/**
 * What may be kept of a survey's results: each option with at least MIN_ANSWERS answers; the
 * rest together only when they add up to that; free text only as how many wrote something,
 * summarised by themes the model finds (each repeated MIN_ANSWERS times or more), never quoted.
 * Too few responses: nothing at all.
 */
export function aggregateSurvey(responses: number, results: SurveyResult[], min = MIN_ANSWERS): { kept: string[]; left: number } {
  if (responses < min) return { kept: [], left: results.length };
  const kept: string[] = [];
  let left = 0;
  for (const result of results) {
    if (result.options) {
      const enough = result.options.filter((option) => option.count >= min).sort((a, b) => b.count - a.count);
      const rest = result.options.filter((option) => option.count < min).reduce((sum, option) => sum + option.count, 0);
      left += result.options.length - enough.length;
      const parts = enough.map((option) => `${option.text} (${option.count})`);
      if (rest >= min) parts.push(`other options together (${rest})`);
      kept.push(`- ${result.text}: ${parts.length ? parts.join(", ") : "no option with enough answers to keep"}`);
    } else if (result.textAnswers !== undefined) {
      kept.push(`- ${result.text}: ${result.textAnswers} wrote something; summarise their themes, each one only if ${min} or more mention it, never quoting them`);
    }
  }
  return { kept, left };
}
