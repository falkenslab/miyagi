# Interactive activities playable in the preview

Issue: [#69](https://github.com/falkenslab/miyagi/issues/69)

## Goal

An HTML activity miyagi builds (a word search, a crossword, a simulation) can be played in the page before publishing it, in the chat and in Materials, without putting the teacher's computer or session at risk.

## Context

- Materials previews HTML in an iframe with `sandbox=""`, and the host serves it with a sandbox policy, so its scripts never run (`gui/src/components/Course.tsx:311-313`): an interactive activity shows as a still page.
- The host serves only files under `drafts/` (#51); the page holds the token that drives miyagi, so an activity's script must never reach it, nor the host's API, nor the network.
- Needed by `teacher-commands` (#68, `produces: html-activity`) and by `designed-material` / `personalised-activities`, whose games today can only be tried after uploading them.

## Changes

- **An ADR** for running an activity's scripts in the preview: what is allowed and why it's safe.
- **Isolation**:
  - the activity in an iframe with `sandbox="allow-scripts"` and no `allow-same-origin`, so it runs in an opaque origin: no cookies, storage, token nor access to the page;
  - served by the host with a Content-Security-Policy that blocks the network (`connect-src 'none'`, no external scripts, styles or images; only its own folder under `drafts/`);
  - no forms, popups nor top navigation.
- **Where**: in Materials, a "Play" toggle next to the still preview, for HTML files; in the chat, a result card when a command with `produces: html-activity` (#68, which doesn't show one yet: its result is only in Materials) leaves an activity in `drafts/`: the activity at a fixed height, "Open full", "Open in Materials" and "Publish" (page, SCORM with a grade, H5P).
- **SCORM**: an activity that reports a score shows it in the preview (a stub of the SCORM API inside the frame), so the teacher sees what Moodle will record.
- `check-host.mjs`: the activity's response carries the CSP; a path outside `drafts/` refused. `check-page.mjs`: an activity's script runs in the frame and can't read `parent.location`, the token or the host's API, nor fetch a URL.
- **Docs**: `avanzado/materiales.md` and `seguridad-y-privacidad.md` (both languages).

## Acceptance

- A word search built in `drafts/` can be played in Materials and in its chat card.
- From inside it, reading the page's token, calling the host's API or fetching any URL fails (checked).
- A SCORM activity's score shows in the preview.
- `verify`, `check-host.mjs` and `check-page.mjs` pass; the ADR is in `.minispec/decisions/`.
