# Releases built by GitHub Actions

Issue: [#115](https://github.com/falkenslab/miyagi/issues/115)

## Goal

Pushing a `vX.Y.Z` tag builds, checks and attaches `miyagi.tgz` and `miyagi-setup.exe` to a draft release, which the maintainer reviews and publishes.

## Context

- Today the `release` skill does everything on the maintainer's Windows: `npm pack`, `desktop: npm install, build, dist`, the unpacked app's checks and its scripted screenshot, then `gh release create` with both files.
- That depends on the local environment: VS Code's terminal sets `ELECTRON_RUN_AS_NODE`, which makes the packaged `miyagi.exe` exit silently unless it's unset (seen releasing v0.17.1).
- `.github/workflows/` has `verify.yml` (the gate without Claude nor Chrome, Node 20 and 22, on Ubuntu) and `pages.yml`; nothing builds a release.
- Every install path points at `releases/latest/download/miyagi.tgz` and `.../miyagi-setup.exe`: a published release without its files breaks installation for everyone until they're there.
- What needs a Claude session or the sandbox stays local: `update-docs`, `smoke-ingest`, `sandbox-e2e`, `check-page`. No subscription token goes into CI (ADR-026).
- Unsigned, as today; signing would come later as secrets, without changing the flow.

## Changes

- `.github/workflows/release.yml`:
  - `on: push: tags: ["v*"]`, and `workflow_dispatch` to try a build: it keeps the files as the run's artifacts and creates no release;
  - `permissions: contents: write`, with the `GITHUB_TOKEN` only;
  - a check that the tag matches `package.json`'s and `desktop/package.json`'s `version`;
  - job `package` (`ubuntu-latest`): `npm ci`, the same checks as `verify.yml`, `npm pack`, renamed `miyagi.tgz`, no `node_modules/` inside, installed in a throwaway prefix and `miyagi --version` equal to the tag;
  - job `desktop` (`windows-latest`): `desktop: npm ci, npm run build, npm run dist`, the unpacked app's checks from the `release` skill (`claude.exe` unpacked, `plugin/` and `prompts/`, only the five locales, no `dxcompiler.dll` nor `dxil.dll`), and the app started with `MIYAGI_DESKTOP_SCRIPT` until the rail shows the tag's version, its screenshot kept as an artifact;
  - job `release`, after both: creates the release as a **draft** (`gh release create --draft --verify-tag`) with both files and notes drafted from the commits since the previous tag.
- The maintainer reads the notes, rewrites them for teachers in Spanish, and publishes (`gh release edit vX.Y.Z --draft=false`); only then is it `latest`.
- `release` skill: bump, commit, tag, push; wait for the workflow (`gh run watch`); look at the screenshot; edit the notes; publish; check the real install path as today. The local build stays as the fallback when Actions fails.
- `CLAUDE.md` "Releasing" and `desktop-app.md`'s release step say the workflow builds them.

- - -

## Acceptance

- A `workflow_dispatch` run on `main` builds both files and passes every check, with no release created.
- The next release is made by pushing its tag: the draft has `miyagi.tgz` and `miyagi-setup.exe`, the workflow's screenshot shows the tag's version, and once published, installing from `releases/latest/download/miyagi.tgz` prints it and the installer link serves the file.
- A tag that doesn't match `package.json`'s version fails before building, and no draft is left.

- - -
