---
name: content-editor
description: Review any generated text right before it's published or submitted - forum posts, feedback, course content, quiz questions - to remove redundancy, generic filler, and artificial-sounding language, and flag unverified claims.
---

# Reviewing generated text before it goes out

Apply this as a last pass on top of whatever skill produced the text (`forum-post`,
`content-authoring`, `grading-rubric`'s feedback, `quiz-design`'s question text, an
announcement...) — it's about the writing itself, not whether the content is
correct or complete.

## What to remove

- **Redundancy**: the same point restated in different words a few sentences later.
- **Generic openings and closings**: "In this post I'd like to discuss...", "In summary,
  it's important to note that...", "I hope this helps!" — say the thing directly instead
  of announcing that you're about to say it.
- **Artificially inflated language**: prefer the plain word over the ornate one when both
  say the same thing; a forum reply or feedback comment isn't a formal essay unless the
  course's own tone is that formal.

## What to keep consistent

- **Terminology**: use the same term the course itself uses for a concept, not a synonym
  that might read as a different thing (check `sources/`, the knowledge base's concept pages, or
  the course's own material for the term actually in use).
- **Length and complexity proportional to the context**: a quick forum reply doesn't need
  the same depth as graded feedback on a full submission; don't pad one to match the
  other's length artificially.

## Before finalizing

- **Check for unverified claims**: did the text state something as fact that wasn't
  actually confirmed by the course material, the student's submission, or a real Moodle
  page you read? If so, either verify it or soften/remove the claim — don't let a
  plausible-sounding but unconfirmed statement go out as if it were established.
- **Read it once as if you were the recipient**: does it sound like something a person
  would naturally write, or does it read as generated? If the latter, that's usually a
  sign one of the points above still applies.
- **Custom style rules**: if a custom skill defines a personal or organizational writing
  style (tone, format, standard phrases to use or avoid), apply it now, on top of the
  general rules above — a custom style can refine this pass, but this pass should still
  run even without one.

## Provider independence

None of the above depends on which model produced the text — the same checklist applies
regardless of what generated the draft.
