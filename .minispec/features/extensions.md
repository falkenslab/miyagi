# Extensions, with Moodle as the first one

Issue: [#33](https://github.com/falkenslab/miyagi/issues/33)

## Goal

Move everything Moodle-specific into a built-in extension, add classrooms and groups to the workspace, and let teachers install content extensions (ADR-014, ADR-016).

## Context

- `pluginRoots()` returns only `plugin/` (`src/agent.ts:138`); `src/catalog.ts` hardcodes `plugin/` and the kit's knowledge plugin.
- Moodle is wired in `agent.ts` (Playwright, `browser_run_code_unsafe`, manual login, gates), `publishGate.ts:48-124` (patterns), `uploadGate.ts` and `validators/gift.ts`, and 14 prompt/skill files name `moodle-capabilities.md`/`course-map.md`.
- agent-kit's `AgentSpec` has no hooks field (gates stay as post-build mutations); `runChatInk` has no local-command API (`/copy`, `/resume`, `/plan` are hardcoded).
- Supersedes `external-plugins` (#3).

## Changes

- `config.json`: `kind: "materia"`, `label`, `aulas[]` (`id`, `extension`, platform fields, secrets kept in `config.json`), `grupos[]` (`id`, `aula`, `platformGroup`), `extensions[]`. Automatic migration from `classroom` with `config.json.bak`; classroom knowledge pages move to `knowledge/aulas/<id>/`; one password secret per classroom.
- `extensions/moodle/` (plugin.json, `miyagi.json`, `prompt.md`, `explore.md`, skills `moodle-navigation`, `course-orientation`, `activity-building`, `scorm-packaging`, command `/map`) and `src/extensions/` (types, manifest, loader, `moodle/connector.ts`, `publishActions.ts`, `validators/gift.ts`). HTML validator stays in the core.
- Generic publish gate fed by the active connectors' predicates; upload gate as a registry by file extension.
- System prompt: core base without Moodle, one section per classroom from its extension, then content extensions, framed as never overriding core rules.
- `catalog.ts` and `sessionSkills()` walk `plugin/` and active extensions; skills and extensions computed inside the session opener.
- Groups: `explore` proposes them, the teacher confirms, code writes them; used to filter grading, forum and progress.
- `miyagi ext add|list|remove|enable|disable|check|new|pack` (content level: no MCP, hooks, settings, or agents with tools beyond Read/Glob/Grep/WebSearch/WebFetch; personal-data warning); GitHub tarball by HTTPS, no git; lock with SHA-256; skill `extension-authoring`.
- agent-kit request: `InkChatOptions.localCommands` with `reopen()`, for `/extensions` and `/connect`.
- Docs: "Conectar tu aula", "Añadir una plantilla", "Escribir una extensión"; `check-docs.mjs` for `ext` and the new config keys.

## Acceptance

- `sandbox-e2e` and `simulate-course` give the same result before and after (report in `tests/`); `student-impact-review` confirms the same actions are gated.
- `check-prompts.mjs` renders no classroom, one Moodle and two Moodles with groups.
- `check-extensions.mjs`: toy extensions breaking each rule are refused; a valid content extension shows in skills and the prompt; a tampered one doesn't load.
- A v0.11 workspace migrates and its knowledge base links still resolve.
