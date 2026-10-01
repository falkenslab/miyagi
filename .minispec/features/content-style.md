# Optional visual style for published content

Issue: [#21](https://github.com/falkenslab/miyagi/issues/21)

## Goal

Give the teacher an optional, accessible visual style for what miyagi writes in Moodle (assignment statements, code blocks, quiz questions and feedback), adapted from [moodle-ui-kit](https://github.com/noeper/moodle-ui-kit).

## Context

- Today miyagi copies the course's existing style (`resource-authoring`, `assignment-building`: look at two or three existing items) and `publish-check` applies a workspace style skill if there is one. There is no ready-made style for a course that has none (an empty course, `course-building`).
- moodle-ui-kit (noeper, CC0 1.0, no dependencies, about 22 kB) has templates with all styles inline: an activity (Objective / Statement / Deliverable), a code block, feedback, a quiz question and question feedback. Inline because many regional Moodles don't allow CSS in statements or theme changes.
- As it is, it breaks `publish-check`'s accessibility rules:
  - the section titles are bold `<p>`, not `h2`/`h3`;
  - the emojis are inside the titles, so screen readers read them out;
  - white background, `#4174c0` and `Arial` are fixed, which overrides the course theme and looks wrong in dark or branded themes.
- Imposing it on a course that already has its own look would leave the course mixed.
- Unknown: whether the site's editor (TinyMCE/Atto, HTML Purifier) keeps inline `style` when miyagi pastes the HTML through Playwright. It depends on each site's configuration.

## Changes

- An opt-in style skill with the kit's templates, fixed for accessibility:
  - real headings (`h2`/`h3`, starting at `h2` as `publish-check` requires);
  - emojis in `<span aria-hidden="true">` or removed;
  - the theme's font (no `font-family`), and colors with enough contrast and no fixed page background;
  - color never the only carrier of meaning.
- Where it lives, to be decided at implementation: a built-in skill enabled from `config.json`, or a template the teacher copies to `<workspace>/.claude/skills/` (which `publish-check` already applies).
- When it applies: only when the teacher enables it, or in an empty course; never mixed into a course that already has its own style.
- `assignment-building`, `quiz-building` and `resource-authoring` point to it when it's active.
- Credit to moodle-ui-kit in the skill (not required by CC0).

## Acceptance

- With the style active, a new assignment, a quiz question with feedback, and a page with a code block come out with the kit's structure and pass `publish-check`: headings in order, no emoji read aloud, contrast OK, and readable with the course's theme.
- With the style off, or in a course with its own style, miyagi keeps following the course's style.
- **Pending**: a sandbox test (`sandbox-e2e`) showing that the editor keeps the inline styles once saved and that students see them, reported in `tests/` with screenshots. If the editor strips them, fall back to plain semantic HTML and record it.
- `verify` passes.
