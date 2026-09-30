# run, ingest and explore with the Ink progress view

## Goal

Show the one-shot sessions (`run`, `ingest`, `explore`) with agent-kit's Ink progress view: a spinner with the current action, the same approval panels as the chat and a status bar, instead of plain console lines.

## Context

- `runSession()` (`src/agent.ts`) renders one-shot runs with `createConsoleRenderer()`: `[action] …` lines, approvals as readline questions, no spinner. A `run` of the whole course lasts many minutes, and in guided mode its approvals look nothing like the chat's.
- agent-kit exports `createProgressView(options)`: the same `ConsoleRenderer` methods and the same text (so a log would match), plus a spinner, the chat's approval and manual-login panels (through an Ink interaction port until `close()`) and a status bar with the mode. Without a TTY or with `plain` it *is* the console renderer. Ctrl+C during a panel is passed on as SIGINT, so the current interrupt handling (first interrupts, second exits) keeps working.
- `close()` must be awaited before printing the session's end.

## Changes

- `runSession()` uses `createProgressView({ formatAction, toolPhrase, mode, plain })` for one-shot kinds; `--plain` (as in chat) or no TTY keeps the console. `close()` awaited before `printSessionEnd()`.
- The interrupt messages written through the view, as today.

## Acceptance

- `teacher-agent run --mode guided --task "…"` against the sandbox shows the spinner, the tool lines and an approval panel like the chat's; approving and rejecting work; Ctrl+C interrupts and the end message prints once, below the view.
- `teacher-agent ingest` (smoke-ingest) works and its log is readable; `ingest </dev/null` (no TTY) prints plain lines as before.
- `verify` passes.
