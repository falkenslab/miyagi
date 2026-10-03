# Neutral materials

Issue: [#34](https://github.com/falkenslab/miyagi/issues/34)

## Goal

Write a subject's materials once in `materials/` and publish them to any classroom through tested exporters (ADR-015).

## Context

- Today GIFT and HTML are written by hand in `drafts/` and checked by `validators/`; activity pages and `.gift` files live in `knowledge/activities/`.
- Needs the `extensions` feature (connectors, capabilities). Split into four releases; each type moves in its own step and its old path goes in the same step.

## Changes

- Base: `materials/` (writable, not ignored); `materials/course.md` (start per group, holidays, evaluations); `src/materials/` parser (a real Markdown tokenizer, `yaml` frontmatter), validator (`Finding[]`), canonical hash; in-process `core` MCP (`materials_validate`, `materials_resolve`, `record_publication`, `publication_status`); losses added to the approval by the publish gate; `npm test` with `node:test`, run by `verify`; core skill `materials-format`.
- Step 1, quizzes and banks: `.quiz.md` (purpose and settings intent) and `.questions.md`; types single, multiple, truefalse, short, numeric, matching, ordering, essay; GIFT exporter and importer in the Moodle extension, never in the core (escapes, code as `[html]<pre>`, names, categories, own output through `validateGift`) and importer (teacher's banks, migration of `activities/*.gift`, a Moodle bank); paper exams A/B with a stored seed (`paper-exam`, `/exam`); `question-bank` capability; `quiz-building` becomes `moodle:publish-quiz`.
- Step 2, notes: Markdown to accessible HTML in the core; `moodle:publish-notes`; `link` capability; `resource-authoring` split.
- Step 3, assignments, rubrics, grading: `.assignment.md`, `.rubric.md` (sums, CE per criterion), `materials/grading.md` (weights add to 100 %, spreadsheet template); `moodle:publish-assignment`, `moodle:gradebook`, `moodle:calendar`; `assignment-building` split; grading uses the published rubric (hash).
- Step 4, units and import: `unit.md` sequence with conditions; `moodle:publish-unit`, `restrictions`, `announcements`, `staged-publishing`; `unit-building`, `course-building`, `publish-check` split; alignment and audit use `publication_status`; import a Moodle course into `materials/`; `/publish`.

## Acceptance

- Unit tests: parser, validator, GIFT round trip, real fixtures re-exported valid, indentation kept, reproducible exam versions, grading sums.
- Each step published to moodle-sandbox and seen as a student (reports in `tests/`); the last step publishes a unit to one group only and imports an existing course.
- After step 4, `check-prompts.mjs`'s Moodle allowlist is empty: no core skill or prompt names a platform.
- A v0.12 workspace's `.gift` files end up in `materials/`; `simulate-course` runs end to end on the new path; `student-impact-review` each step.
