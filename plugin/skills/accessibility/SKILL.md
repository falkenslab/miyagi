---
name: accessibility
description: Apply and audit basic accessibility practices in any Moodle content you create or review - semantic structure, alt text, link text, accessible tables, and not relying on color alone.
---

# Accessibility, when authoring or auditing content

Applies both when creating/editing content (`content-authoring`) and when reviewing
existing content (`course-auditor`, or any time you're checking whether something is
usable by everyone, not just easy to write).

## Semantic structure and headings

Use real headings (Moodle's editor heading styles), in order, instead of just making text
bold or bigger to look like a heading — screen readers navigate by heading structure, not
by visual weight. Don't skip levels (a heading 3 shouldn't appear before any heading 2 in
the same page).

## Images and alt text

Every image needs alt text describing what it *conveys*, not the file name or "image of
a diagram" — if the image shows a process, the alt text should let someone who can't see
it understand the same thing a sighted reader would get. A purely decorative image (with
no informational content) can have empty alt text, but that's the exception, not the
default.

## Links

Link text should describe the destination or action ("download the syllabus PDF"), not a
bare "click here" or "this link" — a screen reader user often navigates a page by jumping
between links alone, out of surrounding context.

## Tables

Use tables for actual tabular data, not for layout. Mark header rows/columns as headers
(not just bold text in a regular cell) so a screen reader announces them correctly when
reading a data cell.

## Color

Never convey information through color alone ("the correct answer is the green box",
"deadlines in red are urgent") — always pair it with text, an icon, or a label. Someone
with color-vision deficiency, or reading a black-and-white printout, needs the same
information without relying on color.

## Language and readability

Prefer clear, direct sentences over long or needlessly complex ones, unless a specific
term is already established course terminology. Break up dense walls of text with
headings, lists, or short paragraphs where it helps someone scanning the page.

## Auditing existing content

The same checklist above doubles as an audit: when reviewing a page, activity
description, or resource that already exists, check it against each point here and note
concrete issues (missing alt text on image X, a table with no header row, a "click here"
link) rather than a vague "accessibility could be improved."
