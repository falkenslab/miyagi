# ADR-019: Moodle through a deterministic MCP, not a free browser

## Decision

The Moodle extension's connector is an in-process MCP server (`moodle`) whose tools are fixed operations on a classroom: read the structure, create or update a section or an activity, upload a file, show or hide, import questions, build a quiz, define a rubric, grade, post in a forum. Each tool runs code, not the model: Moodle's session AJAX services (`lib/ajax/service.php` with the `sesskey`, only functions marked `ajax`) and forms by URL and field name (GET the form, keep its hidden fields, change only what the tool sets, POST, read the result back). Playwright is used only to sign in. The agent gets no browser tools for Moodle; what has no tool it doesn't do in Moodle.

## Motivation

- An inventory of 101 real sessions (4,995 browser calls) found 48 % of the calls spent finding its way around (snapshots, searches, waits), 70 logins in 67 sessions with a median of 4 calls and 56 % of them with a failure, and 72 "Save" clicks reported as failed after Moodle had saved them, so the agent couldn't tell whether something had been published. Feedback was lost by setting TinyMCE's content without saving it, and code lost its indentation.
- Moodle's source for 4.5, 5.0, 5.1 and 5.2 shows the same form URLs and field names in every version and in both Boost and Classic (Classic inherits Boost's form and course templates), and AJAX services with the same signature in all four versions. The differences are few and known (question banks in `mod_qbank` from 5.0, multiple markers in 5.2, Atto out of core in 5.0).
- 21 operations (structure, sections, pages, files, visibility, forum, rubric and grading, GIFT import and quiz, deletion) then ran with no click after signing in, on Moodle 4.5 and 5.2, in Boost and Classic (`tests/2026-10-04T01-06-moodle-sin-clics/`).
- Rejected: the free browser (the inventory above); a Web Services token (needs the site's admin, and has almost no function to create activities); scripted clicks (theme-dependent, and the same false failures); a browser fallback when no tool fits (it brings back what this removes).

## Consequences

- Tools are declared read or publish. The publish gate (ADR-008) asks by tool name instead of guessing from buttons; `isPublishAction()` and its patterns go away for Moodle.
- Publishing tools create hidden by default (ADR-009) and return what Moodle stored, read back after saving, never "clicked Save".
- A tool may delete only what miyagi created and students never saw (checked in the publication record), with the teacher's approval; anything else is never deleted. This narrows the "never delete" principle, it doesn't drop it.
- Sign-in: a visible window on the site's own login page (Moodle's form, CAS, Google, two-factor), the teacher signs in, the cookies are kept per site in `~/.miyagi/sessions/<site>/`, outside the workspace and never seen by the model (ADR-004). When the session expires, the tool pauses, the window opens again and the tool retries. A password in `.env` is used only with Moodle's own login form. With nobody at the screen, an expired session fails with a message saying to sign in.
- `request_manual_login`, the Playwright MCP server and its `secrets` map are no longer used for Moodle; `explore` becomes `get_course_structure` plus the site's capabilities.
- When the teacher asks for something with no tool, miyagi builds what it can in `drafts/`, gives the steps to do it in Moodle, and logs the request locally (no student data) so the next tools come from real use.
- Supported: Moodle 4.5 LTS and later, Boost and Classic, standard course formats. The version is detected by probing features, not by asking the admin. Each tool has a conformance test against moodle-sandbox on 4.5 and 5.2, in Boost and in Classic.
- The tools are the core's, one per capability (`classroom_structure`, `classroom_grade`…, with a `classroom` argument when there are several), so core skills never name a platform; the Moodle extension implements them in-process (a TypeScript object behind the core's in-process MCP server, like `drafts`), with no separate MCP program, and keeps as its own tools only what only Moodle has (SCORM, the gradebook's tree). A classroom extension from a non-official repository implements the same contract through its own MCP server.
- Delivered by the feature `moodle-mcp`, inside `extensions` (ADR-014).
