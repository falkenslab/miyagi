# agent-kit repacked into teacher-agent's releases instead of coming from npm

## Problem

- The dependency points at a copy of agent-kit hosted in a teacher-agent release (`releases/download/v0.4.0/falkenslab-agent-kit-0.10.0.tgz`), not at the kit's own package.
- Every kit upgrade means cloning the tag, `npm pack`, uploading to a teacher-agent release and repointing `package.json` (`upgrade-agent-kit`). It's easy to get wrong and hard to trace back to the kit's tag.
- Neither `git+https://…/agent-kit.git#vX` (npm runs `prepare` without `tsc` in the user's `npm install -g`) nor the tag's `.tar.gz` (source without `dist/`) installs.

## Cause

- agent-kit wasn't published to npm (its ADR-012), and teacher-agent's ADR-001 worked around it by hosting the tarball itself.
- Fixed on the kit's side: ADR-017 publishes it to npm, and `@falkenslab/agent-kit@0.10.1` is there. Versions up to 0.10.0 exist only as git tags.

## Solution

- `"@falkenslab/agent-kit": "0.10.1"` (exact while the API is 0.x), with a plain `npm install`, and no `allowScripts` entry for the kit.
- Supersede ADR-001 with a new ADR, change the principle "agent-kit comes from a release tarball" in `principles.md`, and update `stack.md`.
- `upgrade-agent-kit` becomes `npm install @falkenslab/agent-kit@X.Y.Z` + `verify`. `try-agent-kit-local`, `release` and `CLAUDE.md` ("Releasing") stop mentioning the tarball.
- The kit tarballs already attached to teacher-agent releases stay: old teacher-agent versions still install from them.

## Verification

- `package.json` no longer names any `releases/download/…agent-kit…` URL; `npm install` from a clean `node_modules` works and `verify` passes.
- `npm pack` of teacher-agent, then `npm install -g ./teacher-agent.tgz` in a clean `npm_config_prefix`: `teacher-agent --version` and `teacher-agent --help` run.
- `grep -rn "falkenslab-agent-kit-.*tgz" .minispec .claude CLAUDE.md` only finds the superseded ADR-001.
