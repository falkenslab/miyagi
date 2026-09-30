# External plugins and the FP teaching-plan plugin

Issue: [#3](https://github.com/falkenslab/teacher-agent/issues/3)

## Goal

Load extra skill plugins into teacher-agent from configuration, and move the teaching-plan skills, plus new ones for Spanish vocational training (FP), into a separate `fp-didactica` plugin.

## Context

- `AgentSpec.pluginRoots()` (`src/agent.ts`) already returns a list, but only `plugin/`; `src/catalog.ts` only lists `plugin/` and agent-kit's knowledge plugin.
- `teaching-plan`, `teaching-methodologies` and `topic-research` don't depend on Moodle; `course-alignment` does (it's the bridge between plan and course) and stays in teacher-agent.
- The plan lives at `knowledge/teaching-plan.md` and `knowledge/syntheses/course-alignment.md`, named in `course-knowledge.md`, `plugin/commands/{align,teaching-plan}.md`, the skills `course-alignment`, `course-building`, `publish-check`, `teaching-plan`, `unit-building`, and the dev skill `simulate-course`.
- A plugin brings instructions only; file permissions are set in `toSessionConfig()` and must stay there (ADR-003, ADR-004).
- agent-kit loads plugins as SDK local plugins with `skipMcpDiscovery: true`, so a plugin's `.mcp.json` is ignored. Plugin-defined agents can't be spawned: `subagentTypeGate` only allows the types teacher-agent registers, and `ingest`/`explore` have no `Agent` tool. But a plugin's `hooks/` would run shell commands on the host, outside every gate.

## Changes

- `plugins` in `~/.teacher-agent/config.json` (every course) and `agent.plugins` in the workspace `config.json` (one course): lists of plugin root paths, merged and appended to `pluginRoots()`.
- Reject an external plugin that has `hooks/` or `agents/` (clear error at session start); it may only bring `skills/` and `commands/`.
- `catalog.ts` lists them under their own namespace (`/fp-didactica:…`).
- Move the plan into `knowledge/plan/`: `plan/teaching-plan.md` and `plan/alignment.md` (was `syntheses/course-alignment.md`). Update every file that names them at once; no new writable dir. Old workspaces: move both files on open, like the legacy migration.
- New `fp-didactica` plugin in `falkens-claude-plugins` (`plugins/fp-didactica`, listed in its marketplace), usable from Claude Code too: `teaching-plan`, `teaching-methodologies`, `topic-research`, plus FP skills:
  - learning outcomes (RA) and criteria (CE) from the title's Real Decreto / regional curriculum;
  - grading weighted by RA/CE;
  - dual FP / in-company training plan;
  - intermodular project;
  - practice environments (Docker Compose, VMs, networks), relying on the practice-runner when enabled.
- `practice-testing` may move to the plugin; the `practice-runner` subagent stays in teacher-agent.
- Update `.minispec/core/architecture.md` and `glossary.md` (RA, CE in the FP sense, módulo profesional), `README.md`, `docs/skills.md`, and `check-prompts.mjs` / `check-references.mjs` for skills that move.
- ADR for "external plugins bring instructions only" once implemented.

## Acceptance

- `teacher-agent skills` lists the external plugin's skills with its namespace when configured, and nothing changes when it isn't.
- A plugin with `hooks/` or `agents/` is refused.
- `verify` passes; `smoke-ingest` builds the plan under `knowledge/plan/`; an old workspace's plan is moved there.
- A `simulate-course` run with `fp-didactica` loaded writes an RA/CE-based plan and aligns the course to it.
