# miyagi knows teaching, Moodle comes with moodle-teacher

Issue: [#43](https://github.com/falkenslab/miyagi/issues/43)

## Goal

Keep in miyagi only the teaching practice, and let the Moodle side (tools and how to use them well) come from the extension `moodle-teacher@falkenslab` of agent-extensions, which brings moodle-mcp and its `moodle-teacher:*` skills.

## Context

- The skills in `plugin/skills/` mix teaching judgement (how to design a question, when to step into a forum, what makes a good rubric) with Moodle mechanics (`mod/assign/view.php` URLs, TinyMCE, each form's settings, Moodle 5's question bank).
- That Moodle side is written for the browser. moodle-mcp 0.4.0 has tools for almost all of it (`grade_submission`, `import_questions`, `create_activity`, `get_completion_report`…), and the extension already rewrote those instructions around them. Keeping both gives the agent two skills with different instructions for the same thing.
- Students have their own extension, `moodle-student`, installed by padawan (falkenslab/padawan#1).
- Decided in ADR-021: this replaces the in-process Moodle and the `classroom_*` tools of the dropped `moodle-mcp` note. The kit's extensions are wired in miyagi (`src/extensions.ts`, `miyagi extension`, `/extensions`).

## Changes

**Step 1, done** (`src/classroom.ts`): `classroom.connector` (`moodle-teacher` or `browser`); `init` asks the subject first and the classroom last (no by default), installs or extends moodle-teacher with the site, no username or password; an old classroom is offered the move once; with moodle-teacher there's no Playwright, the publish gate covers its tools by verb (`get_`/`list_` and its session tools read, `delete_`/`remove_`/`reset_`/`restore_` always ask), and the prompts are `teacher-*-moodle-teacher.md` and `explore-moodle-teacher.md`. Left: `explore` against the sandbox once signed in, then steps 2 and 3 below.


- Split each skill; what leaves is already in the extension:
  - Unchanged: `quiz-design`, `teaching-plan`, `teaching-methodologies`, `course-design`, `topic-research`, `practice-testing`.
  - Removed: `quiz-building` (→ `moodle-teacher:quizzes`), `moodle-navigation` (→ `moodle-teacher:read-a-course`), `scorm-packaging` (→ `moodle-teacher:scorm`; miyagi may keep its `drafts_*` for the ZIP).
  - Kept, platform side moved out: `rubric-design` (→ `assignments`), `grading-rubric` (→ `grading`), `assignment-building` (→ `assignments`), `activity-building` (→ `other-activities`), `forum` (→ `forums`), `resource-authoring` (→ `course-content`), `publish-check` (→ `publishing`), `course-orientation` (→ `read-a-course`), `progress-monitoring` (→ `class-progress`), `course-auditor` (→ `course-check`), `course-building`, `unit-building`, `course-alignment` (gradebook → `gradebook`).
- The skills that stay name no platform, screen or tool: they say the teaching act ("publish it hidden and ask the teacher to try it", "read the submissions"), and keep using miyagi's own knowledge base, `sources/`, `drafts/` and subagents.
- "Needs a connected Moodle classroom" becomes "Needs a connected classroom (a classroom extension installed)".
- miyagi offers `moodle-teacher@falkenslab` in its catalogue (topic `miyagi`) and requires it to work in a classroom (`requires: ["moodle-teacher"]` or what the kit allows).
- Remove the browser path for Moodle: Playwright MCP, `request_manual_login`, the `browser_*` labels.
- Docs: "Conectar tu aula" (installing moodle-teacher).
- moodle-teacher 0.2.10 (moodle-mcp 0.4.1) installs with `miyagi extension add moodle-teacher`; 0.2.9 didn't, because moodle-mcp listed bundled packages in `dependencies` (falkenslab/moodle-mcp#48).

- - -

## Acceptance

- No skill in `plugin/skills/` contains "Moodle", Moodle URLs or moodle-mcp tool names, watched by a check (`check-docs` or similar).
- With the extension, against moodle-sandbox: grading an assignment with a rubric, creating a quiz from GIFT and replying in a forum work, and the transcripts show miyagi's judgement and the extension's tools, no browser.
- Without the extension, miyagi works in `drafts/` and says a classroom is missing.
- The docs (guide and advanced) say Moodle comes with the extension.

- - -
