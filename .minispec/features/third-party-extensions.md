# Third-party code extensions and catalog

Issue: [#36](https://github.com/falkenslab/miyagi/issues/36)

## Goal

Let extensions bring MCP servers, safely, and let teachers find and share extensions through a catalog (ADR-016).

## Context

- `extensions` allows content extensions only.
- `loadWorkspaceEnv()` copies `.env` into `process.env` (`src/globalConfig.ts:72`), which may hold `CLAUDE_CODE_OAUTH_TOKEN`; a child process would inherit it.
- agent-kit doesn't expose `reloadPlugins()`/`setMcpServers()` on `AgentRun`.

## Changes

- Code level: `command` only `node` or `python` with the entry inside the extension, dependencies bundled; `npx`/`uvx`/downloads refused.
- Clean environment for extension MCP servers (minimal OS variables plus declared secrets); data dir `~/.miyagi/extension-data/<ext>/<workspace>/`; tools named `mcp__ext_<name>__*`.
- Every tool publishing unless confirmed `readOnlyTools`; MCP annotations not trusted; tool results framed as data; autonomous only with `allowAutonomous`; `readsStudentData`/`sendsTo` shown prominently; network declared, not enforced (said in the confirmation).
- Confirmation at install and on updates that change declarations.
- `ext new --level code --lang ts|python`: a TypeScript template bundled with esbuild into `server/dist/server.js`, and a Python one with vendored dependencies; plain MCP SDKs, no miyagi runtime library (ADR-014).
- Catalog repo `falkenslab/miyagi-extensions`, an index with no code (each extension, official ones included, in its own repo): `index.json` per version (commit, tree hash, kind, level, capabilities, license, tags, trust, withdrawn); CI (hash, `ext check`, personal-data scan, conformance against moodle-sandbox); review checklist for "verified", bound to the commit.
- `ext search`, `ext add <name>`, `ext update`; offline cache; warning at start for withdrawn or newer verified versions.
- Docs page "Extensiones" generated from `index.json`, with a committed fallback copy.
- agent-kit request: `reloadPlugins()`/`setMcpServers()` for enabling without reopening.
- First code extension: falkenslab's own (TriAcademy or YouTube), published as official.

## Acceptance

- `check-extensions.mjs`: a malicious toy extension doesn't receive the OAuth token or other secrets, can't publish without approval, can't start with `npx`, doesn't load after tampering; a prompt-injection tool result isn't obeyed.
- e2e with the first official code extension from `ext add` to an approved publication; `student-impact-review`.
