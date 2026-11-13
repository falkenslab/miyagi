# Actions from extensions' skills

Issue: [#110](https://github.com/falkenslab/miyagi/issues/110)

## Goal

An extension's skill with action metadata in its frontmatter is offered on the page as an action, the same as a command.

## Context

- The page's actions (＋ menu, each item's ⋯ menu, Today, Your classroom, a view's bar) come from `pageActions()` in `src/host/server.ts`, fed only by `listCommands()`; `actionMeta()` in `src/catalog.ts` reads `label`, `icon`, `group`, `needs-classroom`, `applies-to`, `views`, `ask`, `suggest`, `opens`, `produces`.
- `readSkills()` reads only `name` and `description`, so a skill can never be an action.
- Extensions move their flows from commands to skills because Codex has no commands: moodle-teacher's `week` and `to-grade` are skills now (agent-extensions@600a8cc), and show nowhere in Today.
- Moved from falkenslab/agent-extensions#30, which asked for the keys on the commands.

## Changes

- `readSkills()` reads `actionMeta()` from `SKILL.md` too, for extensions' skills (and the subject's own, for free).
- `pageActions()` gets those skills: launching one sends a message that asks the agent to use that skill (with the value asked for, if `ask`), not a slash command.
- The catalog keeps skills and commands apart; an action's kind says which it is, so the page knows how to send it.
- agent-extensions (its own change, in English): `label`, `icon`, `group: day`, `needs-classroom: true` on moodle-teacher's `week` and `to-grade`, and moodle-student's `week`. Claude Code and Codex ignore unknown keys.
- Docs: the advanced page on commands and actions says skills can carry the same keys.

- - -

## Acceptance

- With moodle-teacher installed and a classroom, Today shows "Esta semana" and "Por corregir" from its skills; without a classroom they don't show.
- Launching one starts a turn whose message names the skill, and the agent loads it.
- A skill without `label` stays out of the actions; commands work as before (`check-host.mjs`).
- `verify` passes.

- - -
