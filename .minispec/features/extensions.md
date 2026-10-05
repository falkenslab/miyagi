# Extensions, with Moodle as the first one

Issue: [#33](https://github.com/falkenslab/miyagi/issues/33)

## Goal

Make extensions the dependencies of a workspace, move everything Moodle-specific into a built-in extension, add classrooms and groups, and let a teacher use content extensions (ADR-014, ADR-016, ADR-020).

## Context

- `pluginRoots()` returns only `plugin/` (`src/agent.ts`); `src/catalog.ts` hardcodes `plugin/` and the kit's knowledge plugin.
- Moodle is wired in `agent.ts` (Playwright, `browser_run_code_unsafe`, manual login, gates), `publishGate.ts` (patterns), `uploadGate.ts` and `validators/gift.ts`.
- `config.json` holds the classroom and its password, so it's in the workspace's `.gitignore`.
- agent-kit's `AgentSpec` has no hooks field (gates stay as post-build mutations).
- Follows `classroom-link`, which adds `type` to the classroom and `/moodle:link`.

## Changes

- **Workspace file.** `workspace.json` (shareable, out of `.gitignore`): `kind: "materia"`, `label`, `description`, `classrooms[]` (`id`, `type`, the platform's fields), `groups[]` (`id`, `classroom`, `platformGroup`), `extensions` (name → range, `"builtin"` for Moodle). Secrets in `.env` (one per classroom). Automatic migration from `config.json` (kept as `config.json.bak`); classroom knowledge pages move to `knowledge/classrooms/<id>/`.
- **Dependencies.** `extensions.lock` (repository, version, commit, SHA-256); store `~/.miyagi/extensions/<repo>/<name>/<version>/`, read-only, checked against the lock when installed and when loaded; a workspace's own extensions in its `extensions/`; missing dependencies reported at start and offered, never installed silently.
- **Manifest.** `extension.json` (JSON Schema with `miyagiApi: 1`): `name`, `version`, `kind` (domain, classroom, service, runtime), `provides` (capabilities), `requires` (software on the computer), `level`, and for a classroom extension its operations' support (`full`, `partial` with what's missing). An incompatible `miyagiApi` isn't loaded.
- **Capabilities.** The session's capabilities are what its enabled extensions provide; a skill with `requires:` in its frontmatter is offered only when one provides it (`practice-testing` needs `run-containers`, given by the built-in practice runner while `allowPracticeRunner` lasts). `/capabilities` in the chat lists them and what's missing.
- **Moodle built in.** `extensions/moodle/` (`.claude-plugin/plugin.json`, `extension.json`, `prompt.md`, `explore.md`, skills `moodle-navigation`, `course-orientation`, `activity-building`, `scorm-packaging`, command `/map`) and `src/extensions/moodle/` (connector, publishing actions, GIFT validator). The HTML validator stays in the core. The loader loads it by its manifest's entry, like an installed one; the core never imports its code.
- Generic publish gate fed by the active classroom extensions' predicates; upload gate as a registry by file extension.
- System prompt: core base without Moodle, one section per classroom from its extension, then content extensions, framed as never overriding core rules. `hasMoodle` goes; the standalone bases become the only base.
- `explore` runs the classroom extension's `explore.md`; without a classroom it stops with its message.
- Skills that run the course stay in the core, written against capabilities: `grading-rubric` (`submissions`), `forum` (`forum`), `progress-monitoring` (`progress`), `course-auditor` and `course-alignment` (`structure`); their Moodle steps go to the extension as `moodle:submissions`, `moodle:forum`, `moodle:progress`, `moodle:structure`.
- `teaching-methodologies`, `teaching-plan`, `rubric-design`, `course-design` and `/align` lose their Moodle lines; "how to build it in Moodle" per methodology goes to the extension as a reference of `moodle-navigation`.
- The building skills (`course-building`, `unit-building`, `assignment-building`, `quiz-building`, `resource-authoring`, `publish-check`) are split by `neutral-materials`; until then they're on an allowlist in `check-prompts.mjs` that shrinks with each step.
- `catalog.ts` and `sessionSkills()` walk `plugin/` and the enabled extensions; skills and extensions computed inside the session opener.
- Groups: `explore` proposes them, the teacher confirms, code writes them; used to filter grading, forum and progress.
- CLI at content level: `miyagi extension add|remove|install|update|outdated|list|prune|check|new|pack` (no MCP servers, hooks, settings or agents with tools beyond Read/Glob/Grep/WebSearch/WebFetch; personal-data warning). Repositories and code come with `extension-repositories`. Skill `extension-authoring` turns what a teacher explains into an extension in the workspace's `extensions/`.
- Docs: "Conectar tu aula", "Añadir una extensión", "Escribir una extensión"; `check-docs.mjs` for `extension` and the new keys.
- `.minispec/core/` and `CLAUDE.md`: principles in platform-neutral terms; glossary: workspace as a subject, classroom, group, extension, capability, connector.

## Acceptance

- `sandbox-e2e` and `simulate-course` give the same result before and after (report in `tests/`); `student-impact-review` confirms the same actions are gated.
- `check-prompts.mjs` renders no classroom, one Moodle and two Moodles with groups; outside its allowlist, no file in `plugin/` or `prompts/system/` names Moodle, and nothing outside `src/extensions/moodle/` imports it.
- `check-extensions.mjs`: toy extensions breaking each rule are refused; a valid content extension shows in skills and the prompt; one whose files changed after install doesn't load; a skill requiring a missing capability isn't offered.
- A workspace with `config.json` migrates to `workspace.json` plus `.env`, and its knowledge base links still resolve; a copy of the workspace on another computer gets the same extensions with `miyagi extension install`.
