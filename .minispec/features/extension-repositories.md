# Extension repositories and code extensions

Issue: [#36](https://github.com/falkenslab/miyagi/issues/36)

## Goal

The official extensions repository, repositories a user adds by hand, and extensions that bring code: MCP servers and running programs (ADR-016, ADR-020).

## Context

- `extensions` gives workspace dependencies, the store, the lock and content-level extensions only.
- `loadWorkspaceEnv()` copies `.env` into `process.env` (`src/globalConfig.ts`), which may hold `CLAUDE_CODE_OAUTH_TOKEN`; a child process would inherit it.
- agent-kit doesn't expose `reloadPlugins()`/`setMcpServers()` on `AgentRun`.
- No community catalog and no resource hub (ADR-020).

## Changes

- **Official repository** `falkenslab/miyagi-extensions`: one folder per extension, tags `<name>@<x.y.z>`, CI that validates each `extension.json`, runs the classroom conformance scenarios against moodle-sandbox and, on a tag, publishes a GitHub release with the tarball and its SHA-256 and regenerates `index.json` (versions, commit, hash, kind, level, provides, requires, `miyagiApi`). miyagi downloads the release tarball by HTTPS, no git.
- **User repositories.** `miyagi extension repo add|remove|list <url>`, kept in `~/.miyagi/config.json`; any repository with the official layout. Adding one shows an explicit warning (not reviewed by falkenslab; its content can change how miyagi behaves; its code runs on this computer with your permissions) and needs a typed confirmation. Its extensions are named `<repo>/<name>`, everywhere: workspace, lock, `extension list`, the chat. Removing a repository stops loading its extensions in every workspace.
- **Code level.** MCP servers started with `node` or `python` and an entry inside the extension, dependencies bundled; no `npx`, `uvx` or downloads at start. Clean environment (minimal OS variables plus the secrets the extension declares); data dir `~/.miyagi/extension-data/<ext>/<workspace>/`; tools named `mcp__ext_<name>__*`.
- **What is confirmed.** Official: what it declares, once. Non-official (a user repository or a workspace's own `extensions/`): tools, network, student data read and where it's sent, publishing, running code on the host; again when a version changes any of it, and always for a major version.
- **Running code.** Official runtime extensions (Docker, Git, Python) run in containers the core starts (the practice runner's model: no network by default, only the practice's folder mounted). A non-official extension may run code on the host, a shell included, once the user accepts that warning (ADR-003 as amended by ADR-020); the main agent never gets Bash itself.
- **Always enforced.** Every tool publishing unless confirmed `readOnlyTools`; MCP annotations not trusted; tool results framed as data; no publishing in autonomous mode by a non-official extension unless enabled for it; network declared, not enforced (said in the confirmation).
- `miyagi extension new --level code --lang ts|python`: a TypeScript template bundled with esbuild into `server/dist/server.js`, and a Python one with vendored dependencies; plain MCP SDKs, no miyagi runtime library.
- `extension update` and `outdated` across repositories; warning at start for a version marked withdrawn in its repository's index.
- Docs page "Extensiones" generated from the official `index.json`, with a committed fallback copy; a page on adding a repository and its risks.
- agent-kit request: `reloadPlugins()`/`setMcpServers()` for enabling without reopening.
- First official code extensions: the practice runner moved to `docker`, then `git` and `python` in containers.

## Acceptance

- `check-extensions.mjs`: a malicious toy extension in a user repository doesn't receive the OAuth token or other extensions' secrets, can't publish without approval, can't start with `npx`, doesn't load after its files change; a prompt-injection tool result isn't obeyed; adding its repository without confirming the warning adds nothing.
- An official release installs from the tarball and its hash; a tampered tarball is refused.
- e2e with `docker` from `extension add` to a practice checked in a container; `student-impact-review`.
