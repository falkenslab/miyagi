# The life of an activity: plan, build, hidden test, served

Issue: [#17](https://github.com/falkenslab/miyagi/issues/17)

## Goal

New or complex activities go through four phases (a plan agreed with the teacher, the build, a hidden test in the classroom, and opening it to students), with one approval to move from each phase to the next; `course/drafts` records every activity in progress with its phase, and the end of a session and the next greeting say how many are in each.

## Context

- Today a request goes straight to building. `publish-check` already makes every new resource go up hidden and be tested before it's shown (ADR-009), but nothing makes the teacher and the agent agree on what to build first: the teacher sees the activity when it's already in Moodle.
- agent-kit's plan mode (since 0.14): while it's on, the agent only reads and writes the plan files the spec declares (`AgentSpec.planMode`: `isPlanFile`, `isReadOnlyTool`) and ends with `present_plan`. miyagi declares nothing yet, so in plan mode it can't write a plan file nor use any of its own tools.
- `course/drafts` lists only resources uploaded hidden and not shown; something being planned or built isn't recorded, so neither the teacher nor the next session knows about it. `printSessionEnd()` (`src/agent.ts`) only warns that the page has items.
- Where things are built: the neutral source in `materials/`, the rest (an HTML app, a SCORM package, the plan) in `drafts/<slug>/` (see `neutral-materials`).
- Optional: suggested for a unit's project, a gamified activity, a SCORM package, a workshop; not for a quick question or a small edit. Asked by the teacher (2026-09-30).

## Changes

- `AgentSpec.planMode` in `src/agent.ts`: plan files `drafts/*/plan.md`; read-only tools: the knowledge base's reading tools, `drafts_list`/`drafts_info`, and the classroom's read tools (the browser's snapshot today, the Moodle extension's read tools with `moodle-mcp`).
- Skill `activity-lifecycle` (the building skills point to it for new or complex activities):
  1. **Plan**, in plan mode: `drafts/<slug>/plan.md` with objectives and the criteria it serves, what students do and produce, how it's assessed, the classroom pieces and settings, materials, timing, risks. Iterated with the teacher; `pedagogy-reviewer` reviews it and its critique is addressed or answered in the plan. `present_plan` → approval to build.
  2. **Build** in `materials/` and `drafts/<slug>/`; then compare what was built with `plan.md`, point by point, saying what differs and why. Approval to upload.
  3. **Hidden test**: upload hidden and test it as the teacher (`publish-check`). Approval to open it.
  4. **Served**: show it to students and check it as a student.
  Each approval's summary says which phase ends and what the next one does. The agent suggests the process when a request fits; the teacher can decline it or ask for it ("con el proceso completo").
- `course/drafts` becomes the register of activities in progress: one entry each, phase first (**en plan**, **cocinándose**, **probándose oculto**, **servido**), with links to its `plan.md`, its source and its classroom URL once uploaded, and what it needs for the next phase. A served entry stays until the next session has seen it. A fixed format, described in `classroom-knowledge.md`, `publish-check` and the skill, so code can count it; old pages (hidden items only) read as "probándose oculto".
- `printSessionEnd()` summarises by phase in the chat's language ("En el horno: 1 en plan, 2 cocinándose, 1 probándose oculto"); the chat's greeting says the same. Messages in en/es/fr/de; a check in `verify` that parses sample pages.
- The activity's page (`activity/<slug>`) links its `plan.md` as its reference.

## Acceptance

- Against the sandbox, reported in `tests/`: asked for a new gamified activity with the process, the agent writes `plan.md` in plan mode (nothing else written, nothing changed in the classroom), iterates it with the teacher and `pedagogy-reviewer`, and asks to build; builds, compares with the plan, uploads hidden, tests and asks to open it, one approval per phase.
- After a session that planned one activity, built another and left a third hidden, `course/drafts` has the three with their phases and the end of the session says "En el horno: 1 en plan, 1 cocinándose, 1 probándose oculto"; the next greeting mentions it.
- A small request (a typo in a page) doesn't trigger the process; an old `course/drafts` is summarised without errors.
- `verify` passes.
