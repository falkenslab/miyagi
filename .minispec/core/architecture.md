# Architecture

## Flow

```
cli.ts → workspace config → toSessionConfig() → AgentSpec (agent.ts) → agent-kit runQuery()/runChatInk()
                                                    ├─ system prompt (prompts/system/*.md)
                                                    ├─ plugin/ skills + commands, agent-kit knowledge plugin
                                                    ├─ Playwright MCP → Moodle
                                                    └─ subagents: researcher, pedagogy-reviewer, practice-runner (opt-in)
```

Session kinds: `run` (one-shot mission, or `--task`), `chat` (agent-kit's Ink chat, full screen by default; `--inline`, `--plain` for readline; starts guided, Shift+Tab switches to interactive), `ingest` (no browser, builds the knowledge base), `explore` (guided probe of the Moodle site, capped at 60 turns, no legacy migration).

## Key pieces

- `src/cli.ts` — `bin` entry and subcommand dispatch; bare `teacher-agent` asks run/chat; `run`/`chat` in a folder that isn't a workspace yet run the setup wizard, save and exit (the session starts from its own command, so the full-screen chat never follows the wizard's prompts); `init` offers `explore` afterwards (a failure only warns).
- `src/agent.ts` — `runSession()` and the `AgentSpec`: Playwright MCP, disallowed tools, approval and manual-login texts, `buildSubagents()`.
- `src/publishGate.ts` — the publish gate (ADR-008): in guided, a publishing browser action without a prior approval asks the teacher; `isPublishAction()` knows Moodle's publishing buttons.
- `src/menu.ts` — the `init` wizard (practice-runner opt-in saved as explicit true/false), `offerPracticeRunner()`, run-kind and mode prompts.
- `src/workspace.ts` — `config.json` schema (a moodle-agent teacher aula; `agent.role: "student"` rejected), paths, `toSessionConfig()`, legacy migration.
- `src/globalConfig.ts` — `~/.teacher-agent/config.json` (token, `defaultHeadless`, `defaultLanguage`, `autoCompactEnabled`) and the workspace `.env`.
- `src/catalog.ts` — skill and command listing for the `skills`/`commands` subcommands.
- `src/systemPrompt.ts` — assembles the prompt: teacher-run / teacher-chat / teacher-ingest / explore plus conditional sections.
- `src/playwrightConfig.ts` — the `@playwright/mcp` config; its `secrets` map keeps the Moodle password away from the model.
- `src/toolLabels.ts` — `browser_*` labels on top of agent-kit's `createFriendlyToolLabel()`.

## Subagents

- `researcher` — WebSearch/WebFetch/read (`prompts/system/researcher.md`).
- `pedagogy-reviewer` — read-only (`pedagogy-reviewer.md`).
- `practice-runner` — opt-in (`agent.allowPracticeRunner`), `run`/`chat` only, Bash for Docker inside `practice/` (see ADR-003).

`subagents.md` and `practice-access.md` tell the main agent they exist. Registering any subagent adds `Agent`/`Bash` to the session's tools; agent-kit's gates keep Bash only for subagents that list it.

## Plugin (`plugin/`, name `teacher-agent`)

One home per concern:

- Building — `course-building` → `unit-building` → `resource-authoring`, `assignment-building`, `activity-building`, `quiz-design` + `quiz-building`, `rubric-design`, `practice-testing`.
- Pedagogy — `course-design`, `teaching-methodologies`, `teaching-plan`, `course-alignment`.
- Running the course — `grading-rubric`, `forum`, `progress-monitoring`, `course-auditor`, `course-orientation`, `moodle-navigation`.
- `topic-research`, and `publish-check`: the one pre-publication check and the approval rules the other skills point to.

agent-kit's `knowledge` plugin adds 4 skills and 3 commands.

## Knowledge base

agent-kit's generic knowledge base plus the course layer in `prompts/system/course-knowledge.md`:

- Root pages: `orientation.md`, `course-map.md`, `moodle-capabilities.md`, `progress.md` and `course-audit.md` (dated entries), `teaching-plan.md` (the course's only plan: objectives `O…`, criteria `CE…`, units, grading).
- `syntheses/course-alignment.md` — dated comparisons of the course with the plan.
- `topics/<slug>.md`, `activities/<slug>.md` — criteria, rubric, questions; a quiz's GIFT file sits next to it as `activities/<slug>.gift`.

File scope (agent-kit's hook, set in `toSessionConfig()`): writes only in `knowledge/` (and `practice/` with the practice-runner), `sources/` read-only, `config.json` and `.env` denied.

## Legacy migration

A moodle-agent teacher aula opens as-is: `moveLegacyContext()` moves `context/` into `sources/`; `moveLegacyKnowledge()` moves an old `knowledge/` (with `README.md`, no `index.md`) to `knowledge-legacy/`; `migrationPending` adds `knowledge-migration.md` so the agent rebuilds the knowledge base.

## Folder map

- `src/` — CLI and session wiring.
- `plugin/` — runtime skills and slash commands.
- `prompts/` — system prompt sections and messages.
- `docs/` — user documentation beyond the README: the skills guide (`skills.md`) and `CHEATSHEET.md`.
- `tests/` — end-to-end test reports (see `tests/CLAUDE.md`).
- `.claude/skills/` — skills for developing this repo.
- `.minispec/` — this specification.
