# Seeing the classroom: "View in the classroom" on every Moodle action

Issue: [#77](https://github.com/falkenslab/miyagi/issues/77)

## Goal

Under each of miyagi's actions in Moodle, the chat offers "View in the classroom", which opens the very page it touched: beside the chat in the desktop app, in a new tab of the teacher's browser in the web version. The model never sees it.

## Context

- The teacher only reads what miyagi says it did in the classroom; checking it means finding the page in Moodle by hand.
- Screenshots (this note's first version) were dropped: they needed moodle-mcp and moodle-teacher to capture and store pictures the model must never read, and a still picture of miyagi's browser (often in edit mode) isn't the classroom as the teacher or a student sees it.
- moodle-mcp already knows each tool's page: its follow mode (its ADR-011, `src/tools/follow.ts`, `FOLLOWED_PAGES` and `openSitePage`) shows it in its own browser when asked (`show_browser`).
- Moodle refuses to be framed by another site by default (`X-Frame-Options`, "allowframembedding" off), so the web page can't embed it; Electron can, in a view of its own (`WebContentsView`), not a frame.

## Changes

- **moodle-mcp** returns, in every tool's result that has a page, its absolute URL in `_meta` (`page`), from the same map follow mode uses ([falkenslab/moodle-mcp#56](https://github.com/falkenslab/moodle-mcp/issues/56)). Until then, nothing shows: miyagi doesn't guess URLs.
- **The host**: a PostToolUse hook on `mcp__moodle__*` reads that URL and keeps it with the call (`tool_use_id`, the id the kit's `TranscriptCall.id` carries), only if it's on the classroom's own origin; the page gets it with the call. Kept with the conversation, so a resumed one shows its links.
- **The page**: "View in the classroom" under each of those steps in the chat, and on the classroom's items where the page knows them (Your classroom, the oven's served activities).
- **Web version**: it opens in a new tab (`rel="noopener"`), where the teacher is already signed in to Moodle.
- **Desktop app**: a panel beside the chat, a `WebContentsView` with its own persistent session (`persist:classroom`), no preload, sandboxed, navigation kept to the classroom's origin (anything else goes to the system browser), back, reload, "Open in the browser" and close. The teacher signs in to Moodle there once; it's remembered. It never shares anything with miyagi's page (its token, its host).
- **Docs** (es, en): the browser page and the desktop app's: the link, the panel, signing in once, that it's the teacher's own session and the model doesn't see it.

## Acceptance

- In the sandbox, after miyagi creates a page and an assignment, each step offers "View in the classroom", which opens that page: in a new tab on the web, in the panel in the desktop app.
- A URL outside the classroom's origin is never offered; the panel doesn't navigate out of it.
- The model gets no URL nor picture it didn't already get (the transcript is unchanged).
- Checked at 360, 768 and 1440 px, with a test report with screenshots.
