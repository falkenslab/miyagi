# A toolbox for drafts/

## Goal

Let the agent do almost anything with files in `drafts/` — download a site, copy, move, delete, zip and unzip, make a PDF — through its own deterministic tools, never a shell, so it can build SCORM, H5P or IMS packages and any other material it uploads to Moodle.

## Context

- In a 2026-09-28 session on `introduccion-a-html5-y-css3`, the teacher asked to package the web game `https://fvarrui.github.io/gamificando/terminal-implacable/index.html` (28 files, plus a `shared/` folder) as SCORM.
- The agent couldn't do it. It can only write text into `drafts/` (Write/Edit); it can't download files to disk, copy binaries or build a ZIP.
  - `save_to_sources` copies downloads into `sources/`, which is read-only for it.
  - The `general-purpose` subagent is blocked, and `practice-runner` works only in Docker.
- The agent asked for `Bash` for itself, or for a subagent. Rejected (ADR-003): a host shell can do anything the user can, and "only in `drafts/`" would be a prompt, not a limit. Here it would also run on content downloaded from the internet.
- What the agent needs is a small set of file operations. As code inside teacher-agent's process, each checks its own paths, and nothing ever executes what it handles.
- Decided by the teacher:
  - deletion is permanent;
  - the PDF tool is part of this feature;
  - size limits are configurable.

## Changes

- An in-process MCP server `drafts`, built with `createSdkMcpServer()` and `tool()` as exported by agent-kit since 0.12.0 (no SDK dependency of our own), returned from `buildMcpServers()` in `run` and `chat`. Tools:
  - `drafts_list`: a folder's entries (name, size, date), optionally recursive.
  - `drafts_mkdir`, `drafts_copy`, `drafts_move`: folders, and files including binaries.
  - `drafts_delete`: permanent, for a file or a folder. Never `drafts/` itself.
  - `drafts_download`: one URL to a path in `drafts/`. `http(s)` only, with a timeout, the size limit and the content type reported.
  - `drafts_fetch_site`: a page and everything it loads.
    - Loaded in a headless browser; every response saved under `drafts/<slug>/`, mirroring the URL paths from their common root, so relative links keep working.
    - Resources from other hosts are listed, not saved, unless asked. What only loads on interaction is reported so it can be fetched with `drafts_download`.
  - `drafts_unzip` / `drafts_zip`:
    - no entry may write outside its target folder (zip slip);
    - caps on total size and number of files against zip bombs;
    - `drafts_zip` can put a given file at the archive's root (a SCORM `imsmanifest.xml`).
  - `drafts_pdf`: an HTML or Markdown file in `drafts/` to PDF, with the same browser.
  - `drafts_info`: real type, size, image dimensions and hash of a file.
- Every path is resolved and checked to stay inside `drafts/` (no `..`, no absolute paths elsewhere, no symlink escapes). Nothing is ever executed.
- Limits:
  - defaults of 50 MB per download, and 200 MB / 2,000 files per unzip;
  - overridable per workspace in `config.json` (`agent.draftsLimits`), validated on load.
- Dependencies: a pure-JS ZIP library (`fflate`) and a Markdown renderer (`marked`), both with no native parts. The PDF and the site fetch reuse `playwright-core` and the system Chrome, as the Playwright MCP server does.
- A `scorm-packaging` skill:
  - the `imsmanifest.xml` template (SCORM 1.2);
  - a small bridge script that finds Moodle's SCORM API and reports completion and score;
  - how to hook it to a game's end, and the upload settings (grading method, attempts, display) in Moodle.
- `publish-check` and the resource skills name the toolbox, and `toolLabels.ts` gives each tool a readable line in the chat.

## Acceptance

Against the sandbox, reported in `tests/`:

- Asked to package "Terminal implacable" as SCORM, the agent:
  - fetches it into `drafts/`;
  - writes the manifest and the bridge;
  - zips it and uploads it hidden;
  - plays it as the teacher in Moodle, and the score reaches the gradebook;
  - calls neither `Bash`, `Agent` nor Docker.
- A PDF of a page of notes is generated from `drafts/` and uploaded as a File resource.
- The toolbox refuses:
  - paths outside `drafts/` (`..`, absolute, symlink);
  - `file://` URLs;
  - a zip-slip archive;
  - a download or an unzip over the limits;
  - deleting `drafts/` itself.

  Each refusal is covered by checks in `verify`.
- `verify` passes.
