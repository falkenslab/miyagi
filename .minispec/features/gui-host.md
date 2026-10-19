# GUI: miyagi's local web host

Issue: [#46](https://github.com/falkenslab/miyagi/issues/46)

## Goal

A local server (`src/host/`) that runs a miyagi chat through agent-kit's chat controller and offers it to a page as state and actions (ADR-022), with `miyagi web` to use it from a browser.

## Context

- Today `chat` runs `runChatInk()` (`src/agent.ts`) and signs in with `ensureClaudeAuthPersisted()` (`src/globalConfig.ts`), which offers `claude setup-token` in a terminal.
- agent-kit 0.19+ has `createChatController(opener, { runsDir, historyPath, panels: "state" })`: `getState()`, `subscribe()`, `send`, `interrupt`, `setMode`, `answer`, `choose`, `listRuns`, `resume`, `newConversation`, the extension actions, `setLanguage`, `api("sources")`. Captain Whiskers' `web/server.ts` (343 lines) is the model.
- miyagi is on agent-kit 0.25, which has the controller.

## Changes

- Extract from `agent.ts` the session opener the chat uses (`buildSessionOptions(config, run.dir, spec, { run })`), so `runChatInk()` and the host share it.
- `src/host/server.ts`, `startHost(workspaceDir, { port?, token? })`:
  - `127.0.0.1`, random token (`randomBytes(18)`), checked timing-safe on `?token=` or `x-token`; 403 otherwise.
  - `GET /` the built page (`dist/gui/`), with CSP `default-src 'self'`, `connect-src 'self'`, `img-src 'self' data:`, `referrer-policy: no-referrer`.
  - `GET /api/events` (SSE): `info` (name, version, kit version, language, workspace label) and `state` (`{ signedIn, chat: getState() }`, throttled to 50 ms), a ping every 20 s; a new connection replaces the old one (`replaced`).
  - `POST /api/<action>` mapped one to one to the controller (send, interrupt, mode, answer, choose, runs, resume, new, language, the extension actions); `send` refused while busy.
  - `POST /api/upload`: a file to the workspace's `sources/` through the sources extension (`addSource`), or for a pending `request_file`; 50 MB limit.
- Sign-in without a terminal: `resolveClaudeAuth()`; if missing, the state says `signedIn: false` and `POST /api/login` takes a pasted key (`sk-ant-oat…` → `CLAUDE_CODE_OAUTH_TOKEN`, `sk-ant-api…` → `ANTHROPIC_API_KEY`), saved as today in `~/.miyagi/config.json` (mode 0600, in `secretFilePaths()`).
- `miyagi web --dir <workspace> [--port]`: prints the URL with its token; never opens it on `0.0.0.0`.
- `check-host.mjs` in `verify`: a request without the token gets 403; with it, `/api/events` sends `info` then `state`; `/api/send` reaches a stub opener.
- Docs: "Usar miyagi en el navegador" (advanced), with the tunnel's risks; `check-docs.mjs` for `web`.

- - -

## Acceptance

- `miyagi web` on a sandbox workspace, opened in a browser with the page of `gui-chat`, holds a conversation with an approval answered from the page.
- No token, key or password in the page's state, the SSE stream or the transcript.
- `verify` passes, `check-host.mjs` included.

- - -
