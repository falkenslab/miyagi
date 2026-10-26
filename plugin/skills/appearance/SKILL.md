---
name: appearance
description: Choose and check the visual style of what miyagi exports from materials/ - pages, assignment statements, quiz questions and feedback, code blocks - from the styles installed as extensions, or the course's own theme (the default); and help a teacher make their own style. Use when the teacher asks for a style, a look, colours or a template for what's published, when a course has no style of its own, or when a published item lost its styles.
---

# The look of what's published

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

What miyagi exports from `materials/` is accessible HTML that takes the classroom's theme. A
**style** dresses it: a header with the activity's title, a box around the statement, code with a
"select and copy" label, feedback in a coloured frame. A style is an extension with a `style/`
folder, one template per kind; the exporter fills it by code (`materials-format`).

## Choosing

- `materials_style` without a name says the style in use and the ones installed. With a name, it
  sets it for the subject; `course` goes back to the classroom's theme (the default).
- Set one only when the teacher asks for it, or offer it when the course is empty and has no look
  of its own; a course that has one keeps it (`course`), and you follow what's there.
- None installed: the catalog's style extensions (miyagi's Extensions view, or `miyagi extension`);
  installing is the teacher's decision.
- The change applies to the next exports; what's published only changes when it's exported and
  published again, with its approval.

## What the exporter guarantees, whatever the template

Templates come from anyone, so each one is made accessible when it's read, and the export says
what it fixed (tell the teacher, whose style it is; the file isn't changed): real headings in
order (a bold paragraph used as a title becomes one), emojis hidden from screen readers, no font
or page background over the theme, and a colour without enough contrast (4.5:1) dropped. Colour
never carries meaning alone: a label says it too.

## After publishing

Read the item back from the classroom: if the classroom removed the inline styles (some sites
strip them, and only their administrator allows them), say so, set `course` and publish it plain
rather than trying again. Then the teacher previews it as a student.

## A teacher's own style

An extension (a Claude Code plugin folder: `.claude-plugin/plugin.json` with its name, version and
description) with `style/<kind>.html` for the kinds
it dresses (`page`, `assignment`, `code`, `question`, `feedback`; a missing one stays plain).
Placeholders: `{{title}}` (page, assignment), `{{body}}` (the exported HTML: put it where the
content goes), `{{code}}` and `{{language}}` (code: `<pre><code>{{code}}</code></pre>`, nothing
else inside the `<pre>`), `{{label:copy}}`, `{{label:statement}}`, `{{label:question}}`,
`{{label:feedback}}`, `{{label:code}}` (in the teacher's language). Inline styles only: no
`<style>`, no classes. Install it in the subject, set it, export one material of each kind and
read what the export fixed. The teacher adds it with
`miyagi extension add <folder> --link --project`, so their edits apply without reinstalling.
