---
name: content-authoring
description: Create or edit a course resource or activity (page, quiz, assignment, forum) with clear instructions, a descriptive name, consistency with the rest of the course, and basic accessibility, instead of generic content.
---

# Creating or editing course content

## Before creating anything

Check 2-3 existing sections or activities in the course first: names, tone, level of
detail. New content should fit that style, not look like it's from a different course.
If `sources/` has the teacher's syllabus or notes, base it on that before your own
judgment about what the topic should cover.

If you're going to create a question or activity, and `knowledge/moodle-capabilities.md`
exists, check it to see what types this particular installation supports — not every
installation offers the same ones.

If what you're about to create is really a structural decision (which activity type fits
here, how it fits the unit's progression) rather than a single obvious piece, check
`course-design` first. For the activity's actual mechanics (a workshop's phases, a
lesson's branching, a genuine assignment prompt...), use `activity-design` — or
`quiz-design` specifically for a quiz's questions. For an evaluable activity's grading
criteria, use `rubric-design`.

## Writing the content

- **Descriptive name**: "Quiz: fundamentals of loops in Python", not "Quiz 1" or "New
  quiz". The student should know what it's about just from reading the title in the
  course listing.
- **Explicit instructions**: exactly what's being asked, in what format it's submitted
  (if applicable), and what will be evaluated. Don't assume the student will infer it
  from context.
- **Reasonable progression**: if the course has a sequence of topics, new content should
  fit where it belongs — don't assume knowledge from a later topic.
- **Genuine content**: no filler text or placeholders — if you don't have enough
  information to write something meaningful, say so in your final summary instead of
  making it up.

Apply `accessibility`'s checklist to whatever you write (alt text, headings, link text,
not relying on color alone), and `content-editor` as a final pass on the writing itself
before considering it done.

## After creating

Review how the activity/resource looks from the normal view (not the edit one) before
considering it done — some formatting mistakes only show up that way.

Note in the topic's page, `knowledge/topics/<slug>.md` (create it if this is the first time you
touch that topic), and, for an evaluable activity, in its `knowledge/activities/<slug>.md`, what you created and why: the activity's name, what you decided it should cover,
and any criteria you set yourself while writing it. The knowledge base is the agent's memory
across sessions — if it isn't noted here, a future session has no way of knowing it
already exists, and might end up duplicating or contradicting what you already did.
