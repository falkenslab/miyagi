import { marked } from "marked";
import type { Question } from "./model.js";

/**
 * Paper exams from a quiz (ADR-015): versions A, B… with the questions and their options in
 * another order, drawn from a seed kept next to them, so the same seed gives the same versions
 * and a lost copy can be printed again. Each version comes with its answer key.
 */

export interface ExamLabels {
  name: string;
  version: string;
  key: string;
  points: (n: number) => string;
  trueFalse: [string, string];
}

export interface Exam {
  seed: number;
  versions: { letter: string; html: string }[];
  key: string;
}

/** A small seeded generator (mulberry32): the same seed, the same sequence, on any machine. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], next: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

const md = (text: string) => marked.parse(text, { async: false }) as string;
const mdInline = (text: string) => marked.parseInline(text, { async: false }) as string;
const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

const STYLE = `body{font-family:Georgia,"Times New Roman",serif;max-width:46em;margin:1.5em auto;padding:0 1em;line-height:1.45}
h1{font-size:1.5em;margin-bottom:.2em}header p{display:flex;gap:2em;flex-wrap:wrap}
ol.questions>li{margin:1.2em 0;break-inside:avoid}ol.options{list-style:none;padding-left:1em}
pre{background:#f4f4f4;padding:.6em;border-radius:4px;overflow-x:auto}.points{color:#555;font-size:.9em}
.lines{border-bottom:1px solid #999;height:1.6em}table{border-collapse:collapse}td,th{border:1px solid #999;padding:.3em .6em;text-align:left}
@media print{body{margin:0}}`;

function page(title: string, body: string, lang: string): string {
  return `<!doctype html>\n<html lang="${lang}">\n<head>\n<meta charset="utf-8">\n<title>${escapeHtml(title)}</title>\n<style>${STYLE}</style>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}

/** One version: its questions in order with what each shows, and its key. */
function version(questions: Question[], next: () => number, labels: ExamLabels): { items: string[]; key: string[] } {
  const items: string[] = [];
  const key: string[] = [];
  for (const question of shuffled(questions, next)) {
    let answers = "";
    switch (question.type) {
      case "single":
      case "multiple": {
        const options = shuffled(question.answers, next);
        answers = `<ol class="options">${options.map((answer, i) => `<li>${LETTERS[i]}) ${mdInline(answer.text)}</li>`).join("")}</ol>`;
        key.push(options.map((answer, i) => (answer.correct ? LETTERS[i] : "")).filter(Boolean).join(", "));
        break;
      }
      case "truefalse":
        answers = `<ol class="options"><li>a) ${labels.trueFalse[0]}</li><li>b) ${labels.trueFalse[1]}</li></ol>`;
        key.push(question.truth ? `a) ${labels.trueFalse[0]}` : `b) ${labels.trueFalse[1]}`);
        break;
      case "matching": {
        const right = shuffled((question.pairs ?? []).map((pair) => pair.right), next);
        answers = `<table><tbody>${(question.pairs ?? []).map((pair, i) => `<tr><td>${i + 1}. ${mdInline(pair.left)}</td><td>${LETTERS[i]}) ${mdInline(right[i]!)}</td></tr>`).join("")}</tbody></table>`;
        key.push((question.pairs ?? []).map((pair, i) => `${i + 1}-${LETTERS[right.indexOf(pair.right)]}`).join(", "));
        break;
      }
      case "ordering": {
        const items2 = shuffled(question.order ?? [], next);
        answers = `<ol class="options">${items2.map((item, i) => `<li>${LETTERS[i]}) ${mdInline(item)}</li>`).join("")}</ol>`;
        key.push((question.order ?? []).map((item) => LETTERS[items2.indexOf(item)]).join(" → "));
        break;
      }
      case "short":
        answers = `<div class="lines"></div>`;
        key.push(question.answers.map((answer) => answer.text).join(" / "));
        break;
      case "numeric":
        answers = `<div class="lines"></div>`;
        key.push(`${question.value}${question.tolerance ? ` ± ${question.tolerance}` : ""}`);
        break;
      case "essay":
        answers = `<div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div>`;
        key.push("—");
        break;
    }
    items.push(`<li>${md(question.text)}<p class="points">${labels.points(question.points)}</p>${answers}</li>`);
  }
  return { items, key };
}

export function paperExam(title: string, description: string, questions: Question[], count: number, seed: number, labels: ExamLabels, lang: string): Exam {
  const next = random(seed);
  const versions: Exam["versions"] = [];
  const keys: string[] = [];
  for (let v = 0; v < count; v++) {
    const letter = String.fromCharCode(65 + v);
    const { items, key } = version(questions, next, labels);
    versions.push({
      letter,
      html: page(`${title} · ${labels.version} ${letter}`, `<header><h1>${escapeHtml(title)}</h1><p><span>${labels.name}: ______________________________</span><span>${labels.version} ${letter}</span></p></header>\n${description ? md(description) : ""}\n<ol class="questions">${items.join("\n")}</ol>`, lang),
    });
    keys.push(`<h2>${labels.version} ${letter}</h2><ol>${key.map((answer) => `<li>${escapeHtml(answer)}</li>`).join("")}</ol>`);
  }
  return { seed, versions, key: page(`${title} · ${labels.key}`, `<h1>${escapeHtml(title)} · ${labels.key}</h1>\n${keys.join("\n")}`, lang) };
}

/** The questions a quiz's random picks put in a paper exam: drawn with the same seed, so they're the same each time. */
export function drawn<T>(items: readonly T[], count: number, seed: number): T[] {
  return shuffled(items, random(seed ^ 0x9e3779b9)).slice(0, count);
}
