# A material the teacher designed, into the course

Issue: [#52](https://github.com/falkenslab/miyagi/issues/52)

## Goal

"Sube al tema 3 la ficha que hice en Canva" done right in one go: the design exported in the format that fits, kept, and published in the course as the resource that fits, with the teacher's yes before publishing; without naming any design tool or platform.

## Context

- The tools exist (canva 0.2.2 exports; moodle-teacher publishes), so it can be done step by step today, but nothing says the teacher's part: which format for which material, where it goes in the unit, how it's introduced to students.
- agent-kit 0.30 asks the model to request `/extensions sign-in` when a remote extension (Canva) waits for it.
- Only `practice-testing` uses `requires` today; this would be the second skill gated on capabilities, and the first on two extensions at once.

## Changes

- Skill `designed-material`, `requires: [design-export, lms-content]` (canva and moodle-teacher provide them today): which format for which material (PDF to print, an image for an infographic in a page, slides to download or project), where in the unit and with what text for students, the file kept in `drafts/<slug>/` before publishing (export links expire), published hidden first with `publish-check`, nothing personal about students in a design.
- No tool names: how to export is the design extension's skill, how to publish the classroom's (`check-neutral-skills.mjs`).
- Docs: the skill in `guia/habilidades.md`, with what it needs installed.

## Acceptance

- With canva and moodle-teacher installed, in one conversation: a Canva design is exported, kept and published hidden in a unit of a moodle-sandbox course, with the teacher's yes before publishing; report in `tests/`.
- Without one of them, the skill isn't offered and miyagi doesn't mention it.
- `verify` and `check-docs` pass.
