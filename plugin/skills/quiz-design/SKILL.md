---
name: quiz-design
description: Write pedagogically sound quiz questions - plausible distractors, varied cognitive levels, unambiguous wording, useful feedback - or review an existing quiz for trivial, repetitive, or poorly worded questions.
---

# Designing quiz questions, not just formatting them

This is the pedagogical layer behind writing a question. `quiz-building` covers the quiz itself — its settings, adding the questions by form or GIFT import, their order, and changing a quiz that already has attempts — apply this skill's principles while actually writing the questions.

## Writing a question

- **One clear thing being tested**: a question shouldn't secretly test two unrelated facts at once — if it does, split it.
- **Unambiguous wording**: avoid phrasing where more than one option could reasonably be argued correct depending on interpretation. If a qualifier ("usually", "always", "in most cases") changes the answer, make sure it's there deliberately, not by accident.
- **Plausible distractors**: a wrong option should reflect a real, predictable misconception — not be obviously wrong just from its wording or length. A wrong answer that's clearly the odd one out (much shorter, oddly specific, unrelated to the others) gives away the answer without testing anything.
- **Feedback per option**, when the format supports it (see the GIFT `#` syntax in `quiz-building`): explain briefly *why* a wrong option is wrong, not just that it is — that's what makes a quiz useful for learning, not only for scoring.

## Varying cognitive level

Don't write an entire quiz at the same level (e.g. all pure recall). Mix in questions that require applying a concept to a new situation, comparing two ideas, or spotting an error in a worked example — matched to what the topic and the course's level actually call for.

## Reviewing an existing quiz

The same checklist doubles as a review: read through the quiz's questions (question bank or quiz preview) and flag any that are trivial (answerable without having studied the topic), near-duplicates of another question in the same quiz, ambiguous, or have a distractor that's obviously not a real option. Summarize findings rather than silently leaving them — a teacher may want to keep a "trivial" question deliberately (e.g. as an easy warm-up), so flag it as a suggestion, not an automatic fix.

## Alignment

A question should map back to an objective of the unit (the teaching plan's criteria, or `course-design`'s objectives), or at minimum to material the students actually had access to (`sources/`, the course's own resources) — don't test on a detail that was never actually covered.
