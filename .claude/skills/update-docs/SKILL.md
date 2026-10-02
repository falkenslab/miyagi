---
name: update-docs
description: Bring miyagi's documentation site (docs/, Docusaurus) up to date with a change to the project before it is committed or released - find which pages describe what changed (skills, commands, CLI options, config keys, guardrails, the knowledge base, install), update them, flag screenshots that no longer match, run check-docs.mjs and build the site. Use before every commit that changes src/, plugin/, prompts/, package.json or README.md, before every release, and whenever the user asks to update the docs.
---

# Keep the docs site in step with the project

The site in `docs/` (https://falkenslab.github.io/miyagi/) is what teachers read before they
install, and what advanced users read to customise miyagi. A change that the code makes and
the site doesn't mention is a broken promise; a page that describes something the code no
longer does is worse. This skill runs **before** the commit or the release, not after.

## 1. What changed

- Before a commit: `git diff --stat` and `git diff` of what is about to be committed.
- Before a release: `git log <last tag>..HEAD --stat` (`git describe --tags --abbrev=0`).

Ignore changes that no reader can see: refactors with the same behaviour, `tests/`,
`.minispec/`, `.claude/skills/` (except this one), lint or build config.

## 2. Where each change is documented

| What changed | Pages to check in `docs/content/` |
| --- | --- |
| A skill in `plugin/skills/` added, renamed, merged or its purpose changed | `guia/habilidades.md`, `guia/referencia.md`, the landing's capability tabs (`docs/src/pages/index.js`) if a capability appears or disappears |
| A command in `plugin/commands/` | `guia/chat.md` (shortcuts), `guia/referencia.md` |
| A CLI subcommand or option (`src/cli.ts`, `src/agent.ts`, `src/menu.ts`) | `guia/referencia.md`, `guia/primeros-pasos.md` (the `init` questions), `avanzado/sesiones-y-modos.md` |
| A `config.json` key (`src/workspace.ts`) or the global config (`src/globalConfig.ts`) | `avanzado/configuracion.md` |
| Approvals, the publish gate, drafts, the upload gate, the drafts toolbox | `avanzado/aprobaciones-y-borradores.md`, the landing's control section |
| The knowledge base layout or `ingest` (`prompts/system/course-knowledge.md`, `teacher-ingest.md`, agent-kit's knowledge plugin) | `avanzado/base-de-conocimiento.md`, `guia/memoria.md` |
| The practice-runner (`prompts/system/practice-runner.md`, `agent.allowPracticeRunner`) | `avanzado/practicas-docker.md`, `casos-de-uso/` (unit 1 and the practice check) |
| Own skills, commands, `instructions.md` (`src/catalog.ts`, `prompts/system/custom-instructions.md`) | `avanzado/habilidades-propias.md`, `avanzado/atajos-e-instrucciones.md` |
| Secrets, file scope, tools the agent may use (`src/playwrightConfig.ts`, `toSessionConfig()`) | `avanzado/seguridad-y-privacidad.md`, the landing's "never does" list |
| Install, requirements, Node version, the install URL | `guia/instalar.md`, the landing's install section, `README.md` |
| Messages and prompts the teacher sees in the chat (`src/messages/`, `prompts/messages/`) | screenshots in `casos-de-uso/` (see step 4) |
| A new agent-kit release with visible changes (chat keys, panels, `/resume`) | `guia/chat.md`, `avanzado/sesiones-y-modos.md` |

When in doubt, `grep -rn "<name of the thing>" docs/content docs/src` finds every mention.

## 3. Update the pages

- Same rules as the rest of the site: Spanish for teachers, plain words in Guía and Casos de
  uso, precise (paths, keys, defaults) in Avanzado. Say nothing the product doesn't back:
  every claim must trace to code, a prompt, a skill, a command or a report in `tests/`.
- The `markdown-writing` rules: one line per paragraph and list item, no `---` between
  sections, no tables with an empty header row.
- Remove what is no longer true rather than adding a caveat next to it.
- A renamed page or anchor breaks links: the build fails on broken links, keep it that way.

## 4. Screenshots

The use-case tutorial (`docs/content/casos-de-uso/`) shows real screenshots of the chat and
of Moodle (`docs/static/img/casos/`). If the change alters what one of them shows (a
message, a panel, a step the agent takes, a page it builds), list the affected images and
say so: either retake them (the test report that built the tutorial, in `tests/`, explains how
they were made against moodle-sandbox and keeps its scripts: the pseudo-terminal driver for
the chat and the Moodle capture script; convert new ones with `shot-to-webp.mjs`) or, if
retaking isn't possible now, add
the screenshots to the commit message as pending and tell the user. Never edit a screenshot
by hand to make it match.

## 5. Check

```
node .claude/skills/update-docs/check-docs.mjs     # every skill, command, CLI subcommand and config key is documented
(cd docs && npm ci && npm run build)               # no broken links or anchors
```

`check-docs.mjs` fails with the list of what is missing and where it should be. The build
must pass; look at changed pages with `npm run serve` in `docs/` when the change is visual.

## 6. Report

List the pages changed and why, the screenshots that need retaking (if any), and the result
of both checks. The docs changes go in the same commit as the change they describe when they
belong to it (`feat` with its docs), or in their own `docs(site)` commit when they catch up
with earlier work.
