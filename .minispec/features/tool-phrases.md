# Say what the browser did in folded tool groups

## Goal

When the chat folds a group of tool calls into one line, count the browser's actions by what they did ("abrió 3 páginas, pulsó 5 veces") instead of "usó 8 herramientas".

## Context

- agent-kit folds a finished group of calls into a summary line built by `toolGroupSummary()`: each tool counts with a phrase, `[one, many]` with `{n}` for the count. The kit has phrases for its built-in tools (Read, Edit, WebFetch...) in its four languages; any other tool counts as "usó {n} herramientas".
- Most of a teacher-agent session is Playwright (`mcp__playwright__browser_*`) plus `request_human_approval`, so its summaries say almost nothing.
- `runChatInk()` and `createProgressView()` take `toolPhrase(toolName)` for the agent's own tools (agent-kit 0.12+). teacher-agent doesn't pass it.

## Changes

- `src/toolLabels.ts`: a `toolPhrase(toolName)` for the `browser_*` tools (navigate, click, type/fill form, snapshot, evaluate, find, file upload, screenshot, wait...) and the approval tool, from the catalog.
- `src/messages/`: the phrases in en, es, fr and de, as a `toolPhrases` group.
- Passed to `runChatInk()` (and to the one-shot view, see `ink-one-shot-view`).

## Acceptance

- In a chat against the sandbox, a folded group reads like "abrió 2 páginas, pulsó 3 veces, rellenó 1 formulario", in the chat's language. Unknown tools still count as "usó N herramientas".
- `verify` passes.
