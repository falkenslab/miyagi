---
name: assignment-building
description: Design an assignment of any kind - written answer, file submission, group work, project milestone, lab report, case analysis, portfolio, oral presentation or video, drafts with resubmission - with a statement that asks for real reasoning or production, the submission settings that match it, due and cut-off dates, and its rubric. Use whenever an assignment has to be created or reconfigured.
---

# Designing an assignment

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

Without a classroom, write the statement and its rubric in `drafts/` and say where they are;
with one, the classroom extension's assignment skill sets it up there. This skill is what makes
it a good assignment.

An assignment is three things that have to agree: the **statement** (what to do, what to hand
in, how it's graded), the **submission settings** (what students can actually hand in, and when)
and the **grading** (rubric, marking). A statement that says "upload a PDF" on an assignment
that only accepts online text is the most common way to break one.

Its rubric comes from `rubric-design`; hands-on work is checked with `practice-testing` when the
workspace allows it. Check `course/moodle-capabilities` for what this classroom has.

## 1. Pick the kind

| Kind | Submission | Notes |
| --- | --- | --- |
| Short written answer / reflection | Online text, with a word limit if the statement sets one | The quickest to grade; feedback inline |
| Document (essay, report, lab report) | One file, in the formats the statement names | Say the format and naming in the statement |
| Code or technical deliverable | Files (a `.zip` or the files), or online text with a repository link | Check it with `practice-testing` when the workspace allows it |
| Group work / project milestone | One submission per group, on the course's groups | One grade per group; state each member's part |
| Drafts with feedback and resubmission | Students submit explicitly; new attempts granted after feedback | For formative work: feedback, then a new attempt |
| Portfolio | Several files, or online text with links; one assignment per checkpoint | Pair it with a reflection per entry |
| Oral presentation / video | Online text with the video link, or a file with a size limit that fits a video | Say the maximum length; grade with a rubric for content and delivery |
| Offline task graded in the classroom | No submission, only grading | For presentations or exams done in class |

Integrity options, when the task calls for them: students accept a submission statement,
anonymous submissions (graders don't see names), grades released together.

## 2. The statement

A good assignment asks for genuine reasoning, application or production (something that can't
be answered by restating the notes) and says what evidence of learning the submission must show,
not just a topic to write about. Complete enough that a student needs nothing else:

1. **Context and goal**: what they'll do and why it matters (one short paragraph).
2. **Steps or requirements**: numbered, concrete; for practical work, the commands or the
   starting files.
3. **What to hand in**: format, file names, length, where (online text or file).
4. **How it's graded**: the criteria and their weights, the same as the rubric; late and missing
   policy if there is one.
5. **Dates**: due date and, if different, the cut-off date after which nothing is accepted.

Write it in the course's style (look at two or three existing assignments first).

## 3. Settings that match it

- **Dates**: when submissions open, the due date, the cut-off date (late submissions accepted
  until then, marked late), and when to have it graded by; in the course's calendar order.
- **Submission types**: only the ones the statement asks for; for files, the number, size and
  accepted types. If a format can't be restricted to (e.g. `.md`), don't restrict: say it in the
  statement.
- **Late work**: a late penalty can be applied automatically only where the site allows it. If
  it doesn't, say so to the teacher ("ask the site admin to enable grade penalties, or apply it
  by hand"), never that it can't be done. The cut-off date is what closes submissions.
- **Feedback**: written feedback comments on; feedback files if you'll return annotated documents.
- **Grade**: the maximum the rubric adds up to; the grade category if the gradebook uses them.
- **Groups** when it's group work.
- **Completion conditions** if the unit uses them (e.g. "receive a grade" to unlock the next part).

## 4. Rubric

Every assignment graded by hand gets its rubric on the grading form (`rubric-design`), with the
same criteria and weights as the statement.

## 5. Publish and check

Saving the assignment is one publication (one approval, with the statement's summary and the key
settings: dates, submission type, grade); defining its rubric is another. Run `publish-check`
before and after saving: the writing, accessibility, and, as a student would see it, that the
submission accepts exactly what the statement asks and the rubric is visible if it's meant to be.

Record it in its page `activity/<slug>`: the statement's summary, the settings, the rubric
(copy), and the assignment's link.
