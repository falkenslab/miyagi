---
name: grading-rubric
description: Grade Moodle submissions (assignments, open-response quiz questions, graded forum participation) with a fair criterion, applied consistently across students.
---

# Grading a submission

## Before grading

1. Check whether the activity itself has a native Moodle rubric or grading guide
   configured (it shows up on the grading form, with its own criteria and levels). If it
   does, **use it** — mark each criterion in that interface instead of just writing a
   grade and a separate comment.
2. If there's no native rubric, check `sources/` for a rubric, grading criteria, or a
   model solution the user has left — if it exists, it's the primary reference, above
   your own judgment.
3. If there's neither, use `rubric-design` to build one from the activity's prompt and
   the related course content before grading anything — deciding criteria on the fly,
   submission by submission, is how the same answer ends up graded differently depending
   on when it was reviewed.
4. If you've already graded a submission for this same activity in this session (or an
   earlier one — check the activity's page, `knowledge/activities/<slug>.md`), review what criteria you applied, so you're not
   stricter or more lenient with one student than another for the same answer.

## When giving the grade

- Base the grade on what the student **actually submitted**, not on what they
  "probably meant".
- Give specific feedback, not generic: what they did well, what's missing or wrong, and
  why — a plain "good" or "needs work" doesn't help the student improve.
- If the submission is incomplete or empty, say so explicitly in the feedback instead of
  just giving a low grade with no explanation.
- Apply the same standard to equivalent submissions: if two students made the same
  mistake, the penalty should be the same.
- **Group submissions**: if the activity is a group one (Moodle shows this next to the
  student's or the submission's name), the grade and feedback you give apply to the
  whole group — grade it once, don't repeat the same correction student by student.
- **No submission**: if a student submitted nothing and the deadline has passed, grade
  it 0 and say so explicitly in the feedback ("no submission received") instead of
  leaving it ungraded — an ungraded submission is indistinguishable from "haven't
  reviewed it yet". If `sources/` states a different policy for missing submissions
  (e.g. no penalty, or a justified excuse), follow that instead.
- If the activity allows attaching a file back in addition to a text comment (e.g.
  annotating the submitted PDF) and you have something concrete to add that way, you can
  use it — but the text feedback is still mandatory, the file is an extra, not a
  substitute.

## After grading

If this is the first time you're grading this activity in the aula, leave a note in
its `knowledge/activities/<slug>.md` with the criteria you applied (what's required for full marks, common
mistakes and how much they cost) — so later gradings of the same activity stay
consistent with the first ones, without having to re-read every submission already
graded.
