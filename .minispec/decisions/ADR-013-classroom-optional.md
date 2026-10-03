# ADR-013: The classroom is optional; a workspace is a subject

## Decision

miyagi is the teacher's assistant, not a Moodle course manager. A workspace is one subject (módulo, materia) with zero or more classrooms (aulas) on any platform, and groups that belong to the subject and point at a classroom (and at a platform group when the platform has them). Without a classroom it still works: teaching plan, official curriculum, units and materials, with no browser.

## Motivation

Most of what a teacher prepares (the plan, the curriculum, units, rubrics, question banks) doesn't depend on Moodle, and the same subject is often taught in more than one classroom: a Moodle course per group, on-site and distance Moodles, Moodle plus Google Classroom. One workspace per course would duplicate the plan and the materials. Rejected: one workspace per classroom (duplicates the plan), one workspace per teacher with every subject (mixes knowledge bases).

## Consequences

- `config.json`'s `classroom` becomes optional (milestone A), then `aulas[]` and `grupos[]` (milestone B), migrated automatically.
- No classroom: no Playwright, no publish or upload gate, no `explore`; base prompts that don't mention Moodle.
- The typical case stays simple: one Moodle classroom, its groups, nothing asked about where to publish.
- Compatibility with moodle-agent's workspaces is no longer a requirement.
- Delivered by the features `classroom-optional` and `extensions`.
