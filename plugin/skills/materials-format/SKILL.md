---
name: materials-format
description: Write a subject's materials once in materials/ - question banks (.questions.md), quizzes (.quiz.md), notes (.notes.md), assignments (.assignment.md) and rubrics (.rubric.md), units (unit.md), the course's calendar (course.md) and grading (grading.md) as Markdown the teacher can read and edit - and publish them through the materials toolbox, which validates them and exports them to the classroom's import format by code, says what the format leaves out, prints paper exams and records each publication. Use whenever questions, a quiz or a paper exam are written, changed, imported from a GIFT file, or published.
---

# Materials, written once

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

A subject's materials live in `materials/`, as Markdown the teacher reads and edits: the source
of truth. What a classroom imports (GIFT, HTML) is generated from them by code with the
materials toolbox, into `drafts/materials/`; never write those formats by hand. `drafts/` keeps
what's generated or isn't neutral: exports, a SCORM package, an HTML app, an activity's plan.

## A question bank: `materials/<unit>/<slug>.questions.md`

```markdown
---
title: Tema 1 · Variables y tipos
category: Tema 1          # where its questions go in the classroom's bank (default: the title)
criteria: [1.1]           # the criteria its questions give evidence of, numbered as the plan does
---

## T1-01 Qué guarda una variable
type: single · points: 1 · criteria: 1.1, 1.2

¿Qué guarda una variable en un programa?

- [x] Un valor que puede cambiar mientras se ejecuta
- [ ] Siempre el mismo valor
  > Eso es una constante: una variable puede cambiar.
- [ ] El nombre del programa
  > El nombre del programa no se guarda en una variable.

> Una variable es un nombre para un valor que puede cambiar.
```

- `## name`: one question; its name is its position and what it asks (`T1-01 …`), unique.
- The metadata line is optional; `type` is inferred when it's missing. Keys: `type`, `points`
  (default 1), `criteria`, `answer`, `tolerance`.
- The text is any Markdown: code goes in a fenced block with its indentation, as it is: the
  exporter keeps it. No HTML, no escapes.
- The answers are the last list, after the text:

| type | answers |
| --- | --- |
| `single` | `- [x]` exactly one right, `- [ ]` the rest |
| `multiple` | several `- [x]`, at least one `- [ ]` |
| `truefalse` | no list: `answer: true` or `answer: false` |
| `short` | `- def` (every item is an accepted answer) |
| `numeric` | no list: `answer: 3.5 · tolerance: 0.1` |
| `matching` | `- left -> right`, at least three |
| `ordering` | `1. first`, `2. second`… in their right order (no GIFT: paper exams only) |
| `essay` | no list |

- An option's feedback, indented under it: `  > why it's wrong`. Every wrong option says why.
- The question's feedback, a quote at the very end.

## A quiz: `materials/<unit>/<slug>.quiz.md`

```markdown
---
title: Repaso del tema 1
purpose: practice                 # practice, exam or diagnostic
settings:                         # the teacher's intent; the classroom's quiz skill maps it
  attempts: unlimited
  time limit: none
  review: right answers after each attempt
questions:
  - bank: variables.questions.md  # relative to the quiz's folder
    pick: all                     # all, a number drawn at random, or [T1-01, T1-03]
---
Diez preguntas para repasar las variables antes del examen. Sin límite de intentos.
```

Its settings follow its purpose (`quiz-design`). Its body is what students read before starting.

## Notes: `materials/<unit>/<slug>.notes.md`

```markdown
---
title: Variables y tipos
as: page          # page (default) or book: then each ## is a chapter
---
Una **variable** es un nombre para un valor…

## Tipos básicos

![Tabla de los tipos de Python](tipos.png)
```

Headings from `##` (the classroom shows the title). Images next to the file, with what they show
as their alternative text. Links whose text says where they go (never "aquí"). No raw HTML.
`resource-authoring` is what makes them worth reading.

## An assignment and its rubric

```markdown
---
title: "Tarea 1: explica qué es una variable"
grade: 10
rubric: tarea-1.rubric.md
submission: file             # file, text or both
files: 1
formats: [pdf]
due: semana 3 viernes 23:59  # a date (2026-11-20 23:59) or relative to the group's start
cutoff: semana 4 viernes 23:59
criteria: [1.1, 1.2]
---
## Qué tienes que hacer
…
```

```markdown
---
title: Rúbrica de la Tarea 1
total: 10                    # the best levels add up to it
---
## Explica el concepto · criteria: 1.1
- 4: Explica con sus palabras qué es y para qué sirve
- 2: Lo explica de forma incompleta
- 0: No lo explica, o es incorrecto
```

## A unit, the course's calendar, the grading

- `materials/<unit>/unit.md`: its title and summary, and a numbered list of its materials in the
  order students meet them: `2. tarea-1.assignment.md · after: variables.notes.md viewed`
  (`viewed`, `submitted`, `passed`, `completed`).
- `materials/course.md`: `groups` (each `id` and `start`), `holidays` (dates or ranges
  `2026-12-07..2026-12-08`), `evaluations` (`name`, `end`). `materials_resolve` turns
  "semana 3 viernes 23:59" into each group's date (week 1 is the week the group starts; a holiday
  or a weekend moves it to the school day before, and says so).
- `materials/grading.md`: a table `| Categoría | Peso | Actividades |`, the weights adding up to
  100 %, its activities as paths in `materials/`. Its export is the gradebook's plan and a
  spreadsheet to grade outside the classroom, without students.

## The toolbox

1. Write or edit the material in `materials/` (`Write`, `Edit`).
2. `materials_validate` it: errors stop an export; warnings are for the teacher (an option
   without feedback, criteria the plan doesn't have). Fix and validate again.
3. `materials_export` it: a bank to `drafts/materials/<path>.gift`; a quiz to the GIFT of the
   banks it takes plus its plan (settings, slots and marks, description); notes to accessible
   HTML (a page, or one file per chapter) with their images next to it. What the format
   can't say without changing a question (an `ordering` question, options whose grades don't
   split) is refused: ask the teacher, don't change the question yourself. What it leaves out
   without changing one (points) is shown in the next approval, added by code: don't repeat it.
   With a style chosen (`appearance`, `materials_style`), the export dresses pages, statements,
   questions, feedback and code in its templates, and says what it fixed in them.
4. With a classroom, its extension's quiz skill imports the exported GIFT and builds the quiz,
   with the approval listing every question (`quiz-design`). Without one, say where the
   material and its export are.
5. After an import or upload succeeds, `record_publication` with where it went and its link.
   `publication_status` tells what's published, and what was edited after it was published:
   before changing a published material, look; a quiz with attempts isn't changed under its
   students (`quiz-design`).

- **An existing course into materials/**: read it with the classroom extension's read skills and
  write each piece in its format (notes from its pages, assignments with their rubrics, the
  quizzes' banks through `materials_import` from the classroom's question export), its units in
  `unit.md`; then validate them. Nothing is published by importing: it's reading.
- **The teacher's banks**: a GIFT file in `sources/`, or one from before `materials/` in
  `drafts/<slug>/`, becomes a `.questions.md` with `materials_import`; from then on, edit that.
  When `drafts/` has GIFT banks and `materials/` doesn't, offer it.
- **Paper exams**: `materials_exam` prints a quiz as versions A, B… (questions and options in
  another order) with their answer keys in `drafts/exams/<quiz>/`, and keeps the seed: the same
  seed, the same versions. `drafts_pdf` turns them into PDFs to print.
- `materials/.publications.json` is the publication record, kept by the toolbox: never edit it.
- No student's name or data goes in a material: a question is about the subject.
