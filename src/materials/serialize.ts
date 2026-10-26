import { stringify } from "yaml";
import type { Bank, Question } from "./model.js";

/**
 * A bank back to `.questions.md`: what an import writes (a teacher's GIFT bank, an old drafts/
 * file, a classroom's bank), in the same format the teacher edits and parseQuestions() reads.
 */

const quote = (text: string) => text.split("\n").map((line) => `> ${line}`.trimEnd()).join("\n");

function answersOf(question: Question): string {
  switch (question.type) {
    case "single":
    case "multiple":
    case "short":
      return question.answers
        .map((answer) => `- [${answer.correct ? "x" : " "}] ${answer.text.replace(/\n+/g, " ")}${answer.feedback ? `\n  ${quote(answer.feedback.replace(/\n+/g, " "))}` : ""}`)
        .join("\n");
    case "matching":
      return (question.pairs ?? []).map((pair) => `- ${pair.left} -> ${pair.right}`).join("\n");
    case "ordering":
      return (question.order ?? []).map((item, index) => `${index + 1}. ${item}`).join("\n");
    default:
      return "";
  }
}

function metaOf(question: Question, defaultCriteria: string[]): string {
  const parts = [`type: ${question.type}`];
  if (question.points !== 1) parts.push(`points: ${question.points}`);
  if (question.criteria.length && question.criteria.join(",") !== defaultCriteria.join(",")) parts.push(`criteria: ${question.criteria.join(", ")}`);
  if (question.type === "truefalse") parts.push(`answer: ${question.truth ? "true" : "false"}`);
  if (question.type === "numeric") {
    parts.push(`answer: ${question.value}`);
    if (question.tolerance) parts.push(`tolerance: ${question.tolerance}`);
  }
  return parts.join(" · ");
}

export function serializeBank(bank: Bank, defaultCriteria: string[] = []): string {
  const front = stringify({ title: bank.title, ...(bank.category !== bank.title ? { category: bank.category } : {}), ...(defaultCriteria.length ? { criteria: defaultCriteria } : {}) }).trim();
  const sections = bank.questions.map((question) => {
    const answers = answersOf(question);
    return [`## ${question.name}`, metaOf(question, defaultCriteria), "", question.text, ...(answers ? ["", answers] : []), ...(question.feedback ? ["", quote(question.feedback)] : [])].join("\n");
  });
  return `---\n${front}\n---\n\n${sections.join("\n\n")}\n`;
}
