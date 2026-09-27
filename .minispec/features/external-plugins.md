# External plugins and the FP teaching-plan plugin

## Goal

Load extra skill plugins into teacher-agent from configuration, and move the teaching-plan skills, plus new ones for Spanish vocational training (FP), into a separate `fp-didactica` plugin.

## Context

- `AgentSpec.pluginRoots()` (`src/agent.ts`) already returns a list, but only `plugin/`; `src/catalog.ts` only lists `plugin/` and agent-kit's knowledge plugin.
- `teaching-plan`, `teaching-methodologies` and `topic-research` don't depend on Moodle; `course-alignment` does (it's the bridge between plan and course) and stays in teacher-agent.
- The plan lives at `knowledge/teaching-plan.md` (plus `syntheses/course-alignment.md`), named in `course-knowledge.md`, `plugin/commands/{align,teaching-plan}.md`, the skills `course-alignment`, `course-building`, `publish-check`, `teaching-plan`, `unit-building`, and the dev skill `simulate-course`.
- A plugin brings instructions only; file permissions are set in `toSessionConfig()` and must stay there (ADR-003, ADR-004).

## Changes

- Config field `agent.plugins` (workspace `config.json`) and `plugins` (`~/.teacher-agent/config.json`): paths to plugin roots, appended to `pluginRoots()`.
- `catalog.ts` lists them under their own namespace (`/fp-didactica:…`).
- External plugins contribute skills and commands only: check whether agent-kit/the SDK loads plugin-defined subagents, and block them if so (no Bash through a plugin).
- Move the plan into `knowledge/plan/` (`plan/teaching-plan.md`, `plan/course-alignment.md`?) and update every file that names it at once; no new writable dir.
- New `fp-didactica` plugin (separate repo): `teaching-plan`, `teaching-methodologies`, `topic-research`, plus FP skills:
  - learning outcomes (RA) and criteria (CE) from the title's Real Decreto / regional curriculum;
  - grading weighted by RA/CE;
  - dual FP / in-company training plan;
  - intermodular project;
  - practice environments (Docker Compose, VMs, networks), relying on the practice-runner when enabled.
- `practice-testing` may move to the plugin; the `practice-runner` subagent stays in teacher-agent.
- Update `.minispec/core/architecture.md`, `README.md` and `check-prompts.mjs` / `check-references.mjs` for skills that move.

## Acceptance

- `teacher-agent skills` lists the external plugin's skills with its namespace when configured, and nothing changes when it isn't.
- A plugin that declares a subagent with Bash doesn't get it.
- `verify` passes; `smoke-ingest` builds the plan under `knowledge/plan/`.
- A `simulate-course` run with `fp-didactica` loaded writes an RA/CE-based plan and aligns the course to it.
