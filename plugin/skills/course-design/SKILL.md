---
name: course-design
description: Plan a course or unit's pedagogical structure - progressive organization, objectives aligned with content/activities/evaluation, varied activity types, and a diagnostic/formative/summative balance - before creating individual pieces of content.
---

# Designing a course or unit, not just its individual pieces

This is about **planning**, one level above `content-authoring` (which creates one
resource or activity at a time). Use it before adding several new pieces of content, when
restructuring a section, or whenever a request is really "how should this unit look",
not "add this one page".

The methodology of each unit (project, flipped classroom, gamification, cooperative work…) comes
from `teaching-methodologies`; if the teacher has a teaching plan (`teaching-plan`), the design
follows it. A whole course is built with `course-building`, one unit with `unit-building`.

## Propose vs. execute

Planning and executing are different steps. When the request is exploratory ("how would
you organize unit 3?", "what's missing pedagogically?"), propose a structure and explain
the reasoning — don't start creating activities in Moodle until the plan itself is
confirmed. When the request is explicit ("create this"), you can go straight to execution
using this skill's principles, plus `content-authoring` for each individual piece.

## Progressive organization

Order sections/topics so each one builds on what came before, not an arbitrary sequence.
A student shouldn't need knowledge from a later topic to complete an earlier activity.
Check the course's current order with `moodle-navigation` before proposing changes — some
sequencing may already be intentional even if it isn't obvious at first glance.

## Learning objectives

A good objective is observable — it says what the student will be able to *do*, not just
what topic will be "covered" ("explain X", "solve a problem using Y", not "understand X").
Vague objectives ("know about X") are a sign the corresponding activity or evaluation
criterion probably needs tightening too.

For each objective, check it actually connects to something concrete:

- **Content**: is there material that actually teaches it?
- **Activity**: is there something that makes the student practice or demonstrate it?
- **Evaluation**: is it actually assessed somewhere, or does it exist only as a stated
  intention?

An objective with no matching activity or evaluation, or an activity with no objective
behind it, is a misalignment worth flagging.

## Choosing activity types

Don't default to the same activity type every time (usually a quiz) just because it's
familiar. Match the type to what's actually being practiced: a forum or workshop for
discussion/peer-review skills, an assignment for extended reasoning or production, a quiz
for quick recall or applied problems, a lesson for guided, branching content. Reviewing a
section that's five quizzes in a row is itself a signal to reconsider. This is only about
*which* type fits — once it's chosen, `activity-design` designs that specific activity's
mechanics (a quiz's questions are `quiz-design`'s job instead).

## Evaluation balance

A course benefits from a mix, not just a single high-stakes exam at the end:

- **Diagnostic**: something early that reveals the starting point, if it matters for how
  the course proceeds.
- **Formative**: lower-stakes checks along the way, with feedback the student can act on
  before the stakes go up.
- **Summative**: the graded activities that count toward the final grade.

If a course is entirely summative with no formative checkpoints, or the reverse, that's
worth naming explicitly in a proposal.

## Using this alongside other skills

`course-design` decides *what* the course should contain and why, and which activity type
fits where; `activity-design`/`quiz-design` design that specific activity's mechanics once
the type is chosen; `rubric-design` designs its grading criteria; `content-authoring`
builds and writes the actual piece in Moodle; `accessibility` applies to however the
result ends up being written. `course-auditor` uses this skill's criteria when reviewing
an existing course rather than designing a new one.
