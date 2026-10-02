# Unit backup: build a whole unit in drafts/ and restore it at once

Issue: [#23](https://github.com/falkenslab/miyagi/issues/23)

## Goal

Build a unit or a course as a Moodle backup package (`.mbz`) in `drafts/`, reviewable before anything reaches Moodle, and put it in the course with one restore (everything hidden) instead of filling forms one by one.

## Context

- Today every piece is built through Moodle's forms with Playwright: section, book chapter by chapter, page, assignment, quiz, question order, grade weights. Only questions are imported in bulk (GIFT from `drafts/`, checked by the upload gate).
- In the docs tutorial (#22, sandbox on Docker/Windows) Tema 1 took about 50 minutes and hit the 400-turn limit of a session. Typing into the rich-text editor also lost code blocks until the content went through its source-code view.
- A package is like code: the teacher could review the whole unit in `drafts/` (or a generated HTML preview) before it exists in Moodle, and reuse it next year or in another course.
- Restoring into one's own course ("merge into this course") is a default capability of the editing teacher, but a site can restrict it.
- The `.mbz` format is many linked XML files that change between Moodle versions (Moodle 5 moved questions to per-activity banks, `mod_qbank`). The model writing it by hand would fail often: it needs code that builds it.
- ADR-009 still applies: everything arrives hidden, is tested in Moodle, and is shown on a second approval.

## Changes

Spike first (no product change until it passes):

- A script that builds a minimal `.mbz` for Moodle 5.2 from a plain description (section with summary, page, book with chapters, assignment with dates and rubric-free grading, quiz with GIFT questions, all hidden), restored as the sandbox's teacher into an existing course.
- Measure it against the form-by-form build of the same unit (time, turns), and list what doesn't travel (scales, gradebook weights, course-level settings, merging into an existing section).

If the spike holds:

- A drafts tool that builds the package from a unit description in `drafts/<slug>/` (content as HTML files plus a manifest of activities and settings), with a validator in the upload gate (schema, references between files, everything hidden).
- An HTML preview of the unit generated from the same folder, for the teacher's review.
- `explore` records whether the teacher can restore into the course; without it, `unit-building` keeps building through forms.
- `unit-building` and `course-building`: when to build the package and when not to; one approval for the restore with a summary of every piece; the settings that don't travel done afterwards through forms; then the usual test and show.
- `knowledge/topics/<slug>.md` links to the package, so it can be restored again elsewhere.
- Docs (`update-docs`): how it works, in Avanzado, and the tutorial's unit pages if the timings change.

## Acceptance

- The spike's `.mbz` restores without errors into the sandbox as the teacher, with every piece hidden and its content intact (code blocks, chapters, dates, questions), and the time saved is measured and written down.
- If the feature goes ahead: a unit of the SQL course built from a package matches one built through forms, the validator rejects a broken package, the teacher approves one restore and then the showing, and nothing is published without approval.
- A site where the teacher can't restore falls back to forms, saying so.
- Report in `tests/` with screenshots (`test-report`).
