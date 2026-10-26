---
title: Your materials
sidebar_position: 6.5
description: "Your subject's questions, quizzes, notes, assignments with their rubrics and units, written once in materials/ as text you can read and edit, and published to the classroom by code: the format, what gets checked, paper exams and the record of what was published."
---

# Your materials {#tus-materiales}

Your subject's questions, quizzes, notes, assignments with their rubrics and units are written once, in the `materials/` folder, as text you can open and edit with any editor. That is the authoritative version. What the classroom imports (a question bank's GIFT, the HTML of some notes) is generated from it by miyagi with code, not by hand: that way there are no misplaced escapes, code that loses its indentation, questions without a correct answer or images without alternative text.

Each subject has its `materials/` next to `sources/` and `drafts/`. It's yours: miyagi writes in it, so do you, and it isn't ignored if you version the folder with git.

## A question bank {#un-banco-de-preguntas}

A `.questions.md` file, for example `materials/tema-1/variables.questions.md`:

````markdown
---
title: Tema 1 · Variables
category: Tema 1
---

## T1-01 Qué guarda una variable
type: single · points: 1

¿Qué guarda una variable en un programa?

- [x] Un valor que puede cambiar mientras se ejecuta
- [ ] Siempre el mismo valor
  > Eso es una constante: una variable puede cambiar.
- [ ] El nombre del programa
  > El nombre del programa no se guarda en una variable.

> Una variable es un nombre para un valor que puede cambiar.

## T1-02 Traza
¿Qué muestra este programa?

```python
for i in range(2):
    print(i)
```

- [x] 0 y 1
- [ ] 1 y 2
  > range(2) empieza en 0.
````

- Each question starts with `##` and its name, which isn't repeated.
- The `type: … · points: …` line is optional: if it isn't there, the type is deduced from the answers. It can also carry `criteria: 1.1` (the criteria it gives evidence of) and `level: basic` (`basic`, `intermediate` or `advanced`), to use the banks as an exam bank.
- The question text is ordinary text; code goes in a block, with its indentation, as is.
- The answers are the last list: `- [x]` the correct ones, `- [ ]` the rest. Under each option, indented and with `>`, why it's wrong. At the end, also with `>`, the general explanation.
- Types: one answer (`single`), several (`multiple`), true or false (`answer: true`), short answer (`- def`), numerical (`answer: 3.5 · tolerance: 0.1`), matching (`- int -> 3`), ordering (numbered list, paper only) and essay (no list).

## A quiz {#un-cuestionario}

A `.quiz.md` file says what it's for, how you want it to work and which questions it takes from which banks (all, specific ones or a random number):

```markdown
---
title: Repaso del tema 1
purpose: practice
settings:
  attempts: unlimited
  time limit: none
questions:
  - bank: variables.questions.md
    pick: all
---
Diez preguntas para repasar las variables antes del examen.
```

Each bank in the quiz can be filtered with `criteria: [1.1]` and `level: basic`: it takes only those questions, all of them or a number of them. A number with a filter is drawn at export time and comes out the same for every student; for a different draw per student, those questions go in their own bank.

## Some notes {#unos-apuntes}

A `.notes.md` file, as a page or as a book (`as: book`, with one chapter per `##`):

```markdown
---
title: Variables y tipos
as: page
---
Una **variable** es un nombre para un valor que puede cambiar.

## Tipos básicos

![Tabla con los tipos int, float y str](tipos.png)
```

