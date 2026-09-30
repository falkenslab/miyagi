# ADR-007: The chat is agent-kit's full-screen Ink chat

## Decision

`miyagi chat` runs agent-kit's `runChatInk()` in full screen. `--inline` keeps the Ink chat in the terminal's scrollback, and `--plain` (or no TTY) falls back to the readline chat. Setting up a workspace from `run` or `chat` saves it and exits, so a session always starts from its own command.

## Motivation

The Ink chat shows what the teacher needs to follow a long session: the reply with its markdown, tool calls folded into a line, numbered approval panels, a status bar with the mode, and Shift+Tab between guided and interactive. Full screen keeps the prompt and the header in place and adds scrolling and mouse selection. Tested end to end in `tests/2026-09-28T01-10-ink-chat-fullscreen/`.

Starting the chat right after the setup wizard's inquirer prompts, in the same process, is the case this avoids.

## Consequences

- The header is one line cut to the terminal's width: its fields carry short values.
- The screen no longer equals `session.log`: the log stays the plain-text record.
- The chat's system prompt must fit both guided and interactive, since the mode can change mid-session.
- Rendering bugs of the Ink chat are fixed in agent-kit, not worked around here.
