# The oven: every activity with its phase in knowledge/drafts.md

Issue: [#18](https://github.com/falkenslab/teacher-agent/issues/18)

## Goal

Make `knowledge/drafts.md` track every artefact the agent is making, from plan to served, with its phase, the links to its plan and its source, and what it needs to reach the next phase; the end-of-session notice summarises how many are in each phase.

## Context

- Today `knowledge/drafts.md` lists only resources uploaded hidden and not shown yet, one list item each with its link and what's pending (`publish-check`, `course-knowledge.md`): it isn't a history, an item leaves it when shown. An activity that's being planned or built in `drafts/` isn't there, so neither the teacher nor the next session knows about it.
- At the end of a session, `printSessionEnd()` (`src/agent.ts`) warns when `drafts.md` has any list item ("Hay recursos subidos ocultos a Moodle…"), with no count and no phase.
- The activity-building process (`activity-process`) has four phases: plan, build, hidden test, served. This is where they're recorded.
- Asked by the teacher (2026-09-30). Named after the kitchen: an activity goes from the recipe to the oven, is tasted before serving, and is served.

## Changes

- `knowledge/drafts.md` becomes the oven: one entry per artefact still in progress, with
  - its phase: **en plan**, **en el horno** (being built in `drafts/`), **probándose oculto** (uploaded hidden, being tested), **servido** (shown to students);
  - a link to its `drafts/<slug>/plan.md` (if it has one) and to its source folder, and its Moodle link once uploaded;
  - what it needs for the next phase ("waiting for the teacher's approval of the plan", "the SCORM score isn't reaching the gradebook yet").
  A served entry stays until the next session has seen it, then leaves (the activity's knowledge page keeps its history). Existing `drafts.md` files (hidden items) are read as "probándose oculto".
- A fixed, parseable format (a table, or a list with the phase first) described in `course-knowledge.md`, `publish-check` and `activity-process`, so code can count it.
- `printSessionEnd()` reads it and summarises by phase in the chat's language ("En el horno: 1 en plan, 2 en el horno, 1 probándose oculto"), with the file's path; the chat's opening greeting mentions the same summary (it already reads `drafts.md`).
- `src/messages/` for the phase names and the summary in the four languages; a check in `verify` that parses sample files.

## Acceptance

- After a session that planned one activity, built another and left a third hidden, `drafts.md` has the three with their phases and links, and the end-of-session notice says "1 en plan, 1 en el horno, 1 probándose oculto".
- An old `drafts.md` (hidden items only) is summarised as hidden items, without errors.
- The next chat's greeting mentions what's in the oven.
- `verify` passes.
