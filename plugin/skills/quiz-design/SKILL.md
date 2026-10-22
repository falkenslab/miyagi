---
name: quiz-design
description: Design a quiz and write its questions - settings that fit what the quiz is for, plausible distractors, varied cognitive levels, unambiguous wording, useful feedback, GIFT drafted in drafts/ - or review an existing quiz for trivial, repetitive, or poorly worded questions. Use whenever a quiz or its questions are created, changed or reviewed.
---

# Designing a quiz and its questions

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

Without a classroom, write the questions in `drafts/` and say where they are; with one, the
classroom extension's quiz skill builds the quiz, imports the questions and orders them. This
skill is what the quiz is for and what makes its questions good.

## What the quiz is for decides its settings

| | Formative check | Graded test |
| --- | --- | --- |
| Window | The unit's dates | A fixed window |
| Time limit | Usually none | Realistic for the number of questions |
| Attempts | Several or unlimited | 1 (or 2 with the best counting) |
| Grade kept | Highest | Highest or first attempt |
| Feedback | Immediate, or interactive with several tries | Deferred, after the attempt |
| What students see after | Feedback and right answers after each attempt | Right answers only after it closes, if at all |

Long questions go one per page; short checks, all on one page. Shuffle the options of multiple
choice unless one ("all of the above") depends on its position. The description says what it
covers, how long it takes, how many attempts and how it counts. Its maximum grade is what the
plan's weights need (`course-building`, the gradebook), set when it's created.

## Writing a question

- **One clear thing being tested**: a question shouldn't secretly test two unrelated
  facts at once; if it does, split it.
- **Unambiguous wording**: avoid phrasing where more than one option could reasonably be
  argued correct depending on interpretation. If a qualifier ("usually", "always",
  "in most cases") changes the answer, make sure it's there deliberately, not by accident.
- **Plausible distractors**: a wrong option should reflect a real, predictable
  misconception, not be obviously wrong just from its wording or length. A wrong answer
  that's clearly the odd one out (much shorter, oddly specific, unrelated to the others)
  gives away the answer without testing anything.
- **Feedback per option**, when the format supports it: explain briefly *why* a wrong option
  is wrong, not just that it is. That's what makes a quiz useful for learning, not only for
  scoring.
- **Its position in the name** (`T1-01 Contenedor vs MV`, `T1-02 ...`), so the order shows in
  the bank and in the quiz.

## Varying cognitive level

Don't write an entire quiz at the same level (e.g. all pure recall). Mix in questions that
require applying a concept to a new situation, comparing two ideas, or spotting an error in a
worked example, matched to what the topic and the course's level actually call for. Check
`course/moodle-capabilities` for the question types this classroom has before choosing one.

## Several questions: GIFT in drafts/

Write them in `drafts/<quiz-slug>/<quiz-slug>.gift`, outside the knowledge base:

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

- A blank line ends a question, so questions are separated by one and never contain one.
- Escape `~ = # { } :` with a backslash wherever they are meant literally, in the text and in
  the answers (`n \= 3`, `C\#`).
- The importer trims every line: code indented with spaces or tabs loses its indentation (and a
  Python program its meaning), so write code as `[html]` at the start of the text, inside
  `<pre>`, with `&nbsp;` for every space of indentation.
- Each question has exactly one right answer (`=`, or `{TRUE}`/`{FALSE}`).

The GIFT is checked with code before it's imported: a file with errors (unbalanced braces, an
unescaped `=` inside an answer, a multiple choice with no right answer or with several, a
malformed numerical answer, a repeated name, indentation that will be lost) is refused with the
list of lines. Fix it in `drafts/` and import it again; don't work around the check. The check
catches format mistakes, not wrong content.

## Approving the questions

The import is its own approval, separate from creating the quiz, and its summary lists every
question: stem, type, right answer, and the distractors briefly. "6 GIFT questions about X"
isn't reviewable; the list is. After importing, read back a question or two: if one came out
wrong (escapes, lost code), fix that question. Never delete questions to re-import them:
deleting needs its own approval, naming what goes, and the teacher may prefer the fix by hand.

## Changing an existing quiz

Look at its attempts first.

- **None**: editing or replacing questions affects nobody. Placeholder content ("The answer is
  true.", a description like "Test quiz 1", an English stub in a course taught in another
  language) is worth fixing.
- **With attempts**: don't change what a question asks or which answer is right: students were
  graded against the old one. Add new questions or propose the change to the teacher.

## Reviewing an existing quiz

The same checklist doubles as a review: read through the quiz's questions and flag any that are
trivial (answerable without having studied the topic), near-duplicates of another question in
the same quiz, ambiguous, or have a distractor that's obviously not a real option. Summarize
findings rather than silently leaving them: a teacher may want to keep a "trivial" question
deliberately (e.g. as an easy warm-up), so flag it as a suggestion, not an automatic fix.

## Alignment

A question should map back to an objective of the unit (the teaching plan's criteria, or
`course-design`'s objectives), or at minimum to material the students actually had access to
(`sources/`, the course's own resources): don't test on a detail that was never covered.

## After

Run `publish-check` on the quiz (questions in order, feedback where expected, what students see
after as intended). Record in `activity/<quiz-slug>` (one page per quiz, even when it repeats
another quiz's settings) the settings, the questions (types, how many, the criteria followed)
and the quiz's link, with a link to its GIFT file in `drafts/`.
