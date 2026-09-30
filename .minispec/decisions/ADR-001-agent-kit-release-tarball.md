# ADR-001: agent-kit from a release tarball

> Superseded by ADR-010: agent-kit is now installed from npm.

## Decision

`@falkenslab/agent-kit` is a dependency on a built `npm pack` tarball attached to a miyagi GitHub release, with its `prepare` script denied in `allowScripts`.

## Motivation

agent-kit is not on npm. A git dependency breaks `npm install -g` for users (npm can't find `tsc` while preparing it). Bundling agent-kit drags in the Claude SDK's platform-specific binary (245 MB of Windows-only `claude.exe`).

## Consequences

Every agent-kit upgrade means packing it at its tag, attaching the tarball to a miyagi release and pointing `package.json` at that URL (`upgrade-agent-kit` skill). Unreleased kit changes are tried with `try-agent-kit-local` and undone before committing.
