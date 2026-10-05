# The agent can read and list any folder of the computer

Issue: [#42](https://github.com/falkenslab/miyagi/issues/42)

## Problem

The agent and its subagents can `Read` any file the teacher's OS user can read, and `Glob` any folder beside the workspace (`~/Documents`, `~/.ssh`, `~/Downloads`, other projects). Only the workspace's `config.json` and `.env`, the files in `secretFilePaths()` (the Claude token and the SDK's credentials, since `197975d`) and `knowledge/` are refused. Besides other secrets, a teacher's computer holds student data outside the workspace (submissions downloaded, class lists, other courses), which miyagi must never read (ADR-005, ADR-017). An agent reading untrusted content (submissions, forum posts, web pages) could be led to read a file and put it in a reply, a knowledge page or a post.

## Cause

agent-kit's file scope gate allow-lists `Write`/`Edit` and `Grep` but only deny-lists `Read`, and `Glob` is only refused around the knowledge folder; it doesn't check `deniedPaths` either. Reported upstream: falkenslab/agent-kit#28. miyagi passes no read policy because the kit has no option for one.

## Solution

- **Interim, in miyagi (done)**: `sensitivePaths()` denies the most obvious places too (`~/.ssh`, `~/.aws`, `~/.azure`, `~/.gnupg`, `~/.kube`, `~/.npmrc`, `~/.git-credentials`, `~/.netrc`, `~/.pypirc`, `~/.config/gh`, `~/.docker/config.json`, the macOS keychain, the browsers' profile folders on Windows, macOS and Linux), checked by `check-file-scope.mjs`; the docs warn that reading outside the course isn't closed yet. Knowing that a deny-list can't cover student data elsewhere nor every spelling of a path, and that `Glob` ignores it until the kit changes.
- **With the kit's `readableDirs`**: miyagi declares what it reads: `sources/`, `drafts/`, `practice/`, `plugin/` and the installed extensions' folders (`~/.miyagi/extensions/`); the kit adds its own (the session's tool results, the run folder, its plugins) and keeps `knowledge/` behind its tools. `secretFilePaths()` stays as the files denied inside what's allowed.
- `docs/content/avanzado/seguridad-y-privacidad.md` says what the agent can read, plainly.
- `upgrade-agent-kit` to the version that brings it.

## Verification

- `check-file-scope.mjs` grows: `Read` of a file in a sibling folder of the workspace and in `~/.ssh`, and a `Glob` of `~/Documents`, all refused; `Read` of a source, a skill file of `plugin/` and a draft still allowed.
- A sandbox run that loads skills and reads a large tool result (as `explore` does) works as before; `smoke-ingest` passes.
- In a real session, asking the agent to read a file outside the workspace ends in the gate's refusal.
