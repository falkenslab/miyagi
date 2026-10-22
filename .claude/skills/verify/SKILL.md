---
name: verify
description: Run the full quality gate for miyagi (typecheck, lint, build, system prompts rendered for every session kind and mode, skill/command catalog) and report the result. Use before committing, before a release, and after any change under src/, prompts/ or plugin/.
---

# Verify miyagi

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
node .claude/skills/verify/check-neutral-skills.mjs
node .claude/skills/verify/check-activity-register.mjs
node .claude/skills/verify/check-validators.mjs
node .claude/skills/verify/check-drafts-toolbox.mjs
node .claude/skills/verify/check-file-scope.mjs
node .claude/skills/update-docs/check-docs.mjs
node dist/cli.js skills --dir . > /dev/null && node dist/cli.js commands --dir . > /dev/null
```

`check-prompts.mjs` builds the system prompt for `run` (guided, interactive, autonomous),
`chat`, `ingest` and `explore`, with and without a pending migration, from `dist/`, and fails
if:
- any `{{placeholder}}` is left unsubstituted;
- a section that must be there is missing, or one that must not be there is present
  (the classroom sections without a classroom, the course layer in `explore`, the approval step
  in `autonomous`, any `browser_` tool: miyagi has none...);
- a prompt mentions a leftover of the agents this one came from (`student-agent`,
  `moodle-agent`, `context/`, `knowledge/README.md`, `save_to_knowledge`).

`check-references.mjs` fails if a skill, a command or a prompt names a skill or subagent that
doesn't exist — what a merge or a rename leaves behind. After renaming or merging skills, also
update the docs site (`update-docs`; `check-docs.mjs` catches a missing skill) and `.minispec/core/architecture.md`, which it doesn't read.

`check-neutral-skills.mjs` fails if a skill or command in `plugin/` names Moodle, a Moodle URL, a
moodle-mcp tool or a browser action: miyagi's skills say the teaching act, the classroom
extension's skills say how (ADR-021).

`check-activity-register.mjs` counts the phases of sample `course/drafts` pages (an old one
without phases counts as hidden), checks the end-of-session line and which paths plan mode
lets the agent write (only `drafts/<slug>/plan.md`). Change it with the register's format.

`check-validators.mjs` runs the upload validators on `fixtures/validators/`: real GIFT files from
sandbox tests (the loops quiz whose indentation Moodle lost, before and after its fix), GIFT
and HTML files broken on purpose, and the upload gate's hook itself on moodle-teacher's
`import_questions` (GIFT as a file and as text; Moodle XML left alone). Each fixture has its
expected errors by line. When a real upload gets through broken, or a good one is refused,
add the file there with the rule that fixes it.

`check-drafts-toolbox.mjs` exercises the drafts toolbox in a throwaway folder: every refusal
(paths out of drafts/ by "..", absolute path or link, file:// and data: URLs, a zip-slip
archive, downloads and unzips over the limits, drafts/ itself as a target) and a round trip
(copy, zip, unzip, info, and a PDF when Chrome is installed; skipped, and said, otherwise).
A new tool or limit gets its refusal here in the same change.

`check-file-scope.mjs` builds a session's file scope from `dist/` and checks that every file
holding a secret (the workspace's `config.json` and `.env`, `~/.miyagi/config.json`, its legacy
copy, the SDK's `~/.claude/.credentials.json`) can't be read, searched or written, while
`sources/` and `drafts/` still work. A new file with a secret goes in `secretFilePaths()` and
here in the same change.

`check-docs.mjs` (from the `update-docs` skill) fails if the docs site doesn't mention a skill,
a command, a CLI subcommand or a config key the code has. When it fails, run `update-docs`.

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
