import { marked } from "marked";
import TurndownService from "turndown";
import { validateGift } from "../validators/gift.js";
import { finding, type Answer, type Bank, type Finding, type Question } from "./model.js";

/**
 * Questions to GIFT and back (ADR-015): the format a classroom's question bank imports. The
 * exporter is where the bugs of hand-written GIFT stop: escapes, indentation that the importer
 * trims (code goes as `[html]` with `<pre>` and `&nbsp;`, as tests/2026-10-04T01-06-moodle-sin-clics/
 * proved), blank lines that end a question early. Its output goes through validateGift(); what
 * GIFT can't say without changing a question is refused for the teacher to decide, and what it
 * drops without changing it is a loss, said in the approval.
 */

/** Something the export drops without changing what's asked: told to the teacher before publishing. */
export interface Loss {
  code: "points";
  /** The questions it concerns. */
  questions: string[];
}

export interface GiftExport {
  gift: string;
  losses: Loss[];
  /** Questions it can't export as they are: the teacher's call (change or leave out). */
  errors: Finding[];
}

/** The fractions Moodle accepts for an option's grade, in percent. */
const MOODLE_FRACTIONS = [100, 90, 83.33333, 80, 75, 70, 66.66667, 60, 50, 40, 33.33333, 30, 25, 20, 16.66667, 14.28571, 12.5, 11.11111, 10, 5];

