# ADR-015: Neutral materials, exported by code

## Decision

A subject's materials (question banks and quizzes, notes, assignments and rubrics, units, surveys) are written once in `materials/`, as Markdown the teacher can read and edit, and published to each classroom through its connector's **exporter**: deterministic, tested code, not the model. Every export states its losses, and the publish gate adds them to the approval question itself. A code-owned publication record (`knowledge/aulas/<id>/publications.json`) keeps where each material went and the hash of the version published.

## Motivation

The same unit must reach several classrooms on different platforms. Writing GIFT or HTML by hand is where real bugs came from (escapes, lost indentation, quizzes without a right answer); an exporter removes that class of error at the source and validates its own output. Hashes tell when a material changed since it was published. Rejected: XML standards as the source format (QTI, Moodle XML: not editable by a teacher), letting the model translate per platform (not reproducible), the platform as the source of truth (not portable).

## Consequences

- `materials/` is writable and not in `.gitignore`: it's the teacher's material.
- The core validates before any export (one right answer, points, `CE`/`RA` that exist, linked files); exporters run their output through the existing validators (GIFT, HTML).
- What can't be degraded without changing a question is the teacher's call, never the exporter's.
- Relative dates ("week 3") become real dates per group from `materials/course.md`.
- Each material type moves to `materials/` in its own step and the old path for that type is removed in the same step.
- First unit tests in the repo (`node:test`), run by `verify`.
- Delivered by the feature `neutral-materials`.
