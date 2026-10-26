---
name: course-building
description: Build a complete course in the classroom from a description (subject, level, length) - its teaching plan first, then the welcome section and every unit with real content, activities and rubrics, then the course-wide checks (gradebook, calendar, as a student). Use when asked to create or set up a whole course; one unit is unit-building.
---

# Building a complete course

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

Needs a connected classroom; without one, build what you can in `drafts/` and say so.

A course built this way has to hold up as a real one: a student should be able to take it from
the first section to the last without meeting an empty page, a placeholder or an activity whose
instructions don't say what to do. This skill orchestrates the others; each unit is built with
`unit-building`.

## 1. Understand the request

From the description, pin down: subject, level (and so the register of the texts), length
(units or weeks), the course's language, and anything the teacher asked for explicitly (a
practice per unit, a final project, a methodology). `sources/` wins over your own idea of the
subject. What's ambiguous and would change the structure ("a course on Docker" — for beginners
or for sysadmins?), ask about in `chat`; in `run`, make the most reasonable call and say so.

If the course already has content, don't build over it: say what's there and ask (in `run`,
build only in empty sections and report what you left alone). Never delete anything.

## 2. The plan is the teaching plan

There is one plan: `course/teaching-plan` (`teaching-plan`). If the teacher has one, the
course follows it — units, objectives, criteria, methodology, calendar, weights. If not, draft it
with `teaching-plan` before touching the classroom, marking as a proposal everything the teacher didn't
decide, with `course-design` for the structure and `teaching-methodologies` for each unit's
methodology. It must include a welcome section: what the course is about, how it's organized, how
it's graded, where to ask.

Research with `topic-research` anything in the subject that may have changed (versions,
commands, current practice), ask `pedagogy-reviewer` to review the plan and revise it, and check
`course/moodle-capabilities` for what this classroom can create (if it doesn't exist, run
`explore` or read the site's activity types once before planning them).

## 3. Build it, unit by unit

Before the first unit, `materials/course.md` (each group's start, the holidays, the evaluations)
and `materials/grading.md` (the categories and weights the plan says, adding up to 100 %), in
`materials-format`: the dates of every unit and the gradebook come from them.


1. **Welcome section**: its summary, a course guide (`resource-authoring`: objectives, calendar,
   evaluation, what to install, where to ask) and a forum for doubts (`activity-building`).
2. **Each unit, in order**, with `unit-building` — which writes the unit's part of the plan in its
   topic page, builds its resources and activities with their skills, gives every activity graded
   by hand its rubric (`rubric-design`), checks hands-on work with `practice-testing` when the
   workspace allows it, and checks the unit as a student. Finish a unit before starting the next.

Approvals follow `publish-check`: one item per approval when it's new content.

## 4. Course-wide checks

When every unit is built, the things no single unit can see:

- **As a student would see it**, the whole course from the top: sections in
  order, nothing empty or locked without explanation, dates that follow the calendar.
- **The gradebook**, decided before the first graded activity, not repaired after the last one: read in `course/moodle-capabilities` (or in the gradebook's setup) which aggregations the site offers, and create each graded item with the maximum grade the plan's weights need from the start (with only natural (sum) aggregation, a 10 % quiz and a 40 % project out of 100 are 10 and 40 points). The same for late penalties: promise one in a statement only if the site has them, or say it's applied by hand.
- **The gradebook, checked** (the grader report and the gradebook's setup, through the classroom extension's gradebook skill): the plan's weights, and a course
  total on the scale the course guide announces. With natural aggregation the total is the sum
  of every item's maximum (seven items out of 10 show as "out of 70"); if the guide says "out of
  10", use an aggregation whose total you can set (e.g. a weighted mean with the course
  total's maximum at 10) or make the items' maximums add up to it — then look again.
- **The plan vs. the course**: every unit built, every criterion assessed somewhere
  (`course-alignment` does this check in full).

## 5. Report

What was built (sections with their resources and activities), the evaluation, the decisions you
took on your own and why, what `pedagogy-reviewer` pointed out, and what the teacher should review
before students arrive — starting with every proposal in the teaching plan they haven't confirmed.
