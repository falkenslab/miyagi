# A Moodle resource published without the teacher's approval

## Problem

- Chat session of 2026-09-28 on `introduccion-a-html5-y-css3` (course 4, moodle-sandbox), `guided` mode.
- Asked to build a gamified review activity for UT6, the agent filled the "File" resource form and clicked "Save and display" (01:58:40) without calling `request_human_approval`.
- The resource was visible to students until the agent noticed, hid it (01:59:15) and only then asked for approval.
- It breaks the first principle: the teacher approves every change students would see.

## Cause

- In `guided` mode the approval is only a rule in the prompt (`teacher-chat.md`, "Before publishing anything visible to students") and in the skills. Nothing stops a publishing click when the model forgets it.
- It forgot here during a long, unusual flow: building a file, serving it through `practice-runner` and uploading it (see `material-preview`).
- `interactive` isn't affected (the kit's step gate asks before every call), and `autonomous` publishes without asking by design.

## Solution

A publish gate in teacher-agent: a PreToolUse hook that, in `guided`, stops a publishing call made without an approval just before it, and asks the teacher.

- Built from what the kit already exports, added to `options.hooks` after `buildSessionOptions()`, like `maxTurns`:
  - `askForDecision()` for the panel (approve / reject / stop, as the step gate);
  - `modeControl` so it only acts in `guided`, also after Shift+Tab.
- It knows an approval happened from a PostToolUse hook on `request_human_approval`, whose response is teacher-agent's own "approved" text (`humanApprovalTexts`).
- A rejection denies the call with a reason that tells the model to ask with `request_human_approval` first.
- `isPublishAction(toolName, toolInput)`: a Playwright click or key press whose target is one of Moodle's publishing buttons.
  - Forms: "Save and display", "Save and return to course", "Save changes".
  - Forum: "Post to forum", "Post reply", "Send".
  - Grader: "Save changes", "Save and show next".
  - Hide/show, duplicate and similar course-page menu actions.
  - The Spanish UI names of each, taken from the sandbox's language packs, not guessed.
  - `browser_evaluate` / `browser_run_code` scripts that submit a form or call Moodle's web services, matched by what they do.
- How long an approval lasts: one approval may cover a batch (six grades, one "Save changes" each). Proposal: until the next `request_human_approval` call or the end of the turn. Record the choice in an ADR, and add a line to `principles.md`: the approval before publishing is enforced by a hook, not only asked for.
- If student-agent needs the same gate for its final "Submit", move the mechanism to agent-kit and keep only `isPublishAction` here.

## Verification

- A unit-level check of `isPublishAction` against real tool inputs taken from `tests/` transcripts: every publication of the last reports, both languages, and non-publishing clicks ("Cancel", "Add", tabs).
- `sandbox-e2e`: in `guided`, ask the agent to upload a File resource. The click on "Save and display" without approval opens a panel, and rejecting it leaves nothing in the course (checked in the database).
- The same session with normal approvals (grading a batch, forum replies) asks nothing extra.
- After Shift+Tab to `interactive`, only the step gate asks, and back in `guided` the publish gate is on again.
- `student-impact-review` on the change.
