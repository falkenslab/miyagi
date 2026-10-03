# Google Classroom connector

Issue: [#35](https://github.com/falkenslab/miyagi/issues/35)

## Goal

A built-in connector that publishes to and reads from Google Classroom through its API (ADR-014).

## Context

- Needs `extensions` and `neutral-materials`.
- API limits (official docs, Oct 2026): only coursework created by the same Cloud project can be edited or graded; a Form can't be attached to coursework; no private comments; grade categories not writable; Forms has no per-option feedback, no formatting, no file-upload questions; student groups have an API since 2026 (no assignment by group).
- OAuth: unverified apps show a warning and cap at 100 users; verification can take months; school admins may block third-party apps.
- No official Google MCP server for Classroom or Forms.
- Prerequisites, started during `neutral-materials`: Google verification of falkenslab's client, and a domain for an Education demo sandbox (`gedu.demo.<domain>`), not available yet.

## Changes

- `extensions/classroom/` and `src/extensions/classroom/`: in-process MCP over the REST APIs with `fetch` (no `googleapis`), no browser.
- OAuth: loopback with PKCE; falkenslab's client and "bring your own client" (`~/.miyagi/secrets/google-client.json`), with a guide for school admins; token in `~/.miyagi/secrets/google-token.json`, never seen by the model; minimal scopes per capability, `drive.file` not `drive`.
- Tools: read (`classroom_list_courses`, `classroom_structure`, `classroom_submissions`, `forms_responses_summary`) and publishing (`classroom_publish_material`, `classroom_publish_assignment`, `classroom_publish_quiz`, `classroom_announce`, `classroom_set_state`, `classroom_grade`).
- Capabilities: full for structure, orientation, publish-notes/assignment/unit, announcements, link, staged-publishing (DRAFT), survey; partial for publish-quiz (Form linked, no grade import), submissions (own work only, no written feedback), forum, progress, restrictions; `gradebook` absent or partial.
- Groups: native (expanded to students at publish time, never stored) or one class per group.
- Forms exporter with its losses (numeric tolerance, matching/ordering, per-option feedback, code formatting, essay).
- Setup: Google login, pick a class, map its groups.
- Sandbox repo `classroom-sandbox` with a seed script; `miyagi ext test classroom`.
- No browser fallback in 1.1 (decided); revisit with pilot teachers.

## Acceptance

- Conformance scenario green against the sandbox; e2e report with screenshots as a test student.
- A unit published to Moodle and Classroom from the same `materials/`, losses shown in the Classroom approval.
- Docs: "Conectar Google Classroom" and the admin guide; landing page names Classroom.
