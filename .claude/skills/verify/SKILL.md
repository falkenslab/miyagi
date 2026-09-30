---
name: verify
description: Run the full quality gate for teacher-agent (typecheck, lint, build, system prompts rendered for every session kind and mode, skill/command catalog) and report the result. Use before committing, before a release, and after any change under src/, prompts/ or plugin/.
---

# Verify teacher-agent

There are no unit tests yet, so the prompts themselves are part of the gate: most of this
agent's behavior lives in `prompts/` and `plugin/`, and a typo in a `{{placeholder}}` or a
section that silently stops being included only shows up when the prompt is rendered.

Run from the repo root, in this order, stopping at the first failure and reporting it:

```
npm run typecheck
npm run lint
npm run build
node .claude/skills/verify/check-prompts.mjs
node .claude/skills/verify/check-references.mjs
node .claude/skills/verify/check-publish-gate.mjs
node .claude/skills/verify/check-tool-labels.mjs
node .claude/skills/verify/check-validators.mjs
node dist/cli.js skills --dir . > /dev/null && node dist/cli.js commands --dir . > /dev/null
```

`check-prompts.mjs` builds the system prompt for `run` (guided, interactive, autonomous),
`chat`, `ingest` and `explore`, with and without a pending migration, from `dist/`, and fails
if:
- any `{{placeholder}}` is left unsubstituted;
- a section that must be there is missing, or one that must not be there is present
  (browser-only sections in `ingest`, the course layer in `explore`, the approval step outside
  `guided`/`chat`...);
- a prompt mentions a leftover of the agents this one came from (`student-agent`,
  `moodle-agent`, `context/`, `knowledge/README.md`, `save_to_knowledge`).

`check-references.mjs` fails if a skill, a command or a prompt names a skill or subagent that
doesn't exist — what a merge or a rename leaves behind. After renaming or merging skills, also
update `README.md` (skills table) and `.minispec/core/architecture.md`, which it doesn't read.

`check-publish-gate.mjs` classifies real tool calls (clicks, scripts, navigations taken from
test transcripts) with the publish gate's `isPublishAction()` and fails on any that would
publish without being caught, or be stopped without publishing. When a test finds a
publishing action the gate missed, add it there with the fix.

`check-tool-labels.mjs` runs `classifyEvaluate()` on real `browser_evaluate` calls and fails
if one is labelled as the wrong kind (writing, acting, reading a table, the form...) or if
its chat line shows code. When a session shows a JavaScript call with a misleading or
generic label, add it there with the rule that fixes it.

`check-validators.mjs` runs the upload validators on `fixtures/validators/`: real GIFT files from
sandbox tests (the loops quiz whose indentation Moodle lost, before and after its fix), GIFT
and HTML files broken on purpose, and the upload gate's hook itself. Each fixture has its
expected errors by line. When a real upload gets through broken, or a good one is refused,
add the file there with the rule that fixes it.

When you add a prompt section that depends on the session kind, the mode or a config flag,
add it to the `SECTIONS` table in `check-prompts.mjs` in the same change.

Also check the plugin, which the renders don't cover:

```
grep -rn -E "context/|knowledge/README|save_to_knowledge|<topic>/|moodle-agent|\(as a student\)|\(student\)|student side" plugin/
```

must print nothing (the teacher's skills were ported from moodle-agent's shared/teacher
plugins, where skills spoke to both roles — "a post (as a student)"; those are the patterns
that used to be there. "as a student would see it" is fine).

Notes:
- `dist/` is what `check-prompts.mjs` and the CLI read: always `npm run build` first.
- Never "fix" a failure by weakening a lint rule or deleting an expectation. Find the cause;
  if the fix is out of scope, report it instead.
- If `node_modules/@falkenslab/agent-kit` is a symlink to `../agent-kit` (a local-kit trial,
  see `try-agent-kit-local`), say so in the report: the result isn't valid for the pinned kit.

Report only: what ran, pass/fail per step, and the exact error for any failure.