Headings start at `##` (the classroom already shows the page's title). Images go next to the file, each with what it shows as alternative text, and links say where they lead. miyagi turns them into accessible HTML: headings in order, code with its indentation, tables with their header, and the images copied alongside to upload them with the page.

## An assignment and its rubric {#una-tarea-y-su-rúbrica}

The assignment (`.assignment.md`) carries its statement as text and, at the top, what it requires: grade, submission type, formats, dates and its rubric. Dates can be real (`2026-11-20 23:59`) or relative to each group's start (`semana 3 viernes 23:59`).

```markdown
---
title: "Tarea 1: explica qué es una variable"
grade: 10
rubric: tarea-1.rubric.md
submission: file
formats: [pdf]
due: semana 3 viernes 23:59
---
## Qué tienes que hacer
…
```

The rubric (`.rubric.md`) has one `##` per criterion and its levels with their score in front:

```markdown
---
title: Rúbrica de la Tarea 1
total: 10
---
## Explica el concepto
- 4: Explica con sus palabras qué es y para qué sirve
- 2: Lo explica de forma incompleta
- 0: No lo explica, o es incorrecto
```

miyagi checks that each criterion has at least two levels, that scores aren't repeated and that the best levels add up to the total. It exports it the way the classroom's grading form expects it, and also as a table to print. When grading, it uses the published version: if you changed the rubric afterwards, it warns you first.

## A unit, the calendar and grading {#un-tema-el-calendario-y-la-calificación}

- **`materials/<unit>/unit.md`**: the unit's materials in the order the student sees them, and what unlocks each one (`2. tarea-1.assignment.md · after: variables.notes.md viewed`). miyagi checks that each condition refers to something earlier.
- **`materials/course.md`**: when each group starts, the holidays and the assessment periods. With it, “semana 3 viernes 23:59” is a real date for each group; if it falls on a holiday or a weekend, it moves to the previous school day and tells you.
- **`materials/grading.md`**: the categories with their weight (which must add up to 100 %) and their activities. From it come the gradebook plan and a spreadsheet for grading outside the classroom, with no student in it.

With `/miyagi:publish` you publish a material or a whole unit: it checks it, exports it, uploads it hidden in its order and with its restrictions, tests it and asks for your approval to show it. It can also read a course you already have in the classroom and bring it into `materials/`, without publishing anything.

## What miyagi does with them {#lo-que-hace-miyagi-con-ellos}

- **It checks them** before anything else: that each one-answer question has exactly one correct answer, that there are enough options, that names aren't repeated, that a quiz's banks exist, that the criteria you cite are in your teaching plan, and in the notes that each image has its alternative text and that headings don't skip levels. It tells you what fails and on which line.
- **It exports them** to the classroom's format, in `drafts/materials/`, and checks what it generated. What that format can't express without changing a question (ordering, for example) it doesn't change on its own: it asks you. What is lost without changing it (each question's points, which the quiz sets) appears, written by code, in the approval it asks you for before publishing.
- **It keeps a record of what was published**, with a fingerprint of each version: it knows which materials are in the classroom, which you've changed since then and which have never been published.
- **It prints paper exams**: versions A, B… with the questions and the options in a different order, each with its answer sheet, in `drafts/exams/`. It keeps the seed, so it can print exactly the same ones again. Ask for it with `/miyagi:exam` or in your own words.
- **It converts your GIFT banks** (the ones you leave in `sources/` or the ones it already made in `drafts/`) into `.questions.md` files, so you edit them from then on.

## An interest survey and an activity's variants {#una-encuesta-de-intereses-y-las-variantes-de-una-actividad}

A survey goes in `materials/surveys/<name>.survey.md`: its title, what it's for (`purpose`, the first thing the students read), `anonymous: true`, its group from `course.md` and a few questions with `## nombre`, `type: single`, `multiple` or `text` and their options as a list. If it isn't anonymous or asks something that identifies a student or something sensitive, it doesn't pass validation.

An assignment or a quiz lists its variants with `variants: [tarea-2.musica.assignment.md, tarea-2.deporte.assignment.md]`, from two to four, each in its own file next to the neutral one. Validation compares each variant with the neutral one and lets none through that changes anything other than the context: the grade, the rubric, the criteria, the submission, the dates or, in a quiz, each question's type, points, criteria or level.

## The style of what you publish {#el-estilo-de-lo-que-publicas}

What it exports is accessible HTML that takes your classroom's theme. If you want a different look (a header with the title, the statement in a box, code with a label to copy it, feedback in a colored frame), install a style extension, such as `moodle-ui-kit`, and ask it to use it: “use the moodle-ui-kit style”. It's saved in `appearance` (see [Configuration](configuracion.md)), and “go back to my classroom's style” undoes it.

A style is a `style/` folder with one HTML template per type (`page`, `assignment`, `code`, `question` and `feedback`) and placeholders such as `{{title}}`, `{{body}}` or `{{code}}`, which the exporter fills in. You can make your own. Wherever it comes from, miyagi makes it accessible when filling it in: it turns bold paragraphs that act as headings into headings, hides emojis from the screen reader and removes its own font and background and colors that don't contrast. If it fixes something, it tells you. After publishing it checks that the classroom kept the styles: if it strips them, it tells you and publishes without style.

The code is in [`src/materials/`](https://github.com/falkenslab/miyagi/tree/main/src/materials) and has its tests in [`test/`](https://github.com/falkenslab/miyagi/tree/main/test).
