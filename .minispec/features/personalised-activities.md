# Personalised activities

Issue: [#39](https://github.com/falkenslab/miyagi/issues/39)

## Goal

Equivalent variants of an activity set in what a group cares about, from an anonymous survey, without any per-student data (ADR-018).

## Context

- Needs `neutral-materials` (variants, `restrictions`) and a connector's `survey` capability (Moodle Feedback, Google Forms).

## Changes

- `materials/surveys/<slug>.survey.md`; validator requires the purpose/anonymity header and refuses sensitive or identifying questions.
- Published anonymously (Moodle Feedback anonymous; Forms with `DO_NOT_COLLECT`); read only in aggregate (Moodle's analysis page, `forms_responses_summary`); no category under 3 answers; free text summarised, never quoted.
- `knowledge/groups/<group>/interests.md`: date, answers, themes with counts ≥ 3, school year.
- `variants:` in `.assignment.md`/`.quiz.md`: only the context changes; validator enforces same criteria, rubric, points and question types; `pedagogy-reviewer` checks difficulty; 2-4 variants plus a neutral one.
- Delivery: "choose your context" by default; one variant per group with `restrictions` if the teacher decides; never per named student or by creating groups.
- Reminder the first time a survey goes to a classroom: check with the school whether families must be told (model text in the guide).

## Acceptance

- Unit tests: survey validator, variant validator, aggregation threshold.
- e2e against moodle-sandbox with seeded anonymous answers: survey, interests page, three variants as "choose your context", survey seen as anonymous by a student; report in `tests/`.
- `check-knowledge.mjs --names` finds no student; `student-impact-review` passes.
