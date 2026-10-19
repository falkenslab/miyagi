# GUI: the chat in React

Issue: [#47](https://github.com/falkenslab/miyagi/issues/47)

## Goal

The React page (`gui/`) with miyagi's chat as the mockup draws it, on the state and actions of `gui-host` (ADR-022).

## Context

- The mockup (`prototypes/gui/index.html`, not in git) fixes the look: miyagi's colours (sumi, washi, sun `#bc002d`), a sidebar, a chat with a floating dock (todo list and composer over the messages), a mode popover, quick actions, a slash menu, light, dark and system themes.
- The controller's state: `transcript` (`user`, `agent`, `tools` with `TranscriptCall`s and subagent children, `notice`, `turn-summary`), `busy`, `activity`, `todos`, `mode`, `switchableModes`, `panel` (`decision`, `manual`, `text`, `choice`, `form`), `choice`, `commandDetails`, `suggestion`, `contextPercent`, `run`, `language`.
- Captain Whiskers' `web/index.html` solves the same in vanilla JS (folded tool cards, panels as dialogs, upload for `request_file`).
- Needs `gui-host`.

## Changes

- `gui/`: its own `package.json` (React, TypeScript, Vite, no UI framework), `npm run build` into `dist/gui/`, run by miyagi's `build`; `npm run dev` proxies to a running `miyagi web`.
- One SSE hook (`useMiyagi()`) holds `info` and `state`; actions are typed `fetch` calls with the token from the URL.
- Chat view:
  - messages with markdown (a small renderer, no HTML from the model);
  - each `tools` entry folded into one line with the kit's labels (`toolLabels.ts`), opened on click with each call, ✓/✕ and subagents;
  - the floating dock with `todos`, the composer (Enter sends, Shift+Enter a line, Esc interrupts while busy), the `/` menu from `commandDetails`, the suggestion as a chip;
  - mode popover and Shift+Tab (`switchableModes`), with each mode's help.
- Panels as modal dialogs: approval (approve, reject, stop all; the action's summary as the agent wrote it), manual intervention (done), text with attach (uploads, fills the path), choice (radio or checkbox), form (MCP elicitation fields).
- Conversations: a list from `runs`, resume one, new conversation.
- Themes light, dark and system (CSS variables, the system one following `prefers-color-scheme` live); language from `info`, texts in `gui/src/i18n/` (en, es, fr, de) with the same keys checked by a test.
- Accessible: keyboard for everything, focus kept in dialogs, 44 px targets, usable at 360 px.

- - -

## Acceptance

- Against `miyagi web` and the sandbox: a request that publishes shows the approval dialog, approving and rejecting both work; a long tool run stays folded; resuming yesterday's conversation shows it.
- Playwright on the page (a script under `.claude/skills/verify/` or `tests/`): send, approval, mode switch, theme switch; screenshots at 360, 768 and 1440 px.
- Lighthouse accessibility 90 or more.

- - -
