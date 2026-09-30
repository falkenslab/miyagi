# teacher-agent's own colors

## Goal

Give the terminal UI teacher-agent's own look, taken from the owl logo, on top of agent-kit's default theme.

## Context

- Since agent-kit 0.13 the UI's colors come from a theme of roles (`agent`, `toolBullet`, `toolLabel`, `toolResult`, `selection`, `working`, `accent`, `border`...). An agent changes only the roles it wants with `setTheme()` or the `theme` option of `runChatInk()`/`createProgressView()`/`runWizard()` (kit ADR-021).
- teacher-agent uses the default theme: the owl is orange (`#d77757`, the kit's accent) and amber (`#dfa23a`, `docs/assets/owl.svg`), but the tool bullets are green and the spinner light blue, colors that belong to no one in particular.
- The replies' color (`agent`) and the dimmed tool lines stay as they are: the teacher asked for "white only for the agent and me".

## Changes

- One `setTheme()` at the CLI's start (so the chat, the one-shot view and the wizard share it), in a small `src/theme.ts`:
  - `toolBullet`: the owl's amber;
  - `working` (spinner and mode): the owl's orange;
  - everything else, the kit's default (orange selection and panel border, dimmed tools, red errors).
- The owl's colors named once, and used by the chat header's logo too.

## Acceptance

- A chat shows amber tool bullets and an orange spinner; replies and the human's lines unchanged; the approval panel as before. Screenshot kept.
- Legible on dark and light terminal themes.
- `verify` passes.