/** GIFT's special characters, escaped where they're meant literally. */
const escape = (text: string) => text.replace(/[\\~=#{}:]/g, "\\$&");

/** Markdown that needs HTML to survive: code, emphasis, lists, links, images, several paragraphs, tables. */
const needsHtml = (markdown: string) => /`|\*\*|__|\*\S|_\S|^\s*([-*+]|\d+\.)\s|\[[^\]]*\]\(|!\[|\n\s*\n|^\s*\|/m.test(markdown);

/** HTML on GIFT's terms: no blank line (it would end the question), code with its indentation as &nbsp;. */
function giftHtml(html: string): string {
  const parts = html.split(/(<pre[\s\S]*?<\/pre>)/);
  return parts
    .map((part) => {
      if (!part.startsWith("<pre")) return part.replace(/\s*\n\s*/g, " ");
      return part
        .replace(/<code class="[^"]*">/g, "<code>")
        .replace(/\n<\/code><\/pre>$/, "</code></pre>")
        .split("\n")
        .map((line) => line.replace(/^ +/, (spaces) => "&nbsp;".repeat(spaces.length)).replace(/\t/g, "&nbsp;".repeat(4)) || "&nbsp;")
        .join("\n");
    })
    .join("")
    .trim();
}

/** A question's text: plain when it is, `[html]` when Markdown carries more than words. */
function text(markdown: string): { gift: string; html: boolean } {
  if (!needsHtml(markdown)) return { gift: escape(markdown.replace(/\s*\n\s*/g, " ").trim()), html: false };
  return { gift: `[html]${escape(giftHtml(marked.parse(markdown, { async: false }) as string))}`, html: true };
}

/** An answer's or a feedback's text, in the question's format. */
function inline(markdown: string, html: boolean): string {
  const flat = markdown.replace(/\s*\n\s*/g, " ").trim();
  if (html) return escape(giftHtml(marked.parseInline(flat, { async: false }) as string));
  return escape(flat.replace(/`([^`]*)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1"));
}

const feedbackOf = (answer: Answer, html: boolean) => (answer.feedback ? `#${inline(answer.feedback, html)}` : "");
const generalOf = (question: Question, html: boolean) => (question.feedback ? `\n####${inline(question.feedback, html)}` : "");

function fraction(count: number, sign: 1 | -1): string | null {
  const value = 100 / count;
  const allowed = MOODLE_FRACTIONS.find((fraction) => Math.abs(fraction - value) < 0.0001);
  return allowed === undefined ? null : `%${sign < 0 ? "-" : ""}${allowed}%`;
}

function exportQuestion(question: Question, errors: Finding[]): string | null {
  const { gift: body, html } = text(question.text);
  const head = `::${escape(question.name)}::${body}`;
  switch (question.type) {
    case "single":
      return `${head} {\n${question.answers.map((answer) => `${answer.correct ? "=" : "~"}${inline(answer.text, html)}${feedbackOf(answer, html)}`).join("\n")}${generalOf(question, html)}\n}`;
    case "multiple": {
      const right = question.answers.filter((answer) => answer.correct).length;
      const wrong = question.answers.length - right;
      const plus = fraction(right, 1);
      const minus = wrong ? fraction(wrong, -1) : "";
      if (!plus || minus === null) {
        errors.push(finding(question.line, `"${question.name}": ${!plus ? right : wrong} ${!plus ? "right" : "wrong"} options don't split into a grade the classroom accepts (100/${!plus ? right : wrong}); add or remove an option`));
        return null;
      }
      return `${head} {\n${question.answers.map((answer) => `~${answer.correct ? plus : minus}${inline(answer.text, html)}${feedbackOf(answer, html)}`).join("\n")}${generalOf(question, html)}\n}`;
    }
    case "truefalse":
      return `${head} {${question.truth ? "TRUE" : "FALSE"}${generalOf(question, html)}}`;
    case "short":
      return `${head} {\n${question.answers.map((answer) => `=${inline(answer.text, html)}${feedbackOf(answer, html)}`).join("\n")}${generalOf(question, html)}\n}`;
    case "numeric":
      return `${head} {#${question.value}${question.tolerance ? `:${question.tolerance}` : ""}${generalOf(question, html)}}`;
    case "matching":
      return `${head} {\n${(question.pairs ?? []).map((pair) => `=${inline(pair.left, html)} -> ${inline(pair.right, false).replace(/->/g, "-\\>")}`).join("\n")}${generalOf(question, html)}\n}`;
    case "ordering":
      errors.push(finding(question.line, `"${question.name}": an ordering question can't go as GIFT; make it a matching question (each item with its position) or leave it out`));
      return null;
    case "essay":
      return `${head} {${generalOf(question, html)}}`;
  }
}

/** A bank (or some of its questions) as GIFT, in its category. */
export function exportGift(bank: Bank, questions: Question[] = bank.questions): GiftExport {
  const errors: Finding[] = [];
  const blocks = questions.map((question) => exportQuestion(question, errors)).filter((block): block is string => block !== null);
  const gift = `// ${bank.title} — exported by miyagi from materials/; edit the .questions.md, not this file.\n$CATEGORY: $course$/top/${bank.category}\n\n${blocks.join("\n\n")}\n`;
  // The exporter's own output is checked like any GIFT: a finding here is a bug of the exporter.
  for (const problem of validateGift(gift).errors) errors.push(finding(0, `the exported GIFT is invalid at its line ${problem.line}: ${problem.message}`));
  const pointed = questions.filter((question) => question.points !== 1).map((question) => question.name);
  return { gift, losses: pointed.length ? [{ code: "points", questions: pointed }] : [], errors };
}

// ---------- GIFT → .questions.md ----------

const unescape = (text: string) => text.replace(/\\([\\~=#{}:])/g, "$1");
const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });

/** A GIFT text as Markdown: `[html]` through turndown (the &nbsp; indentation back to spaces), the rest as it is. */
function markdownOf(raw: string): string {
  const trimmed = raw.trim();
  const format = /^\[(html|markdown|plain|moodle)\]/i.exec(trimmed);
  const body = unescape(format ? trimmed.slice(format[0].length) : trimmed);
  if (format?.[1]?.toLowerCase() === "html") {
    // Code as GIFT writes it, often a bare <pre>: turndown only takes <pre><code> for a code block.
    const html = body.replace(/<pre>(?!\s*<code)([\s\S]*?)<\/pre>/g, "<pre><code>$1</code></pre>").replace(/&nbsp;/g, "\u00a0");
    return turndown.turndown(html).replace(/\u00a0/g, " ").trim();
  }
  return body.trim();
}

/** Splits at unescaped `marker` characters. */
function splitUnescaped(text: string, marker: RegExp): string[] {
  const out: string[] = [];
  let current = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\\" && i + 1 < text.length) {
      current += text[i]! + text[i + 1]!;
      i++;
    } else if (marker.test(text[i]!)) {
      out.push(current);
      current = text[i]!;
    } else current += text[i]!;
  }
  out.push(current);
  return out;
}

/** One GIFT question to the neutral model; null for what isn't a question (or a type left out). */
function importQuestion(block: string, index: number): Question | null {
  const name = /^::((?:\\.|[^:])*)::/.exec(block);
  const rest = name ? block.slice(name[0].length) : block;
  const open = rest.search(/(?<!\\)\{/);
  const close = rest.lastIndexOf("}");
  if (open < 0 || close < open) return null;
  const question: Question = { name: name ? unescape(name[1]!).trim() : `Q${String(index + 1).padStart(2, "0")}`, type: "essay", text: markdownOf(rest.slice(0, open)), points: 1, criteria: [], answers: [], line: 0 };
  let answers = rest.slice(open + 1, close).trim();
  const general = answers.split(/(?<!\\)####/);
  if (general.length > 1) {
    answers = general[0]!.trim();
    question.feedback = markdownOf(general.slice(1).join("####"));
  }
  if (!answers) return question;
  if (/^(T|F|TRUE|FALSE)\b/i.test(answers)) return { ...question, type: "truefalse", truth: /^T/i.test(answers) };
  if (answers.startsWith("#")) {
    const spec = answers.slice(1).split("#")[0]!.trim();
    // A range (3..4) is its middle with half its width as tolerance.
    const range = /^(-?[\d.]+)\.\.(-?[\d.]+)$/.exec(spec);
    if (range) {
      const [low, high] = [Number(range[1]), Number(range[2])];
      return { ...question, type: "numeric", value: (low + high) / 2, tolerance: Math.abs(high - low) / 2 };
    }
    const [value, tolerance] = spec.split(":");
    return { ...question, type: "numeric", value: Number(value), tolerance: tolerance ? Number(tolerance) : 0 };
  }
  const parts = splitUnescaped(answers, /[=~]/).map((part) => part.trim()).filter(Boolean);
  if (parts.every((part) => part.startsWith("=")) && parts.some((part) => /(?<!\\)->/.test(part))) {
    return { ...question, type: "matching", pairs: parts.map((part) => { const [left, right] = part.slice(1).split(/(?<!\\)->/); return { left: markdownOf(left ?? ""), right: markdownOf(right ?? "") }; }) };
  }
  const parsed = parts.map((part) => {
    const [body, feedback] = splitUnescaped(part.slice(1), /#/);
    const weight = /^%(-?[\d.]+)%/.exec(body ?? "");
    const answerText = markdownOf(weight ? body!.slice(weight[0].length) : body ?? "");
    const correct = part.startsWith("=") || (weight ? Number(weight[1]) > 0 : false);
    return { text: answerText, correct, ...(feedback ? { feedback: markdownOf(feedback.slice(1)) } : {}) };
  });
  if (parts.every((part) => part.startsWith("="))) return { ...question, type: "short", answers: parsed };
  return { ...question, type: parsed.filter((answer) => answer.correct).length > 1 ? "multiple" : "single", answers: parsed };
}

/** A GIFT file (a teacher's bank, an old drafts/ file, a classroom's export) to the neutral model. */
export function importGift(source: string, title: string): Bank {
  let category = title;
  const blocks: string[] = [];
  let current: string[] = [];
  for (const line of source.replace(/\r\n/g, "\n").split("\n")) {
    const trimmed = line.trim();
    const cat = /^\$CATEGORY:\s*(.+)$/.exec(trimmed);
    if (cat) category = cat[1]!.replace(/^\$course\$\/top\//, "").replace(/^\$course\$\//, "").trim() || category;
    if (!trimmed || trimmed.startsWith("//") || cat) {
      if (current.length) blocks.push(current.join("\n"));
      current = [];
      continue;
    }
    current.push(line);
  }
  if (current.length) blocks.push(current.join("\n"));
  return { kind: "questions", title, category, questions: blocks.map(importQuestion).filter((question): question is Question => question !== null) };
}
