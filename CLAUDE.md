# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`miyagi` manages a Moodle course as a teacher, driving a real browser through Playwright MCP, on top of `@falkenslab/agent-kit`. What it is, its architecture, stack, conventions and decisions live in `.minispec/` (see below); this file keeps only how to work on it.

## Commands

```
npm start -- [init|run|chat|explore|ingest|skills|commands] --dir <workspace> [...]   # tsx src/cli.ts
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run build       # tsc -> dist/ (also run by "prepack" before npm pack)
npm link            # global "miyagi" command -> dist/cli.js (build first)
```

There are no tests yet. Always pass `--dir` pointing at a workspace outside this repo (the default is cwd, which would create `config.json`/`sessions/` here).

## Releasing

Users install with `npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`, so every release must carry the `npm pack` output (built by `prepack`, ~50 kB, no `node_modules`) renamed to exactly `miyagi.tgz`. Bump `version`, commit, tag `vX.Y.Z`, `npm pack`, and `gh release create vX.Y.Z miyagi.tgz`.

To try unreleased agent-kit changes locally, `npm link ../agent-kit` (after `npm run build` there) and undo it with `npm install` before committing. Only import from the package root (`@falkenslab/agent-kit`), never deep paths. agent-kit's own `CLAUDE.md` documents its architecture — read it before changing how this agent wires into it.

## Project skills (`.claude/skills/`)

For whoever develops this repo (not the runtime agent's skills, which are in `plugin/`):

- `verify` — quality gate: typecheck, lint, build and `check-prompts.mjs`, which renders the system prompt for every session kind and mode and asserts which sections are in it (and that no student-agent/moodle-agent leftover is). There are no unit tests, so this is the gate.
- `update-docs` — before a commit or a release, brings the docs site (`docs/`) in step with what changed, flags screenshots to retake, and checks it with `check-docs.mjs` and the site's build.
- `commit` / `release` — commit conventions (Spanish, one logical change each; the repo is public) and cutting a version, including building and testing the `miyagi.tgz` users install from.
- `upgrade-agent-kit` — moving the kit to a new release from npm, at an exact version, and checking it with `verify`.
- `try-agent-kit-local` — testing unreleased kit changes without the global npm (ask before touching `../agent-kit`).
- `smoke-ingest` — a real `ingest` on a fixed fixture (syllabus + rubric) plus `check-knowledge.mjs` (which also fails on a student's name in any page with `--names`): the proof that prompt changes to the knowledge base still work.
- `student-impact-review` — checking changes that publish to Moodle (grades, feedback, forum, content) against what students see: the per-action approval, fair and consistent grading, staying inside the course, no student data in the knowledge base.
- `simulate-course <description>` — creates an empty course in the sandbox (`npm run course`), has miyagi build it with `course-building` while `auto-approve.mjs` answers and logs every approval (sandbox only), captures the whole course (`capture-course.mjs`) and writes the report.
- `test-report` — writes a test's report into `tests/<YYYY-MM-DDTHH-MM>-<slug>/` (README.md + `assets/`), indexes it in `tests/README.md` and turns its findings into changes; see `tests/CLAUDE.md`.
- `sandbox-e2e` — end-to-end runs against the moodle-sandbox repo (`$MOODLE_SANDBOX_DIR`, default `../moodle-sandbox`; a separate repo on purpose, not a submodule), using its `info` contract and its `activity` seed (students, submissions of known quality, forum doubts) so every grade and reply has a right answer.
- `minispec-feature` / `minispec-adr` / `minispec-bugfix` / `minispec-implement` — write a feature, an ADR or a bugfix note in `.minispec/`, and implement a pending feature. Every feature and fix note has a GitHub issue in Spanish (label `feature` or `fix`), linked from an `Issue:` line under its title, and closed with a summary of the solution when the note is done.
- `sync-issues` — repairs whatever drifted between the notes and the issues: opens and links a missing issue, closes the one whose note is done.

## Documentation site (`docs/`)

A Docusaurus site in Spanish, published to https://falkenslab.github.io/miyagi/ by `.github/workflows/pages.yml` on every push to `main` that touches `docs/` (pull requests only build it). It has its own `package.json` (`cd docs && npm ci && npm run build`, `npm start` to preview) and isn't in the npm package. Three parts: the landing page (`src/pages/index.js`) and `content/guia/` for teachers with no technical background, `content/casos-de-uso/` (an Introducción a SQL course built step by step against moodle-sandbox, with real screenshots of the chat and of Moodle), and `content/avanzado/` for advanced users. Say nothing the product doesn't back; broken links and anchors fail the build.

Every change to the project updates the docs before it's committed or released: the `update-docs` skill maps what changed to the pages that describe it, flags screenshots to retake, and runs `check-docs.mjs` (every skill, command, subcommand and config key documented) and the build. `commit` and `release` call it.

`.claude/settings.json` enables Anthropic's `example-skills` plugin (`anthropics/skills`): `frontend-design` for design changes, `canvas-design` for the social preview image (`docs/static/img/og-es.png`) and `webapp-testing` to check it. Every visual change is checked at 360, 390, 768, 1024, 1440 and 1920 px (no horizontal scroll, 44 px touch targets, the menu working) and with Lighthouse's mobile and desktop runs, all four scores at 90 or more.

## MiniSpec (read first)

Before writing any code, read `.minispec/README.md` and follow its reading contract. As a minimum, always read `.minispec/core/project.md`, `.minispec/core/conventions.md` and `.minispec/core/principles.md`; read the rest of `.minispec/` only on demand (architecture, stack, glossary, the relevant feature or ADR). Keep features small and don't write redundant documentation. The rules that must not be undone are in `.minispec/core/principles.md`, each backed by an ADR in `.minispec/decisions/`.
