---
name: course-orientation
description: Get enough context on the classroom's course before doing anything complex - structure, your role and its real capabilities, evaluation system, deadlines, and communication channels - without collecting more than the task needs.
---

# Getting oriented in the course

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

Needs a connected classroom; without one, build what you can in `drafts/` and say so.

This happens **once**, near the start (it belongs in the knowledge base, not in the current
turn's context), before a first grading, content or audit pass. It isn't repeated every
session once it's been done. Reading the course's real state (its sections, activities, your
role and what it allows) is the classroom extension's: load its read-a-course skill for how;
this one is about what to gather and when to stop.

## What to look for

Go through the course looking for any of these elements (not every course has all of them):

- A section or resource named "Welcome", "Syllabus", "Course presentation", "How to use
  this course", or similar.
- An announcements or news forum, to check for relevant recent notices.
- A calendar or list of submission dates.
- Any document explaining the grading system (weight of each activity, passing grade,
  late penalties).
- The apparent educational level and subject, if it can be determined from the course's
  own material: don't guess it from the course's name alone if the content says
  otherwise.

Additionally, check what your account can actually do in this course (edit, grade, manage
questions) instead of assuming full capabilities: what the classroom says your role allows is
the real answer, not what a teacher role usually has elsewhere.

If none of this exists, don't make it up: note in `course/orientation` that the course has no
explicit guide and move on with whatever structure is actually there.

## What to note in the knowledge base

Save a brief summary in `course/orientation` (a `course` page: it's whole-course information)
with what you found:

- How the final grade is calculated (if explained).
- Deadlines and key dates for evaluable activities.
- Participation rules (e.g. a minimum number of forum posts).
- Any specific instructions about submission format.
- Which capabilities you confirmed are actually available in this course.

This page is the reference you'll consult first whenever you're unsure what's expected in
a specific activity or what's actually possible to do in this course.

## Don't over-collect

This is meant to be enough context to work confidently, not an exhaustive audit of the
course (that's `course-auditor`'s job). Stop once you have what a task actually needs;
re-visit this skill later (it's cheap to re-check a specific point) rather than trying to
capture everything about the course up front.

## Start the knowledge base

If `knowledge_index` shows the knowledge base empty, this is its first session: create
`course/orientation`, write an initial `overview` with `knowledge_rewrite` (what the course is
about, its blocks as you see them now), create a topic page `topic/<slug>` per block so later
skills have somewhere to link, and `knowledge_log` it. Every other page gets added later, as you
work on the course.
