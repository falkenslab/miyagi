# The page shows nothing of what a subagent is doing

Issue: [#63](https://github.com/falkenslab/miyagi/issues/63)

## Problem

While a subagent works (the researcher looking for an official curriculum, the pedagogy reviewer), the page only shows the main agent's "Agent" line with a spinner. In a real session the first researcher made 42 calls in 8 minutes and the teacher saw none of them: it looked stuck, and the teacher couldn't tell whether to wait or stop it. The terminal chat does show it.

## Cause

agent-kit's chat state carries `subagentActivity` (the label of the subagent's latest action), and its terminal view draws it (`tui/ink/SessionView.js`). The host sends the whole state to the page, but the page's `ChatState` (`gui/src/types.ts`) doesn't have the field and `Transcript.tsx` only draws `chat.activity` (line 166), so a subagent's work never shows.

## Solution

To do:
- `gui/src/types.ts`: `subagentActivity: string | null`.
- `Transcript.tsx`: while the running call is a subagent, under its line, dim: what it's doing now (`subagentActivity`), how long it has been working and how many actions it has taken, updated as they come ("Investigando · Leyendo boe.es · 4 min · 23 acciones").
- The count, if the kit doesn't give it: from the changes of `subagentActivity`, or a kit field (ask before touching `../agent-kit`).
- `check-page.mjs`: during a turn that calls the researcher, the subagent's line shows an action that changes.
- Docs: the chat page says what the subagent line shows.

## Verification

To do: a real session asking for an official curriculum shows the researcher's reads one after another under its line; `check-page.mjs` passes.
