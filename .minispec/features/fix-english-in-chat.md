# English words slip into a Spanish chat

Issue: [#26](https://github.com/falkenslab/miyagi/issues/26)

## Problem

With `agent.language: "español"`, the agent writes some lines of its narration between tool calls in English: «I click "Modificar nombre de sección"…», «All correcto: 4+3+2+1 = 10» (SQL course test, 2026-10-01), «All 10 topic pages created. Now creating the main teaching-plan page…» (2026-10-04). What it publishes is always in Spanish, but the teacher reads these lines in the chat.

## Cause

The system prompt, the skills and most tool results are in English (a project convention), and the language rule (`prompts/system/language.md`, since 2026-09-29) sits at the start of a long prompt. The narration drifts to the language of what the model just read.

## Solution

- Done (36db3f2): every skill restates the rule under its title, checked by `check-references.mjs`. Three Spanish runs that loaded several skills had no English line (2026-10-22).
- Not enough: on 2026-10-25 a short Spanish `run` wrote «I'll read the whole document in parts to get the context right.» and «I'll read the rest of Annex II (sessions, calls, recovery)…» right after `Grep` and `Read` results, not after loading a skill (`tests/2026-10-25T17-57-normativa-docente/`). The drift follows any English context, so a line per skill can't cover it.
- Next: ask agent-kit to restate the reply language in each turn's context, next to the mode notes it already adds, so it's close to every model turn whatever came before; miyagi passes the conversation's language to it.

## Verification

Five Spanish runs that read sources with `Read`/`Grep` and load several skills (an ingest, a plan with norms, a unit build, a grading run, a short question about a source): no English line in their logs, checked with a grep for common English words in the assistant's text.
