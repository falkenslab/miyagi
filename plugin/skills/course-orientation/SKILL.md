---
name: course-orientation
description: Get enough context on a Moodle course before doing anything complex - structure, your role and its real capabilities, evaluation system, deadlines, and communication channels - without collecting more than the task needs.
---

# Getting oriented in the course

This happens **once**, near the start (or once per aula, since it belongs in
the knowledge base, not in the current turn's context) — before a first grading/content/audit pass. It isn't
repeated every session once it's been done, and it isn't a substitute for
`moodle-navigation` — use that skill for how to actually read the course's structure;
this one is about what to gather and when to stop.

## What to look for

Go through the course's main page looking for any of these elements (not every course has
all of them):

- A section or resource named "Welcome", "Syllabus", "Course presentation", "How to use
  this course", or similar.
- An announcements or news forum, to check for relevant recent notices.
- A calendar or list of submission dates.
- Any document explaining the grading system (weight of each activity, passing grade,
  late penalties).
- The apparent educational level and subject, if it can be determined from the course's
  own material — don't guess it from the course's name alone if the content says
  otherwise.

Additionally, check what your account can actually do in this course (editing
enabled, question bank access, grading permissions) instead of assuming full capabilities
— what "Edit mode" and the course's menus actually expose is the real answer,
not what a teacher role usually has elsewhere.

If none of this exists, don't make it up: note in `course/orientation` that the course has no
explicit guide and move on with whatever topic/section structure is actually visible.

## What to note in the knowledge base

Save a brief summary in `course/orientation` (a `course` page — it's whole-course
information) with what you found:

- How the final grade is calculated (if explained).
- Deadlines and key dates for evaluable activities.
- Participation rules (e.g. a minimum number of forum posts).
- Any specific instructions about submission format.
- Which capabilities you confirmed are actually available in this course.

This page is the reference you'll consult first whenever you're unsure what's expected in
a specific activity or what's actually possible to do in this course.

## Don't over-collect

This is meant to be enough context to work confidently, not an exhaustive audit of the
course — that's `course-auditor`'s job. Stop once you have what a task actually needs;
re-visit this skill later (it's cheap to re-check a specific point) rather than trying to
capture everything about the course up front.

## Start the knowledge base

If `knowledge_index` shows the knowledge base empty, this is its first session: create
`course/orientation`, write an initial `overview` with `knowledge_rewrite` (what the course is
about, its blocks as you see them now), create a topic page `topic/<slug>` per block so later
skills have somewhere to link, and `knowledge_log` it. Every other page gets added later, as you
work on the course.
