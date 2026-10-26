import { marked, type Token, type Tokens } from "marked";
import { splitFrontmatter, stringList } from "./frontmatter.js";
import { finding, QUESTION_LEVELS, QUESTION_TYPES, type Answer, type Bank, type Finding, type Parsed, type Question, type QuestionLevel, type QuestionType } from "./model.js";

/**
 * A question bank, `<slug>.questions.md` (ADR-015): a frontmatter (title, category, default
 * criteria) and one `## name` section per question:
 *
 *     ## T1-01 Qué guarda una variable
 *     type: single · points: 1 · criteria: 1.1 · level: basic
 *
 *     ¿Qué guarda una variable?            ← the text: any Markdown, code blocks too
 *
 *     - [x] Un valor que puede cambiar     ← the answers: a task list, the right ones checked
 *     - [ ] Siempre el mismo valor
 *       > Eso es una constante.            ← an option's feedback, indented under it
 *
 *     > Una variable nombra un valor.      ← the question's feedback, last
 *
 * The metadata line is optional: the type is inferred from the answers when it isn't given
 * (one checked: single; several: multiple; `a -> b`: matching; a numbered list: ordering;
 * `answer: true`: truefalse; `answer: 3.5`: numeric; nothing: essay). Read with marked's
 * tokenizer, so code blocks and lists are what Markdown says they are.
 */

const META_KEYS = ["type", "points", "criteria", "level", "answer", "tolerance"] as const;
const META_LINE = new RegExp(`^(${META_KEYS.join("|")})\\s*:`, "i");

/** The line (1-based) each token starts at, from their raw text. */
function withLines(tokens: Token[], firstLine: number): { token: Token; line: number }[] {
  let line = firstLine;
  return tokens.map((token) => {
    const at = line;
    line += (token.raw.match(/\n/g) ?? []).length;
    return { token, line: at };
  });
}

/** `type: single · points: 2` (one line, or one key per line): the keys found, or null if it isn't metadata. */
function readMeta(text: string): Record<string, string> | null {
  const parts = text.split(/\n|\s·\s|\s\|\s/).map((part) => part.trim()).filter(Boolean);
  if (!parts.length || !parts.every((part) => META_LINE.test(part))) return null;
  return Object.fromEntries(parts.map((part) => [part.slice(0, part.indexOf(":")).trim().toLowerCase(), part.slice(part.indexOf(":") + 1).trim()]));
}

/** An item's own text and its feedback (a quote nested under it). */
function itemParts(item: Tokens.ListItem): { text: string; feedback?: string } {
  const quote = item.tokens.find((token) => token.type === "blockquote") as Tokens.Blockquote | undefined;
  const own = item.tokens
    .filter((token) => token.type !== "blockquote" && token.type !== "checkbox")
    .map((token) => token.raw)
    .join("")
    .trim();
  return { text: own.replace(/^\[[ xX]\]\s*/, ""), ...(quote ? { feedback: quote.text.trim() } : {}) };
}

const MATCH = /\s(?:->|→)\s/;

function inferType(list: Tokens.List | undefined, meta: Record<string, string>): QuestionType {
  if (meta.answer !== undefined) return /^(true|false|verdadero|falso)$/i.test(meta.answer) ? "truefalse" : "numeric";
  if (!list) return "essay";
  if (list.items.every((item) => MATCH.test(item.text))) return "matching";
  if (list.ordered && !list.items.some((item) => item.task)) return "ordering";
  return list.items.filter((item) => item.checked).length > 1 ? "multiple" : "single";
}

