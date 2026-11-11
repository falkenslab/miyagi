# Actions that run on their own

Issue: [#108](https://github.com/falkenslab/miyagi/issues/108)

## Goal

An action can run on a schedule or on an event (a new submission, a new forum post, a draft published), prepares its work and leaves it in Drafts with a notice: publishing still waits for the teacher's yes.

## Context

- Depends on `ui-schema`. Every action today is launched by hand. The desktop app already notifies (the bell) and refreshes catalogs on a timer (`catalogRefresh.ts`).
- Decided by the teacher: automatic actions prepare, the teacher publishes. Nothing reaches students without their yes (principles).

## Changes

- `trigger` in the schema: `schedule` (cron-like, in the subject's timezone) and `event` (`submission.new`, `post.new`, `draft.published`), with a minimum interval.
- The host runs a triggered action as a session of its own in a mode that can't publish (plan or guided with no one to approve): drafts, reports and its findings, then a notice in the bell with a link to resume.
- A list of the subject's automatic actions, last run and next, to pause or remove each.

- - -

## Acceptance

- A weekly action runs at its time with the app open, leaves its result in Drafts and a notice in the bell, and published nothing (checked in Moodle).
- An action on `submission.new` runs once per new submission and never twice for the same one.
- Pausing it stops it; the list shows its last run.

- - -
