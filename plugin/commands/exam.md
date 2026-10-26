---
description: Print a quiz as a paper exam - versions A, B... with the questions and options in another order, and their answer keys
---

Print a paper exam now with the `materials-format` skill: $ARGUMENTS

Find the quiz in `materials/` (`materials_list`); if there's none for this, write it first from
its banks (`quiz-design`, `materials-format`) and validate it. Then `materials_exam` with the
number of versions asked (two by default), turn them into PDFs with `drafts_pdf`, and say where
the versions and the answer key are and which seed reprints them.

If nothing was given above (the line is empty), ask which quiz or topic, how many versions, and
whether it should draw a fixed number of questions from a bank before doing anything else.
