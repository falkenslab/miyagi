# Architecture

## Flow

```
cli.ts → workspace config → toSessionConfig() → AgentSpec (agent.ts) → agent-kit runQuery() + createProgressView() / runChatInk()
                                                    ├─ system prompt (prompts/system/*.md)
                                                    ├─ plugin/ skills + commands, agent-kit knowledge plugin
                                                    ├─ Playwright MCP → Moodle
                                                    └─ subagents: researcher, pedagogy-reviewer, practice-runner (opt-in)
```

Session kinds: `run` (one-shot mission, or `--task`), `chat` (agent-kit's Ink chat, full screen by default; `--inline`, `--plain` for readline; starts guided, Shift+Tab switches to interactive; each chat is an agent-kit run folder `sessions/<timestamp>/` keeping its conversation, resumed with `--continue` or `/resume`, ADR-011), `ingest` (no browser, builds the knowledge base), `explore` (guided probe of the Moodle site, capped at 80 turns, no legacy migration). A workspace without a classroom (`config.json` with no `classroom`, ADR-013) has no browser in any kind: no Playwright, no publish or upload gate, no manual login, standalone base prompts (`teacher-*-standalone.md`) and no classroom pages in the knowledge layer (`classroom-knowledge.md`); `explore` stops with a message. `hasMoodle` and the standalone bases are transitional: the `extensions` feature replaces them.

## Key pieces

- `src/cli.ts` — `bin` entry and subcommand dispatch; bare `miyagi` asks run/chat; `run`/`chat` in a folder that isn't a workspace yet run the setup wizard, save and exit (the session starts from its own command, so the full-screen chat never follows the wizard's prompts); `init` offers `explore` afterwards (a failure only warns).
- `src/agent.ts` — `runSession()` and the `AgentSpec`: Playwright MCP, disallowed tools, approval and manual-login texts, `buildSubagents()`. A chat's session is opened per run folder.
- `src/drafts/` — the drafts toolbox, in-process MCP server `drafts` in run/chat: list, mkdir, copy, move, delete, download, fetch_site, unzip, zip, pdf, info. Every path resolved inside drafts/ (`paths.ts`: no "..", absolute paths or links out), http(s) URLs only, size limits from `agent.draftsLimits`, zip-slip and zip-bomb checks, nothing executed; the site fetch and the PDF use @playwright/mcp's playwright-core with the system Chrome, headless.
- `src/uploadGate.ts` + `src/validators/` — the upload gate: before `browser_file_upload`/`browser_drop`, a `.gift` or `.html` file is checked with code (GIFT syntax, answers, numbers, names, lost indentation; HTML viewport, lang, missing local files); errors deny the upload with the lines, warnings reach the model. Every mode.
- `src/publishGate.ts` — the publish gate (ADR-008): in guided, a publishing browser action without a prior approval asks the teacher; `isPublishAction()` knows Moodle's publishing buttons.
- `src/menu.ts` — the `init` wizard (practice-runner opt-in saved as explicit true/false), `offerPracticeRunner()`, run-kind and mode prompts.
- `src/workspace.ts` — `config.json` schema (a moodle-agent teacher aula; `agent.role: "student"` rejected), paths, `toSessionConfig()`, legacy migration, `interfaceLanguage()` (agent-kit's interface language from `agent.language`; unknown → the system's).
- `src/globalConfig.ts` — `~/.miyagi/config.json` (token, `defaultHeadless`, `defaultLanguage`, `autoCompactEnabled`) and the workspace `.env`.
- `src/catalog.ts` — skill and command listing for the `skills`/`commands` subcommands, and the session's `AgentSpec.skills` (this plugin's and the workspace's; the SDK's own left out).
- `src/systemPrompt.ts` — assembles the prompt: teacher-run / teacher-chat / teacher-ingest / explore plus conditional sections.
- `src/playwrightConfig.ts` — the `@playwright/mcp` config; its `secrets` map keeps the Moodle password away from the model.
- `src/toolLabels.ts` — `browser_*` labels on top of agent-kit's `createFriendlyToolLabel()` (a `browser_evaluate` call by what its code does, `classifyEvaluate()`), and `toolPhrase()` for folded tool groups.
- `src/messages/` — person-facing texts in en/es/fr/de, typed as `Messages` (en is the reference); `t()` follows agent-kit's `getLanguage()`, chosen once at the CLI's start (`--language`, `agent.language`, `defaultLanguage`, system). Model-facing text stays in English.

