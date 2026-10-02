# English words slip into a Spanish chat

Issue: [#26](https://github.com/falkenslab/miyagi/issues/26)

## Problem

In the SQL course test, with `agent.language: "español"`, the agent wrote some lines of its chat narration in English or half English: «I click "Modificar nombre de sección"…», «No es nombre de contenedor, fine.», «All correcto: 4+3+2+1 = 10». What it published in Moodle was always in Spanish. Minor, but the teacher sees it in every screenshot of the tutorial.

## Cause

The system prompt and the skills are in English (a project convention), and the language rule (`prompts/system/language.md`) covers what the agent tells the human, but the short narration between tool calls drifts to the language of the instructions it just read, mostly right after loading a skill.

## Solution

- `prompts/system/language.md`: state that every line the human sees in the chat, including one-line notes between actions, is in the conversation's language.
- If it persists, check agent-kit's own interstitial texts (none of these came from it).

## Verification

A chat in the sandbox in Spanish that loads several skills (a unit build): no English lines in `session.log`, checked with a grep for common English words in assistant text.
