---
name: rubric-design
description: Build a rubric or grading guide from scratch - observable criteria and clear performance levels - when an activity doesn't already have one, instead of grading purely from memory of the prompt.
---

# Building a rubric, not just applying one

`grading-rubric` covers grading with criteria that already exist (Moodle's own rubric, something left in `sources/`, or one already noted in the activity's knowledge base page). This skill is for when none of those exist yet and criteria need to be constructed — typically while setting up a new evaluable activity (alongside `assignment-building` or `activity-building`), or the first time an existing activity is about to be graded with nothing to go on but its prompt.

## What makes a good criterion

- **Observable**: something a grader can point to in the actual submission ("identifies at least two causes and explains their relationship"), not a vague quality ("shows good understanding").
- **Non-redundant**: each criterion should assess something the others don't — two criteria that would almost always move together (e.g. "clarity" and "organization", worded so similarly they're graded identically in practice) are a sign to merge them.
- **Actually assessable from what's submitted**: a criterion that requires information the submission format can't provide (e.g. judging "effort" from a short-answer field) isn't usable — drop it or rephrase it into something the format can actually show.

## Performance levels

Define what separates each level in concrete terms (what's present at the top level that's missing at the one below), not just a label ("excellent" / "good" / "needs improvement") with no distinguishing description — a label alone forces every grading decision back to subjective judgment, defeating the point of having a rubric.

## Where it goes

Set it up in Moodle itself whenever the activity supports it (assignments do), so it's on the grading form: the activity's "Advanced grading" tab → "Change active grading method to" Rubric → "Define new grading form from scratch" → criteria and levels → "Save rubric and make it ready". Each level needs its own description and points; the points of each criterion's top level add up to the activity's maximum grade. Saving it is a publication (students see the rubric on the activity): ask for approval with the criteria and levels in the summary. Also keep a copy in the activity's page, `knowledge/activities/<slug>.md`, so `grading-rubric` and later sessions can read it without opening Moodle.

A rubric on the grading form is the norm for anything graded by hand; a criteria table in the statement is useful for students but doesn't replace it. Only where no rubric can be attached (e.g. a quiz's essay question) does the knowledge-base copy stand alone.

## Detecting problems in an existing rubric

The same criteria above apply when reviewing one that already exists: flag criteria that are subjective, redundant with another, or not actually checkable from the submission format — the same three checks as when building one from scratch.
