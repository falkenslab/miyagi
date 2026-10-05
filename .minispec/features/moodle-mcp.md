# Moodle MCP

Issue: [#40](https://github.com/falkenslab/miyagi/issues/40)

## Goal

Replace the free browser in Moodle with the `moodle` MCP server of the Moodle extension: fixed tools that read and publish with the teacher's session, no clicks, and a sign-in the teacher does once per site (ADR-019).

## Context

- Today the agent drives Moodle with Playwright MCP (`src/agent.ts:124-136`), a profile per chat (`sessions/<ts>/browser-profile`), manual login or the password from `.env`, and `publishGate.ts` guessing what publishes from buttons.
- Inventory of real sessions and the stability study of Moodle 4.5-5.2: see ADR-019. Every tool below was proven by hand in `tests/2026-10-04T01-06-moodle-sin-clics/` (its `probe.mjs` is the starting point for `client.ts`).
- `core_courseformat_new_module` only creates subsections; activities are created with `modedit.php?add=`.
- Gobierno de Canarias campuses run Moodle 4.5.11+ (EVAGD with Boost, Aulatic and eForma with Classic) behind CAS; moodle-sandbox runs 5.2 Boost and needs a 4.5 mode.
- Lives in `extensions/moodle/` and `src/extensions/moodle/` (feature `extensions`); the first tools can land before it, wired as today's `drafts` server is.

## Changes

- `src/extensions/moodle/session.ts`: a sign-in window with playwright-core and the system Chrome on the site's login URL, done when the user menu appears; cookies per site in `~/.miyagi/sessions/<site>/`; detection of an expired session (redirect to the login page or the CAS) that pauses the tool, opens the window and retries; Moodle's own login form filled from `.env` when there is a password; checks the teacher can edit the course.
- `src/extensions/moodle/client.ts`: requests with the session's cookies; `ajax(method, args)` on `lib/ajax/service.php`; `form(url)` → fields (hidden ones kept) → `submit(changes)` → result with Moodle's validation errors; `uploadDraft()` on `repository_ajax.php`; forms found by their fields, not their `_qf__` class (it changes between versions); `capabilities()` by probing features: the page's `docs.moodle.org/<version>/` link, `question/banks.php` (5.0+), theme and course format from the body classes (`lib/upgrade.txt` and `UPGRADING.md` don't tell the version).
- Tools (read): `get_course_structure` (`core_courseformat_get_state`), `get_activity`, `get_site_capabilities`, `list_submissions`, `get_grades`, `get_file_text`.
- Tools (publish, hidden by default, return what was stored): `upsert_section` (`section_add`, `core_update_inplace_editable`, `editsection.php`), `create_module` and `update_module` (`modedit.php`), `upload_file`, `set_visibility` (`cm_show/hide`, `section_show/hide`), `move` (`cm_move`, `section_move_after`), `import_questions` (GIFT; `courseid` in 4.5, the course's `qbank` in 5.x, created if missing), `set_quiz_questions` (one by one, in order, then the pagination the teacher wants: adding one by one leaves one per page), `define_rubric`, `grade_submission` (`core_get_fragment` gradingpanel + `mod_assign_submit_grading_form`, rubric levels, feedback HTML), `forum_post` (`post.php` for a discussion, `mod_forum_add_discussion_post` for a reply), `delete_created` (only what the publication record says miyagi created and was never visible).
- GIFT exporter rules found in the tests: `[html]` at the start of the question text (in the middle, students see "[html]" and lines lose their leading spaces), indentation as `&nbsp;`, `{ } : = ~ #` escaped.
- Publish gate by tool name; Playwright MCP, `request_manual_login`, the `secrets` map and `browser_*` labels removed for Moodle; `explore` uses the read tools.
- Unsupported requests: the agent says so, builds what it can in `drafts/`, gives the teacher the steps, and appends the request to a local log.
- Commands `miyagi login` / `logout` (and `/login` in the chat); `init` signs in when it connects the classroom.
- moodle-sandbox: a 4.5 mode (`MOODLE_BRANCH=MOODLE_405_STABLE`: web root without `public/`, its own project name and port, `core.longpaths` on Windows), and a switch to Classic.
- Skills that act in Moodle rewritten around the tools; `moodle-navigation` reduced to what tools can't cover.

## Acceptance

- `miyagi extension test moodle`: every tool's conformance scenario green against moodle-sandbox 4.5 and 5.2, in Boost and Classic.
- `sandbox-e2e` and `simulate-course` through the MCP: same course as before, no browser calls, a fraction of the calls; report in `tests/`; `student-impact-review`.
- Sign-in on a real campus (EVAGD) once, then several chats with no new sign-in; an expired session recovered in the middle of a tool.
- No cookie or password reaches the model or the workspace.
