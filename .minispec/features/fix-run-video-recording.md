# run fails to record its session on video

Issue: [#13](https://github.com/falkenslab/teacher-agent/issues/13)

## Problem

Every `run` starts with `browser_start_video` ("Empezando a grabar vídeo") and the call fails ("### Error"), so the session isn't recorded. Seen in two sandbox runs on 2026-09-30 (v0.7.0, agent-kit 0.13.0). The run itself goes on normally.

## Cause

To confirm. `prompts/messages/run-initial.md` makes `browser_start_video` the very first call, before any navigation; Playwright MCP's handler (`videoStart`, `capability: "devtools"`) calls `context.startVideoRecording()`, which likely needs a browser context/page that doesn't exist yet. The flags look right (`--caps devtools`, `--output-dir <run>/browser-files`). The transcript doesn't keep the error text: reproduce to read it.

## Solution

- Reproduce and read the error (a `run` in the sandbox, or the Playwright MCP server alone).
- If it's the missing page: start the recording right after the first navigation (`run-initial.md`), keeping `browser_stop_video` last (`teacher-run.md`).
- If recording isn't worth it (headless runs, size): drop both calls and the prompt lines.

## Verification

- A `run` against the sandbox: no error on the video call, and a `.webm` in `<run>/browser-files/` after it ends (or no video calls at all, if dropped).
- `verify` passes.
