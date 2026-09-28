# agent-kit 0.10.0 and the full-screen Ink chat

## Goal

Move to agent-kit 0.10.0 and switch `chat` from the readline UI to the kit's Ink chat, full screen by default.

## Context

- teacher-agent pins agent-kit 0.6.0 (tarball in the v0.1.0 release, ADR-001; `.minispec/core/stack.md`).
- `chat` calls `runChatTui()` (`src/agent.ts`, `runSession`): readline prompt, `tú>` / `teacher-agent>` labels, a welcome line, the header printed with `console.log` before it.
- agent-kit 0.10.0 brings `runChatInk()` (its ADR-014): reply streamed with markdown, tool calls folded into one line (Ctrl+O), approval panels, status bar, prompt suggestions, `@` file mentions, tab/taskbar state. It falls back to `runChatTui()` without a TTY or with `plain`.
- `fullscreen: true` (its ADR-015) draws the alternate screen: pinned header and prompt, own scrolling, mouse selection with right-click copy. Off by default in the kit.
- `buildSessionOptions()` now also returns a `modeControl` (its ADR-016): Shift+Tab switches guided ↔ interactive in the Ink chat.
- `run`, `ingest` and `explore` use `runQuery()` + `createConsoleRenderer()`; `createProgressView()` exists but is out of scope here.

## Changes

- Upgrade with the `upgrade-agent-kit` skill: pack 0.10.0 at its tag, attach it to a teacher-agent release, point `package.json` at it, update `stack.md`. Fix whatever 0.6 → 0.10 breaks (typecheck).
- `chat` uses `runChatInk()` with `fullscreen: true`, `mode`, `modeControl`, `header` (title `teacher-agent`, fields: workspace, course, session dir) and the existing `formatAction`, `initialPrompt`, `sessionLogPath`, `historyPath`.
- The Ink header replaces the `console.log` lines for `chat` (they'd be wiped by the alternate screen); `run`/`ingest`/`explore` keep them.
- Welcome text: drop the readline-specific hints (Esc, `/exit`); the Ink chat shows its own shortcuts.
- `--inline` flag on `chat` for the non-full-screen Ink chat, `--plain` for the readline one (`plain: true`).
- The chat's system prompt must fit both guided and interactive, now that the mode can change mid-session (ADR-016 of the kit): check `prompts/system/teacher-chat*`.
- Update `README.md`, `src/cli.ts` usage text and `.minispec/core/architecture.md` (chat → Ink, full screen).

- - -

## Acceptance

- `package.json` points at the 0.10.0 tarball; `verify` passes (typecheck, lint, build, `check-prompts.mjs`).
- `teacher-agent chat --dir <ws>` opens full screen with the header, the opening message streams in, PageUp/wheel scroll, Shift+Tab toggles guided/interactive in the status bar.
- A Moodle publication in chat shows the kit's approval panel and nothing is published without the teacher's answer (`student-impact-review`).
- Exiting (`/exit`, Ctrl+C) restores the terminal and prints the session-end message.
- `--inline` and `--plain` give the inline Ink chat and the readline chat; piped stdin falls back to readline.
- `session.log` still reads as before.
- Tried against moodle-sandbox (`sandbox-e2e`) on Windows Terminal, with a report in `tests/`.

- - -
