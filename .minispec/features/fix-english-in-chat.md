# English words slip into a Spanish chat

Issue: [#26](https://github.com/falkenslab/miyagi/issues/26)

## Problem

In the SQL course test, with `agent.language: "español"`, the agent wrote some lines of its chat narration in English or half English: «I click "Modificar nombre de sección"…», «No es nombre de contenedor, fine.», «All correcto: 4+3+2+1 = 10». What it published in Moodle was always in Spanish. Minor, but the teacher sees it in every screenshot of the tutorial.

## Cause

The system prompt and the skills are in English (a project convention), and the language rule (`prompts/system/language.md`) covers what the agent tells the human, but the short narration between tool calls drifts to the language of the instructions it just read, mostly right after loading a skill.

## Solution

The rule this note first proposed (every line the human sees, the short notes between actions included, in the conversation's language) has been in `prompts/system/language.md` since 2026-09-29, and the slip still happens: on 2026-10-04, a Spanish `run` wrote "All 10 topic pages created. Now creating the main teaching-plan page…". A rule at the start of a long prompt isn't enough. Options, cheapest first:

- Repeat it where the drift starts: a line at the top of every skill ("Write to the human in the conversation's language, not this skill's"), checked by `check-references.mjs` or a new check.
- Ask agent-kit to restate the reply language next to each skill it loads, or in each turn's context, as it already does with the mode notes.
- Measure first: count English lines in the session logs of several runs before and after.

## Verification

Three Spanish runs that load several skills (a unit build, a `run` without a classroom, a grading run): no English lines in their logs, checked with a grep for common English words in assistant text.
