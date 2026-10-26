import type { Finding, ValidationResult } from "../validators/gift.js";
import type { Assignment } from "./assignment.js";
import type { CourseCalendar } from "./course.js";
import type { Grading } from "./grading.js";
import type { Notes } from "./notes.js";
import type { Rubric } from "./rubric.js";
import type { Unit } from "./unit.js";

/**
 * The neutral materials of a subject (ADR-015): Markdown the teacher can read and edit in
 * `materials/`, published to a classroom through exporters (code, not the model). This is
 * their model once parsed: what the validator checks, the hash fingerprints and the exporters
 * turn into a platform's format.
 */

export type { Finding, ValidationResult };

export const QUESTION_TYPES = ["single", "multiple", "truefalse", "short", "numeric", "matching", "ordering", "essay"] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_LEVELS = ["basic", "intermediate", "advanced"] as const;
export type QuestionLevel = (typeof QUESTION_LEVELS)[number];

/** One answer of a question: an option (single, multiple), an accepted text (short). */
export interface Answer {
  text: string;
  correct: boolean;
  feedback?: string;
}

export interface Question {
  /** Its name in the bank: the `##` heading, e.g. "T1-01 Qué guarda una variable". */
  name: string;
  type: QuestionType;
  /** The question's text, as Markdown (code blocks, lists, emphasis). */
  text: string;
  points: number;
  /** The criteria or learning outcomes it gives evidence of (`CE1a`, `RA2`...). */
  criteria: string[];
  /** single, multiple, short. */
  answers: Answer[];
  /** truefalse. */
  truth?: boolean;
  /** numeric. */
  value?: number;
  tolerance?: number;
  /** matching: left → right. */
  pairs?: { left: string; right: string }[];
  /** ordering: the items in their right order. */
  order?: string[];
  /** Shown after answering, whatever the answer. */
  feedback?: string;
  /** How hard it is, for an exam bank by criterion and level; unset when not said. */
  level?: QuestionLevel;
  /** Where its heading is in the file (1-based). */
  line: number;
}

/** A question bank: `<slug>.questions.md`. */
export interface Bank {
  kind: "questions";
  title: string;
  /** Where its questions go in the classroom's bank; its title when not given. */
  category: string;
  questions: Question[];
}

/** One part of a quiz: questions from a bank, all, some by name, or a number drawn at random. */
export interface QuizPick {
  bank: string;
  /** "all", a number drawn at random, or the names chosen. */
  pick: "all" | number | string[];
  /** Only the bank's questions with one of these criteria and this level (an exam bank's filter). */
  criteria?: string[];
  level?: QuestionLevel;
}

/** A quiz: `<slug>.quiz.md`, what it's for and what goes in it; its settings are intent, not a platform's fields. */
export interface Quiz {
  kind: "quiz";
  title: string;
  purpose: "practice" | "exam" | "diagnostic";
  /** Free settings, as the teacher wrote them (attempts, time limit, review...): the classroom's skill maps them. */
  settings: Record<string, string>;
  questions: QuizPick[];
  /** What students read before starting, as Markdown. */
  description: string;
}

export type Material = Bank | Quiz | Notes | Assignment | Rubric | Grading | CourseCalendar | Unit;

/** A parse's result: the material (when it could be read at all) and what's wrong with it. */
export interface Parsed<T> {
  material?: T;
  findings: ValidationResult;
}

export const finding = (line: number, message: string): Finding => ({ line, message });
