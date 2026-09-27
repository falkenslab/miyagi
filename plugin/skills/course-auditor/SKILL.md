---
name: course-auditor
description: Run a holistic audit of a Moodle course - organization, accessibility, pedagogy, evaluation, broken or stale content - or a lighter periodic maintenance pass, producing prioritized recommendations instead of a raw checklist.
---

# Auditing a course

Two related but different uses of this skill:

- **A full audit**: a one-off, thorough pass, usually requested explicitly ("review this course", "audit unit 3") or run by the `/teacher-agent:audit` command.
- **Routine maintenance**: a lighter periodic pass — stale dates, broken restrictions, empty sections — or preparing the course for a new edition/term. Run the same checks below, but scoped to what's likely to have changed since the last pass (see "Remembering past audits").

Both compose the other skills' criteria rather than redefining them:

- Structure and pedagogical coherence: `course-design` — and a second opinion from the `pedagogy-reviewer` subagent on the units that look weakest.
- Against the teacher's teaching plan, if there is one: `course-alignment` (don't repeat its comparison here; run it, or cite its latest entry).
- Writing, accessibility and how it works for a student: `publish-check` (its "When auditing").
- Each activity's design: `assignment-building`, `activity-building`, `quiz-design` + `quiz-building`; notes and resources: `resource-authoring`.
- Grading criteria quality: `rubric-design`.
- Outdated content (a tool version, a command, a statistic): `topic-research`.
- Reading the course's real current state: `moodle-navigation`.

## What to check

- **Organization and navigation**: is the section structure coherent and progressive (`course-design`)? Any section that's effectively empty or just a dumping ground of unrelated files?
- **Coherence**: do objectives, content, activities, and evaluation actually line up (`course-design`)?
- **Writing and accessibility**: `publish-check` on a sample of pages and activities, not necessarily every single one for a large course.
- **Activities and evaluation**: activity-type variety, evaluation balance (`course-design`), whether each activity is actually well-designed for its type (its building skill), question quality in quizzes (`quiz-design`), grading-criteria quality (`rubric-design`).
- **Instructions**: does each activity clearly say what's expected, in what format, and what's graded (the standard of `assignment-building`)?
- **Resources**: broken external links (checkable via `WebFetch` where the link is reachable at all — note as "couldn't verify" rather than "broken" if it's blocked or requires auth), outdated material (a date, a tool version, a reference clearly stale — check what's current with `topic-research`), content overload (a section with far more material than a student could reasonably get through).
- **Dates**: inconsistent or contradictory deadlines (a quiz open before its own prerequisite unlocks, an assignment due before the material covering it is available).
- **Empty or orphaned sections**: a section with no content, or an activity that's effectively unreachable because of a restriction pointing at something that no longer exists.

## Preparing a new edition

When asked to prepare the course for a new run (new term/cohort): check for dates tied to the previous edition that need updating, and note anything that references specific past students or submissions that shouldn't carry over — but only *propose* these changes, don't reset or delete anything without the changes being confirmed first (see "Propose vs. execute" in `course-design`).

## Producing the result

Don't hand back a flat checklist of everything checked — group findings by severity/impact and lead with what matters most (a broken prerequisite chain blocking students outranks a missing alt text on a decorative image). For each finding, say what's wrong and, briefly, what fixing it would look like — the audit's value is the prioritization, not just the detection.

## Remembering past audits

If `knowledge/course-audit.md` exists, read it first: it's the history of previous findings. Note in it what you found this time (date, findings, what's new vs. still unresolved from before) so a later audit doesn't start from zero and can tell whether a known issue was ever fixed.
