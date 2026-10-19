# GUI: switching workspaces

Issue: [#49](https://github.com/falkenslab/miyagi/issues/49)

## Goal

In the app, a teacher creates, opens and switches between their workspaces by name, and reaches their files without knowing where they are (ADR-022, ADR-023).

## Context

- `workspace-registry` gives the registry (`~/.miyagi/workspaces.json`), the default folder and the creation code; this note is the screens on top of it.
- The interaction port is one per process: one workspace open at a time.
- The mockup has a switcher in the sidebar and a "new subject" dialog.
- Needs `gui-host`, `gui-chat` and `workspace-registry`.

## Changes

- The host: `GET /api/workspaces` (the registry, missing ones marked) and `POST /api/workspace` to switch: closes the controller and opens one on the other workspace, each keeping its conversations in its own `sessions/`.
- Start screen when nothing is open: recent workspaces, "Nueva asignatura", "Abrir una carpeta".
- "Nueva asignatura" as a form with `init`'s questions and defaults, through the same code; its folder is the default unless the teacher opens "Elegir carpeta"; connecting a classroom at the end leads to `gui-extensions`.
- "Abrir la carpeta" (sources, drafts) and drag and drop into `sources/`, so the hidden folder never matters.
- A missing workspace can be located again or forgotten; nothing is ever deleted from the app.
- The app opens the last workspace; the switcher and the window title show its name and kind word.

- - -

## Acceptance

- Create two subjects from the app, switch between them: each keeps its conversations and knowledge base; `miyagi chat -w <name>` finds the same ones.
- A workspace whose folder was moved shows as missing and can be located again.

- - -
