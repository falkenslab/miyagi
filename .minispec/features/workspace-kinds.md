# Department and competitive-exam workspaces

Issue: [#37](https://github.com/falkenslab/miyagi/issues/37)

## Goal

Add the workspace kinds `departamento` and `oposicion` next to `materia` (ADR-017).

## Context

- `kind: "materia"` exists since `extensions`; it's the only kind.
- Same engine, extensions and approval; what changes is the base prompt, default skills and knowledge-base pages.
- Only sketched for now: redesign in detail when it starts.

## Changes

- `departamento`: annual report of a module or department, meeting minutes, coordination between modules, projects (Erasmus+, innovation, teacher training). If the teacher includes student data while dictating, it isn't copied into the knowledge base.
- `oposicion`: teaching plan and units in the exam board's format, no classrooms; board requirements as content extensions.
- `init` asks the kind; base prompts and pages per kind.

## Acceptance

- A report and a set of minutes in a `departamento` workspace, and a plan with two units in an `oposicion` workspace, each with its report in `tests/`.
