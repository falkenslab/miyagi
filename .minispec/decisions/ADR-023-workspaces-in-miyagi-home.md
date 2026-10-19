# ADR-023: Workspaces live in miyagi's home, listed in a registry

## Decision

- **A new workspace goes to `~/.miyagi/workspaces/<slug>/` by default**; the teacher picks another folder only if they want to. Whatever its folder, every workspace is listed in **`~/.miyagi/workspaces.json`** (id, name, kind, folder, created, last opened), so the teacher opens one by its name, never by its path.
- **Technical names are English**: the generic one is `workspace` (folders, files, code, CLI); its `kind` says what it is: `subject` (the only one now), later `department` and `exam-prep`. The interface never shows "workspace": it says the kind's word in the teacher's language ("asignatura", "subject", "matière", "Fach").

## Motivation

- Teachers shouldn't manage locations: `--dir` and "a workspace is a folder like a git repository" are a developer's model.
- `~/.miyagi/` keeps student data off cloud-synced folders (`Documents` is often in OneDrive on Windows): sources, transcripts and what the agent downloads from the classroom stay on the computer (ADR-005, ADR-017). It's also where the token, the extensions and the kit's per-project private folders already are.
- A registry apart from `~/.miyagi/config.json`: that file holds the Claude token and is denied to the agent; the list isn't secret and the GUI reads and writes it often.
- `workspace` covers every kind, `subject` doesn't; "course" is taken by Moodle's course and the school year, "project" says nothing.
- Rejected: `~/Documents/miyagi/` as the default (cloud sync, see above); the registry inside `config.json`; renaming `workspace` in the code.

## Consequences

- A hidden folder on macOS and Linux: the teacher reaches their files through miyagi (the GUI's "open folder" and drag and drop, `miyagi workspaces` printing each folder), not through a path they remember.
- `--dir` stays, and a current directory that is a workspace still wins, so nobody's habits break; existing workspaces stay where they are and are registered when opened.
- A registered folder that disappears is shown as missing, never removed by itself; forgetting one never deletes its folder.
- Amends ADR-017's kind names (`materia`, `departamento`, `oposicion` → `subject`, `department`, `exam-prep`).
- Delivered by the features `workspace-registry` (CLI and the shared code) and `gui-workspaces`.