function parseQuestion(name: string, line: number, section: { token: Token; line: number }[], defaults: { criteria: string[]; level?: string }, findings: Finding[]): Question {
  const tokens = section.filter(({ token }) => token.type !== "space");
  let meta: Record<string, string> = {};
  if (tokens[0]?.token.type === "paragraph") {
    const read = readMeta((tokens[0].token as Tokens.Paragraph).text);
    if (read) {
      meta = read;
      tokens.shift();
    }
  }
  // The question's feedback: a quote at the very end; its answers: the last list before it.
  let feedback: string | undefined;
  const last = tokens[tokens.length - 1];
  if (last?.token.type === "blockquote" && tokens.some(({ token }) => token.type === "list")) {
    feedback = (last.token as Tokens.Blockquote).text.trim();
    tokens.pop();
  }
  const listAt = tokens.map(({ token }) => token.type).lastIndexOf("list");
  const answersAt = listAt === tokens.length - 1 ? listAt : -1;
  const list = answersAt >= 0 ? (tokens[answersAt]!.token as Tokens.List) : undefined;
  const textTokens = answersAt >= 0 ? tokens.slice(0, answersAt) : tokens;
  const text = textTokens.map(({ token }) => token.raw).join("\n").replace(/\n{3,}/g, "\n\n").trim();

  const given = meta.type?.toLowerCase();
  if (given && !QUESTION_TYPES.includes(given as QuestionType)) findings.push(finding(line, `"${name}": unknown type "${meta.type}" (${QUESTION_TYPES.join(", ")})`));
  const type = (given && QUESTION_TYPES.includes(given as QuestionType) ? given : inferType(list, meta)) as QuestionType;
  const points = meta.points === undefined ? 1 : Number(meta.points.replace(",", "."));
  if (!(points > 0)) findings.push(finding(line, `"${name}": points must be a number above 0, not "${meta.points}"`));
  const question: Question = { name, type, text, points: points > 0 ? points : 1, criteria: meta.criteria ? stringList(meta.criteria) : defaults.criteria, answers: [], line, ...(feedback ? { feedback } : {}) };
  const level = (meta.level ?? defaults.level)?.trim().toLowerCase();
  if (level !== undefined) {
    if (QUESTION_LEVELS.includes(level as QuestionLevel)) question.level = level as QuestionLevel;
    else findings.push(finding(line, `"${name}": unknown level "${level}" (${QUESTION_LEVELS.join(", ")})`));
  }
  if (!text) findings.push(finding(line, `"${name}": it has no text`));
  // A checklist inside the text is answers in the wrong place: they go after it, last.
  const misplaced = textTokens.find(({ token }) => token.type === "list" && (token as Tokens.List).items.some((item) => item.task));
  if (misplaced) findings.push(finding(misplaced.line, `"${name}": the answers ("- [x] ...") go after the question's text, as its last list`));
  const listLine = answersAt >= 0 ? tokens[answersAt]!.line : line;

  switch (type) {
    case "single":
    case "multiple":
    case "short": {
      if (!list) {
        findings.push(finding(line, `"${name}": a ${type} question needs its answers as a list ("- [x] right", "- [ ] wrong")`));
        break;
      }
      question.answers = list.items.map((item): Answer => ({ ...itemParts(item), correct: item.checked === true || (type === "short" && !item.task) }));
      const right = question.answers.filter((answer) => answer.correct).length;
      if (type === "short") {
        if (list.items.some((item) => item.task && !item.checked)) findings.push(finding(listLine, `"${name}": in a short answer every item is an accepted answer; an unchecked one would be accepted as right too`));
        if (!right) findings.push(finding(listLine, `"${name}": a short answer needs at least one accepted answer`));
      } else {
        if (question.answers.length < 2) findings.push(finding(listLine, `"${name}": it needs at least two options`));
        if (type === "single" && right !== 1) findings.push(finding(listLine, `"${name}": a single-answer question needs exactly one right option, checked ("- [x]"); it has ${right}`));
        if (type === "multiple" && right < 1) findings.push(finding(listLine, `"${name}": a multiple-answer question needs at least one right option, checked ("- [x]")`));
        if (type === "multiple" && right === question.answers.length) findings.push(finding(listLine, `"${name}": every option is right: nothing tells apart who knows from who ticks everything`));
      }
      // A short answer may accept the same word written two ways (def, DEF) on purpose.
      const texts = question.answers.map((answer) => (type === "short" ? answer.text : answer.text.toLowerCase()));
      if (new Set(texts).size !== texts.length) findings.push(finding(listLine, `"${name}": two answers are the same`));
      if (question.answers.some((answer) => !answer.text)) findings.push(finding(listLine, `"${name}": an answer is empty`));
      break;
    }
    case "truefalse":
      if (!/^(true|false|verdadero|falso)$/i.test(meta.answer ?? "")) findings.push(finding(line, `"${name}": a true/false question needs "answer: true" or "answer: false"`));
      else question.truth = /^(true|verdadero)$/i.test(meta.answer!);
      break;
    case "numeric": {
      const value = Number((meta.answer ?? "").replace(",", "."));
      const tolerance = meta.tolerance === undefined ? 0 : Number(meta.tolerance.replace(",", "."));
      if (meta.answer === undefined || Number.isNaN(value)) findings.push(finding(line, `"${name}": a numeric question needs "answer: <number>"`));
      else question.value = value;
      if (Number.isNaN(tolerance) || tolerance < 0) findings.push(finding(line, `"${name}": the tolerance must be a number of 0 or more`));
      else question.tolerance = tolerance;
      break;
    }
    case "matching":
      question.pairs = (list?.items ?? []).map((item) => {
        const [left, right] = itemParts(item).text.split(MATCH);
        return { left: (left ?? "").trim(), right: (right ?? "").trim() };
      });
      if (question.pairs.some((pair) => !pair.left || !pair.right)) findings.push(finding(listLine, `"${name}": every pair is "left -> right"`));
      if (question.pairs.length < 3) findings.push(finding(listLine, `"${name}": a matching question needs at least three pairs`));
      break;
    case "ordering":
      question.order = (list?.items ?? []).map((item) => itemParts(item).text);
      if (question.order.length < 2) findings.push(finding(listLine, `"${name}": an ordering question needs at least two items, as a numbered list in their right order`));
      break;
    case "essay":
      if (list && answersAt >= 0 && list.items.some((item) => item.task)) findings.push(finding(listLine, `"${name}": an essay has no options; is it another type?`));
      break;
  }
  return question;
}

