# Appearance: styles for published content

Issue: [#21](https://github.com/falkenslab/miyagi/issues/21)

## Goal

Let the teacher pick a visual style for what miyagi publishes (assignment statements, quiz questions and feedback, code blocks, pages), from the official styles or their own, starting from one adapted from [moodle-ui-kit](https://github.com/noeper/moodle-ui-kit).

## Context

- Today miyagi copies the course's existing style (`resource-authoring`, `assignment-building`: look at two or three existing items). A course with no style (empty, `course-building`) gets none.
- moodle-ui-kit (noeper, CC0 1.0, no dependencies, about 22 kB) has templates with all styles inline: activity (Objective / Statement / Deliverable), code block, feedback, quiz question and question feedback. Inline because many regional Moodles don't allow CSS in statements or theme changes.
- As it is, it breaks `publish-check`'s accessibility rules: bold `<p>` instead of headings, emojis read aloud inside titles, and a fixed white background, `#4174c0` and `Arial` that override the course theme.
- With `neutral-materials`, the core turns Markdown into accessible HTML: that exporter, code and not the model, is where a style is applied.
- A style is a domain extension (ADR-020): the official ones in the official repository, a school's in a repository the teacher adds, the teacher's own in the workspace's `extensions/`.
- Unknown until `moodle-mcp`: whether the editor keeps inline `style` when the HTML is sent by POST instead of typed through the editor.

## Changes

- **A style is an extension** that provides the `style:<name>` capability and holds one HTML template per kind: `assignment.html`, `question.html`, `feedback.html`, `code.html`, `page.html`, with placeholders the exporter fills. Official ones: the kit's, fixed for accessibility, and a plain one (structure, no colour), credited to moodle-ui-kit.
- **Choosing**: `workspace.json` key `appearance`: `"course"` (default: copy the course's style, as today) or the name of an enabled style extension.
- **Applying**: the HTML exporter of `neutral-materials` fills the chosen template; a kind the style doesn't have falls back to the plain one.
- **Accessibility on top of any template**, checked by the exporter: real headings starting at `h2`, emojis in `<span aria-hidden="true">`, no `font-family` or fixed page background, enough contrast, colour never the only carrier of meaning. A template that breaks them is fixed when filled, with a warning; the template itself isn't changed.
- **If the classroom strips inline styles**, plain semantic HTML; the classroom extension declares it (`styles: "inline" | "none"`).
- Skill `appearance`: when a style applies, and how a teacher makes their own (with `extension-authoring`).

## Acceptance

- With a style chosen, a new assignment, a quiz question with feedback and a page with a code block come out with that style and pass `publish-check`: headings in order, no emoji read aloud, contrast OK, readable with the course's theme.
- A teacher's style with a broken template (bold `<p>` titles) is fixed when filled and the teacher is warned.
- With `"course"`, miyagi keeps following the course's style.
- A sandbox test (`sandbox-e2e`) showing that the inline styles survive once saved and that students see them, reported in `tests/` with screenshots; if they don't, the fallback is recorded.
- `verify` passes.
