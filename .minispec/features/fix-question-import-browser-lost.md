# Edge crashes leave Moodle work incomplete

Issue: [#89](https://github.com/falkenslab/miyagi/issues/89)

## Problem

While building a course on moodle-sandbox, Moodle tools kept failing with `Target page, context or browser has been closed` or hung until the 1800 s tool limit: `import_questions`, but also `add_book_chapter`, `set_rubric`, `update_activity` and others. Quizzes ended up incomplete: the database shows 5 questions in unit 1's quiz, 0 in unit 2's (the agent reported 4 of 20) and 10 in unit 3's. The agent told the teacher «Moodle rechaza nuevas importaciones en ese banco», which is wrong.

## Cause

Edge itself crashed. The browser profile held 151 crash reports from 23:53 to 09:08 UTC of that run, and the 147 analysed were all the same: exception `0x80000003` (a deliberate breakpoint) at `msedge.dll+0x43e1824`, Edge 157.0.4341.42, launched by moodle-mcp 0.8.0, which tries Edge first. What triggers it isn't known. It didn't reproduce outside the app (52 rounds of opening pages, headless and with a window, on the same profile and a new one), and a later 14-minute run from the app, after signing in again over HTTP, published a whole unit and two quizzes without a crash. After a crash, `import_questions` answers `Activity N has no question bank you can import into`, even for a quiz that had imported questions, so the agent blames the bank. That message and the choice of browser are moodle-mcp's, so the fix may land there.

## Solution

Pending, tracked in https://github.com/falkenslab/moodle-mcp/issues/57. Retry the tool when the browser is lost, and don't report a lost browser as a missing bank. The teacher can't choose the browser: `MOODLE_MCP_CHANNEL` doesn't reach the server, because the extension launcher only passes the variables its manifest declares, and editing the manifest makes miyagi turn the extension off. A browser option in the extension would give a way out.

## Verification

Pending. Find what triggers the crash, and check that a unit built while the browser is killed on purpose ends complete, with the question count in Moodle matching the GIFT files.
