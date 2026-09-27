---
name: teaching-plan
description: Help the teacher write the teaching plan (programación didáctica) of a course - context, objectives, contents and units, methodology, assessment and grading, timing, attention to diversity, resources - as linked pages of the knowledge base, from the teacher's own material and decisions. Use when the teacher asks to write, review or update their programación or teaching plan, or before building a course that should follow one.
---

# Writing the teaching plan (programación didáctica)

The teaching plan is the teacher's document: what the course is for, how it's organised, how students learn and how they're assessed. You help write it, well structured and coherent; the decisions are the teacher's. It's generic — not tied to any particular law or regulation — unless the teacher gives you one (in `sources/`) or asks you to follow it, in which case use `topic-research` to find and cite it. Don't go looking for one otherwise: a course description that names a qualification or a level (a vocational title, a school year) says who the students are, not that the plan must quote its official curriculum. Write your own objectives and criteria, and at most note in the plan's context, as a proposal, that it can be aligned with the official curriculum if the teacher wants.

There is only one plan per course: when `course-building` or `unit-building` need a plan and there isn't one, they draft this one (every decision the teacher didn't take marked as a proposal) rather than keeping a plan of their own.

It lives in the knowledge base, as linked pages, not as a separate document: `teaching-plan.md` is the hub, and each unit's topic page holds that unit's part. That's what lets `course-alignment` compare it with the course in Moodle.

## 1. Gather

- `sources/`: previous plans, the syllabus, the department's criteria, a regulation if the teacher left one — read them all first; they win over your suggestions.
- The course in Moodle, if it exists: what's already built.
- What's missing, ask (in `chat`) — the teacher's decisions shouldn't be invented: the group and its context, the total hours and calendar, the weights. In `run`, propose and mark each proposal clearly as such ("(propuesta, pendiente de confirmar)").

## 2. Structure

`knowledge/teaching-plan.md` (a synthesis page, listed in `index.md`), with these sections:

1. **Context**: the course, the students (level, prior knowledge, diversity), the hours and the calendar, the resources available (the Moodle course, equipment).
2. **Objectives**: general objectives of the course, observable, numbered (`O1`, `O2`…) so units and criteria can reference them.
3. **Contents and units**: the units in order, each with its hours and dates, its objectives, and a link to its topic page (`topics/<slug>.md`).
4. **Methodology** (`teaching-methodologies`): the principles and the methodologies used in the course and in which units, with why.
5. **Assessment**: the criteria of evaluation, numbered (`CE1.1`, `CE1.2`… by objective), each with its instruments (rubric, quiz, observation) and the activities where it's assessed.
6. **Grading**: how the final grade is calculated (weights per unit, per criterion or per instrument), passing requirements, late and missing work, make-up assessments.
7. **Attention to diversity**: general measures (UDL, multiple formats) and how to adapt for specific needs.
8. **Resources**: materials, tools, the Moodle course.
9. **Review**: how and when the plan is revised.

Each unit's topic page gets a "Teaching plan" section with its objectives and criteria (linking back to `teaching-plan.md`), its methodology, its activities and instruments, and its weight.

## 3. Check coherence

Before calling it done: every objective has criteria; every criterion is assessed by at least one instrument in some unit; weights add up to 100 %; unit hours add up to the total and fit the calendar; nothing in grading contradicts the assessment section. Then ask `pedagogy-reviewer` to review `teaching-plan.md` and the topic pages, and revise with its critique.

## 4. Deliver

Tell the teacher where it is (`knowledge/teaching-plan.md` and the topic pages), what you proposed on your own and needs their confirmation, and what `pedagogy-reviewer` flagged. Offer the next step: `course-alignment` to check the Moodle course against it, or `unit-building` for units that don't exist yet.

Nothing here is published in Moodle unless the teacher asks for it.
