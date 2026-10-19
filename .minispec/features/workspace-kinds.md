# Department and competitive-exam workspaces

Issue: [#37](https://github.com/falkenslab/miyagi/issues/37)

## Goal

Add the workspace kinds `department` and `exam-prep` next to `subject` (ADR-017, ADR-023).

## Context

- `workspace-registry` writes `kind: "subject"` in `config.json`; it's the only kind.
- Same engine, extensions and approval; what changes is the base prompt, default skills and knowledge-base pages.
- The interface says the kind's word in the teacher's language ("espacio de departamento", "preparación de oposición"), never "workspace".
- Only sketched for now: redesign in detail when it starts.

## Changes

- `department`: annual report of a module or department, meeting minutes, coordination between modules, projects (Erasmus+, innovation, teacher training). If the teacher includes student data while dictating, it isn't copied into the knowledge base.
- `exam-prep`: teaching plan and units in the exam board's format, no classrooms; board requirements as extensions.
- `init` (and the GUI's "new") asks the kind; base prompts and pages per kind.

## Acceptance

- A report and a set of minutes in a `department` workspace, and a plan with two units in an `exam-prep` workspace, each with its report in `tests/`.
