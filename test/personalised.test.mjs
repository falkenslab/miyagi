// Unit tests of personalised activities (#39), on the built code in dist/: the interests survey's
// validator (anonymous, a purpose, nothing identifying or sensitive), the aggregation threshold,
// and the variants that may change only the context.
import assert from "node:assert/strict";
import { test } from "node:test";

const load = (module) => import(new URL(`../dist/materials/${module}.js`, import.meta.url).href);
const { parseSurvey, aggregateSurvey } = await load("survey");
const { compareAssignments, compareQuizzes } = await load("variants");
const { parseAssignment } = await load("assignment");
const { parseQuiz } = await load("quiz");
const { parseQuestions } = await load("questions");

const SURVEY = `---
title: ¿Qué os interesa?
purpose: Saber qué temas os interesan para ambientar en ellos las actividades del tema 3. Es anónima y voluntaria.
anonymous: true
group: A
---
## Temas
type: multiple

¿Sobre qué te gustaría que fueran los ejemplos?

- Videojuegos
- Deporte
- Música

## Género musical
type: single

- Pop
- Rock

## Algo más
type: text
`;

test("an interests survey: anonymous, with a purpose, its questions and options", () => {
  const { material, findings } = parseSurvey(SURVEY);
  assert.deepEqual(findings.errors, []);
  assert.equal(material.group, "A");
  assert.deepEqual(material.questions.map((q) => [q.name, q.type, q.options.length]), [["Temas", "multiple", 3], ["Género musical", "single", 2], ["Algo más", "text", 0]]);
  assert.match(findings.warnings.map((f) => f.message).join(), /never quoted/);
});

test("a survey that isn't anonymous, or asks who or something sensitive, is refused", () => {
  const bad = parseSurvey(SURVEY.replace("anonymous: true", "anonymous: false").replace("purpose: Saber", "purpose: X\nx: Saber") + "\n## Tu nombre\ntype: text\n\n## Religión\ntype: single\n\n- Sí\n- No\n\n## Salud\ntype: text\n\n¿Tienes alguna enfermedad?\n");
  const all = bad.findings.errors.map((f) => f.message).join("\n");
  assert.match(all, /anonymous: true/);
  assert.match(all, /"purpose"/);
  assert.match(all, /"Tu nombre": it asks something that identifies/);
  assert.match(all, /"Religión": it asks about something sensitive/);
  assert.match(all, /"Salud": it asks about something sensitive/);
});

test("only what three or more answered is kept; under three responses, nothing", () => {
  const results = [
    { text: "Temas", options: [{ text: "Videojuegos", count: 7 }, { text: "Deporte", count: 2 }, { text: "Música", count: 2 }, { text: "Cine", count: 1 }] },
    { text: "Algo más", textAnswers: 4 },
  ];
  const { kept, left } = aggregateSurvey(9, results);
  assert.equal(kept[0], "- Temas: Videojuegos (7), other options together (5)");
  assert.match(kept[1], /4 wrote something; summarise their themes, each one only if 3 or more/);
  assert.equal(left, 3);
  assert.deepEqual(aggregateSurvey(2, results).kept, []);
  assert.equal(aggregateSurvey(5, [{ text: "T", options: [{ text: "a", count: 1 }, { text: "b", count: 1 }] }]).kept[0], "- T: no option with enough answers to keep");
});

const ASSIGNMENT = "---\ntitle: Tarea\ngrade: 10\nrubric: t.rubric.md\nsubmission: file\nformats: [pdf]\ndue: semana 3 viernes 23:59\ncriteria: [1.1]\n---\n## Qué hacer\nCalcula la media de los goles de tu equipo en cinco partidos con una lista de Python y explica el resultado.\n";

test("a variant may change only the context: same grade, rubric, criteria, submission and dates", () => {
  const base = parseAssignment(ASSIGNMENT.replace("criteria: [1.1]", "criteria: [1.1]\nvariants: [t.musica.assignment.md, t.juegos.assignment.md]")).material;
  assert.deepEqual(base.variants, ["t.musica.assignment.md", "t.juegos.assignment.md"]);
  const music = parseAssignment(ASSIGNMENT.replace("goles de tu equipo en cinco partidos", "reproducciones de cinco canciones")).material;
  assert.deepEqual(compareAssignments(base, music), []);
  const harder = parseAssignment(ASSIGNMENT.replace("grade: 10", "grade: 8").replace("formats: [pdf]", "formats: [pdf, zip]").replace("criteria: [1.1]", "criteria: [1.1, 1.2]")).material;
  assert.deepEqual(compareAssignments(base, harder), ["grade 8, not 10", "criteria 1.1, 1.2, not 1.1", "what's handed in (submission, files, formats)"]);
  const one = parseAssignment(ASSIGNMENT.replace("criteria: [1.1]", "criteria: [1.1]\nvariants: [a.assignment.md]"));
  assert.match(one.findings.errors.map((f) => f.message).join(), /2 to 4 contexts/);
});

test("a quiz's variant keeps each question's type, points, criteria and level", () => {
  const bank = (extra = "") => parseQuestions(`---\ntitle: B\ncriteria: [1.1]\n---\n## A\ntype: single · points: 2${extra}\n\n¿Uno?\n\n- [x] sí\n- [ ] no\n  > no\n\n## B\nanswer: true\n\n¿Dos?\n`).material.questions;
  const quiz = (variants = "") => parseQuiz(`---\ntitle: Q\npurpose: practice\nquestions:\n  - bank: b.questions.md\n${variants}---\nQ.\n`).material;
  assert.deepEqual(compareQuizzes(quiz(), bank(), quiz(), bank()), []);
  const changed = compareQuizzes(quiz(), bank(), quiz(), bank(" · level: advanced").map((q, i) => (i === 1 ? { ...q, type: "single" } : q)));
  assert.deepEqual(changed, ["question 1's level", "question 2 is single, not truefalse"]);
});
