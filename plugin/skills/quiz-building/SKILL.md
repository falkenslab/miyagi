---
name: quiz-building
description: Create or change a Moodle quiz - its settings (dates, time limit, attempts, grading method, question behaviour, review options, layout), its questions added by form or imported in bulk as GIFT, their order and the total - or change an existing quiz safely. Use whenever a quiz is created or modified; quiz-design is how to write the questions themselves.
---

# Building a quiz

A quiz is its **settings** (when, how many times, how it's graded, what students see after) plus
its **questions** (written with `quiz-design`, added by form or imported). Both have to agree
with what the quiz is for: a formative check wants several attempts and immediate feedback, a
graded test wants one attempt and answers shown only after it closes.

## 1. Settings

| Setting | Formative check | Graded test |
| --- | --- | --- |
| "Open the quiz" / "Close the quiz" | The unit's dates | A fixed window |
| "Time limit" (and "When time expires") | Usually none | Realistic for the number of questions |
| "Attempts allowed" | Several or unlimited | 1 (or 2 with the best counting) |
| "Grading method" | Highest grade | Highest grade or first attempt |
| "How questions behave" | "Immediate feedback" or "Interactive with multiple tries" | "Deferred feedback" |
| "Review options" | Feedback and right answers after each attempt | Right answers only after the quiz closes, if at all |
| "Grade to pass" | If completion depends on it | If the course requires it |

Layout: "New page" / "Questions per page" (one per page for long questions, all on one page for
short checks); "Shuffle within questions" for multiple choice unless an option like "all of the
above" depends on its position. Write the description as for any activity: what it covers, how
long it takes, how many attempts, how it counts.

## 2. Questions

Write them with `quiz-design`. Then:

- **One or two questions**: the quiz's "Questions" page → "Add" → "a new question" (or "from
  question bank" to reuse one).
- **Several**: import them as GIFT (below), then add them from the bank.

Every question's name carries its position (`T1-01 Contenedor vs MV`, `T1-02 ...`), so the
order is visible in the bank and the quiz.

### GIFT import

GIFT covers multiple choice, true/false, short answer, numerical, matching and essay; check
`knowledge/moodle-capabilities.md`, and use the form for other types.

```
// Multiple choice, with feedback per option after #
::T1-01 Capital::What is the capital of France? {
=Paris
~London#London is the capital of the United Kingdom
~Berlin#Berlin is the capital of Germany
}

// True/false
::T1-02 For loop::A "for" loop in Python always needs to know the number of iterations in advance. {FALSE}

// Short answer
::T1-03 Keyword::Which Python keyword defines a function? {=def}

// Numerical, with tolerance
::T1-04 Root::What's the square root of 49? {#7:0}

// Code: [html], <pre>, and &nbsp; for every level of indentation
::T1-05 Trace::[html]<p>What does this print?</p><pre>for i in range(2)\:
&nbsp;&nbsp;&nbsp;&nbsp;print(i)</pre> {
=0 and 1
~1 and 2
}
```

A blank line ends a question, so questions are separated by one and never contain one.
Escape `~ = # { } :` with a backslash wherever they are meant literally, in the text and in
the answers (`n \= 3`, `C\#`). Moodle's importer trims every line: code indented with spaces
or tabs loses its indentation (and a Python program its meaning), so write code as `[html]`
inside `<pre>`, with `&nbsp;` for every space of indentation, from the start.

Every `.gift` and `.html` upload is checked with code before it leaves the browser: a file
with errors (unbalanced braces, an unescaped `=` inside an answer, a multiple choice with no
right answer or with several, a malformed numerical answer, a repeated name, indentation that
will be lost; an HTML page without viewport or with a missing local file) is refused with the
list of lines. Fix the file in `drafts/` and upload it again; don't work around the check.

1. Write the file in the quiz's drafts folder, outside the knowledge base:
   `drafts/<quiz-slug>/<quiz-slug>.gift`; check each question has exactly one right answer
   (`=`, or `{TRUE}`/`{FALSE}`). The upload check catches format mistakes, not wrong content.
2. **Ask for approval of the import on its own**, separately from creating the quiz, listing
   every question — stem, type, right answer, and the distractors briefly. "6 GIFT questions
   about X" isn't reviewable; the list is.
3. Open the bank you're importing into and use "Import": in Moodle 5 the quiz's own bank
   (`question/bank/importquestions/import.php?cmid=<quiz cmid>`) or a shared "Question bank"
   activity; in Moodle 4.x and earlier, the course's question bank ("More" → "Question bank" →
   "Import"). Import into a category named after the topic, not the default one.
4. Choose "GIFT", upload the file, and read Moodle's summary: every question imported, no
   syntax errors (fix the file and re-import only what's missing).
5. Add them to the quiz: "Add" → "from question bank".

### Order and total

Adding several questions at once doesn't keep the file's order (in a real course they landed as
06, 01, 02, 03, 05, 04). On the quiz's "Questions" page, fix the order with each question's move handle unless shuffling is intended, and check "Total of marks" and the maximum grade. Set the maximum grade the plan's weights need (`course-building`, the gradebook) when you create the quiz, not afterwards.

Keep each browser script short and synchronous (read the order, click one handle): a long script of background requests can leave the page hanging with no timeout, and a hung call stops the whole session until someone notices.

## 3. Changing an existing quiz

Look at its attempts first (the quiz page says "Attempts: N").

- **0 attempts**: editing or replacing questions affects nobody (Moodle keeps the old text as a
  previous version). Placeholder content — "The answer is true.", a description like "Test quiz
  1", an English stub in a course taught in another language — is worth fixing.
- **With attempts**: don't change what a question asks or which answer is right — students were
  graded against the old one. Add new questions or propose the change to the teacher.

Each save is a publication with its own approval: a quiz's settings, an edited question, a new
one, an import. Only the same setting change on several quizzes may share one approval, naming
each.

## 4. After

Run `publish-check` on the quiz (preview it as a student: questions in order, feedback where
expected, review options as intended). Record in `knowledge/activities/<quiz-slug>.md` — one page per quiz, even when it repeats another quiz's settings — the settings, the questions (types, how many, the criteria followed) and the quiz's URL, with
a link to its GIFT file in `drafts/`.