## Subagents

- `researcher` — WebSearch/WebFetch/read (`prompts/system/researcher.md`).
- `pedagogy-reviewer` — read-only (`pedagogy-reviewer.md`).
- `practice-runner` — opt-in (`agent.allowPracticeRunner`), `run`/`chat` only, Bash for Docker inside `practice/` (see ADR-003).

`subagents.md` and `practice-access.md` tell the main agent they exist. Registering any subagent adds `Agent`/`Bash` to the session's tools; agent-kit's gates keep Bash only for subagents that list it.

## Plugin (`plugin/`, name `miyagi`)

One home per concern:

- Building — `course-building` → `unit-building` → `resource-authoring`, `assignment-building`, `activity-building`, `quiz-design` + `quiz-building`, `rubric-design`, `scorm-packaging`, `practice-testing`.
- Pedagogy — `course-design`, `teaching-methodologies`, `teaching-plan`, `course-alignment`.
- Running the course — `grading-rubric`, `forum`, `progress-monitoring`, `course-auditor`, `course-orientation`, `moodle-navigation`.
- `topic-research`, and `publish-check`: the one pre-publication check and the approval rules the other skills point to.

agent-kit's `knowledge` plugin adds 4 skills and 3 commands.

## Knowledge base

agent-kit's knowledge base, reached only through its `knowledge_*` tools over its file store (agent-kit ADR-024), plus the course layer: the page types in `src/knowledgeTypes.ts` and the rules in `prompts/system/course-knowledge.md`. Pages are `type/slug` ids; the index and backlinks are kept by the kit.

- `course/<slug>` (root files with `type: course`): `orientation`, `course-map`, `moodle-capabilities`, `teaching-plan` (the course's only plan: objectives `O…`, criteria `CE…`, units, grading), `progress` and `course-audit` (dated entries), `drafts` (resources still hidden). `tagCoursePages()` gives older root pages that type at the start of every session.
- `synthesis/course-alignment` — dated comparisons of the course with the plan.
- `topic/<slug>`, `activity/<slug>` — criteria, rubric, questions; a quiz's GIFT file is in `drafts/<slug>/`.
- The `researcher` and `pedagogy-reviewer` subagents read pages with `knowledge_index`, `knowledge_search` and `knowledge_read`.

File scope (agent-kit's hook, set in `toSessionConfig()`): no file tool reaches `knowledge/`; `Read`/`Glob`/`Grep` read `sources/` (plus `extract_text` for DOCX, PPTX and XLSX), `Write`/`Edit` only `drafts/` (and `practice/` with the practice-runner); `config.json` and `.env` denied.

## Legacy migration

A moodle-agent teacher aula opens as-is: `moveLegacyContext()` moves `context/` into `sources/`; `moveLegacyKnowledge()` moves an old `knowledge/` (with `README.md`, no `index.md`) to `knowledge-legacy/`; `migrationPending` adds `knowledge-migration.md` so the agent rebuilds the knowledge base.

## Folder map

- `src/` — CLI and session wiring.
- `plugin/` — runtime skills and slash commands.
- `prompts/` — system prompt sections and messages.
- `docs/` — the documentation site (Docusaurus, Spanish): the landing page in `src/pages/`, pages in `content/` (`guia/` for teachers, `casos-de-uso/` the SQL course tutorial with real screenshots in `static/img/casos/`, `avanzado/`), deployed to GitHub Pages by `.github/workflows/pages.yml`; kept in step with the code by the `update-docs` skill.
- `tests/` — end-to-end test reports (see `tests/CLAUDE.md`).
- `.claude/skills/` — skills for developing this repo.
- `.minispec/` — this specification.
