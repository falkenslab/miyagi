---
name: assignment-building
description: Create a Moodle assignment of any kind - written answer, file submission, group work, project milestone, lab report, case analysis, portfolio, oral presentation or video, drafts with resubmission - with the statement, the submission settings that match it, due and cut-off dates, and its rubric. Use whenever an assignment has to be created or reconfigured; activity-design decides what it asks, this skill builds it.
---

# Building an assignment

An assignment in Moodle is three things that have to agree: the **statement** (what to do, what
to hand in, how it's graded), the **submission settings** (what Moodle actually lets students
upload, and when) and the **grading** (rubric, marking). A statement that says "upload a PDF"
on an assignment that only accepts online text is the most common way to break one.

Use `activity-design` for what the assignment asks and `rubric-design` for its rubric; this skill
is how to set it up. Check `knowledge/moodle-capabilities.md` for what this Moodle has.

## 1. Pick the kind

| Kind | Submission settings | Notes |
| --- | --- | --- |
| Short written answer / reflection | Online text, "Word limit" if the statement sets one | The quickest to grade; feedback inline |
| Document (essay, report, lab report) | File submissions, "Maximum number of uploaded files" 1, "Accepted file types" the formats the statement names | Say the format and naming in the statement |
| Code or technical deliverable | File submissions (a `.zip` or the files), or online text with a repository link | Check it with `practice-testing` when the workspace allows it |
| Group work / project milestone | "Students submit in groups", "Require group to make submission", group mode on the course's groups | One submission and one grade per group; state each member's part |
| Drafts with feedback and resubmission | "Require students to click the submit button", "Grant attempts" (manually or until pass), "Allowed attempts" | For formative work: feedback, then a new attempt |
| Portfolio | File submissions (several files) or online text with links, one assignment per checkpoint | Pair it with a reflection per entry |
| Oral presentation / video | Online text with the video link, or a file with a size limit that fits a video | Say the maximum length; grade with a rubric for content and delivery |
| Offline task graded in Moodle | No submission types (only grading) | For presentations or exams done in class |

Integrity options, when the task calls for them: "Require that students accept the submission
statement", "Anonymous submissions" (graders don't see names), "Use marking workflow" (grades
released together).

## 2. The statement

Complete enough that a student needs nothing else:

1. **Context and goal**: what they'll do and why it matters (one short paragraph).
2. **Steps or requirements**: numbered, concrete; for practical work, the commands or the
   starting files.
3. **What to hand in**: format, file names, length, where (online text or file).
4. **How it's graded**: the criteria and their weights, the same as the rubric; late and missing
   policy if there is one.
5. **Dates**: due date and, if different, the cut-off date after which nothing is accepted.

Write it with `content-authoring`, and run it through `content-editor` and `accessibility`.

## 3. Settings

- **Dates**: "Allow submissions from", "Due date", "Cut-off date" (late submissions accepted
  until then, marked late), "Remind me to grade by". Keep them in the course's calendar order.
- **Submission types**: only the ones the statement asks for; for files, the number, size and
  "Accepted file types". If a format isn't in Moodle's list (e.g. `.md`), don't restrict to it —
  say it in the statement.
- **Late work**: Moodle 5 can apply late penalties automatically ("Grade penalties" on the
  assignment, with the course's "Penalty rules": e.g. -20 % up to 3 days late), but only if the
  site administrator has enabled grade penalties for assignments. If the setting isn't there,
  say so to the teacher — "ask the site admin to enable grade penalties, or apply it by hand" —
  never that Moodle can't do it. The cut-off date is what closes submissions.
- **Feedback types**: "Feedback comments" on (written feedback), feedback files if you'll return
  annotated documents.
- **Grade**: the maximum the rubric adds up to; the grade category if the gradebook uses them.
- **Group mode and groups** when it's group work.
- **Completion conditions** if the unit uses them (e.g. "receive a grade" to unlock the next
  part).

## 4. Rubric

Every assignment graded by hand gets its rubric in Moodle (`rubric-design`: "Advanced grading" →
Rubric → "Save rubric and make it ready"), with the same criteria and weights as the statement.

## 5. Publish and check

Saving the assignment is one publication (one approval, with the statement's summary and the
key settings: dates, submission type, grade); saving its rubric is another. Afterwards open the
assignment as a student would ("Switch role to..." or preview) and check the statement, the
dates, that the submission form accepts exactly what the statement asks, and that the rubric
is visible if it's meant to be.

Record it in `knowledge/activities/<slug>.md`: the statement's summary, the settings, the rubric
(copy), and the assignment's URL.