/** Parses and checks a bank: what's wrong is an error (it can't be exported as it is) or a warning. */
export function parseQuestions(source: string): Parsed<Bank> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, body, bodyLine, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" && data.title.trim() ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const defaults = { criteria: stringList(data.criteria), ...(typeof data.level === "string" ? { level: data.level } : {}) };

  const tokens = withLines(marked.lexer(body), bodyLine);
  const questions: Question[] = [];
  let current: { name: string; line: number; section: { token: Token; line: number }[] } | null = null;
  const close = () => {
    if (current) questions.push(parseQuestion(current.name, current.line, current.section, defaults, errors));
  };
  for (const entry of tokens) {
    const token = entry.token;
    if (token.type === "heading" && (token as Tokens.Heading).depth <= 2) {
      close();
      current = (token as Tokens.Heading).depth === 2 ? { name: (token as Tokens.Heading).text.trim(), line: entry.line, section: [] } : null;
      continue;
    }
    if (current) current.section.push(entry);
    else if (token.type !== "space" && token.type !== "heading") warnings.push(finding(entry.line, "text outside any question (a question starts with a ## heading) is ignored"));
  }
  close();
  if (!questions.length) errors.push(finding(bodyLine, `no questions: each one starts with a "## name" heading`));
  const seen = new Map<string, number>();
  for (const question of questions) {
    const key = question.name.toLowerCase();
    if (seen.has(key)) errors.push(finding(question.line, `"${question.name}": the name is repeated (line ${seen.get(key)}); names identify the questions in the bank`));
    else seen.set(key, question.line);
  }
  // A few checks that don't stop an export: they're for the teacher to look at.
  for (const question of questions) {
    if ((question.type === "single" || question.type === "multiple") && !question.answers.some((answer) => !answer.correct && answer.feedback)) {
      warnings.push(finding(question.line, `"${question.name}": no wrong option says why it's wrong (feedback indented under it, "  > ...")`));
    }
  }
  const category = typeof data.category === "string" && data.category.trim() ? data.category.trim() : title;
  return { material: { kind: "questions", title, category, questions }, findings: { errors, warnings } };
}
