# Video tutorials with the teacher's voice, on YouTube

Issue: [#38](https://github.com/falkenslab/miyagi/issues/38)

## Goal

Official tool extensions that turn a step-by-step script into a narrated video with the teacher's own voice, upload it to YouTube and link it in a classroom.

## Context

- Needs `third-party-extensions` (code level) and a connector's `link` capability.
- Only sketched for now: redesign in detail when it starts.

## Changes

- Script from `materials/` (steps, narration), screen capture guided by the agent (Playwright) or provided by the teacher.
- Narration with a voice service, only the teacher's own voice with explicit consent; the service key as a secret.
- Editing with ffmpeg inside an opt-in container, like the practice-runner.
- Upload with the YouTube Data API as unlisted until approved; the link published in the chosen classroom through its connector.

## Acceptance

- A short tutorial produced, approved, uploaded unlisted and linked in a sandbox classroom; report in `tests/`.
