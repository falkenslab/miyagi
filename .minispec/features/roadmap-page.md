# Public roadmap page

Issue: [#29](https://github.com/falkenslab/miyagi/issues/29)

## Goal

Publish where miyagi is going (linking a classroom when you want, Moodle without the free browser, extensions and their repositories, materials written once, Classroom, curriculum, learning situations, video, personalisation) as a page of the docs site that says plainly it's a plan.

## Context

- The docs site only describes what exists (ADR-012); the new direction (ADR-013 to ADR-020) has nowhere public to live.
- Already available, to mark as such: the classroom is optional (#30, closed).
- Each milestone has its feature file and issue; teachers can follow and comment on those issues.

## Changes

- `docs/content/hoja-de-ruta.md`, linked from the footer (`docs/docusaurus.config.js`), not from the landing page; a notice at the top that it's a plan and only items marked "disponible" exist.
- One entry per open feature, grouped in the order of `.minispec/features/` (classroom-link, moodle-mcp, extensions, extension-repositories, neutral-materials, activity-lifecycle, appearance, official-curriculum, learning-situations, classroom-connector, personalised-activities, workspace-kinds, video-voice-youtube), in the teacher's language, each linking its issue.
- A "Lo que miyagi no hará" section: personal student data, tutoring, families (ADR-017); a community catalog or a hub to share extensions or activities (ADR-020).
- ADR-012: one line recording that the roadmap is the only page about what doesn't exist yet, and says so.
- `update-docs`: when a milestone closes, mark its entry "disponible" with a link to the guide.

## Acceptance

- The page builds, is linked from the footer and every entry links an open issue.
- `check-docs.mjs` and the site build pass.
