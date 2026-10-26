// Unit tests of the neutral materials (ADR-015), on the built code in dist/: the bank and quiz
// parsers and their checks, the GIFT exporter and importer (real files from the validators'
// fixtures among them), the hash, and the paper exams. Run with `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (module) => import(new URL(`../dist/materials/${module}.js`, import.meta.url).href);
const { parseQuestions } = await load("questions");
const { parseQuiz } = await load("quiz");
const { exportGift, importGift } = await load("gift");
const { serializeBank } = await load("serialize");
const { materialHash } = await load("hash");
const { paperExam, drawn } = await load("exam");
const { validateGift } = await import(new URL("../dist/validators/gift.js", import.meta.url).href);
const fixture = (name) => readFileSync(path.join(root, ".claude/skills/verify/fixtures/validators", name), "utf8");

const BANK = `---
title: Tema 1 · Variables
category: Tema 1
criteria: [CE1a]
---

## T1-01 Qué guarda
type: single · points: 2

¿Qué guarda una **variable**?

- [x] Un valor que puede cambiar
- [ ] Siempre el mismo valor
  > Eso es una constante.

> Una variable nombra un valor: x = 3.

## T1-02 Traza
¿Qué imprime?

\`\`\`python
for i in range(2):
    print(i)
\`\`\`

- [x] 0 y 1
- [ ] 1 y 2
  > range(2) empieza en 0.

## T1-03 Bucle
answer: false

Un for siempre sabe cuántas vueltas da.

## T1-04 Numéricos
Elige los numéricos.

- [x] int
- [x] float
- [ ] str
  > Es texto.

## T1-05 Raíz
answer: 7 · tolerance: 0.5

¿Raíz de 49?

## T1-06 Tipos
Relaciona:

- 3 -> int
- 3.5 -> float
- "a" -> str

## T1-07 Clave
type: short

¿Qué palabra define una función?

- def

## T1-08 Explica
Explica qué es una variable.
`;

test("a bank: every type read, defaults applied, no findings", () => {
  const { material, findings } = parseQuestions(BANK);
  assert.deepEqual(findings.errors, []);
  assert.deepEqual(
    material.questions.map((q) => q.type),
    ["single", "single", "truefalse", "multiple", "numeric", "matching", "short", "essay"],
  );
  const [first, , third, , fifth] = material.questions;
  assert.equal(first.points, 2);
  assert.deepEqual(first.criteria, ["CE1a"]);
  assert.equal(first.feedback, "Una variable nombra un valor: x = 3.");
  assert.equal(first.answers[1].feedback, "Eso es una constante.");
  assert.equal(third.truth, false);
  assert.equal(fifth.value, 7);
  assert.equal(fifth.tolerance, 0.5);
  assert.equal(material.category, "Tema 1");
});

