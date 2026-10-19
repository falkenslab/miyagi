# Workspaces by name, in miyagi's home

Issue: [#53](https://github.com/falkenslab/miyagi/issues/53)

## Goal

Create and open workspaces without handling folders: new ones go to `~/.miyagi/workspaces/<slug>/`, every one is listed in `~/.miyagi/workspaces.json`, and the CLI opens them by name (ADR-023).

## Context

- `resolveWorkspaceDir()` (`src/agent.ts`) is `--dir` or the current directory; `init` creates the workspace there (`src/menu.ts`, `promptInitWorkspace`), and `miyagi` alone uses the current directory.
- `~/.miyagi/` already holds `config.json` (the token, `src/globalConfig.ts`), the extensions and the kit's private folders.
- `ingest` takes files as positional arguments, so a workspace name can't be positional.
- The GUI (`gui-workspaces`) needs the same registry and the same creation code.

## Changes

- `src/workspaces.ts`: the registry `~/.miyagi/workspaces.json` (`{ workspaces: [{ id, name, kind, dir, createdAt, openedAt }] }`, `id` a unique slug of the name); `registerWorkspace()`, `listWorkspaces()` (each marked `missing` when its folder has no `config.json`), `findWorkspace(name or id)`, `forgetWorkspace()`; written atomically, never deleting a folder.
- `config.json` gets `kind: "subject"`, written when missing.
- Resolving the workspace, in order: `--dir <path>`; `--workspace <name>` (`-w`); the current directory if it is one; otherwise, with a terminal, a menu of the registered ones (last opened first) plus "new"; without one, an error listing their names.
- `init` without `--dir`: asks the name first and creates `~/.miyagi/workspaces/<slug>/`; with `--dir`, as today. Both register it.
- Opening any workspace registers it (or updates `openedAt`), so existing ones join the list on their own.
- `miyagi workspaces` lists name, kind, folder, last opened and missing ones; `miyagi workspaces forget <name>` drops one from the list and says its folder is untouched.
- Messages (en, es, fr, de) say the kind's word ("asignatura"), not "workspace", except in `--dir`'s help.
- Docs: "Primeros pasos" without `--dir`, the reference (`--workspace`, `workspaces`), "Configuración" (`kind`, `workspaces.json`); `check-docs.mjs` for the new subcommand.

- - -

## Acceptance

- From any folder: `miyagi init` with the defaults creates `~/.miyagi/workspaces/<slug>/` and registers it; `miyagi chat -w <name>` opens it; `miyagi` alone offers it in the menu.
- An existing workspace opened with `--dir` appears in `miyagi workspaces`; after moving its folder it shows as missing, and `forget` removes it from the list only.
- Running inside a workspace folder without flags still opens it; `verify` and `check-docs` pass.

- - -
