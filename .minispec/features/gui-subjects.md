# GUI: subjects (workspaces) without `--dir`

Issue: [#49](https://github.com/falkenslab/miyagi/issues/49)

## Goal

In the app, a teacher creates, opens and switches between their subjects without knowing a workspace is a folder (ADR-022).

## Context

- Every command needs `--dir <workspace>`; `init` asks the subject's questions in a terminal (`src/menu.ts`): name, description, tone, language, instructions, and at the end whether to connect a classroom.
- Captain Whiskers has a single home folder; miyagi has one workspace per subject.
- The interaction port is one per process: one subject open at a time.
- The mockup has a subject switcher in the sidebar and a "new subject" dialog.
- Needs `gui-host` and `gui-chat`.

## Changes

- A list of known subjects in `~/.miyagi/config.json` (`subjects: [{ dir, label, openedAt }]`), filled by `init` and by opening one; a missing folder is shown as such, never deleted.
- Default folder for new subjects: `~/Documents/miyagi/<slug>/`, changeable in the dialog.
- The host switches subject: closes the controller and opens one on the other workspace (`POST /api/subject`), keeping each subject's conversations in its own `sessions/`.
- Start screen when nothing is open: recent subjects, "Nueva asignatura", "Abrir una carpeta".
- "Nueva asignatura" as a form with `init`'s questions and its defaults, written by the same code as `init` (extracted from `menu.ts`); connecting a classroom at the end leads to `gui-extensions`.
- The app opens the last subject.
- Messages in en, es, fr, de.

- - -

## Acceptance

- Create two subjects from the app, switch between them: each keeps its conversations and knowledge base; `miyagi chat --dir` on either finds the same workspace.
- A subject whose folder was moved shows as missing and can be located again.

- - -
