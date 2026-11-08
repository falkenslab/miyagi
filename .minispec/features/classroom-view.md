# Seeing the classroom: "View in the classroom" on every Moodle action

Issue: [#77](https://github.com/falkenslab/miyagi/issues/77)

## Goal

Under each of miyagi's actions in Moodle, the chat offers "View in the classroom", which opens the very page it touched: beside the chat in the desktop app, in a new tab of the teacher's browser in the web version. The model never sees it.

## Context

- The teacher only reads what miyagi says it did in the classroom; checking it means finding the page in Moodle by hand.
- Screenshots (this note's first version) were dropped: they needed moodle-mcp and moodle-teacher to capture and store pictures the model must never read, and a still picture of miyagi's browser (often in edit mode) isn't the classroom as the teacher or a student sees it.
- moodle-mcp already knows each tool's page: its follow mode (its ADR-011, `src/tools/follow.ts`, `FOLLOWED_PAGES` and `openSitePage`) shows it in its own browser when asked (`show_browser`).
- A result's `_meta` can't be read from a hook. Tested through the SDK with a stub MCP server (8 November 2026): `PostToolUse`'s `tool_response` has only the content and the model doesn't get it, but the stream's `tool_use_result` and the session's stored `mcpMeta` keep it. agent-kit 0.32 drops it when it builds its `tool-result` event.
- Moodle refuses to be framed by another site by default (`X-Frame-Options`, "allowframembedding" off), so the web page can't embed it; Electron can, in a view of its own (`WebContentsView`), not a frame.

## Changes

- **moodle-mcp** returns, in every tool's result that has a page, its absolute URL in `_meta` (`page`), from the same map follow mode uses ([falkenslab/moodle-mcp#56](https://github.com/falkenslab/moodle-mcp/issues/56), implemented, not published yet). Until it and the kit's change are out, nothing shows: miyagi doesn't guess URLs.
- **agent-kit** carries a tool result's `_meta` on its `tool-result` event and on `TranscriptCall` as `meta`, and restores it from the stored `mcpMeta` when a conversation is resumed ([falkenslab/agent-kit#91](https://github.com/falkenslab/agent-kit/issues/91)). miyagi moves to that release with `upgrade-agent-kit`.
- **The host**: takes `meta.page` from the calls of `mcp__moodle__*` tools and gives it to the page with the call, only if it's on the classroom's own origin. The kit keeps it with the conversation, so a resumed one shows its links.
- **The page**: "View in the classroom" under each of those steps in the chat, and on the classroom's items where the page knows them (Your classroom, the oven's served activities).
- **Web version**: it opens in a new tab (`rel="noopener"`), where the teacher is already signed in to Moodle.
- **Desktop app**: a panel beside the chat, a `WebContentsView` with its own persistent session (`persist:classroom`), no preload, sandboxed, navigation kept to the classroom's origin (anything else goes to the system browser), back, reload, "Open in the browser" and close. The teacher signs in to Moodle there once; it's remembered. It never shares anything with miyagi's page (its token, its host).
- **Docs** (es, en): the browser page and the desktop app's: the link, the panel, signing in once, that it's the teacher's own session and the model doesn't see it.

## Acceptance

- In the sandbox, after miyagi creates a page and an assignment, each step offers "View in the classroom", which opens that page: in a new tab on the web, in the panel in the desktop app.
- A URL outside the classroom's origin is never offered; the panel doesn't navigate out of it.
- The model gets no URL nor picture it didn't already get (what it receives is unchanged).
- A resumed conversation still shows its links.
- Checked at 360, 768 and 1440 px, with a test report with screenshots.
