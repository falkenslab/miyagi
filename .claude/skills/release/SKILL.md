---
name: release
description: Cut a new miyagi release - decide the semver bump from the commits since the last tag, bump the version, commit, tag, push, build the installable package and create the GitHub release with it and Spanish notes. Only when the user explicitly asks to release or publish a version.
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

```
npm version <patch|minor> --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore(release): vX.Y.Z"   # plus the attribution trailer the session requires
git tag vX.Y.Z
git push origin main && git push origin vX.Y.Z
```

Tags are lightweight. Never move or delete a published tag, never force-push.

## 4. Build the package and test it

```
npm pack --pack-destination <scratchpad>          # prepack builds dist/ first
mv <scratchpad>/miyagi-X.Y.Z.tgz <scratchpad>/miyagi.tgz
```

It must be tens of kB, with no `node_modules/` inside (`tar -tzf` it). A package in the
hundreds of MB means dependencies got bundled — among them the Claude SDK's Windows-only
`claude.exe` — and it won't install on Mac or Linux: don't publish it.

Install it into a throwaway prefix, never the user's global npm, and run `--version` from
there (`<scratchpad>/g/miyagi.cmd` on Windows):

```
npm install -g --prefix <scratchpad>/g <scratchpad>/miyagi.tgz
```

## 4b. The desktop installer (Windows)

The same miyagi in a window (`desktop/`, ADR-022): every release carries `miyagi-setup.exe`, built
from this tag, so the app never lags behind the package. On Windows, from a terminal where
`ELECTRON_RUN_AS_NODE` isn't set (VS Code's sets it: `env -u ELECTRON_RUN_AS_NODE` in Git Bash):

```
cd desktop
npm install            # Electron and electron-builder; its postinstall downloads Electron's binary
npm run build          # builds miyagi and its page, copies dist/ plugin/ prompts/ into desktop/miyagi/, installs its dependencies
npm run dist           # electron-builder: desktop/dist/miyagi-setup.exe
```

Before uploading it, check the unpacked app in `desktop/dist/win-unpacked/`:
- `resources/app.asar.unpacked/node_modules/@anthropic-ai/claude-agent-sdk-win32-x64/claude.exe`
  exists (outside the asar: another process runs it);
- `resources/app.asar.unpacked/miyagi/plugin/` and `.../miyagi/prompts/` exist;
- it starts and shows the page, with a throwaway data folder and a scripted shot:
  `MIYAGI_DESKTOP_DATA=<scratchpad>/d MIYAGI_DESKTOP_SCRIPT=<steps.json> desktop/dist/win-unpacked/miyagi.exe`
  (steps as in `main.mjs`: wait for `.side .brand`, `shot`). Look at the image: the sidebar, and
  the version in its footer is this release's.

A Windows-only artifact: it's ~230 MB and unsigned, so SmartScreen warns on the first run (the
install page explains it). Never put it in the npm package.

## 5. GitHub release

Notes in Spanish, for a teacher who uses miyagi (not its code), from the commits since
the last tag: the install command, novedades, correcciones, cambios que afectan a los
workspaces existentes (with what the user must do, if anything), and the agent-kit version it
uses.

```
gh release create vX.Y.Z <scratchpad>/miyagi.tgz desktop/dist/miyagi-setup.exe --verify-tag --title "miyagi vX.Y.Z" --notes-file <notes>
```

Then check the real user path: install from
`https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz` into
another throwaway prefix and run `--version`. And the installer: `https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-setup.exe`
answers with the file. The first release that carries it also makes the docs' install page
(`docs/content/guia/instalar.md`) lead with that link, SmartScreen's warning explained, and the
npm command for Mac, Linux and whoever prefers the terminal.

Report the version, the release URL and the notes. If a step fails half-way, report exactly
what is pushed and published and what isn't instead of retrying blindly.
