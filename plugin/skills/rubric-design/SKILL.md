---
name: rubric-design
description: Build a rubric or grading guide from scratch - observable criteria and clear performance levels - when an activity doesn't already have one, instead of grading purely from memory of the prompt.
---

# Building a rubric, not just applying one

`grading-rubric` covers grading with criteria that already exist (Moodle's own rubric,
something left in `sources/`, or one already noted in the activity's knowledge base page). This skill is for
when none of those exist yet and criteria need to be constructed — typically while setting
up a new evaluable activity (alongside `content-authoring`), or the first time an existing
activity is about to be graded with nothing to go on but its prompt.

## What makes a good criterion

- **Observable**: something a grader can point to in the actual submission ("identifies
  at least two causes and explains their relationship"), not a vague quality ("shows good
  understanding").
- **Non-redundant**: each criterion should assess something the others don't — two
  criteria that would almost always move together (e.g. "clarity" and "organization",
  worded so similarly they're graded identically in practice) are a sign to merge them.
- **Actually assessable from what's submitted**: a criterion that requires information the
  submission format can't provide (e.g. judging "effort" from a short-answer field) isn't
  usable — drop it or rephrase it into something the format can actually show.

## Performance levels

Define what separates each level in concrete terms (what's present at the top level that's
missing at the one below), not just a label ("excellent" / "good" / "needs improvement")
with no distinguishing description — a label alone forces every grading decision back to
subjective judgment, defeating the point of having a rubric.

## Where it goes

If the activity has Moodle's native rubric/grading-guide feature available, prefer setting
it up there (via "Turn editing on" → the activity's grading method settings) so it's
visible on the grading form itself — check `knowledge/moodle-capabilities.md` if it exists
for what this installation supports. Otherwise, save the rubric in the activity's page, `knowledge/activities/<slug>.md`,
so `grading-rubric` (and future gradings of the same activity) can reuse it consistently.

## Detecting problems in an existing rubric

The same criteria above apply when reviewing one that already exists: flag criteria that
are subjective, redundant with another, or not actually checkable from the submission
format — the same three checks as when building one from scratch.
