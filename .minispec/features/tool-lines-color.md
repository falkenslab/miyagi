# Tool lines in a quieter color than the agent's replies

## Goal

In the chat, show the lines of the tools the agent runs ("Navigating to …", "Clicking …", "Leyendo …") in a color that stands back, so they don't look like the agent's replies.

## Context

- Today both are in the terminal's default color (white on a dark theme): the tool line is `● <label>` with only the bullet colored (agent-kit's `toolGroup.ts`, `call.label` as given), and the reply is `● <text>`. A long session reads as one block of white text. Only the results (`⎿ …`) are dimmed.
- The label comes from teacher-agent: `formatAction` (`friendlyToolLabel`, `src/toolLabels.ts`), which the kit uses for the chat's lines, the spinner and the session log (the log strips colors).
- Asked by the teacher (2026-09-29).

## Changes

- `friendlyToolLabel` returns the label in a secondary color (the kit's `ui.dim`, gray), for the chat's tool lines and the spinner.
- Check that agent-kit measures and cuts colored labels by their visible width (`fitWidth`), in full screen and inline, and in the Ctrl+O summary. `session.log` keeps plain text.
- `run`/`ingest`/`explore` use the same labels in the console renderer (`[action] …`): check they read well dimmed, or dim only for the chat.
- If agent-kit adopts a quieter color for tool lines itself (every agent would want it), drop this and take it with `upgrade-agent-kit`.

## Acceptance

- In a chat, tool lines are gray and the agent's replies keep the terminal's color. Nothing is cut or misaligned at 80 and 130 columns, in full screen and `--inline`.
- `session.log` has no color codes.
- `verify` passes, and a screenshot of a chat with both is kept in the test report.
