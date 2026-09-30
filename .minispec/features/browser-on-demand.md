# Open Moodle only when a request needs it

Issue: [#4](https://github.com/falkenslab/teacher-agent/issues/4)

## Goal

In `chat`, start from the knowledge base and open the browser (log into Moodle) only when something the teacher asks needs the live course; for exploring the course on its own initiative, ask first.

## Context

- Every chat logs into Moodle before the teacher says anything:
  - the opening message (`prompts/messages/chat-opening-teacher.md`) says "Log into Moodle and enter the given course";
  - `teacher-chat.md` says "At the start of the conversation, log into Moodle".
- The browser itself is lazy: Playwright MCP only launches it on the first browser tool call. It's the prompt that makes that call happen.
- Much of a chat needs no Moodle at all:
  - asking about the course from what the agent already knows (`knowledge/`);
  - ingesting new material from `sources/` (`/knowledge:ingest`);
  - planning a unit or drafting resources in `drafts/`, before uploading them.

  Logging in first costs a minute and tokens, and opens a Chrome window the teacher didn't ask for.
- The teacher asked (2026-09-29): don't open the browser until a request needs it; if the agent wants to explore the course, ask first.

## Changes

- **Opening message:** greet from the knowledge base, with no browser.
  - Say what the agent knows of the course: last update in `log.md`, pending hidden drafts, open tasks.
  - If the knowledge base is empty or missing, say so and offer to explore the course (with `explore`, or in the chat) or to ingest `sources/`.
- **`teacher-chat.md`, "How to work":** answer from `knowledge/` when it's enough, and say how fresh that is.
  - Use the browser only when the request needs the live course (current submissions, grades, forum, whatever changed since the last notes) or acts in it (publish, grade, create).
  - If the agent would browse only to explore or refresh its notes, it asks first.
- **Login on demand:** `credentials-configured.md` and `credentials-manual-login.md` log in right before the first browser action, not at the start. Manual login still works: the manual-intervention tool is there when a request needs it.
- **Unchanged:**
  - `run` and `explore`, whose mission is in Moodle, keep logging in at the start;
  - `ingest` has no browser.
- `check-prompts.mjs`: the chat's prompt no longer says to log in at the start, and the opening message has no login.

## Acceptance

- `teacher-agent chat` in a workspace with a knowledge base:
  - no browser call and no Chrome window until the teacher asks for something that needs Moodle;
  - the greeting summarizes what the agent knows.
- "¿Qué temas tiene el curso?" is answered from `knowledge/` without browsing, saying where it comes from.
- "¿Hay entregas pendientes?" logs in and checks Moodle.
- In a workspace with no knowledge base, the agent offers to explore or ingest, and doesn't browse until the teacher says yes.
- `verify` passes, and a chat against the sandbox is written up in `tests/`.
