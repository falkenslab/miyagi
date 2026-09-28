# Resume a conversation from the workspace

## Goal

Let the teacher pick up an earlier chat with the agent where it was left (`teacher-agent chat --continue` or `--resume`), with the conversation stored in and read from the course's workspace, never from `~/.claude`.

## Context

- Each `teacher-agent chat` starts with no memory of the previous conversation. What carries over is the knowledge base (`knowledge/`), which the agent reads at the start, and the teacher's typed prompts for ↑/Ctrl+R (`sessions/history.jsonl`).
- A decision agreed in one session ("package it as SCORM, you choose the weight") is lost in the next unless the agent wrote it down.
- The conversation itself is saved only by the Claude SDK, in `~/.claude/projects/<cwd>/`, outside the workspace: not where the teacher looks, not backed up or moved with the course, and not something teacher-agent can resume today (it passes no `resume` option).
- The SDK can mirror a conversation to a store of our own and resume from it: `Options.sessionStore` (`append`, `load`, `listSessions`, `listSubkeys`), marked `@alpha` in SDK 0.3.266. On resume it calls `load()` and replays what the store returns, so the workspace becomes the source. It still writes its own copy under `CLAUDE_CONFIG_DIR` (local write first, then the mirror).
- This is all teacher-agent side: `options.sessionStore` and `options.resume` can be set after `buildSessionOptions()`, like `maxTurns`. No agent-kit change.

## Changes

- A workspace session store (`src/conversationStore.ts`):
  - every chat conversation goes to `sessions/conversations/<sessionId>.jsonl`, and a subagent's to `…/<sessionId>/<subpath>.jsonl`;
  - entries are appended as the SDK sends them, idempotent by `uuid`;
  - `load` reads them back;
  - `listSessions` lists them by modification time;
  - each chat's session folder records which conversation it used (`sessions/<ts>-chat/conversation.txt`).
- `teacher-agent chat`:
  - `--continue` resumes the workspace's latest conversation;
  - `--resume` lists recent ones (date, first message, number of turns) to pick one, or takes an id.
  - A resumed session:
    - doesn't send the opening message again;
    - shows the last exchanges in the chat's welcome text, since the screen starts empty;
    - logs into Moodle again when it needs to (the browser is new).
  - An approval from the earlier session never counts for the publish gate (a new process).
- Chat only: `run`, `ingest` and `explore` are one-shot and keep starting fresh.
- Decide whether to also keep the SDK's own copy out of `~/.claude`, by pointing `CLAUDE_CONFIG_DIR` at a folder inside the session. Check first what else that directory holds (settings, credentials, caches) before moving it.
- If `sessionStore` changes while it's `@alpha`, the store is the only place to adapt. Pin the SDK version this was tested with in `stack.md`.
- README/CHEATSHEET: how to resume, and what does and doesn't carry over (the conversation yes; the browser session, approvals and the screen's history no).

## Acceptance

- In a chat against the sandbox, agree something ("the review quiz doesn't count for the grade"), exit, then `teacher-agent chat --continue`: the agent knows it without reading it from `knowledge/`, and doesn't greet as a new session.
- The conversation file is in `sessions/conversations/` of the workspace. Copying the workspace to another folder and resuming there works.
- `--resume` lists earlier conversations with their date and first message, and resumes the chosen one.
- `verify` passes.
