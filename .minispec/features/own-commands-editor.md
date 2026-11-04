# Editing own commands in the page, and their forms filled from the knowledge base

Issue: [#78](https://github.com/falkenslab/miyagi/issues/78)

## Goal

A teacher can see, change and try their own commands from the page, without talking to miyagi or touching a file, and a form's word list comes filled from the topic it was opened on.

## Context

- #68 made own commands: written by talking (`command-authoring`), saved by `commands_save` after an approval (`src/commandsServer.ts`), in a subject (`.claude/commands/`) or for all (`~/.miyagi/own/commands/`), and launched from a form (`ParameterForm` in `gui/src/components/Actions.tsx`).
- The form only fills the first parameter whose type matches the item it was opened on (a topic's title); a `words` parameter starts empty and miyagi takes the words from the glossary itself.
- There is no way to see or change a command without asking miyagi; a new one shows only from the next conversation.

## Changes

- **Words from the knowledge base**: opening a form on a topic fills a `words` parameter from that topic page's glossary (the host reads it; the teacher can edit the list before sending).
- **An editor in the page**: under Extensions (or the catalog's ✎), the teacher's own commands with their scope; for each, name, icon, label, where it shows, its parameters (add, remove, reorder, type, default, limits) and its instructions; "Try it" opens its form; saving goes through the same validation as `commands_save` (`validateCommand`) and asks the teacher to confirm, never silently.
- Deleting an own command from the editor, with confirmation.
- The catalog picks up a command saved from the editor without a new conversation.
- `check-host.mjs`: saving an invalid command from the page is refused; `check-page.mjs` or `check-own-command.mjs`: a word list prefilled from a topic's glossary.
- **Docs**: `avanzado/atajos-e-instrucciones.md` (both languages).

## Acceptance

- Opening the word search's form on a topic with a glossary shows its words already in the field.
- A teacher changes a command's default and its label in the page, tries it, saves it, and sees it changed in the catalog in the same conversation.
- A command with a refused key or no `$ARGUMENTS` can't be saved from the editor either.
- `verify` passes.
