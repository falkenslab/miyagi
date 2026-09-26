---
name: quiz-bulk-import
description: Write several quiz questions in GIFT format and import them all at once into the question bank, instead of creating them one by one through the "Add question" form - for a quiz with several questions.
---

# Importing quiz questions instead of creating them one by one

For a quiz with one or two questions, use Moodle's normal form — the format/import
doesn't pay off. This is for when several questions are needed at once: it's a workflow
a real teacher would also use (Moodle ships with question import built in), not an API
shortcut. This skill is only the import mechanics — apply `quiz-design`'s principles
(distractors, cognitive level, unambiguous wording) while actually writing the questions
below.

## Before writing

If `knowledge/moodle-capabilities.md` exists, check it: GIFT only covers a subset of
Moodle's question types (multiple choice, true/false, short answer, numeric, matching,
essay) — if the type you need isn't on that list, create it with the normal form instead
of forcing it into GIFT.

## GIFT format

A plain text file, one question after another. Minimal examples:

```
// Multiple choice
::Capital of France::What is the capital of France? {
=Paris
~London
~Berlin#Berlin is the capital of Germany, not France
}

// True/false
::For loop::A "for" loop in Python always needs to know the number of iterations in advance. {FALSE}

// Short answer
::Reserved word::Which Python keyword is used to define a function? {=def}

// Numeric (with a tolerance margin)
::Square root::What's the square root of 49? {#7:0}
```

The `#` symbol after an answer adds specific feedback for that option (optional). `=`
marks the correct answer; `~` marks an incorrect one.

## Writing and saving

Write the file in the knowledge base (the only folder you can write to), next to the quiz's
activity page: `knowledge/activities/<quiz-slug>.gift`. Write all the questions at once,
checking each one has a single answer marked with `=` (or `{TRUE}`/`{FALSE}` for
true/false) before moving on to the next.

## Importing into Moodle

1. Open the question bank you'll import into and use its "Import" option. In Moodle 5
   that's the quiz's own bank (`question/bank/importquestions/import.php?cmid=<quiz cmid>`)
   or a shared "Question bank" activity if the course uses one; in Moodle 4.x and earlier,
   the course's question bank ("More" → "Question bank" → "Import").
2. Before uploading the file, check which category the questions will be imported
   into. If there isn't one named after the topic, create a new category with that name
   instead of leaving them all in the default category — that way the question bank
   stays organized by topic, not as a single pool.
3. Choose "GIFT" format and upload the file you just wrote in `knowledge/activities/`.
4. Review the summary Moodle shows after importing: how many questions were imported and
   whether any had a syntax error — fix the file and re-import only if something's
   missing.
5. Add the imported questions to the quiz from the question bank ("Add" → "from question
   bank"), no need to recreate them.

## After importing

Open the quiz and check that the number of questions and the total grade are what you
expected before considering it done.

Note in the quiz's page, `knowledge/activities/<quiz-slug>.md`, what questions you imported (types used, how many, general
criteria you followed when writing them) — no need to copy the full content of the
`.gift` file, which is already kept next to it as a separate file. The knowledge base is
the agent's memory across sessions: if more questions need to be added to the same quiz
later, that note saves you from re-reading everything already imported to keep the same
criteria.
