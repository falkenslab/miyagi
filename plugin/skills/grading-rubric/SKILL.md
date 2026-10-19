---
name: grading-rubric
description: Grade submissions in the classroom (assignments, open-response quiz questions, graded forum participation) with a fair criterion, applied consistently across students.
---

# Grading a submission

Needs a connected classroom; without one, build what you can in `drafts/` and say so.

This skill is the criterion. Reading the submissions and saving grades and feedback in the
classroom is the classroom extension's: load its grading skill alongside this one, and use its
tools, not your guesses about the platform's screens.

## Before grading

1. Check whether the activity has its own rubric or marking guide in the classroom. If it
   does, **use it**: mark each criterion there instead of just writing a grade and a separate
   comment.
2. If there's none, check `sources/` for a rubric, grading criteria, or a model solution the
   teacher has left. If it exists, it's the primary reference, above your own judgment.
3. If there's neither, use `rubric-design` to build one from the activity's prompt and the
   related course content before grading anything: deciding criteria on the fly, submission
   by submission, is how the same answer ends up graded differently depending on when it was
   reviewed.
4. If you've already graded a submission for this same activity in this session (or an
   earlier one: check the activity's page, `activity/<slug>`), review what criteria you
   applied, so you're not stricter or more lenient with one student than another for the same
   answer.
5. Check that the activity can actually hold what you're going to write. Many assignments
   don't accept feedback comments unless that's turned on in their settings. If the criteria
   in use require written feedback and it's off, turning it on is a settings change: ask for
   approval first like any other publication, then change it, and only then start grading.

Students may reach you as aliases rather than names. Grade the alias as it comes, never try
to find out who is behind it, and write the feedback to the student, not to the alias.

## When a rubric level is a range

Rubrics often give a range for a partial level ("1-2 points if some example is missing or
wrong"). Decide the rule the first time the range applies (e.g. "3 of 4 examples correct →
2, 2 or fewer → 1") and write it down in the activity's page before grading the next
submission, so the same situation always lands on the same number. Mention the rule in the
feedback when it decides the grade.

## When giving the grade

- Base the grade on what the student **actually submitted**, not on what they
  "probably meant".
- Give specific feedback, not generic: what they did well, what's missing or wrong, and
  why. A plain "good" or "needs work" doesn't help the student improve.
- If the submission is incomplete or empty, say so explicitly in the feedback instead of
  just giving a low grade with no explanation.
- Apply the same standard to equivalent submissions: if two students made the same
  mistake, the penalty should be the same.
- **Group submissions**: if the activity is a group one, the grade and feedback you give
  apply to the whole group. Grade it once; don't repeat the same correction student by
  student.
- **No submission**: if a student submitted nothing and the deadline has passed, grade
  it 0 and say so explicitly in the feedback ("no submission received") instead of
  leaving it ungraded: an ungraded submission is indistinguishable from "haven't
  reviewed it yet". If `sources/` states a different policy for missing submissions
  (e.g. no penalty, or a justified excuse), follow that instead.
- If the activity allows attaching a file back in addition to a text comment (e.g.
  annotating the submitted PDF) and you have something concrete to add that way, you can
  use it. The text feedback is still mandatory: the file is an extra, not a substitute.

## Check what was saved

After saving each grade, read it back with the classroom's read tools and check that **both**
the grade and the comment are there: checking only the grade is how a whole batch ends up
with no feedback. Never tell the teacher that students received a comment you haven't seen
saved.

## After grading

If this is the first time you're grading this activity, leave a note in its page
`activity/<slug>` with the criteria you applied (what's required for full marks, common
mistakes and how much they cost), so later gradings of the same activity stay consistent with
the first ones without re-reading every submission already graded.
