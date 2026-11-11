# The page's schema and parameterised actions

Issue: [#106](https://github.com/falkenslab/miyagi/issues/106)

## Goal

A versioned JSON Schema describes everything the page handles (its items and their fields, where an action can go, what an action is), and an action's prompt uses named variables filled from the item and its form.

## Context

- Own commands (#68, #78) and miyagi's commands show on 8 item kinds (`applies-to`), ask values in a form (`parameters`, 7 types) and reach the agent as one line (`/command value`, or `name: value; …`). The agent gets the item's name, not its data (its link, section, dates, visibility).
- The frontmatter is checked by hand-written rules (`src/ownCommands.ts`); nothing says which fields an item has, so a command can't name one safely.
- The teacher wants miyagi to add features to the page on request: an action on chosen items, its prompt parameterised, a form asking what it needs. Decided: Markdown with frontmatter stays the format, validated against the schema.

## Changes

- `schema/ui.schema.json` (versioned): `entities` (each item kind and its fields), `anchors` (item menu of a kind, a view's bar, selected text, a suggestion on Today), `action` (label, icon, group, anchor, `when`, `form`, `prompt`, `trigger`, `mode`).
- The host builds each item's data to the schema (what it already computes to draw it) and sends it with the action: the prompt's `{{item.*}}` and `{{form.*}}` filled in the host, and the item's JSON next to it for the agent.
- `src/ownCommands.ts` validates the frontmatter against the schema (Ajv or zod generated from it): an unknown field or variable is refused when saving. `$ARGUMENTS` keeps working.
- `new-command` skill and `commands_*` tools: the schema in hand to write an action on request ("un botón en cada tarea que…"), validated and shown before saving.
- `check-*` script: every command in `plugin/` and the templates validate against the schema.

- - -

## Acceptance

- An own command with `prompt` using `{{item.title}}` and `{{form.tono}}` reaches the agent with both filled, and the item's data as JSON.
- Saving a command that names `{{item.dueDate}}` (not in the schema) is refused with the field's name.
- miyagi writes, on a teacher's request in the chat, an action for an item kind, validated, approved and shown on those items.
- Existing own commands and miyagi's commands work unchanged.

- - -
