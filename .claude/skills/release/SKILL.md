---
name: release
description: Cut a new miyagi release - decide the semver bump from the commits since the last tag, bump the version, commit, tag and push; the release workflow builds and checks miyagi.tgz and miyagi-setup.exe into a draft release, whose Spanish notes are rewritten before publishing it. Only when the user explicitly asks to release or publish a version.
disable-model-invocation: true
---

# Release miyagi

A release is a version commit, a `vX.Y.Z` tag on `main` and a GitHub release in the
**public** `falkenslab/miyagi` repo carrying the installable package. Users don't
clone: they run

```
npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz
```

so a release without a `miyagi.tgz` asset (that exact name) breaks installation for
everyone the moment it becomes "latest".

## 1. Preconditions

- On `main`, working tree clean, up to date with `origin/main` (`git fetch && git status -sb`).
  Uncommitted changes: stop and ask (or use `commit` first if the user wants them in).
- `node_modules/@falkenslab/agent-kit` is a real folder installed from npm at the version in
  `package.json`, not a symlink to `../agent-kit` (finish a local-kit trial first).
- The `update-docs` skill has run over the commits since the last tag and its docs changes are
  committed: `check-docs.mjs` and the site's build pass, and no screenshot is left pending
  without the user knowing.
- The `verify` skill passes. If prompts or plugin skills changed since the last tag,
  `smoke-ingest` too; if something that acts in Moodle changed, `sandbox-e2e`.
- `gh auth status` works.

## 2. Decide the bump

Last tag: `git describe --tags --abbrev=0`; commits: `git log <tag>..HEAD --format=%s`.
While the version is `0.x`: any `feat` or breaking change (`!`) → **minor**; only `fix`,
`docs`, `refactor`, `chore`, `build` → **patch**. If nothing but `docs`/`chore` changed, say a
release may not be worth it and confirm. State the bump and why.

## 3. Bump, commit, tag, push

The desktop app's `package.json` carries the same version and dependencies (`desktop/scripts/build.mjs`
writes them, and the release workflow refuses a tag they disagree with):

```
npm version <patch|minor> --no-git-tag-version
node -e "const fs=require('fs');const m=require('./package.json');const f='desktop/package.json';const d=JSON.parse(fs.readFileSync(f));d.version=m.version;d.dependencies=m.dependencies;fs.writeFileSync(f,JSON.stringify(d,null,2)+'\n')"
git add package.json package-lock.json desktop/package.json
git commit -m "chore(release): vX.Y.Z"   # plus the attribution trailer the session requires
git tag vX.Y.Z
git push origin main && git push origin vX.Y.Z
```

Tags are lightweight. Never move or delete a published tag, never force-push.

## 4. The workflow builds the files

Pushing the tag starts `.github/workflows/release.yml` (#115). Follow it with
`gh run watch $(gh run list --workflow release.yml --limit 1 --json databaseId -q '.[0].databaseId')`. It:

- checks that the tag, `package.json` and `desktop/package.json` say the same version;
- on Ubuntu: the gate of `verify.yml`, `npm pack` as `miyagi.tgz` and `check-package.mjs` (under 5 MB,
  no `node_modules/`, installed into a throwaway prefix it prints the version and `web --help` shows the help);
- on Windows: `desktop: npm ci, npm run build, npm run dist` and `check-desktop.mjs` on
  `desktop/dist/win-unpacked/` (below), keeping the screenshot as the run's `desktop-screenshot` artifact;
- then a **draft** release with both files and notes drafted from the commits. A re-run replaces a
  draft's files, never a published release's.

Each installer is built on its own system because the Claude SDK installs only the `claude` binary of
the platform `npm install` runs on (`@anthropic-ai/claude-agent-sdk-win32-x64`, `-darwin-arm64`…): a
Windows build carries `claude.exe`, and can't make a Mac or Linux app. `miyagi.tgz` carries none:
each user's `npm install -g` fetches theirs.

What `check-desktop.mjs` checks, the same locally:
- `resources/app.asar.unpacked/node_modules/@anthropic-ai/claude-agent-sdk-win32-x64/claude.exe`
  exists (outside the asar: another process runs it), and so do `.../miyagi/plugin/` and `.../miyagi/prompts/`;
- `locales/` holds only `en-US`, `es`, `es-419`, `fr` and `de` (`electronLanguages`, about 45 MB less);
- `scripts/afterPack.cjs` ran: no `dxcompiler.dll` nor `dxil.dll` (WebGPU, 26 MB) and
  `LICENSES.chromium.html.gz` instead of the 20 MB HTML (`package.json`'s `files` also leaves the types,
  source maps and docs of `node_modules` out of the asar; the unpacked app is about 610 MB, 297 of them
  Claude Code's `claude.exe`, which can't be made smaller);
- it starts with a throwaway data folder (also its home, so no `~/.miyagi` is touched) and without
  `ELECTRON_RUN_AS_NODE` (VS Code's terminal sets it, and the packaged app then exits silently), until
  its rail shows the version.

Download the screenshot (`gh run download <run> -n desktop-screenshot`) and look at it.

The installer is Windows-only, ~215 MB and unsigned, so SmartScreen warns on the first run (the
install page explains it). Never put it in the npm package.

**When Actions fails** and can't be fixed now, build locally as the fallback: `npm pack` and
`check-package.mjs`; from a terminal without `ELECTRON_RUN_AS_NODE` (`env -u ELECTRON_RUN_AS_NODE` in
Git Bash), `cd desktop && npm install && npm run build && npm run dist`, then `check-desktop.mjs`; and
`gh release upload vX.Y.Z miyagi.tgz desktop/dist/miyagi-setup.exe --clobber` to the draft (or
`gh release create … --draft` if the workflow never got that far).

## 5. Publish the release

The workflow's notes are a list of commits. Rewrite them (`gh release edit vX.Y.Z --notes-file <notes>`)
in Spanish, for a teacher who uses miyagi (not its code): the install section it leaves, novedades,
correcciones, cambios que afectan a los workspaces existentes (with what the user must do, if
anything), and the agent-kit version it uses. Then publish it, which makes it "latest":

```
gh release edit vX.Y.Z --draft=false --latest
```

Then check the real user path: install from
`https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz` into another throwaway
prefix and run `--version`; and `https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-setup.exe`
answers with the file.

Report the version, the release URL and the notes. If a step fails half-way, report exactly
what is pushed and published and what isn't instead of retrying blindly.
