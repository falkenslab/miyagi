---
name: release
description: Cut a new teacher-agent release - decide the semver bump from the commits since the last tag, bump the version, commit, tag, push, build the installable package and create the GitHub release with it and Spanish notes. Only when the user explicitly asks to release or publish a version.
disable-model-invocation: true
---

# Release teacher-agent

A release is a version commit, a `vX.Y.Z` tag on `main` and a GitHub release in the
**public** `falkenslab/teacher-agent` repo carrying the installable package. Users don't
clone: they run

```
npm install -g https://github.com/falkenslab/teacher-agent/releases/latest/download/teacher-agent.tgz
```

so a release without a `teacher-agent.tgz` asset (that exact name) breaks installation for
everyone the moment it becomes "latest".

## 1. Preconditions

- On `main`, working tree clean, up to date with `origin/main` (`git fetch && git status -sb`).
  Uncommitted changes: stop and ask (or use `commit` first if the user wants them in).
- `node_modules/@falkenslab/agent-kit` is a real folder installed from the tarball URL in
  `package.json`, not a symlink to `../agent-kit` (finish a local-kit trial first).
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
mv <scratchpad>/teacher-agent-X.Y.Z.tgz <scratchpad>/teacher-agent.tgz
```

It must be tens of kB, with no `node_modules/` inside (`tar -tzf` it). A package in the
hundreds of MB means dependencies got bundled — among them the Claude SDK's Windows-only
`claude.exe` — and it won't install on Mac or Linux: don't publish it.

Install it into a throwaway prefix, never the user's global npm, and run `--version` from
there (`<scratchpad>/g/teacher-agent.cmd` on Windows):

```
npm install -g --prefix <scratchpad>/g <scratchpad>/teacher-agent.tgz
```

## 5. GitHub release

Notes in Spanish, for a teacher who uses teacher-agent (not its code), from the commits since
the last tag: the install command, novedades, correcciones, cambios que afectan a los
workspaces existentes (with what the user must do, if anything), and the agent-kit version it
uses.

```
gh release create vX.Y.Z <scratchpad>/teacher-agent.tgz --verify-tag --title "teacher-agent vX.Y.Z" --notes-file <notes>
```

Then check the real user path: install from
`https://github.com/falkenslab/teacher-agent/releases/latest/download/teacher-agent.tgz` into
another throwaway prefix and run `--version`.

Report the version, the release URL and the notes. If a step fails half-way, report exactly
what is pushed and published and what isn't instead of retrying blindly.
