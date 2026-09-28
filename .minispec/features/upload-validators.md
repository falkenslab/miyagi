# Deterministic validation of files before they're uploaded to Moodle

## Goal

Check the files the agent uploads to Moodle (GIFT first, then HTML) with code, not with the model's judgment, and refuse the upload until they pass.

## Context

- In `tests/2026-09-28T15-41-draft-testing/`, a GIFT file that Moodle accepted lost the indentation of its code: the GIFT parser trims each line, so `print(n)` ended up outside the loop, which changes what the Python program does.
  - The agent only found it by previewing the hidden quiz, and fixed it question by question with two more approvals.
  - What worked, confirmed empirically: `[html]` with `<pre>` and `&nbsp;` for the indentation.
- Getting the file right is left to the model today (`quiz-building`: "check each question has exactly one right answer"). A syntax or format mistake is only seen after the upload, if at all.
- The agent uploads files with `browser_drop` or `browser_file_upload`, passing the file's path in `drafts/`. A PreToolUse hook can read and check it before the upload, like the publish gate (ADR-008). No new MCP tool is needed: the kit doesn't export a way to build one.

## Changes

- `src/validators/gift.ts`: a GIFT checker (no Moodle), returning errors with line numbers:
  - unbalanced `{ }` and unescaped special characters (`~ = # { } :`) in question text and answers;
  - multiple choice with no right answer, or with several `=` where one is expected; percentages outside −100…100 or not adding up;
  - malformed numerical answers (`{#value:tolerance}`, ranges);
  - repeated question names (`::name::`);
  - indentation that will be lost: a line starting with spaces or tabs inside a question in the default format, or in `[html]` without `&nbsp;`. The error says how to keep it (`[html]` with `<pre>` and `&nbsp;`).
- `src/validators/html.ts`, for a file uploaded as a resource:
  - no `<meta name="viewport">` (the phone problem of the same test);
  - no `lang` on `<html>`;
  - scripts or styles loaded from another site;
  - broken local references.
- A hook (next to the publish gate, in every mode, since a broken file is never wanted): before `browser_drop` / `browser_file_upload`, validate each `.gift` / `.html` path.
  - Errors → deny, with the list, so the agent fixes the file in `drafts/` and retries.
  - Warnings → allow, and pass them to the model in the hook's context.
- `quiz-building`: the checker runs on every GIFT upload; write code as `[html]` + `<pre>` + `&nbsp;` from the start.
- `.claude/skills/verify/check-validators.mjs`: valid and broken fixtures, including the GIFT of this test before and after its fix.

## Acceptance

- The original GIFT of that test (indented code in `<pre>` with plain spaces) is refused with an error on the right lines. The fixed one passes.
- A GIFT with an unescaped `=` in an answer, a question without a right answer and a duplicated name gets three errors.
- In a sandbox run, asked for a quiz with code, the upload is refused once with the list (or the file is right from the start), and the imported questions keep their indentation in the preview.
- `verify` passes.
