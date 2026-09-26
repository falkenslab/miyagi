---
name: course-building
description: Build a complete Moodle course from a description (subject, level, length) - plan it with course-design, then create every section, resource and activity with real content, check it as a student would see it, and leave the plan in the knowledge base. Use when asked to create or set up a whole course, or a whole unit, rather than a single activity.
---

# Building a complete course

A course built this way has to hold up as a real one: a student should be able to take it from
the first section to the last without meeting an empty page, a placeholder or an activity whose
instructions don't say what to do. This skill orchestrates the others; it doesn't replace them.

## 1. Understand the request

From the description, pin down: subject, level (and so the register of the texts), length
(number of units or weeks), the language of the course, and anything the teacher asked for
explicitly (a practice per unit, a final project, a weekly quiz...). Check `sources/` for a
syllabus or notes: they win over your own idea of the subject. What's still ambiguous and would
change the structure (e.g. "a course on Docker" — for beginners or for sysadmins?), ask about in
`chat`; in `run`, make the most reasonable call and state it in the plan.

If the course already has content, don't build over it: say what's there and ask (in `run`,
build only in empty sections and report what you left alone). Never delete anything.

## 2. Plan before creating anything

Use `course-design` to write the plan into the knowledge base as `knowledge/course-plan.md`
(a synthesis page, listed in `index.md`) before touching Moodle:

- the course's objectives, observable ("configure...", "explain why...");
- one row per section: title, objectives it covers, its resources, its activities (type,
  graded or not, how it's assessed), and how it connects to the next;
- the evaluation: weights, and which activities are formative vs. summative;
- a welcome section: what the course is about, how it's organized, how it's graded, where to
  ask (the forum).

Check `knowledge/moodle-capabilities.md` for what this Moodle can create; if it doesn't exist,
look at the "Activity or resource" chooser once before planning activity types.

## 3. Create it, section by section

In order, one section at a time, finishing each before starting the next:

1. **The section**: in edit mode, name it ("Edit section name" on its "New section" title, or
   "Add section" at the end of the course when more are needed) and write its summary: what
   the student will learn and do there.
2. **Resources** (`content-authoring`): a page with the section's actual content — explained,
   with examples, at the course's level — not an outline of what "will be covered".
3. **Activities** (`activity-design`, and `rubric-design` for anything graded by hand; for
   quizzes `quiz-design`, and `quiz-bulk-import` when there are several questions): complete
   instructions, what to hand in, how it's graded, a due date that fits the course's pace.
   **Every activity graded by hand gets a rubric in Moodle** — "Advanced grading" → Rubric,
   built with `rubric-design` from the criteria in its statement, levels with a description
   each (not just points), saved and made ready. A criteria table in the statement doesn't
   replace it: the rubric is what shows up in the grader, gets marked criterion by criterion
   and keeps the same answer on the same grade. A request that mentions a rubric for one
   activity ("a final task with a rubric") is not a request to leave the others without one;
   skip rubrics only if the teacher says so, and say in the report which activities have none.
   A hands-on activity (commands to run, code to write, a container to build) is checked with
   `practice-testing` before it's published, when the workspace allows it; if it doesn't, say in
   the report which practices weren't run.
4. **Order and visibility**: activities after the resources they depend on; access
   restrictions only if the plan calls for them.

Every save in Moodle is a publication: in `guided` or `chat` it needs its own approval, with a
summary of what that section or activity contains. One item per approval: three sections are
three approvals, and creating a quiz and importing its questions are two (the second listing
every question, see `quiz-bulk-import`). A summary that announces "and then I'll add X" hides X
from whoever approves it. Run each text through `content-editor` and
`accessibility` before saving it.

Record in the plan page, as you go, what was actually created (with its Moodle URL) — the
course map and the activity pages follow the usual knowledge-base rules.

## 4. Check it as a student

When everything is created: go through the course from the top as a student would ("Switch
role to..." → Student from your user menu, then back with "Return to my normal role"), or at
least with each activity's "Preview". Look for empty sections, activities without
instructions, quizzes with no questions or a total grade of 0, broken links and dates out of
order. Fix what you find (each fix is a publication too).

Then check that the settings say what the texts promise — the gap students would find first:

- **The gradebook** (Grades → the grader report and "Gradebook setup"): the weights are the
  ones in the plan, and the course total uses the scale the course guide announces. With
  "Natural" aggregation the total is the sum of every item's maximum (seven items out of 10
  show as "out of 70"); if the guide says "out of 10", use an aggregation whose total you can
  set (e.g. "Weighted mean of grades" with the course total's maximum at 10), or make the
  items' maximums add up to it — then look at the grader report again.
- **Submission settings**: accepted file types, sizes, group submission, attempts and dates as
  the statement says. If Moodle doesn't know a file type the statement accepts (`.md` isn't in
  its list), say so in the statement instead of promising a restriction that doesn't exist.

## 5. Report

Summarize what was built: sections with their resources and activities, the evaluation, the
decisions you took on your own (and why), and what's left for the teacher to review — the
items worth a human look before students arrive.
