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
   earlier one — check the activity's page, `activity/<slug>`), review what criteria you applied, so you're not
   stricter or more lenient with one student than another for the same answer.
5. Check that the grading form can actually hold what you're going to write. An assignment
   only shows a feedback box if "Feedback comments" is enabled in its settings ("Feedback
   types"), and plenty of courses leave it off. If the criteria in use
   require written feedback and it's off, enabling it is a settings change: ask for approval
   first like any other publication, then do it in the activity's settings
   (`course/modedit.php?update=<cmid>`), and only then start grading.

In Moodle 4.x/5.x an assignment's submissions are listed at
`mod/assign/view.php?id=<cmid>&action=grading`, and each one opens in the grader at
`mod/assign/view.php?id=<cmid>&action=grader&userid=<id>` — save each grade there before
moving to the next student.

The grader's feedback box is a rich-text editor (TinyMCE) over a hidden textarea, and "Save
changes" sends the textarea, not what the editor shows. Text put into the editor with
JavaScript (`ed = tinymce.get('id_assignfeedbackcomments_editor'); ed.setContent(...)`) never
reaches it unless you also call `ed.save()` before saving; typing into the editor does.
Otherwise Moodle saves the grade with an empty comment, and says nothing. So after saving,
reload the grader for that
student (or look at the "Feedback comments" column of the submissions table) and check that
**both** the grade and the comment are there — checking only the grade is how a whole batch
ends up with no feedback. Never tell the teacher that students received a comment you
haven't seen saved.

## When a rubric level is a range

Rubrics often give a range for a partial level ("1-2 points if some example is missing or
wrong"). Decide the rule the first time the range applies — e.g. "3 of 4 examples correct →
2, 2 or fewer → 1" — and write it down in the activity's page before grading the next
submission, so the same situation always lands on the same number. Mention the rule in the
feedback when it decides the grade.

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
its page `activity/<slug>` with the criteria you applied (what's required for full marks, common
mistakes and how much they cost) — so later gradings of the same activity stay
consistent with the first ones, without having to re-read every submission already
graded.
