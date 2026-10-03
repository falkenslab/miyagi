# Public roadmap page

Issue: [#29](https://github.com/falkenslab/miyagi/issues/29)

## Goal

Publish where miyagi is going (classroom optional, extensions, Classroom, curriculum, video, personalisation) as a page of the docs site that says plainly it's a plan.

## Context

- The docs site only describes what exists (ADR-012); the new direction (ADR-013 to ADR-018) has nowhere public to live.
- Each milestone has its feature file and issue; teachers can follow and comment on those issues.

## Changes

- `docs/content/hoja-de-ruta.md`, linked from the footer (`docs/docusaurus.config.js`), not from the landing page; a notice at the top that it's a plan and only items marked "disponible" exist.
- One entry per milestone (A, B, C, 1.0, 1.1-1.5) in teacher's language, each linking its issue.
- A "Lo que miyagi no hará" section (ADR-017: personal student data, tutoring, families).
- ADR-012: one line recording that the roadmap is the only page about what doesn't exist yet, and says so.
- `update-docs`: when a milestone closes, mark its entry "disponible" with a link to the guide.

## Acceptance

- The page builds, is linked from the footer and every entry links an open issue.
- `check-docs.mjs` and the site build pass.
