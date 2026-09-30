# Activity catalog

Issue: [#16](https://github.com/falkenslab/miyagi/issues/16)

## Goal

Connect miyagi to a shared catalog of activities where the teacher can search, download and install an activity in their Moodle course, and publish their own activities after signing up.

## Context

- Today every activity is built from scratch in `drafts/` (GIFT, HTML, rubrics, packages) and uploaded hidden (ADR-009). Nothing built in one course can be reused by another teacher.
- The catalog doesn't exist yet: it will be a separate project (its own repo, service and API). **This feature is blocked until that project exists**; it is recorded now so the idea and its constraints aren't lost.
- Searching and downloading may be anonymous; publishing needs an account in the catalog.
- Constraints that already apply:
  - installing in Moodle is a change students would see: built in `drafts/`, uploaded hidden, tested, and approved by the teacher (ADR-008, ADR-009);
  - the catalog's credentials never reach the model (ADR-004);
  - publishing sends content outside the course: nothing from students (names, submissions, grades, forum posts) may go in it (ADR-005 in spirit);
  - no shell to fetch or unpack what comes from the catalog (ADR-003); downloading and unpacking belong to the `drafts/` toolbox (`drafts-toolbox.md`).

## Changes

To be settled once the catalog's API is known. Expected shape:

- Configuration: the catalog's URL, and the account, stored like the Moodle credentials (never in the prompt or the knowledge base).
- In-process tools for the catalog, like the `drafts` server:
  - `catalog_search`: by text, subject, level, activity type; returns summaries.
  - `catalog_get`: one activity's details and files, downloaded into `drafts/`.
  - `catalog_publish`: an activity from `drafts/` with its metadata (title, description, level, licence), only for a signed-up account.
- An `activity-catalog` skill:
  - install: download, adapt to the course (unit, dates, grading), upload hidden, test, ask for approval to show;
  - publish: build the package from what's in the course, strip anything about students, show the teacher exactly what will be published, publish only after their explicit approval.
- The publish step goes through the approval gate like any change in Moodle, since it is outward-facing.
- `toolLabels.ts` lines for the new tools; the catalog named in `course-building` and the activity skills as a source before building from scratch.

Open questions (decided with the catalog project):

- Package format: a Moodle activity backup (`.mbz`), or miyagi's own sources (GIFT, HTML, SCORM, rubric) plus metadata.
- Sign-up and authentication (token, OAuth), and whether downloads need an account.
- Licence of published activities (e.g. CC BY-SA) and moderation.

## Acceptance

Against the sandbox and a running catalog, reported in `tests/`:

- The agent finds an activity by a teacher's description, installs it hidden in a unit, tests it and shows it only after approval.
- Signed up, the agent publishes an activity from the course; the published package holds no student data, and nothing is published without the teacher's approval.
- Without an account, publishing is refused with a clear message; search and install still work (if the catalog allows it).
- The catalog's credentials appear in no prompt, log or knowledge page.
- `verify` passes.
