# Link a classroom

Issue: [#41](https://github.com/falkenslab/miyagi/issues/41)

## Goal

Linking a classroom is optional and can be done at any time: `init` doesn't push it, the chat links one with `/moodle:link`, and the classroom says what type it is (ADR-013, ADR-020).

## Context

- Since `classroom-optional`, `init` asks first "¿Conectar un aula Moodle ahora?" (default yes), and `init` on a workspace without a classroom offers to connect one (`src/menu.ts`, `src/cli.ts`).
- `config.json`'s `classroom` has no type: it's assumed to be Moodle.
- Linking handles credentials, which never reach the model (ADR-004): it can't be a plugin command the model reads; it has to be a local command run by code.
- agent-kit's `runChatInk` has no local-command API (`/copy`, `/resume`, `/plan` are hardcoded) and a session can't change its tools without reopening.
- With `moodle-mcp` (ADR-019) the link signs in through a window and keeps no password; until then it asks for what `init` asks today.

## Changes

- **Type.** `classroom.type: "moodle"`, assumed when missing and written on the next save; read through one helper so `extensions` can move it to `classrooms[]` unchanged.
- **`init`.** Asks about the subject first (name, description, tone, language, instructions); at the end, "¿Quieres conectar ya un aula? También puedes hacerlo luego desde el chat con /moodle:link", default no.
- **CLI.** `miyagi link moodle [<course URL>]` and `miyagi unlink`, with the same questions as `init`'s classroom; `init` on a workspace without a classroom points to them instead of asking.
- **Chat.** Local commands, in both chats:
  - `/moodle:link`: asks for the course URL (and the credentials while `moodle-mcp` isn't there) in the chat's own wizard; signs in and checks that the account can edit that course before saving; saves the classroom and reopens the session in the same run folder, now with the browser, the gates and the classroom's prompt sections.
  - `/moodle:unlink`: after a confirmation, removes the classroom from the workspace and reopens without a browser; nothing changes in Moodle, and the classroom's knowledge pages stay.
  - `/moodle:status`: the linked classroom, its course and whether the session is signed in.
  - `/connect`: the core's own, lists the classroom types available (Moodle only for now) and hands over to the chosen one's link.
- The chat's opening without a classroom names `/moodle:link`.
- agent-kit request: `InkChatOptions.localCommands` (name, description, handler) with a `reopen()` for the handler, also in the plain chat.
- Messages (en/es/fr/de); docs: "Conectar tu aula" in the guide, the chat's commands, `miyagi link` in the reference; `check-docs.mjs` for the new commands.

## Acceptance

- `init` with every default ends without a classroom; answering yes at the end gives the same workspace as today.
- In a chat without a classroom, `/moodle:link` with the sandbox course links it, and the next request that needs Moodle uses the browser without leaving the conversation; with a course where the account isn't a teacher, it refuses and says why.
- `/moodle:unlink` then a request: no browser; the knowledge base is intact.
- No password or token appears in any transcript or in the conversation; `check-prompts.mjs` unchanged with and without a classroom; report in `tests/`.
