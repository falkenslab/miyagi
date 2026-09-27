---
name: activity-building
description: Design and build Moodle's other activities - workshop (peer assessment), lesson (branching paths), glossary, wiki, database, choice, feedback survey, forum activities and graded forums, H5P - so each one really works as intended, plus the pieces that connect activities - completion conditions, access restrictions, badges and groups. Use when a unit needs something other than a resource, an assignment or a quiz, or a methodology needs these mechanics (peer review, itineraries, gamification, cooperative work).
---

# Designing and building other activities

For each type: what makes it work (the design) and how to set it up in Moodle so it behaves that way. Assignments are `assignment-building`, quizzes `quiz-building`, pages and books `resource-authoring`. Which type fits a point of the unit, and why, comes from `course-design` and `teaching-methodologies`.

Check `knowledge/moodle-capabilities.md` first: only create types the installation offers ("Add content" → "Activity or resource" lists them). Every activity gets a complete description — what to do, how, by when, how it's assessed — and every save is a publication with its own approval.

## Workshop — peer assessment

For work students assess among themselves (project drafts, essays, designs).

- **Design both phases**: the submission prompt as concrete as an assignment's (`assignment-building`), and the assessment criteria as a rubric (`rubric-design`) so students know what to look for. 2–4 assessments per student: fewer defeats it, more is busywork. Give an assessed example if they haven't done peer review before.
- **Phases**: "Setup phase" → "Submission phase" → "Assessment phase" → "Grading evaluation phase" → "Closed". The dates ("Open for submissions from", "Open for assessment from" and their deadlines) are what open and close each phase for students; switching the phase early is harmless if they're set, and useless if they aren't. Say the dates in the description.
- **Grades**: one for the submission (from peers' assessments), one for the quality of each student's assessments.
- **Assessment form**: rubric or accumulative grading; it only takes whole points per level — if the criteria use halves, scale the rubric (×2, ×4), the workshop normalizes it. "Use self-assessment" if students also assess their own.
- **Allocation**: "Allocate submissions" (random allocation); "Scheduled allocation" runs it when the submission phase ends (it needs the site's cron, which every real Moodle has).
- **Teams reviewing teams**: with "Separate groups" Moodle allocates reviewers from the same group — the opposite of peer review between teams. Use "Visible groups" and "Prevent reviews by peers from the same group".

## Lesson — branching paths

For guided sequences with decisions: an itinerary adapted to the answers, an escape-room style activity, a case with choices.

- **Design the branches**: a wrong answer to a checkpoint leads to a page that addresses that misconception, not a generic "try again". A lesson without real branches is a page with extra clicks — use a page instead. Draw the path in the unit's topic page before building it.
- **Build**: content pages ("Add a content page") with buttons to other pages, question pages ("Add a question page") that jump by answer; graded or practice; attempts per question; retakes.
- Walk every branch: each one must end somewhere — a dead end blocks the student.

## Collaborative activities: glossary, wiki, database

Build in **individual accountability**: without a clear share of the work (a wiki section, a set of glossary terms, entries per student), the first to contribute does everything and the rest free-ride. The history of each tool shows who did what, which makes it gradable.

- **Glossary**: shared vocabulary; "Add a new entry", approval before entries are visible, auto-linking of terms across the course.
- **Wiki**: "Wiki mode" — "Collaborative wiki" (one per group with group mode) or "Individual wiki" (e.g. a learning journal). Seed the first page with the expected structure.
- **Database**: entries with the "Fields" you define (text, URL, image, file, menu…) — a bibliography, a gallery of projects, solved exercises. Define fields and templates before opening it.

## Forum as an activity

(Running the forum day to day is `forum`.) The opening prompt invites more than a one-line reaction: a question with more than one defensible position, or a concept to apply to a case. If participation is graded, say the minimum (e.g. one post and two replies) and grade it with "Whole forum grading" and a rubric, not by counting posts.

| Type | Use |
| --- | --- |
| Standard forum for general use | Open discussion, doubts |
| Q and A forum | Everyone answers before seeing the others' answers |
| Each person posts one discussion | Everyone presents their work, others comment |
| A single simple discussion | One focused debate |

Group mode for team forums.

## Choice and feedback (survey)

- **Choice**: one question with a real purpose (assigning debate sides, choosing a project topic, scheduling), stated in the prompt. "Allow choice to be updated" if they may change their mind; limit answers per option to balance groups.
- **Feedback**: questionnaires without right answers (course evaluation, a needs survey, a project retrospective). Every question has a reason to be asked; specific enough to need an honest answer ("what was the hardest part of this topic and why", not "how did you find it"). "Anonymous" when honesty matters more than follow-up.

## H5P

Interactive content (interactive video with questions, drag and drop, flashcards, course presentation): good for flipped classroom and self-checks. Check which content types the site has before planning one.

## Connecting activities

- **Completion conditions**: what counts as done (view, submit, receive a grade, pass). Needed for everything below; turn completion tracking on for the course if it's off.
- **Restrict access** ("Add restriction..."): by date, by completion of another activity, by grade, by group — for itineraries and gamified levels. Say in the section summary what unlocks what, or students will think content is missing.
- **Badges**: "Manage badges" → "Add a new badge", awarded on "Activity completion", course completion, or "Manual issue by role" when the condition isn't a completion or a grade ("the team fixed the four critical flaws"). Name what it certifies ("Contenedores: nivel 1"), and enable access once its criteria are set.
- **Groups and groupings**: create them before the activities that use them; separate groups hide other teams' work, visible groups show it.

## After creating

Run `publish-check`, walking every path (every branch of a lesson, every phase of a workshop, what a locked activity says), and record the activity in `knowledge/activities/<slug>.md` with its settings and URL.
