# ADR-010: agent-kit from npm, at an exact version

## Decision

`@falkenslab/agent-kit` is a normal npm dependency pinned to an exact version (`"0.10.1"`, no range), with no `allowScripts` entry. Supersedes ADR-001.

## Motivation

The kit is now published to npm (agent-kit's ADR-017). The tarball repacked into a teacher-agent release (ADR-001) worked around its absence, at the cost of a manual pack, upload and repoint on every upgrade, with no link back to the kit's own tag. A git dependency or the tag's `.tar.gz` still can't be used: the first runs `prepare` without `tsc` during a user's `npm install -g`, the second has no `dist/`.

An exact version, not a `^` range: while the kit's API is 0.x, a minor can break, and users installing teacher-agent get whatever the range resolves to at install time, not the version it was tested with.

## Consequences

- Upgrading is `npm install --save-exact @falkenslab/agent-kit@X.Y.Z` plus `verify` (`upgrade-agent-kit`).
- The kit tarballs attached to older teacher-agent releases stay: those versions still install from them.
- Unreleased kit changes are still tried with `try-agent-kit-local`, and the lockfile restores the pinned version afterwards.