test("a bank's mistakes are found, with their lines", () => {
  const broken = `---\ntitle: Roto\n---\n\n## A\ntype: single\n\nTexto\n\n- [x] uno\n- [x] dos\n\n## A\nTexto\n\n- [ ] uno\n- [ ] dos\n\n## C\ntype: raro\n\nTexto\n\n## D\n- [x] antes\n- [ ] del texto\n\nTexto\n`;
  const { findings } = parseQuestions(broken);
  const messages = findings.errors.map((f) => `${f.line} ${f.message}`).join("\n");
  assert.match(messages, /^10 .*exactly one right option/m);
  assert.match(messages, /the name is repeated/);
  assert.match(messages, /unknown type "raro"/);
  assert.match(messages, /answers .* go after the question's text/);
  assert.match(parseQuestions("## sin frontmatter\nTexto").findings.errors.map((f) => f.message).join(), /needs a "title"/);
});

test("export: valid GIFT, code kept with its indentation, escapes, losses said", () => {
  const { material } = parseQuestions(BANK);
  const { gift, losses, errors } = exportGift(material);
  assert.deepEqual(errors, []);
  assert.deepEqual(validateGift(gift).errors, []);
  assert.match(gift, /\$CATEGORY: \$course\$\/top\/Tema 1/);
  assert.match(gift, /<pre><code>for i in range\(2\)\\:\n&nbsp;&nbsp;&nbsp;&nbsp;print\(i\)<\/code><\/pre>/);
  assert.match(gift, /####Una variable nombra un valor\\: x \\= 3\./);
  assert.match(gift, /~%50%int\n~%50%float\n~%-100%str#Es texto\./);
  assert.match(gift, /\{#7:0\.5\}/);
  assert.deepEqual(losses, [{ code: "points", questions: ["T1-01 Qué guarda"] }]);
});

test("export refuses what GIFT can't say without changing the question", () => {
  const bank = `---\ntitle: X\n---\n\n## Orden\nOrdena:\n\n1. uno\n2. dos\n\n## Once buenas\nElige.\n\n${Array.from({ length: 11 }, (_, i) => `- [x] a${i}`).join("\n")}\n- [ ] mal\n`;
  const { material } = parseQuestions(bank);
  const { errors } = exportGift(material);
  assert.match(errors.map((f) => f.message).join("\n"), /ordering question can't go as GIFT/);
  assert.match(errors.map((f) => f.message).join("\n"), /11 right options don't split into a grade the classroom accepts \(100\/11\)/);
});

test("round trip: export, import, export again gives the same questions", () => {
  const { material } = parseQuestions(BANK);
  const first = exportGift(material).gift;
  const back = importGift(first, material.title);
  const reparsed = parseQuestions(serializeBank(back));
  assert.deepEqual(reparsed.findings.errors, []);
  assert.equal(exportGift(reparsed.material).gift, first);
});

test("real GIFT files import and re-export valid, indentation kept", () => {
  for (const name of ["loops-fixed.gift", "valid-types.gift", "escape-room.gift"]) {
    const bank = importGift(fixture(name), name);
    assert.ok(bank.questions.length > 0, name);
    const reparsed = parseQuestions(serializeBank(bank));
    assert.deepEqual(reparsed.findings.errors, [], `${name}: ${JSON.stringify(reparsed.findings.errors)}`);
    const { gift, errors } = exportGift(reparsed.material);
    assert.deepEqual(errors, [], name);
    assert.deepEqual(validateGift(gift).errors, [], name);
  }
  const loops = exportGift(parseQuestions(serializeBank(importGift(fixture("loops-fixed.gift"), "Bucles"))).material).gift;
  assert.match(loops, /&nbsp;&nbsp;&nbsp;&nbsp;print\(n\)/);
  const range = importGift(fixture("valid-types.gift"), "Tipos").questions.find((q) => q.name === "NUM2");
  assert.deepEqual([range.value, range.tolerance], [3.5, 0.5]);
});

test("the hash ignores how it's written, not what it says", () => {
  const a = parseQuestions(BANK).material;
  const b = parseQuestions(BANK.replace("¿Qué guarda una **variable**?", "¿Qué  guarda una **variable**?\n").replace(/\n\n## T1-02/, "\n\n\n## T1-02")).material;
  const c = parseQuestions(BANK.replace("Un valor que puede cambiar", "Un valor que cambia")).material;
  assert.equal(materialHash(a), materialHash(b));
  assert.notEqual(materialHash(a), materialHash(c));
});

test("a quiz: purpose, settings and its parts", () => {
  const { material, findings } = parseQuiz(`---\ntitle: Repaso\npurpose: practice\nsettings:\n  attempts: unlimited\nquestions:\n  - bank: tema-1.questions.md\n    pick: 3\n  - bank: tema-2.questions.md\n    pick: [T2-01, T2-02]\n---\nDiez minutos.\n`);
  assert.deepEqual(findings.errors, []);
  assert.deepEqual(material.questions, [{ bank: "tema-1.questions.md", pick: 3 }, { bank: "tema-2.questions.md", pick: ["T2-01", "T2-02"] }]);
  assert.equal(material.settings.attempts, "unlimited");
  assert.match(parseQuiz("---\ntitle: X\npurpose: fun\n---\n").findings.errors.map((f) => f.message).join(), /purpose/);
});

test("paper exams: the same seed gives the same versions; versions differ", () => {
  const { questions } = parseQuestions(BANK).material;
  const labels = { name: "Nombre", version: "Versión", key: "Respuestas", points: (n) => `${n} p.`, trueFalse: ["V", "F"] };
  const one = paperExam("Examen", "", questions, 2, 1234, labels, "es");
  const two = paperExam("Examen", "", questions, 2, 1234, labels, "es");
  assert.equal(one.versions[0].html, two.versions[0].html);
  assert.equal(one.key, two.key);
  assert.notEqual(one.versions[0].html, one.versions[1].html);
  assert.notEqual(paperExam("Examen", "", questions, 1, 99, labels, "es").versions[0].html, one.versions[0].html);
  assert.deepEqual(drawn([1, 2, 3, 4, 5], 3, 7), drawn([1, 2, 3, 4, 5], 3, 7));
});

const { parseNotes, accessibleHtml, localImages } = await load("notes");

test("notes: accessible HTML, headings under the classroom's title, code kept", () => {
  const { material, findings } = parseNotes("---\ntitle: Variables\n---\n\nUna **variable** guarda un valor.\n\n## Tipos\n\n| Tipo | Ejemplo |\n| --- | --- |\n| int | 3 |\n\n### Enteros\n\n```python\nfor i in range(2):\n    print(i)\n```\n");
  assert.deepEqual(findings.errors, []);
  const html = accessibleHtml(material.markdown, 2);
  assert.match(html, /<h2>Tipos<\/h2>/);
  assert.match(html, /<h3>Enteros<\/h3>/);
  assert.match(html, /<th scope="col">Tipo<\/th>/);
  assert.match(html, /<pre data-language="python"><code>for i in range\(2\):\n {4}print\(i\)\n?<\/code><\/pre>/);
});

test("notes: what a student would miss is found", () => {
  const { findings } = parseNotes("---\ntitle: X\n---\n\n# X\n\n![](diagrama.png)\n\nMás en [aquí](https://example.org).\n\n## A\n\n#### B\n");
  const all = [...findings.errors, ...findings.warnings].map((f) => f.message).join("\n");
  assert.match(all, /has no alternative text/);
  assert.match(all, /doesn't say where it goes/);
  assert.match(all, /skips a level/);
  assert.match(all, /repeats the title/);
});

test("notes as a book: one chapter per ##", () => {
  const { material, findings } = parseNotes("---\ntitle: Bucles\nas: book\n---\nIntro.\n\n## for\nTexto for.\n\n## while\nTexto while.\n");
  assert.deepEqual(findings.errors, []);
  assert.deepEqual(material.chapters.map((c) => c.title), ["for", "while"]);
  assert.equal(material.markdown, "Intro.");
  assert.deepEqual(localImages("![a](img/x.png) ![b](https://e.org/y.png)"), ["img/x.png"]);
});


const { parseRubric, rubricDefinition } = await load("rubric");
const { parseAssignment } = await load("assignment");
const { parseGrading, gradingSheet } = await load("grading");
const { parseCourse, resolveDate } = await load("course");
const { parseUnit } = await load("unit");

test("a rubric: levels, total, the classroom's definition", () => {
  const { material, findings } = parseRubric("---\ntitle: Rúbrica T1\ntotal: 7\n---\n## Concepto · criteria: 1.1\n- 4: Lo explica bien\n- 2: A medias\n- 0: No lo explica\n\n## Ejemplos\n- 3: Dos ejemplos propios\n- 0: Ninguno\n");
  assert.deepEqual(findings.errors, []);
  assert.equal(material.total, 7);
  assert.deepEqual(rubricDefinition(material).criteria[0], { description: "Concepto (1.1)", levels: [{ definition: "No lo explica", score: 0 }, { definition: "A medias", score: 2 }, { definition: "Lo explica bien", score: 4 }] });
  const wrong = parseRubric("---\ntitle: X\ntotal: 10\n---\n## A\n- 3: bien\n- 3: igual\n## B\n- 1: solo uno\n");
  const all = wrong.findings.errors.map((f) => f.message).join("\n");
  assert.match(all, /same score/);
  assert.match(all, /two levels or more/);
  assert.match(all, /add up to 4/);
});

test("an assignment: dates, submission, rubric", () => {
  const { material, findings } = parseAssignment("---\ntitle: Tarea 1\ngrade: 10\nrubric: t1.rubric.md\nsubmission: file\nformats: [.PDF]\ndue: semana 3 viernes 23:59\ncutoff: semana 4 viernes 23:59\n---\n## Qué hacer\nExplica con tus palabras qué es una variable, con dos ejemplos propios, en un PDF de una página como máximo.\n");
  assert.deepEqual(findings.errors, []);
  assert.deepEqual([material.formats, material.due, material.rubric], [["pdf"], "semana 3 viernes 23:59", "t1.rubric.md"]);
  const bad = parseAssignment("---\ntitle: X\ndue: mañana\nsubmission: video\n---\n");
  assert.match(bad.findings.errors.map((f) => f.message).join("\n"), /"due" is a date[\s\S]*submission[\s\S]*no statement|submission[\s\S]*"due"/);
});

test("grading: weights add up to 100; the sheet has no students", () => {
  const ok = parseGrading("---\ntitle: Calificación\n---\n| Categoría | Peso | Actividades |\n| --- | --- | --- |\n| Tareas | 60 % | t1.assignment.md, t2.assignment.md |\n| Cuestionarios | 40 % | repaso.quiz.md |\n");
  assert.deepEqual(ok.findings.errors, []);
  assert.equal(gradingSheet(ok.material, "Alumno", "Nota"), "Alumno,Tareas: t1,Tareas: t2,Cuestionarios: repaso,Nota\n%,30,30,40,100\n");
  const off = parseGrading("---\ntitle: X\n---\n| Categoría | Peso |\n| --- | --- |\n| A | 50 % |\n| B | 40 % |\n");
  assert.match(off.findings.errors.map((f) => f.message).join(), /add up to 90 %/);
});

test("relative dates per group: week 1 is the start's week; holidays and weekends move back", () => {
  const { material, findings } = parseCourse("---\ntitle: Curso\ngroups:\n  - id: A\n    start: 2026-09-15\n  - id: B\n    start: 2026-09-21\nholidays: [2026-10-02, 2026-10-12..2026-10-13]\n---\n");
  assert.deepEqual(findings.errors, []);
  assert.deepEqual(material.holidays, ["2026-10-02", "2026-10-12", "2026-10-13"]);
  const [a, b] = material.groups;
  assert.deepEqual(resolveDate("semana 1 viernes 23:59", a, material.holidays), { date: "2026-09-18 23:59" });
  assert.deepEqual(resolveDate("week 1 friday 14:00", b, material.holidays), { date: "2026-09-25 14:00" });
  assert.deepEqual(resolveDate("semana 3 viernes", a, material.holidays), { date: "2026-10-01 23:59", moved: "2026-10-02 is a holiday: moved to 2026-10-01" });
  assert.equal(resolveDate("semana 5 martes 9:00", a, material.holidays).date, "2026-10-09 9:00");
  assert.equal(resolveDate("2026-11-20 10:00", a, material.holidays).date, "2026-11-20 10:00");
  assert.throws(() => resolveDate("el viernes", a, []));
});

test("a unit: steps in order, conditions on what comes before", () => {
  const { material, findings } = parseUnit("---\ntitle: Tema 1\n---\n1. variables.notes.md\n2. t1.assignment.md · after: variables.notes.md viewed\n3. repaso.quiz.md · after: t1.assignment.md submitted\n");
  assert.deepEqual(findings.errors, []);
  assert.deepEqual(material.steps[2], { material: "repaso.quiz.md", after: { material: "t1.assignment.md", condition: "submitted" } });
  const bad = parseUnit("---\ntitle: X\n---\n1. a.quiz.md · after: b.notes.md viewed\n2. b.notes.md\n3. c.notes.md · after: b.notes.md passed\n");
  const all = bad.findings.errors.map((f) => f.message).join("\n");
  assert.match(all, /isn't before it/);
  assert.match(all, /only a graded activity is passed/);
});
