# Moodle's browser doesn't start on a long data path

Issue: [#93](https://github.com/falkenslab/miyagi/issues/93)

## Problem

With a long data folder, Edge failed to start for the classroom (`launchPersistentContext` … `browser has been closed`), so the agent couldn't reach Moodle. It tried to get round it by calling `configure` to move the browser profile to a temporary folder, a persistent change to the extension's setup.

## Cause

The browser profile lives under `<data>/.miyagi/extensions/.data/moodle-teacher/profile`, and the failure went away when the same data was moved to a much shorter path. The exact length limit wasn't measured.

## Solution

Pending, tracked in https://github.com/falkenslab/moodle-mcp/issues/58. Detect the failure and tell the teacher what's wrong, or keep the profile on a short path. The agent shouldn't change the profile folder on its own to work around it.

## Verification

Pending. Start a session with a data folder of the failing length and check the outcome, and that the profile setting stays as it was.
