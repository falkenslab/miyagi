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
- `src/agent.ts` — `runSession()` (`run`/`ingest`/`explore` one-shot via `runQuery()`, `chat` via `runChatTui()`) and the `AgentSpec` (Playwright MCP, disallowed tools, approval/manual-login texts). No subagents: the teacher role never had any, so the session has no `Agent`/`Bash`. An `ingest` session has no browser; `explore` is `guided` (manual login possible), capped at 40 turns and skips the legacy migration.
- `src/menu.ts` — the `init` wizard, the explore offer, and the run-kind/mode prompts.
- `src/workspace.ts` — `<workspace>/config.json` schema (same shape as a moodle-agent teacher aula; `agent.role: "student"` is rejected, a missing role is written as `"teacher"`), workspace paths, `toSessionConfig()`, and the moodle-agent aula migration (`moveLegacyContext()`, `moveLegacyKnowledge()`, see below).
- `src/globalConfig.ts` — `~/.teacher-agent/config.json` (Claude token, `defaultHeadless`, `defaultLanguage`, `autoCompactEnabled`) and the workspace `.env` loading.
- `src/catalog.ts` — built-in (`plugin/` + agent-kit's knowledge plugin) and workspace skills/commands for the `skills`/`commands` subcommands.
- `src/systemPrompt.ts` — assembles the system prompt from `prompts/system/*.md` (teacher-run / teacher-chat / teacher-ingest / explore plus conditional sections).
- `src/playwrightConfig.ts` — the `@playwright/mcp` `--config` file; its `secrets` map is why the real Moodle password never reaches the model.
- `src/toolLabels.ts` — `browser_*` labels layered on agent-kit's `createFriendlyToolLabel()`.
- `plugin/` — the SDK local plugin (`name: "teacher-agent"`): 15 skills + 7 slash commands (`/teacher-agent:grade`...), moodle-agent's `shared` and `teacher` plugins merged; agent-kit's `knowledge` plugin adds 4 skills and 3 commands on its own.

Code resolves `plugin/` and `prompts/` relative to `src/` (`path.join(__dirname, "..", ...)`), which also holds for the compiled `dist/`.

## The knowledge base

Built on agent-kit's built-in knowledge base (generic rules appended to the prompt, `knowledge-*` skills); this repo adds the course layer in `prompts/system/course-knowledge.md` (always in the prompt): `orientation.md`, `course-map.md`, `moodle-capabilities.md`, `progress.md` and `course-audit.md` (histories, dated entries) at the root, `topics/<slug>.md` and `activities/<slug>.md` (grading criteria, rubric, imported questions; a quiz's GIFT file sits next to it as `activities/<slug>.gift`, since `knowledge/` is the only writable folder). The skills that write there (`grading-rubric`, `rubric-design`, `quiz-bulk-import`, `content-authoring`, `forum-facilitation`, `progress-monitoring`, `course-auditor`, `course-orientation`) and `explore.md` name those paths: change the layout in all of them at once.

File access is enforced by agent-kit's file-scope hook, configured in `toSessionConfig()`: writes only in `knowledge/`, `sources/` read-only, `config.json` and `.env` in `deniedPaths`.

A moodle-agent teacher aula opens as-is: `moveLegacyContext()` moves `context/` into `sources/`, `moveLegacyKnowledge()` moves an old `knowledge/` (with `README.md`, no `index.md`) to `knowledge-legacy/` (non-markdown, non-GIFT files to `sources/`), and `migrationPending` adds `prompts/system/knowledge-migration.md` so the agent rebuilds the knowledge base from it.

## Things not to undo

- `browser_run_code_unsafe` is in `disallowedTools` (RCE-equivalent, per Playwright's own description).
- There is no student role on purpose: this agent only ever acts as a teacher (`student-agent` is the student).
- No pages about individual students in the knowledge base: progress and forum notes are class-level patterns.
- `config.json` (plaintext password) and `.env` (token) stay in `deniedPaths`.
