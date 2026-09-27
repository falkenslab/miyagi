---
name: upgrade-agent-kit
description: Move teacher-agent's @falkenslab/agent-kit dependency to a new agent-kit release - pack the kit at its tag, attach the tarball to a teacher-agent release, point package.json at that URL, reinstall, update .minispec/core/stack.md, verify. Use when a new agent-kit release is out, or when the user asks to update the kit.
---

# Upgrade the agent-kit dependency

agent-kit isn't on npm, and teacher-agent can't depend on it through git: users install
teacher-agent with `npm install -g <tarball URL>`, and npm fails to prepare git dependencies
there (it can't find `tsc`). So the dependency is a **built agent-kit tarball attached to a
teacher-agent GitHub release**, e.g.

```
"@falkenslab/agent-kit": "https://github.com/falkenslab/teacher-agent/releases/download/v0.1.0/falkenslab-agent-kit-0.6.0.tgz"
```

with `"allowScripts": { "@falkenslab/agent-kit": false }` (the tarball already has `dist/`; its
`prepare` must not run).

## 0. Before

- agent-kit is changed by other sessions too: `git -C ../agent-kit fetch --tags -q` and look
  at what changed since the current version (`git -C ../agent-kit log --oneline vOLD..vNEW`, and
  `gh release view vNEW -R falkenslab/agent-kit`). A `!` or a "Cambios incompatibles" section
  means teacher-agent's code probably has to change too.
- student-agent uses the same kit: check what it did for the same upgrade
  (`git -C ../student-agent log --oneline -- package.json src/`).

## 1. Build the kit's tarball at the tag

In a scratch clone, never in `../agent-kit` (someone may be working there):

```
git clone -q --depth 1 --branch vNEW https://github.com/falkenslab/agent-kit.git <scratchpad>/agent-kit-vNEW
cd <scratchpad>/agent-kit-vNEW && npm install && npm pack --pack-destination <scratchpad>
```

→ `<scratchpad>/falkenslab-agent-kit-X.Y.Z.tgz`, tens of kB, with `dist/` inside.

## 2. Publish it

Attach it to the current latest teacher-agent release (additive: it doesn't change what that
release installs, and the URL is permanent):

```
gh release upload vCURRENT <scratchpad>/falkenslab-agent-kit-X.Y.Z.tgz
```

## 3. Point the dependency at it

```
npm install "https://github.com/falkenslab/teacher-agent/releases/download/vCURRENT/falkenslab-agent-kit-X.Y.Z.tgz"
```

A plain `npm install` after editing `package.json` isn't enough: the lockfile keeps the old
tarball. Check `allowScripts` still has `"@falkenslab/agent-kit": false` and no stale entry.

## 4. Update the docs

`.minispec/core/stack.md` names the kit version and the tarball URL: update both.

## 5. Check

- `grep '"version"' node_modules/@falkenslab/agent-kit/package.json` shows the new version,
  and it's a real folder, not a symlink.
- `git diff package.json` shows only the dependency line.
- Run the `verify` skill. If the release was breaking, adapt the code first.

## 6. Commit

One commit, `build(deps): agent-kit vNEW`, whose body says in a line what the release brings
to teacher-agent. Files: `package.json`, `package-lock.json`, `.minispec/core/stack.md` (plus any code the
upgrade required). Push only if the user asks. Users get the new kit with the next release.
