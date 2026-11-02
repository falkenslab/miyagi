# A side panel with the turn's whole progress

Issue: [#70](https://github.com/falkenslab/miyagi/issues/70)

## Goal

Opening a turn's actions shows, in a panel to the right of the chat, everything miyagi and its subagents are doing in that turn, live, so a long task can be followed without the conversation filling up.

## Context

- A turn's actions are one dim line in the chat; opened, the list unfolds inline (`gui/src/components/Transcript.tsx`, `Tools`). With a researcher making 40 reads, that list pushes the conversation away.
- #63 added, under a working subagent's line, what it's doing now, for how long and how many actions. This panel is the detail behind that line.
- What the page already gets (agent-kit's transcript): each call's label and result (`isError`, a result line), and for a subagent call the labels of its actions (`children`). Not there: a subagent action's result, nor when any call started or ended.
- Asked by the teacher (2026-11-02) while testing the desktop app.

## Changes

- **Prototype first** at 1440, 1024 and 390 px (with the side menu open and closed), approved before code.
- **Opening it**: the turn's action line (and the subagent's line under it) opens the panel instead of unfolding inline; Esc, its ✕ or tapping outside closes it; remembered per session whether it was open.
- **Content**, for the turn chosen (the running one by default):
  - each call in order, ✓/✕/…, its label and result line; a subagent call unfolded with its actions;
  - live while the turn runs, following the end unless the teacher scrolled up;
  - at the top: the turn's elapsed time and Stop;
  - the turn's task list, if any (the same as the pill over the composer).
- **Widths**: docked beside the chat at ≥1280 px; a drawer over the chat between 761 and 1279 px; a full-height sheet on a phone.
- **Not in the panel**: approvals and questions stay in the composer's place.
- **More detail, later** (needs agent-kit, ask before touching `../agent-kit`): a subagent action's result and each call's start and end, for "this read took 20 s" and failed steps inside a subagent.
- **Docs**: `avanzado/navegador.md` (both languages).
- `check-page.mjs`: during a subagent turn, the line opens the panel with its actions growing; Esc closes it; at 1440 it sits beside the chat with no horizontal scroll, at 1024 over it, at 390 as a sheet; 44 px targets.

## Acceptance

- During a research with a subagent, opening its line shows the panel with each of its actions appearing as they happen, and the chat stays readable beside it (≥1280 px) or under it.
- An approval asked while the panel is open still shows in the composer's place.
- `verify` and `check-page.mjs` pass at 360–1920 px in both themes.
