# Appearance: a catalog of styles for published content

Issue: [#21](https://github.com/falkenslab/miyagi/issues/21)

## Goal

Let the teacher pick a visual style for what miyagi writes in Moodle (assignment statements, quiz questions and feedback, code blocks, pages) from built-in styles or their own, starting from one adapted from [moodle-ui-kit](https://github.com/noeper/moodle-ui-kit).

## Context

- Today miyagi copies the course's existing style (`resource-authoring`, `assignment-building`: look at two or three existing items) and `publish-check` applies a workspace style skill if there is one. A course with no style (empty, `course-building`) gets none.
- moodle-ui-kit (noeper, CC0 1.0, no dependencies, about 22 kB) has templates with all styles inline: activity (Objective / Statement / Deliverable), code block, feedback, quiz question and question feedback. Inline because many regional Moodles don't allow CSS in statements or theme changes.
- As it is, it breaks `publish-check`'s accessibility rules: bold `<p>` instead of headings, emojis read aloud inside titles, and a fixed white background, `#4174c0` and `Arial` that override the course theme.
- A style written as a workspace skill (`.claude/skills/`) mixes instructions with HTML and loses the shared accessibility rules. Rules and templates should be separate: the rules in miyagi, the templates as plain HTML.
- The agent writes only in `knowledge/` and `drafts/` (file scope), so it can't create or edit a style in the workspace by itself.
- No skill in `plugin/` ships files besides its `SKILL.md` yet.
- Unknown: whether the site's editor (TinyMCE/Atto, HTML Purifier) keeps inline `style` when miyagi pastes the HTML through Playwright.

## Changes

- **`appearance` skill** (`plugin/skills/appearance/SKILL.md`), the rules:
  - when a style applies and how each template is filled;
  - accessibility on top of any template: real headings starting at `h2`, emojis in `<span aria-hidden="true">`, no `font-family` or fixed page background, enough contrast, color never the only carrier of meaning;
  - a template that breaks them (the teacher's own) is fixed when filled, with a warning; the teacher's file is not touched;
  - if the editor strips inline styles, fall back to plain semantic HTML.
- **Built-in styles** in `plugin/skills/appearance/styles/<name>/`, one HTML per kind: `assignment.html`, `question.html`, `feedback.html`, `code.html`, `page.html`. At least the kit's, fixed, and a plain one (structure, no color). Credit to moodle-ui-kit in the skill.
- **The teacher's styles** in `<workspace>/appearance/<name>/`, same files; not `templates/`, which in a course means other things (a submission template, a rubric). Read-only for the agent, like `sources/`.
- **Choosing**: `config.json` key `appearance`:
  - `"course"` (default): copy the course's style, as today;
  - `"<name>"`: the workspace's style of that name first, then the built-in one; a workspace style overrides a built-in one with the same name.
- **CLI**: `miyagi appearance list` (built-in and workspace styles) and `miyagi appearance copy <from> <to>` (a built-in style into `<workspace>/appearance/<to>/` to edit), like `skills`/`commands`.
- `assignment-building`, `quiz-building`, `resource-authoring` and `publish-check` point to `appearance` when a style is chosen.

Open questions:

- A style missing one kind (e.g. no `code.html`): take the built-in one, or no style for that kind.
- Whether the agent can read files shipped with a plugin skill (`styles/*.html`), or they need a tool; check how agent-kit loads skills.
- Whether colors are parameters of a style (the school's colors) or each variant is its own style.

## Acceptance

- `miyagi appearance list` shows the built-in styles and the workspace's; `copy` creates an editable one in `<workspace>/appearance/`.
- With a style chosen, a new assignment, a quiz question with feedback, and a page with a code block come out with that style and pass `publish-check`: headings in order, no emoji read aloud, contrast OK, readable with the course's theme.
- A workspace style with a broken template (e.g. bold `<p>` titles) is fixed when filled and the teacher is warned.
- With `"course"`, miyagi keeps following the course's style.
- **Pending**: a sandbox test (`sandbox-e2e`) showing that the editor keeps the inline styles once saved and that students see them, reported in `tests/` with screenshots. If the editor strips them, the fallback is recorded.
- `verify` passes.
