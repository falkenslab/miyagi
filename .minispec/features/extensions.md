# Adopt agent-kit's extensions

Issue: [#33](https://github.com/falkenslab/miyagi/issues/33)

## Goal

Use agent-kit's extensions (ADR-021): a teacher installs, updates and turns off extensions from the official repository, `falkenslab/agent-extensions`, per computer or per workspace.

## Context

- miyagi is on agent-kit 0.25.0 (knowledge and sources already as its internal extensions, `Read`/`Glob` allow-listed); what it doesn't use yet (kit ADR-025): `AgentSpec.extensionDirs`, `officialMarketplace`, `catalogTopics`, `runExtensionCommand()`, `/extensions` in the chats, `requires:` in skills.
- `pluginRoots()` returns only `plugin/` (`src/agent.ts`); `src/catalog.ts` hardcodes `plugin/` and the kit's knowledge plugin.
- `practice-testing` needs a shell today (`practice-runner`, ADR-003); `docker-lab-practices` moves it to an extension.

## Changes

- `extensionDirs`: agent scope `~/.miyagi/extensions/`, project scope `<workspace>/extensions/` (their folders readable to the agent); `officialMarketplace` = agent-extensions; `catalogTopics: ["miyagi"]`.
- `miyagi extension …` subcommand through `runExtensionCommand()`; `/extensions` in both chats.
- `catalog.ts` and `sessionSkills()` read the enabled extensions too.
- `init` ends asking whether to connect a classroom (default no) and, if yes, installs `moodle-teacher` and asks its options (sites); the chat's opening without a classroom says how.
- `config.json`'s `classroom` migrated: its URL becomes moodle-teacher's `sites`, its password dropped (moodle-teacher signs in through a window).
- Docs: "Conectar tu aula" (installing moodle-teacher), "Añadir una extensión", the command in the reference; `check-docs.mjs` for `extension`.
- `.minispec/core/`: architecture, stack and glossary say extensions are the kit's.

- - -

## Acceptance

- `miyagi extension add moodle-teacher` in a sandbox workspace installs it without a question; one from another marketplace asks as the kit says.
- A chat lists the extension in `/extensions`, its skills are offered, and turning it off leaves miyagi working in `drafts/`.
- An old workspace with `config.json` opens and keeps its knowledge base; `verify` and `smoke-ingest` pass.

- - -
