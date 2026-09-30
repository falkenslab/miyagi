---
name: upgrade-agent-kit
description: Move miyagi's @falkenslab/agent-kit dependency to a new agent-kit release from npm - read what changed, install the exact version, update .minispec/core/stack.md, verify, commit. Use when a new agent-kit release is out, or when the user asks to update the kit.
---

# Upgrade the agent-kit dependency

agent-kit is on npm (its ADR-017). miyagi depends on it at an **exact version**, never
a range (ADR-010):

```
"@falkenslab/agent-kit": "0.10.1"
```

While the kit is 0.x a minor can break, and a range would let a user's `npm install -g` pick a
version miyagi was never checked against. Never go back to a git dependency: npm runs
the kit's `prepare` during a user's global install and fails without `tsc`.

## 0. Before

- See what's new: `npm view @falkenslab/agent-kit versions dist-tags` and the release notes
  (`gh release view vNEW -R falkenslab/agent-kit`). A "Breaking changes" section other than
  "None", or a `!` in `git -C ../agent-kit log --oneline vOLD..vNEW`, means miyagi's code
  probably has to change too.
- student-agent uses the same kit: check what it did for the same upgrade
  (`git -C ../student-agent log --oneline -- package.json src/`).

## 1. Install it

```
npm install --save-exact @falkenslab/agent-kit@X.Y.Z
```

`--save-exact` keeps `package.json` pinned. Don't edit the version by hand and run a plain
`npm install`: the lockfile keeps the old one.

## 2. Update the docs

`.minispec/core/stack.md` names the kit version: update it.

## 3. Check

- `grep '"version"' node_modules/@falkenslab/agent-kit/package.json` shows the new version,
  and it's a real folder, not a symlink (`try-agent-kit-local` leaves one).
- `git diff package.json` shows only the dependency line.
- Run the `verify` skill. If the release was breaking, adapt the code first.
- If the kit changed what the chat, the approvals or the hooks do, try it for real: a `chat`
  session against the sandbox (`sandbox-e2e`).

## 4. Commit

One commit, `build(deps): agent-kit vNEW`, whose body says in a line what the release brings
to miyagi. Files: `package.json`, `package-lock.json`, `.minispec/core/stack.md` (plus any
code the upgrade required). Push only if the user asks. Users get the new kit with the next
miyagi release.
