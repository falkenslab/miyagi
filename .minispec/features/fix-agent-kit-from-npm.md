# agent-kit repacked into teacher-agent's releases instead of coming from npm

## Problem

- The dependency points at a copy of agent-kit hosted in a teacher-agent release (`releases/download/v0.4.0/falkenslab-agent-kit-0.10.0.tgz`), not at the kit's own source.
- Every kit upgrade means cloning the tag, `npm pack`, uploading to a teacher-agent release and repointing `package.json` (`upgrade-agent-kit`). It's easy to get wrong and hard to trace back to the kit's tag.
- The obvious alternatives don't work:
  - `git+https://…/agent-kit.git#v0.10.0`: npm runs `prepare` (`tsc`) during the user's `npm install -g` and fails, because `tsc` isn't installed there.
  - `…/archive/refs/tags/v0.10.0.tar.gz`: installs fine, but it's the source without `dist/`, and npm doesn't run `prepare` for a remote tarball. `main` (`./dist/index.js`) is missing and teacher-agent fails when it starts.

## Cause

- agent-kit is `private: true` and not published to npm (its ADR-012). `dist/` isn't in git, so only an `npm pack` output is installable, and nothing publishes one.
- teacher-agent's ADR-001 works around it by hosting that tarball itself.

## Solution

- In agent-kit (its own repo, its own decision):
  - Drop `private: true`.
  - Publish `@falkenslab/agent-kit` to npmjs as a public scoped package, from its release tag. `prepublishOnly` builds `dist/`, and `files` already limits the contents.
  - Write an ADR that supersedes its ADR-012.
- In teacher-agent:
  - `"@falkenslab/agent-kit": "^0.10.0"` or an exact version (while the API is 0.x, a minor can break, so pin `~0.10.0` or `0.10.0`).
  - Remove the `allowScripts` entry for the kit.
  - Supersede ADR-001 with a new ADR, update the principle "agent-kit comes from a release tarball" in `principles.md`, and update `stack.md`.
  - `upgrade-agent-kit` becomes `npm install @falkenslab/agent-kit@X.Y.Z` + `verify`.
  - `try-agent-kit-local` and `release` stop mentioning the tarball; so does `CLAUDE.md` (the "Releasing" section).
- The kit tarballs already attached to teacher-agent releases stay: old teacher-agent versions still install from them.

## Verification

- `npm view @falkenslab/agent-kit@0.10.0 dist.tarball` resolves, and the tarball contains `dist/index.js`.
- `package.json` no longer names any `releases/download/…agent-kit…` URL; `npm install` from a clean `node_modules` works and `verify` passes.
- `npm pack` of teacher-agent, then `npm install -g ./teacher-agent.tgz` on a clean machine (or a clean `npm_config_prefix`): `teacher-agent --version` and `teacher-agent --help` run.
- `grep -rn "falkenslab-agent-kit-.*tgz" .minispec .claude CLAUDE.md` only finds the superseded ADR-001.
