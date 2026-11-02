# The teacher's own commands, with parameters, as actions

Issue: [#68](https://github.com/falkenslab/miyagi/issues/68)

## Goal

A teacher can make their own commands (a word search on a topic, a crossword, a matching game…) with the parameters they need, without programming, and launch them from the page with a form filled from what they're looking at.

## Context

- Own commands already load from `<subject>/.claude/commands/` (`src/catalog.ts:110`, marked custom), and own skills from `.claude/skills/` (`avanzado/habilidades-propias.md`). But they're written by hand, only per subject, and the page doesn't offer them.
- Claude's command format has one `$ARGUMENTS` string: no named, typed parameters for a form.
- Building and publishing an activity already exist: `designed-material`, `activity-lifecycle` (`drafts/<slug>/`), the Materials preview, moodle-teacher's `scorm` (an HTML game graded in Moodle).
- Depends on `contextual-actions` (#67: the same frontmatter, catalog and item menus), and for an interactive result on `playable-preview` (#69).
- Asked by the teacher (2026-11-02): "un comando para crear sopas de letras donde el parámetro sea la temática, cantidad de elementos, palabras…".

## Changes

- **Parameters in the frontmatter** (the `contextual-actions` metadata, plus):
  - `parameters`: each with `name`, `label` (per language or one), `type` (text, number, choice, words, topic, source, page), `required`, `default`, `min`/`max`, `options`, `help`;
  - `produces` (html-activity, quiz, document, page): how the result is shown;
  - in the instructions, `{{name}}` for each value; what reaches the model is the command with its values as a short labelled list.
- **A form from `parameters`**: in the catalog and on the items of `applies-to`, prefilled from context (the topic's title for a `topic`; a topic's glossary words for `words`, from the knowledge base); validated before sending.
- **Creating one by talking**: a skill `command-authoring` (in `plugin/skills/`, neutral): asks what it should make and which values change each time, writes the command, shows the form it will get and saves it only on the teacher's yes; can edit an existing one.
- **Where it lives**: this subject (`.claude/commands/`), all the teacher's subjects (new `~/.miyagi/commands/`, read by `catalog.ts` and the session), or shared as an extension (extensions already carry commands; a department's marketplace).
- **Starting templates**: word search, crossword, matching, ordering, flashcards, as commands the teacher copies and adapts (in the plugin, offered from "New command").
- **An editor in the page**, later: name, icon, parameters, instructions, "Try it".
- **The result**: a card in the chat with the activity (playable when `produces: html-activity`, see `playable-preview`), "Open in Materials" and "Publish" (page, SCORM with a grade, H5P).
- Security: a command is instructions, not code; it runs under the same approvals, file scope and gates as any turn. Validate the frontmatter and refuse a command whose parameters break it.
- **Docs**: `avanzado/habilidades-propias.md` (both languages): own commands, their parameters, the three scopes, an example (the word search); `guia/ideas.md` a line.
- `check-docs.mjs` and `check-references.mjs` cover own commands; a check renders the form of the templates' frontmatter.

## Acceptance

- Asking miyagi "quiero un comando para hacer sopas de letras con la temática, el número de palabras y las palabras" ends, after the teacher's yes, with a command in the scope chosen.
- That command shows in the catalog and in a topic's ⋯ menu; its form opens with the topic filled in, and sending it builds the word search in `drafts/`, shown in the chat and in Materials.
- A command saved for all subjects shows in another subject too.
- `verify` passes; a real session builds the word search from the form.
