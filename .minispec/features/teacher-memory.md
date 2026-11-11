# Teacher memory

Issue: [#104](https://github.com/falkenslab/miyagi/issues/104)

## Goal

miyagi remembers the teacher across all their subjects (how they like to be addressed, their feedback style, their tools) with agent-kit's memory, and never keeps a student in it.

## Context

- miyagi registers agent-kit's `awareness()` (#102) but not `memory()`. A teacher's preference lands in one subject's knowledge base and every other subject starts from zero: in the FP simulation the neutral feedback style stayed in Despliegue de Aplicaciones Web only.
- agent-kit's memory (`extensions/memory`) keeps one Markdown file per entry in the folder the agent gives it (`memory({ dir })`), reached only through `recall`, `remember` and `forget`; it only stores what the person wrote, quoting their words. `/memory:list` and `/memory:forget` let the person see and remove entries.
- Teachers name their students in the chat ("Rubén tiene TDAH" in the ESO simulation). The kit's rule keeps entries about the person, but nothing stops a sentence about a student from going in. Student data stays out of everything miyagi keeps (principles; ADR-005, ADR-017).
- The subject's own decisions (its plan, its criteria, "óxido férrico no se acepta") belong to its knowledge base; mixed into the memory they'd leak into other subjects.

## Changes

- `src/agent.ts`: register `memory({ dir })` next to `awareness()`, with the folder at `~/.miyagi/memory/` (outside every subject, like `~/.miyagi/config.json` and `~/.miyagi/extensions/`).
- Prompts (`teacher-chat*.md`, `teacher-run*.md`): what goes in the memory (the teacher: name and how to address them, tone, feedback style, formats, tools) and what doesn't (a subject's decisions go to its knowledge base; never a student's name, need, grade or anything about one).
- `check-prompts.mjs`: the memory section and the no-students rule, in the session kinds that have it.
- `check-file-scope.mjs`: the memory folder reachable only through its tools.
- Docs site (`update-docs`): where the memory lives, what it keeps, `/memory:list` and `/memory:forget`, in Spanish and English.

- - -

## Acceptance

- In subject A the teacher says how they want feedback written; a new conversation in subject B follows it from the first reply, and `/memory:list` shows the entry.
- A decision of subject A (a grading criterion) is in A's knowledge base and not in the memory.
- A message naming a student and their need leaves no entry that names or describes the student (checked by trying it on purpose).
- `~/.miyagi/memory/` holds the entries; Read, Grep and Write can't reach it.
- `verify` passes, and the docs build with the new section.

- - -
