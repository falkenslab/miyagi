# Students' names in the page, aliases for the agent

Issue: [#109](https://github.com/falkenslab/miyagi/issues/109)

## Goal

The app and the web version show each student's real name where moodle-mcp gives the agent an alias, and turn a name the teacher writes back into its alias, so names never reach the model.

## Context

- moodle-teacher runs moodle-mcp with `student_data: pseudonymize`: students reach the model as aliases (`A-7K3F9Q`), remembered in @falkenslab/pseudonym's encrypted directory (`%APPDATA%\pseudonym`, `~/.config/pseudonym`), with its key beside it. The agent can't read that folder (`sensitivePaths()`, 93ac5f7).
- The teacher sees the aliases too: an approval of grades lists `A-7K3F9Q 6,5`, and they must look up who that is in Moodle.
- A name the teacher types in the chat ("¿cómo va Lucía Martín?") reaches the model as is.
- pseudonym's library exports only `redact`, `remember` and `resolve`; the way back is its CLI, for the person in charge (its ADR-007): `pseudonym aliases --service moodle@<host>` prints the service's people as CSV (alias,name).
- The host (`src/host/`) is the only path to the page: `send()` (events) and `act()`'s answers, plus `/api/drafts/file`. The terminal draws through agent-kit and keeps the aliases (decided: no names there).

## Changes

- `@falkenslab/pseudonym` at moodle-mcp's version, exact, for its CLI.
- `src/host/names.ts`: the subject's classroom service (`moodle@<host>`); the alias↔name list from the CLI (`process.execPath`, `ELECTRON_RUN_AS_NODE`), kept in memory only, read again when an unknown alias shows (at most every 10 s), then the page gets the state again.
  - `reveal(data)`: every string of an answer with each known alias as the name; the approval panel (`state.panel`) as "Name (A-…)".
  - `aliasify(text)`: the directory's full names (case and accent insensitive, whole words) as their aliases.
- `server.ts`: `reveal` on `state` and `automatic` events, on `act()` answers except the teacher's commands' editor, and on text previews of `drafts/`; `aliasify` on what goes to the agent: `send` (and a message joining a turn), `answer`, an action's form and item (`launch`), and the conversation search.
- An "Ocultar nombres" switch in the top bar while the list has people (to project in class, to take screenshots): the host sends aliases until it's turned back; not remembered, names again at every start.
- Docs: privacy page (the page shows names, the agent never gets them, the switch, the terminal keeps aliases), in Spanish and English.
- `check-host.mjs`: with a fake directory (`PSEUDONYM_HOME`, plain storage), an alias in the state shows as a name, the switch hides it, a name sent becomes its alias in the transcript.

- - -

## Acceptance

- In the sandbox, a grading approval in the app shows "Lucía Martín (A-…)"; the transcript and the session's files keep only aliases.
- The teacher writes "Lucía Martín" in the chat: the agent's transcript has her alias, the page shows her name.
- "Ocultar nombres" shows aliases everywhere at once; restarting the app shows names again.
- Without a classroom, or with `student_data: clear`, nothing changes.
- Report in `tests/`.

- - -
