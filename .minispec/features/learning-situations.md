# Learning situations and intermodular project

Issue: [#32](https://github.com/falkenslab/miyagi/issues/32)

## Goal

Design LOMLOE learning situations (ESO, Bachillerato) and the FP intermodular project on top of the teaching plan and the official curriculum.

## Context

- The plan lives in `knowledge/teaching-plan.md`; `official-curriculum` brings the provisions to `knowledge/curriculum/`.
- No skill covers either today; region- or school-specific templates will arrive as content extensions (feature `extensions`); until then, `sources/` or `instructions.md`.

## Changes

- Skill `learning-situation`: title, context (a challenge close to the students), specific competences, criteria, basic knowledge, exit-profile descriptors, sequence of activities, resources, assessment (instruments tied to criteria), UDL. Writes `knowledge/situations/<slug>.md`, linked to the plan and the curriculum; can feed `unit-building`.
- Skill `intermodular-project`: the challenge, the modules and RA it integrates (the whole title's curriculum through `official-curriculum`), phases, deliverables, assessment by RA of each module, coordination with the teaching team. Writes `knowledge/intermodular-project.md`.
- Both reviewed by `pedagogy-reviewer` before they're done.
- `course-knowledge.md` (and the standalone prompts) name the new pages.

## Acceptance

- A learning situation for an ESO subject and an intermodular project for an FP title, in a workspace without a classroom, linked to their curriculum pages; report in `tests/`.
- `verify`, `smoke-ingest` and `check-docs.mjs` pass.
