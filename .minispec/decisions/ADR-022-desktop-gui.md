# ADR-022: A desktop app in Electron and React, on a local web host

## Decision

- miyagi gets a graphical interface for teachers with no technical background: a **desktop app** (Electron) whose window shows a **React** page. The terminal chats stay.
- As Captain Whiskers does (agent-kit ADR-026), the window doesn't talk to the agent through IPC: miyagi's own **local web host** (`src/host/`) runs the kit's chat controller (`createChatController`, `panels: "state"`) and serves the page and an API (state over SSE, actions as `POST /api/<action>`) on `127.0.0.1` with a random token. Electron's main process starts it and opens a window on its URL; the same host serves a browser with `miyagi web`.
- The page is a React + TypeScript app built with Vite (`gui/`), shipped built inside the npm package; the desktop shell (`desktop/`) has its own `package.json` and is packaged with electron-builder.
- The page shows the agent's state and sends actions; every rule stays in the agent (modes, approvals, file scope, gates). A screen never publishes anything the chat couldn't.

## Motivation

- Teachers aren't developers: a terminal, slash commands and `--dir` keep most of them out.
- Captain Whiskers proved the path on Electron 44 (packaged `asar`, the SDK's native CLI unpacked) and the kit already applies the packaging fixes. Same shape means the kit's guide and pitfalls apply unchanged.
- One host for the window and the browser: the phone through a tunnel comes free, and the page can be tested in a plain browser with Playwright.
- React rather than the captain's vanilla page: miyagi's interface has many more views (subjects, plan, materials, knowledge base, extensions, settings) than one chat, as the mockup shows; components and state are worth a build step.
- Rejected: IPC with a preload (two transports, no browser mode); Tauri (no Node: rejected by the kit too); a separate repository (the host and the agent change together).

## Consequences

- Needs agent-kit 0.19 or later (the controller): miyagi is on 0.25.
- The host keeps ADR-026's rules: `127.0.0.1` only, the token, one person at a time, the modes and their gates unchanged; a strict CSP; no navigation or new windows out of its origin.
- The interaction port is one per process: one open subject (workspace) at a time per app.
- Windows first (NSIS installer, unsigned at first, SmartScreen warns); macOS and Linux later. A download of ~200–300 MB.
- Delivered by the features `gui-host`, `gui-chat`, `desktop-app`, `gui-workspaces`, `gui-extensions` and `gui-course-views`.
