---
name: course-alignment
description: Check that the Moodle course matches the teaching plan - every objective and criterion assessed by some activity, units, dates and weights as planned, nothing in the course the plan doesn't account for - and propose or make the changes to align them. Use when the teacher asks whether their course follows their programación / teaching plan, after writing or changing the plan, or before the course starts.
---

# Aligning the course with the teaching plan

The teaching plan says what should happen; the Moodle course is what students actually get. This
skill finds where they differ and closes the gap — in the course when the plan is right, or by
telling the teacher when the plan should change.

It needs `knowledge/teaching-plan.md` (see `teaching-plan`). If there isn't one, say so and offer
to write it first; don't reconstruct a plan from the course and then "align" the course to it.

## 1. Build the two maps

- **From the plan**: units (order, dates, hours, weight), objectives and criteria per unit, the
  activities and instruments that assess each criterion, the grading weights.
- **From Moodle** (`moodle-navigation`, the gradebook's setup and the grader report): sections in
  order with their dates, every activity with its type, dates, grade and weight, its rubric's
  criteria if it has one, completion and restrictions.

## 2. Compare

Write the comparison into `knowledge/syntheses/course-alignment.md` (dated, a new entry each
time), as a table per unit and a list of gaps:

- **Coverage**: criteria with no activity assessing them; activities that assess nothing in the
  plan.
- **Instruments**: an activity the plan grades with a rubric that has none in Moodle, or whose
  rubric's criteria don't match the plan's.
- **Weights**: gradebook weights vs. the plan's grading section; the course total's scale.
- **Calendar**: section and activity dates vs. the plan's timing; deadlines out of order or
  colliding.
- **Units**: planned units missing from the course, sections the plan doesn't mention.
- **Methodology**: a unit planned as a project, a flipped classroom… that in Moodle is just notes
  and a quiz.

Rank the gaps: what students would hit first (a missing rubric, a wrong weight, a missing unit)
before what's cosmetic.

## 3. Close the gaps

For each gap, decide with the teacher (in `chat`) or propose (in `run`):

- the course is wrong → fix it: settings and rubrics with the usual skills, a missing unit with
  `unit-building`, a missing activity with `assignment-building` or `activity-building` — each
  change a publication with its own approval (an identical setting change on several items may
  share one, naming each; new or rewritten texts never do);
- the plan is wrong or outdated → don't touch the course; tell the teacher what to change in the
  plan, and update `teaching-plan.md` only if they confirm.

Never delete activities or student work to "align" anything: propose it.

## 4. Report

The alignment table, what was fixed, what's left for the teacher to decide, and the date of this
check in the synthesis page.
