# Units built in one request skip the hidden-drafts flow

Issue: [#25](https://github.com/falkenslab/miyagi/issues/25)

## Problem

In the SQL course test (`tests/2026-10-01T19-03-docs-sql-course/`), Tema 1 was built as ADR-009 says: each piece created hidden, checked, and shown after an approval with its summary. Temas 2 and 3, asked for in a single `/miyagi:build-unit` request, were saved visible: book chapters, guided practices and assignments with "Save and display", and the Tema 3 quiz visible before it had all its questions. The publish gate stopped every save (22 "Publicación sin aprobación previa" panels, with only the button's name, no summary), and only 2 approvals were requested for both units. Told about it, the agent fixed the quiz, admitted the slip and did Tema 4 correctly (12 approvals, everything hidden first, 0 gate panels).

## Cause

Not confirmed. Candidates, from the transcripts:

- Two units in one request: the second runs deep into a long session (it hit the spend limit, and Tema 1 had hit the 400-turn limit), and `unit-building`'s hidden-first step is far behind in the context.
- `unit-building` and `resource-authoring` say "build hidden" but the step that creates each piece doesn't repeat it; the create form defaults to visible.

## Solution

Provisional: with `moodle-mcp` (#40) every tool creates hidden by default, which fixes this at the root. Until then:


- `unit-building`: one unit per pass — when several are asked for, finish (and show) one before starting the next, and restate the hidden-first rule at each piece.
- `resource-authoring`, `assignment-building`, `quiz-building`: at creation, set "Availability: Hide on course page" in the same form, before the first save.
- Consider a gate rule (dropped once the gate asks by tool name): a "Save and display" on a new activity's form (`course/modedit.php?add=`) without a prior approval is the pattern to flag in the panel ("se va a publicar visible una actividad nueva").

## Verification

`sandbox-e2e` / `simulate-course` asking for two units in one request: every new piece hidden at creation (check `mdl_course_modules.visible` right after each save), one approval per piece and one to show, and no gate panel.
