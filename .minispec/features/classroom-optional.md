# Classroom optional

Issue: [#30](https://github.com/falkenslab/miyagi/issues/30)

## Goal

A workspace without a Moodle classroom works: chat, run and ingest with no browser, helping with the teaching plan and materials (ADR-013).

## Context

- `classroom.url` and `classroom.courseId` are required (`src/workspace.ts:21-28`); `WorkspaceSessionConfig.moodleUrl`/`moodleCourseId` too.
- Every kind but `ingest` starts Playwright and both gates (`src/agent.ts:117-137, 293-300`); the chat header calls `new URL(moodleUrl)` (`:337`) and would throw.
- `teacher-run.md`, `teacher-chat.md`, `teacher-ingest.md` and `course-knowledge.md` assume Moodle; `init` requires the Moodle URL (`src/menu.ts:63`).
- `config.json` keeps `classroom` here; `aulas[]` comes with `extensions`.
- Transitional: `hasMoodle`, the Moodle-named messages and the `*-standalone.md` bases are removed by `extensions`, where the standalone base becomes the only one.

## Changes

- `WorkspaceConfig.classroom` optional; `label`/`description` at the root when there's none; `readWorkspaceConfig()` requires `url` and `courseId` when there is one.
- `WorkspaceSessionConfig.hasMoodle`; `moodle*` optional; `toSessionConfig()` adds the secret only with a classroom.
- `buildSpec(..., hasMoodle)`: `hasBrowser = kind !== "ingest" && hasMoodle`; `drafts` server always in run/chat; Playwright config, gates, manual-login texts and credential checks only with a browser.
- Headers show "sin aula" instead of the URL; `explore` without a classroom stops with a message.
- Standalone base prompts `teacher-{chat,run,ingest}-standalone.md` (assistant for the teacher, nothing to publish, materials in `drafts/`, connect a classroom with `miyagi init`); classroom pages of the knowledge base move to `system/classroom-knowledge.md`, added only with a classroom; `web-research` uses the no-forum line; `chat-opening-teacher-standalone.md`.
- Skills: `teaching-plan`, `course-design`, `rubric-design`, `teaching-methodologies` say "the connected classroom, if any"; skills that act in Moodle open with "Needs a connected Moodle classroom; without one, build what you can in `drafts/` and say so". No skill moves.
- `init`: first question "¿Conectar un aula Moodle ahora?"; without it, only label, description, persona, language, instructions, and no `explore` offer. `init` on a workspace with no classroom offers to connect one.
- Messages (en/es/fr/de): `connectMoodleNow`, `noClassroom`, `exploreNeedsClassroom`, `classroomIncomplete`, `headerClassroom`.
- `.minispec/core/`: `project.md`, `architecture.md`, `principles.md` (ADR-013).

## Acceptance

- `check-prompts.mjs` also renders a workspace without `classroom`: standalone bases present; no `MOODLE_PASSWORD`, navigation map, file-name safety or classroom knowledge.
- `init` without a classroom, then `chat`: no browser opens, a teaching plan is written to `knowledge/`.
- `explore` without a classroom ends with its message; `smoke-ingest` passes without one.
- `sandbox-e2e` with a classroom behaves as before (report in `tests/`); `student-impact-review` finds nothing changed in what's published.
