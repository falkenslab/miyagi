# Write to miyagi while it works

Issue: [#62](https://github.com/falkenslab/miyagi/issues/62)

## Goal

While miyagi works on a turn, the teacher can still send it messages (a question, a correction, "skip that, do this"), which it reads as soon as it can, as in Claude Code, without stopping the turn.

## Context

- Today a message can't be sent while a turn runs, blocked three times over:
  - the composer: Enter does nothing and send becomes stop (`gui/src/components/Composer.tsx:138`);
  - the host: `send` answers `{ error: "busy" }` (`src/host/server.ts:356`);
  - agent-kit: `send()` always starts a new turn (`runTurn`) and waits for it; two at once would overwrite each other's `turnDone`.
- The mechanism is there: each turn goes to the SDK through the session's input queue (`createInputQueue`, `queue.push`), open the whole session — what Claude Code uses to take messages mid-task.
- Seen in a real session: miyagi had a subagent researching the curriculum and the teacher couldn't add anything until it finished.
- A message sent while a subagent works reaches the main agent, which waits for the subagent: it is read when the subagent returns. Cutting the research short is still the stop button.
- The terminal chat (agent-kit's TUI) has the same limit; this feature is the page's, the terminal follows if the kit's change covers it.

## Changes

- **agent-kit** (a kit release first; ask before touching `../agent-kit`):
  - a way to send during a turn: the line goes into the running turn's input queue, with no new turn, no new turn summary, and the turn still ends once;
  - the person's message in the transcript, marked as queued until the agent reads it (an event or a field the page can show);
  - mode, language and extension notices still go with the next message, as today.
- **Host** (`src/host/server.ts`): `send` while busy goes through the kit's new call instead of `busy`; slash commands and "exit" while busy still refused, with a notice.
- **Composer** (`Composer.tsx`): typing and Enter work while busy; send and stop both shown while busy (send when there's text); placeholder says it will reach miyagi as soon as it can.
- **Transcript**: a queued message under the turn's activity, dim, "en cola", until it's read.
- **Docs**: the chat page (`docs/content/guia/chat.md`, `avanzado/navegador.md`, English too): writing while it works.
- **check-page.mjs**: during a long turn, a message sent is shown queued, then the agent's reply answers it, and the turn ends once.
- Upgrade the kit (`upgrade-agent-kit`).

## Acceptance

- While miyagi works (a tool running, a subagent researching), the teacher can type and send; the message appears queued and the reply takes it into account without the turn being stopped.
- A turn with messages sent during it ends once, with one "✻ n s".
- Stop still interrupts the turn; an approval pending still takes the composer's place (answering it comes first).
- A slash command sent while busy is refused with a notice, not run.
- `verify` and `check-page.mjs` pass.
