# Materials folder and local preview

## Goal

Give the materials the agent builds for Moodle (a web page, a PDF, an HTML activity) their own folder, and a tool to open them in the agent's browser before uploading them, without a shell or Docker.

## Context

- In a 2026-09-28 session, the teacher asked for "a gamified single-page activity with an HTML5 and a CSS3 editor … build it and open it in the browser".
- The agent wrote the file in `knowledge/activities/reto-html-css-ut6.html`. `knowledge/` is the knowledge base: pages about the course, not deliverables. It then uploaded it to Moodle from there.
- To open it, it tried `file://`, which Playwright MCP blocks. Opening `file://` would let the browser read any local file, so it stays blocked.
- Then it tried `Bash`, which is denied (ADR-003), and a subagent with no type, which was refused. Finally it used `practice-runner`, which only exists when `allowPracticeRunner` is on. That one ran an nginx container on port 8090 and didn't remove it afterwards.
- The need is legitimate and will come back with any interactive material. The agent has no allowed way to meet it.

## Changes

- `materials/` in every workspace:
  - writable by the main agent (`extraWritableDirs` in `toSessionConfig()`);
  - created by `init` and on opening an old workspace;
  - not ignored in the workspace's `.gitignore`: it's the teacher's material.
- A `preview_file` tool (own MCP server, like `save_to_sources`):
  - takes a path inside `materials/`, starts or reuses one static server in the teacher-agent process, and returns the URL to open with the browser;
  - the server listens on `127.0.0.1` on a random port, serves only `materials/` (no path escapes, no directory listing), is read-only and stops with the session;
  - not registered in `ingest`, which has no browser.
- Prompt and skills:
  - where materials go (`materials/`, never `knowledge/`);
  - "preview it with `preview_file` before uploading";
  - uploading goes from `materials/`. `course-knowledge.md` names the folder as outside the knowledge base.
- `practice-runner` stays for running practices, not for serving files: say so in its prompt.

## Acceptance

- Asked for an interactive HTML activity, the agent writes it to `materials/`, opens it through `preview_file`, tries it in the browser and uploads it from there, with no `Bash`, `Agent` or Docker call.
- `preview_file` refuses a path outside `materials/`, and the URL can't reach any other file (`..`, absolute paths, encoded paths).
- Nothing listens after the session ends.
- `verify` passes. An end-to-end run against the sandbox is written up in `tests/`.
