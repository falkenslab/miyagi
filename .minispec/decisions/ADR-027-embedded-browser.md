# ADR-027: A web browser in the desktop app, kept apart from the agent

## Decision

- The desktop app's side panel shows real web pages, signed in with the teacher's own session: one sandboxed `WebContentsView` per tab, with no preload, in a session of its own (`persist:browser`), placed over the panel's rectangle. Only in Electron: `miyagi web` keeps opening links in a new tab.
- The page talks to it as it talks to the rest of the host (ADR-022): actions (`browser-*`, an option of `startHost` as `pickFolder`) and the tabs on an event of their own. The chat's state never carries them.
- `file:` and the host's own address are refused, typed, linked or loaded from inside a page (the host's URL carries the token). Permissions are denied by default; a pop-up becomes a tab; a download goes through the system's save dialog; no devtools when packaged.
- Only the sign-in is kept: the session's cookies. No cache, no tabs, no addresses, and what else the sites stored is cleared on quitting.

## Motivation

- A teacher wants to look at Moodle next to the conversation. Moodle refuses being framed, so the page can't show it; a native view can, and a session of its own keeps the sign-in out of miyagi's page.
- Moodle's addresses and pages can identify a student, and pages are untrusted content: neither may reach the model (ADR-004) nor be written down.
- Rejected: an `<iframe>` (framing is refused); a preload or IPC (ADR-022); handing this session to moodle-mcp, whose access is separate and goes on being so.

## Consequences

- The agent still reaches Moodle only through moodle-mcp, with its own session; the teacher's session here is invisible to it.
- A native view is painted over the page: anything of the page that would be covered takes a still (`capturePage`) in its place, detected by hit-testing the view's rectangle, so new menus and dialogs need no change.
- Screenshots of the page alone don't show the view: the screenshot hook captures the window.
- Any new way of reaching a page goes through `refusedUrl` and `webAddress` (`src/host/browser.ts`).
