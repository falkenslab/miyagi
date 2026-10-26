---
name: quiz-design
description: Design a quiz and write its questions - settings that fit what the quiz is for, plausible distractors, varied cognitive levels, unambiguous wording, useful feedback, written as a bank in materials/ - or review an existing quiz for trivial, repetitive, or poorly worded questions. Use whenever a quiz or its questions are created, changed or reviewed.
---

# Designing a quiz and its questions

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

The questions are written once in `materials/`, as a bank and a quiz (`materials-format`), and
exported by code. Without a classroom, say where they are; with one, the classroom extension's
quiz skill builds the quiz, imports the exported questions and orders them. This skill is what
the quiz is for and what makes its questions good.

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

## Writing them: a bank in materials/

Write them in `materials/<unit>/<slug>.questions.md` and the quiz that takes them in
`<slug>.quiz.md`, in the format of `materials-format`: the text and its code as plain
Markdown, the right options checked, each wrong option's feedback under it, the purpose and
settings in the quiz's frontmatter. Then `materials_validate` and `materials_export`: the
export writes the classroom's format (escapes, code with its indentation, one right answer) and
checks it; never write GIFT by hand. Its checks catch format mistakes, not wrong content.

## Approving the questions

The import is its own approval, separate from creating the quiz, and its summary lists every
question: stem, type, right answer, and the distractors briefly. "6 GIFT questions about X"
isn't reviewable; the list is. What the export leaves out (points the import doesn't keep) is
added to that approval by code. After importing, read back a question or two, and
`record_publication` the bank and the quiz. Never delete questions to re-import them:
deleting needs its own approval, naming what goes, and the teacher may prefer the fix by hand.

## Changing an existing quiz

Look at its attempts first.

- **None**: editing or replacing questions affects nobody. Placeholder content ("The answer is
  true.", a description like "Test quiz 1", an English stub in a course taught in another
  language) is worth fixing.
- **With attempts**: don't change what a question asks or which answer is right: students were
  graded against the old one. Add new questions or propose the change to the teacher.

`publication_status` says whether its bank was edited after it was published.

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
and the quiz's link, with the paths of its bank and quiz in `materials/`.
