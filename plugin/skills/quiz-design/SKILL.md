---
name: quiz-design
description: Write pedagogically sound quiz questions - plausible distractors, varied cognitive levels, unambiguous wording, useful feedback - or review an existing quiz for trivial, repetitive, or poorly worded questions.
---

# Designing quiz questions, not just formatting them

This is the pedagogical layer behind writing a question. `quiz-bulk-import` covers the
GIFT-format mechanics of importing many questions at once — apply this skill's principles
first, while actually writing them, whichever way they'll end up in Moodle (the normal
form for one or two, or `quiz-bulk-import` for a batch).

## Writing a question

- **One clear thing being tested**: a question shouldn't secretly test two unrelated
  facts at once — if it does, split it.
- **Unambiguous wording**: avoid phrasing where more than one option could reasonably be
  argued correct depending on interpretation. If a qualifier ("usually", "always",
  "in most cases") changes the answer, make sure it's there deliberately, not by
  accident.
- **Plausible distractors**: a wrong option should reflect a real, predictable
  misconception — not be obviously wrong just from its wording or length. A wrong answer
  that's clearly the odd one out (much shorter, oddly specific, unrelated to the others)
  gives away the answer without testing anything.
- **Feedback per option**, when the format supports it (see `quiz-bulk-import`'s GIFT
  `#` syntax): explain briefly *why* a wrong option is wrong, not just that it is —
  that's what makes a quiz useful for learning, not only for scoring.

## Varying cognitive level

Don't write an entire quiz at the same level (e.g. all pure recall). Mix in questions that
require applying a concept to a new situation, comparing two ideas, or spotting an error
in a worked example — matched to what the topic and the course's level actually call for.

## Reviewing an existing quiz

The same checklist doubles as a review: read through the quiz's questions (question bank
or quiz preview) and flag any that are trivial (answerable without having studied the
topic), near-duplicates of another question in the same quiz, ambiguous, or have a
distractor that's obviously not a real option. Summarize findings rather than silently
leaving them — a teacher may want to keep a "trivial" question deliberately (e.g. as an
easy warm-up), so flag it as a suggestion, not an automatic fix.

## Changing a quiz that already exists

Check the quiz's attempts first (its page says "Attempts: N"). With **0 attempts**, editing
or replacing questions affects nobody; Moodle keeps the old text as a previous version of
the question. With attempts, don't change what a question asks or which answer is right —
students would have been graded against a different question than the one now shown. Add
new questions instead, or propose the change to the teacher. Every save (an edited question,
a new one, the quiz's name or description) is a publication that needs its own approval.

Placeholder content — a question like "The answer is true.", a description like "Test quiz
1", an English stub in a course taught in another language — is worth fixing when the quiz
has no attempts: it's exactly what a real teacher would notice and correct.

After changing questions, reopen the quiz and check the question count and the total grade
("Total of marks") match what you intended.

## Alignment

A question should map back to something in `course-design`'s objectives, or at minimum to
material the students actually had access to (`sources/`, the course's own resources) —
don't test on a detail that was never actually covered.
