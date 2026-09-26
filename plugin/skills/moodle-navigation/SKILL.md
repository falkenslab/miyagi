---
name: moodle-navigation
description: Read a Moodle course's real structure - sections, activities, resources, access restrictions, completion states, and how activities relate to each other - instead of guessing from a resource's name alone.
---

# Reading a Moodle course's structure

This underlies almost everything else: before deciding what to do next (grade a
submission, audit a section), read what the course's structure actually says, not
what a resource's title suggests it might contain.

## Sections and activities

A course page snapshot lists sections (sometimes called "topics" or "weeks") each
containing activities and resources. Read the section names and any section-level
description or summary text — it often states the section's goal or expected outcome,
useful context before diving into individual items.

## Activity vs. resource

Moodle draws a real distinction: a **resource** (page, file, URL, book) is passive
content; an **activity** (quiz, assignment, forum, workshop, choice...) usually expects an
action and can be graded. Don't treat a resource as if it required a submission, or an
activity as if viewing it were enough.

## Access restrictions

An activity can be greyed out, hidden, or shown with a note explaining why it isn't
available yet — commonly a date, a group membership, or "must complete X first"
(activity completion used as a prerequisite). Read that note before concluding an
activity is simply broken or out of scope:

- **Date-restricted**: note the date if visible; it may become available later in the
  same session or a future one.
- **Completion-restricted**: identifies which other activity has to be completed first —
  this is the closest thing Moodle has to an explicit dependency between activities.
- **Group/role-restricted**: not accessible to the current role/group at all; don't try
  to force it.

Don't push through a restriction (there's usually no legitimate way to bypass one from the
UI). Note why it's locked and move on to what is available; re-check later if the
restriction looked date- or completion-based.

## Completion states

Moodle tracks completion per activity, shown as an icon/checkbox next to it: manual (the
user ticks it themselves), automatic on view, or automatic on meeting a condition (grade
received, submission made). Read which kind applies before assuming a visited resource
"counts" — some resources need an explicit manual tick even after being read.

## Relationships between activities

Beyond explicit completion-restrictions, activities can be related more loosely: a quiz
that clearly tests a preceding topic's resources, an assignment that builds on an earlier
one, a forum discussion referencing a resource by name. Reading a section as a whole
(not each item in isolation) usually surfaces this — worth doing before grading a topic's activities
or designing/auditing course structure.

## Keep it grounded in what's real

Never infer a course's structure, restrictions, or completion state from memory or from a
previous session's notes alone — Moodle's actual current state is the source of truth.
`knowledge/course-map.md` (see the navigation-map instructions) is only a shortcut to
*where* something is, never a substitute for reading its current state.
