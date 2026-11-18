---
name: release
description: Cut a new miyagi release - decide the semver bump from the commits since the last tag, bump the version, commit, tag and push; the release workflow builds and checks miyagi.tgz and the desktop app for Windows, macOS and Linux into a draft release, whose Spanish notes are rewritten before publishing it. Only when the user explicitly asks to release or publish a version.
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
- the desktop app on four runners (#116), each `desktop: npm install, npm run build, npm run dist` and
  `check-desktop.mjs` (below) on its unpacked app, keeping its screenshot as the run's `screenshot-<name>` artifact:
  `windows` (`windows-latest`, `miyagi-setup.exe`), `mac-arm64` (`macos-latest`, `miyagi-arm64.dmg`),
  `mac-x64` (`macos-15-intel`, `miyagi-x64.dmg`) and `linux` (`ubuntu-latest` under `xvfb-run`,
  `miyagi.AppImage` and `miyagi.deb`);
- then a **draft** release with every file and notes drafted from the commits. A re-run replaces a
  draft's files, never a published release's.

Each installer is built on its own system because the Claude SDK installs only the `claude` binary of
the platform `npm install` runs on (`@anthropic-ai/claude-agent-sdk-win32-x64`, `-darwin-arm64`…): a
Windows build carries `claude.exe`, and can't make a Mac or Linux app; one Mac runner per arch, for the same
reason. `miyagi.tgz` carries none:
each user's `npm install -g` fetches theirs.

What `check-desktop.mjs` checks on the system it runs on, the same locally:
- `app.asar.unpacked/node_modules/@anthropic-ai/claude-agent-sdk-<platform>-<arch>/claude[.exe]`
  exists (outside the asar: another process runs it), and so do `.../miyagi/plugin/` and `.../miyagi/prompts/`;
- on Windows and Linux, `locales/` holds only `en-US`, `es`, `es-419`, `fr` and `de` (`electronLanguages`,
  about 45 MB less) and `LICENSES.chromium.html.gz` replaces the 20 MB HTML (`scripts/afterPack.cjs`);
- on Windows, no `dxcompiler.dll` nor `dxil.dll` (WebGPU, 26 MB, `afterPack.cjs` too) (`package.json`'s `files` also leaves the types,
  source maps and docs of `node_modules` out of the asar; the unpacked app is about 700 MB, 380 of them
  Claude Code's `claude.exe` in SDK 0.3.327, which can't be made smaller);
- it starts with a throwaway data folder (also its home, so no `~/.miyagi` is touched) and without
  `ELECTRON_RUN_AS_NODE` (VS Code's terminal sets it, and the packaged app then exits silently), until
  its rail shows the version; on Linux with `--no-sandbox`, since an unpacked build has no SUID
  `chrome-sandbox` (the `.deb` sets it up when installed).

Download the screenshots (`gh run download <run> -p 'screenshot-*'`) and look at them: on macOS the
traffic lights sit at the title bar's left and the page draws no menus (they're the system's).

The installers are unsigned: SmartScreen warns on Windows, and Gatekeeper on macOS, where the app is
only ad-hoc signed (`mac.identity: "-"`, which Apple Silicon needs to run it at all; the SDK's
`claude`, signed by Anthropic, is left alone with `signIgnore`). The install page explains what to do on
each. Never put any of them in the npm package.

**When Actions fails** and can't be fixed now, build locally as the fallback: `npm pack` and
`check-package.mjs`; from a terminal without `ELECTRON_RUN_AS_NODE` (`env -u ELECTRON_RUN_AS_NODE` in
Git Bash), `cd desktop && npm install && npm run build && npm run dist`, then `check-desktop.mjs`; and
`gh release upload vX.Y.Z miyagi.tgz desktop/dist/miyagi-setup.exe --clobber` to the draft (the Mac and
Linux files need those systems) (or
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
prefix and run `--version`; and each installer under
`https://github.com/falkenslab/miyagi/releases/latest/download/` (`miyagi-setup.exe`, `miyagi-arm64.dmg`,
`miyagi-x64.dmg`, `miyagi.AppImage`, `miyagi.deb`) answers with the file.

Report the version, the release URL and the notes. If a step fails half-way, report exactly
what is pushed and published and what isn't instead of retrying blindly.
