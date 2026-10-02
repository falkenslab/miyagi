---
name: commit
description: Create atomic commits for miyagi following the repo's conventions (Conventional Commits, Spanish messages, one logical change per commit, split mixed files by hunk). Use whenever the user asks to commit, or when finishing a piece of work that should be committed.
---

# Commits for miyagi

Commit only when the user asked, or when they asked for a piece of work "done" that
obviously ends in a commit. Never push unless they also asked to push. The repo is
**public**: anything committed is visible to everyone.

## 1. Understand what changed

`git status --short` and `git diff --stat`, then read the diffs. Other sessions may have
touched the repo: commit only what belongs to the work at hand and mention anything else.
Never commit `dist/`, `node_modules/`, `*.tgz` or anything from a workspace (`config.json`,
`.env`, `sessions/`, a test workspace left in the repo by mistake), and never a Moodle
password or Claude token — grep the staged diff for any credential you handled in the session
(e.g. the sandbox's, from its `.env`).

`node_modules/@falkenslab/agent-kit` as a symlink means a local-kit trial is going on
(`try-agent-kit-local`): don't commit `package.json`/`package-lock.json` changes from it.

## 2. Verify

Run the `verify` skill. Don't commit a tree that fails it.

If the change touches `src/`, `plugin/`, `prompts/`, `package.json` or `README.md`, or anything a
teacher sees, run the `update-docs` skill too: the docs site (`docs/`) is updated in the same
commit as the change it describes, or in a `docs(site)` commit right before it.

## 3. Group

One logical change per commit, ordered so each builds on the previous ones: a dependency
bump on its own (`build(deps)`), a feature with the prompts and code it needs, docs on their
own when they're not part of a feature.

- Stage by path (`git add <paths>`), never `git add -A` blindly; check `git status` after.
- A file mixing two changes (`src/agent.ts` often does): stage one change's hunks only —
  `git diff -U0 <file>` to a patch, keep the hunks you want, `git apply --cached --unidiff-zero`
  — then check with `git diff --cached`.

## 4. Message

`type(scope): descripción`, lowercase type, no trailing period, **in Spanish** (identifiers,
paths and skill names stay as they are). Types: `feat`, `fix`, `refactor`, `docs`, `build`,
`chore`. Scopes in use: `cli`, `workspace`, `knowledge`, `plugin`, `prompts`, `deps`,
`claude`, `release`.

The body explains why — the problem, the constraint, what was confirmed empirically — not
the list of edits; wrap at ~80 columns. Mention what was verified and how (a real ingest, a
session against the sandbox...). End with the attribution trailer the session's instructions
require. Pass the message through a heredoc.

## 5. Finish

`git status --short` (clean unless you deliberately left something) and
`git log --oneline -n <commits made>`. Report the commits. Never `--no-verify`, never amend a
pushed commit, never force-push.
