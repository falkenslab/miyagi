---
name: try-agent-kit-local
description: Try unreleased changes of the sibling ../agent-kit in miyagi before a kit release - link the local kit into node_modules without touching the global npm, test, then restore the pinned version. Use when a miyagi change needs something new in agent-kit, or to check a kit change against this agent before releasing it.
---

# Try a local agent-kit build

## 0. Ask first

agent-kit is its own repo, and other sessions change it too. Before editing it from here,
tell the user what miyagi needs from the kit and why, and get a yes. Then check its
state: `git -C ../agent-kit status -sb` and `git -C ../agent-kit log --oneline -5` — don't
build on top of someone else's uncommitted work without saying so.

## 1. Change and verify the kit

Work in `../agent-kit` following its own `CLAUDE.md` and project skills. Build it:
`(cd ../agent-kit && npm run build)`.

## 2. Link it here — without the global npm

```
npm install --no-save ../agent-kit
```

This makes `node_modules/@falkenslab/agent-kit` a symlink to `../agent-kit` and leaves
`package.json`/`package-lock.json` alone. Don't use `npm link`: it registers a global link
that outlives the trial. Every later kit change needs `(cd ../agent-kit && npm run build)`
again; this project reads the kit's `dist/`, never its `src/`.

## 3. Test

Change miyagi against the linked kit and run the `verify` skill (it reports the
symlink). For behavior that only shows at runtime, a real session: `smoke-ingest`, or
`sandbox-e2e` for anything that acts in Moodle.

## 4. Release the kit, then pin it

Once both sides work: commit and release the kit from `../agent-kit` (its own `release`
skill; confirm with the user), then run `upgrade-agent-kit` here. Check
`node_modules/@falkenslab/agent-kit` is a folder again before committing anything here.

## If the trial is abandoned

`npm install` restores the pinned version from the lockfile. Leave `../agent-kit` as it was,
or tell the user what's left there uncommitted.
