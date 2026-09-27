# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`teacher-agent` is an agent that manages a Moodle course as a teacher (grading, forum, content, class progress, audits), driving a real browser through Playwright MCP. It is built on top of `@falkenslab/agent-kit` (github.com/falkenslab/agent-kit), with the same structure as its sibling `student-agent`.

Its whole domain layer (skills, slash commands, prompts) comes from the teacher role of `moodle-agent`, where student and teacher used to live in one agent: the `shared` and `teacher` plugins, `teacher-run`/`teacher-chat`, the `explore` probe and the teacher's human-approval wording. The only changes to that content adapt it to agent-kit's knowledge base (`context/` → `sources/`, `knowledge/README.md` → `index.md`/`log.md`, `knowledge/<topic>/` → `topics/`/`activities/` pages, `save_to_knowledge` → agent-kit's `save_to_sources`). Nothing here is domain-agnostic scaffolding: session/options wiring, hooks, human-in-the-loop tools, the chat TUI and Claude auth all come from agent-kit.

## Commands

```
npm start -- [init|run|chat|explore|ingest|skills|commands] --dir <workspace> [...]   # tsx src/cli.ts
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run build       # tsc -> dist/ (also run by "prepack" before npm pack)
npm link            # global "teacher-agent" command -> dist/cli.js (build first)
```

There are no tests yet. Always pass `--dir` pointing at a workspace outside this repo (the default is cwd, which would create `config.json`/`sessions/` here).

## Depending on agent-kit

agent-kit is not on npm yet, and a git dependency doesn't work for end users (`npm install -g` of a package with git dependencies fails: npm can't find `tsc` while preparing them; bundling agent-kit instead drags in the Claude SDK's platform-specific binary, 245 MB of Windows-only `claude.exe`). So `package.json` points at a **built agent-kit tarball attached to a teacher-agent release** (`.../releases/download/v0.1.0/falkenslab-agent-kit-0.6.0.tgz`, made with `npm pack` of agent-kit at its tag). Its `prepare` is denied in `allowScripts` (the tarball already has `dist/`). To bump agent-kit: `npm pack` it at the new tag, attach the tarball to the next teacher-agent release, point the dependency at that URL and `npm install`.

## Releasing

Users install with `npm install -g https://github.com/falkenslab/teacher-agent/releases/latest/download/teacher-agent.tgz`, so every release must carry the `npm pack` output (built by `prepack`, ~50 kB, no `node_modules`) renamed to exactly `teacher-agent.tgz`. Bump `version`, commit, tag `vX.Y.Z`, `npm pack`, and `gh release create vX.Y.Z teacher-agent.tgz`.

To try unreleased agent-kit changes locally, `npm link ../agent-kit` (after `npm run build` there) and undo it with `npm install` before committing. Only import from the package root (`@falkenslab/agent-kit`), never deep paths. agent-kit's own `CLAUDE.md` documents its architecture — read it before changing how this agent wires into it.

## Layout

- `src/cli.ts` — the `bin` entry: subcommand dispatch (`init`, `run`, `chat`, `explore`, `ingest`, `skills`, `commands`, `--help`, `--version`; bare `teacher-agent` asks run/chat). `init` offers to run `explore` right after creating the workspace; a failure there only warns.
- `src/agent.ts` — `runSession()` (`run`/`ingest`/`explore` one-shot via `runQuery()`, `chat` via `runChatTui()`) and the `AgentSpec` (Playwright MCP, disallowed tools, approval/manual-login texts). Subagents (run/chat only, see `buildSubagents()`): `researcher` (WebSearch/WebFetch/read, `prompts/system/researcher.md`) and `pedagogy-reviewer` (read-only, `pedagogy-reviewer.md`) are always registered and have no shell; `subagents.md` tells the main agent about them. The only one with a shell is the opt-in `practice-runner` (`agent.allowPracticeRunner`, off by default, `run`/`chat` only): Bash for Docker inside `practice/`, with agent-kit's three subagent gates keeping Bash away from the main agent; its prompt is `prompts/system/practice-runner.md`, and `practice-access.md` tells the main agent it exists. Registering any subagent puts `Agent`/`Bash` in the session's tools; agent-kit's gates keep Bash for subagents that list it. `run --task "<text>"` replaces the default mission with one concrete job (`prompts/messages/run-mission-task.md`). An `ingest` session has no browser; `explore` is `guided` (manual login possible), capped at 60 turns and skips the legacy migration.
- `src/menu.ts` — the `init` wizard (including the practice-runner opt-in, always saved as explicit true/false), `offerPracticeRunner()` for workspaces that never answered, the explore offer, and the run-kind/mode prompts.
- `src/workspace.ts` — `<workspace>/config.json` schema (same shape as a moodle-agent teacher aula; `agent.role: "student"` is rejected, a missing role is written as `"teacher"`), workspace paths, `toSessionConfig()`, and the moodle-agent aula migration (`moveLegacyContext()`, `moveLegacyKnowledge()`, see below).
- `src/globalConfig.ts` — `~/.teacher-agent/config.json` (Claude token, `defaultHeadless`, `defaultLanguage`, `autoCompactEnabled`) and the workspace `.env` loading.
- `src/catalog.ts` — built-in (`plugin/` + agent-kit's knowledge plugin) and workspace skills/commands for the `skills`/`commands` subcommands.
- `src/systemPrompt.ts` — assembles the system prompt from `prompts/system/*.md` (teacher-run / teacher-chat / teacher-ingest / explore plus conditional sections).
- `src/playwrightConfig.ts` — the `@playwright/mcp` `--config` file; its `secrets` map is why the real Moodle password never reaches the model.
- `src/toolLabels.ts` — `browser_*` labels layered on agent-kit's `createFriendlyToolLabel()`.
- `plugin/` — the SDK local plugin (`name: "teacher-agent"`): 21 skills + 12 slash commands, grown from moodle-agent's `shared` and `teacher` plugins. Each concern has one home: building (`course-building` → `unit-building` → `resource-authoring`, `assignment-building`, `activity-building`, `quiz-design` + `quiz-building`, `rubric-design`, `practice-testing`), pedagogy (`course-design`, `teaching-methodologies`, `teaching-plan`, `course-alignment`), running the course (`grading-rubric`, `forum`, `progress-monitoring`, `course-auditor`, `course-orientation`, `moodle-navigation`), `topic-research`, and `publish-check` — the one pre-publication check (writing, accessibility, as a student) and the approval rules every other skill points to instead of restating them; agent-kit's `knowledge` plugin adds 4 skills and 3 commands on its own.

Code resolves `plugin/` and `prompts/` relative to `src/` (`path.join(__dirname, "..", ...)`), which also holds for the compiled `dist/`.

## The knowledge base

Built on agent-kit's built-in knowledge base (generic rules appended to the prompt, `knowledge-*` skills); this repo adds the course layer in `prompts/system/course-knowledge.md` (always in the prompt): `orientation.md`, `course-map.md`, `moodle-capabilities.md`, `progress.md` and `course-audit.md` (histories, dated entries), `teaching-plan.md` (the course's only plan — the teacher's programación, or the agent's draft of it with proposals marked: objectives `O…`, criteria `CE…`, units, grading) at the root, `syntheses/course-alignment.md` (dated comparisons of the course with the plan), `topics/<slug>.md` and `activities/<slug>.md` (grading criteria, rubric, imported questions; a quiz's GIFT file sits next to it as `activities/<slug>.gift`, since `knowledge/` is the only writable folder). The skills that write there (`grading-rubric`, `rubric-design`, `quiz-building`, `resource-authoring`, `assignment-building`, `activity-building`, `forum`, `progress-monitoring`, `course-auditor`, `course-orientation`, `course-building`, `unit-building`, `teaching-plan`, `course-alignment`) and `explore.md` name those paths: change the layout in all of them at once.

File access is enforced by agent-kit's file-scope hook, configured in `toSessionConfig()`: writes only in `knowledge/`, `sources/` read-only, `config.json` and `.env` in `deniedPaths`.

A moodle-agent teacher aula opens as-is: `moveLegacyContext()` moves `context/` into `sources/`, `moveLegacyKnowledge()` moves an old `knowledge/` (with `README.md`, no `index.md`) to `knowledge-legacy/` (non-markdown, non-GIFT files to `sources/`), and `migrationPending` adds `prompts/system/knowledge-migration.md` so the agent rebuilds the knowledge base from it.

## Project skills (`.claude/skills/`)

For whoever develops this repo (not the runtime agent's skills, which are in `plugin/`):

- `verify` — quality gate: typecheck, lint, build and `check-prompts.mjs`, which renders the system prompt for every session kind and mode and asserts which sections are in it (and that no student-agent/moodle-agent leftover is). There are no unit tests, so this is the gate.
- `commit` / `release` — commit conventions (Spanish, one logical change each; the repo is public) and cutting a version, including building and testing the `teacher-agent.tgz` users install from.
- `upgrade-agent-kit` — moving the kit to a new release: pack it at its tag, attach the tarball to a teacher-agent release, point the dependency at it.
- `try-agent-kit-local` — testing unreleased kit changes without the global npm (ask before touching `../agent-kit`).
- `smoke-ingest` — a real `ingest` on a fixed fixture (syllabus + rubric) plus `check-knowledge.mjs` (which also fails on a student's name in any page with `--names`): the proof that prompt changes to the knowledge base still work.
- `student-impact-review` — checking changes that publish to Moodle (grades, feedback, forum, content) against what students see: the per-action approval, fair and consistent grading, staying inside the course, no student data in the knowledge base.
- `simulate-course <description>` — creates an empty course in the sandbox (`npm run course`), has teacher-agent build it with `course-building` while `auto-approve.mjs` answers and logs every approval (sandbox only), captures the whole course (`capture-course.mjs`) and writes the report.
- `test-report` — writes a test's report into `tests/<YYYY-MM-DDTHH-MM>-<slug>/` (README.md + `assets/`), indexes it in `tests/README.md` and turns its findings into changes; see `tests/CLAUDE.md`.
- `sandbox-e2e` — end-to-end runs against the moodle-sandbox repo (`$MOODLE_SANDBOX_DIR`, default `../moodle-sandbox`; a separate repo on purpose, not a submodule), using its `info` contract and its `activity` seed (students, submissions of known quality, forum doubts) so every grade and reply has a right answer.

## Things not to undo

- `browser_run_code_unsafe` is in `disallowedTools` (RCE-equivalent, per Playwright's own description).
- There is no student role on purpose: this agent only ever acts as a teacher (`student-agent` is the student).
- No pages about individual students in the knowledge base: progress and forum notes are class-level patterns.
- `config.json` (plaintext password) and `.env` (token) stay in `deniedPaths`.
- The practice runner stays opt-in and Docker-only: its prompt forbids installing anything, sudo, mounting beyond the practice folder or the Docker socket, and touching containers it didn't create. Don't give the main agent Bash to "simplify" it.
- Every end-to-end test leaves its report in `tests/`, and its lessons in `plugin/skills/` or `prompts/`.
