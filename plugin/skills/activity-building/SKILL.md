---
name: activity-building
description: Create and configure Moodle's other activity types - workshop (peer assessment), lesson (branching paths), glossary, wiki, database, choice, feedback survey, forum variants and graded forums, H5P, book - plus the pieces that connect activities - completion conditions, access restrictions, badges and groups. Use when a unit needs something other than a page, an assignment or a quiz, or a methodology needs these mechanics (peer review, itineraries, gamification, cooperative work).
---

# Building other activities

`activity-design` decides what an activity asks and why; this skill is how to set it up in Moodle
so it behaves as designed. Check `knowledge/moodle-capabilities.md` first: only create types the
installation offers ("Add content" → "Activity or resource" lists them). Every save is a
publication with its own approval, and every activity gets a complete description: what to do,
how, by when, how it's assessed.

## Workshop — peer assessment

For work that students assess among themselves with a rubric (project drafts, essays, designs).

- It runs in phases the teacher switches: "Setup phase" → "Submission phase" → "Assessment
  phase" → "Grading evaluation phase" → "Closed". Say the dates of each phase in the description:
  Moodle doesn't switch them unless you configure the automatic switch.
- Two grades: one for the submission (from peers' assessments), one for the quality of each
  student's assessments.
- Assessment form: a rubric or accumulative grading with the criteria from `rubric-design`;
  "Use self-assessment" if students also assess their own.
- "Allocate submissions": random allocation, 3–4 assessments per student is usually enough;
  "Scheduled allocation" runs it by itself when the submission phase ends (it needs the site's
  cron, which every real Moodle has).
- **Teams reviewing teams**: with group mode "Separate groups", Moodle can only allocate
  reviewers from the same group — the opposite of peer review between teams. Use "Visible
  groups" and tick "Prevent reviews by peers from the same group" in the allocation.
- The dates ("Open for submissions from", "Open for assessment from" and their deadlines) are
  what really open and close each phase for students; switching the phase early is harmless if
  those dates are set, and useless if they aren't.
- The workshop's rubric only takes whole points per level: if the criteria use halves, scale
  the rubric (×2, ×4) — the workshop normalizes it to the activity's grade.
- Give examples of assessed work if students haven't done peer review before.

## Lesson — branching paths

For guided sequences with decisions: an itinerary adapted to the answers, an escape-room style
activity, a case with choices.

- Content pages ("Add a content page") with buttons that jump to other pages; question pages
  ("Add a question page") that jump depending on the answer.
- Draw the path before building it (in the unit's topic page), and check every branch ends
  somewhere — a dead end blocks the student.
- Graded or practice lesson; max attempts per question; retakes allowed or not.

## Glossary

Shared vocabulary, collected by students or by the teacher. "Add a new entry"; entries can be
approved before they're visible; auto-linking highlights terms across the course. Good for
cooperative work (each group defines part of the terms) and as a revision resource.

## Wiki

Collaborative writing. "Wiki mode": "Collaborative wiki" (one wiki everyone edits, per group
with group mode) or "Individual wiki" (each student their own, e.g. a learning journal). Seed the
first page with the structure you expect; the history shows each member's contribution.

## Database

Structured collections of entries with fields you define ("Fields": text, URL, image, file,
menu…): a bibliography, a gallery of projects, a repository of solved exercises. Define the
fields and the list and single templates before opening it to students.

## Choice

One question, several options: assign debate sides, choose a project topic, a quick poll. "Allow
choice to be updated" if they can change their mind; limit the answers per option to balance
groups.

## Feedback (survey)

Questionnaires without right answers: course evaluation, a needs survey at the start, a project
retrospective. "Anonymous" when honesty matters more than follow-up.

## Forum variants

| Type | Use |
| --- | --- |
| Standard forum for general use | Open discussion, doubts |
| Q and A forum | Each student must post before seeing the others' answers |
| Each person posts one discussion | Everyone presents their work, others comment |
| A single simple discussion | One focused debate |

A graded forum ("Whole forum grading", with a rubric) assesses participation with criteria, not
by counting posts. Use group mode for team forums.

## H5P and book

- **H5P**: interactive content (interactive video with questions, drag and drop, flashcards,
  course presentation). Good for flipped classroom and self-checks; check the content types
  available before planning one.
- **Book**: long content split into chapters, better than one long page for a unit's notes.

## Connecting activities

- **Completion conditions**: what counts as done (view, submit, receive a grade, pass). Needed
  for everything below; turn completion tracking on for the course if it's off.
- **Restrict access** ("Add restriction..."): by date, by completion of another activity, by
  grade, by group. Use it for itineraries and gamified levels; say in the section summary what
  unlocks what, or students will think content is missing.
- **Badges**: "Manage badges" → "Add a new badge", awarded on "Activity completion", course
  completion, or "Manual issue by role" when the condition can't be expressed as completion or a
  grade (e.g. "the team fixed the four critical flaws"). Name what the badge certifies
  ("Contenedores: nivel 1"), not just a reward, and enable access once its criteria are set.
- **Groups and groupings**: create them before activities that use them; separate groups hide
  other teams' work, visible groups show it.

## After creating

Preview it as a student would ("Switch role to..." → Student), walk every path (every branch of
a lesson, every phase of a workshop, what a locked activity says), and record the activity in
`knowledge/activities/<slug>.md` with its settings and URL.
