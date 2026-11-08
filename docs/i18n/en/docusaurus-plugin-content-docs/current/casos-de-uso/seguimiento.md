---
title: 9. Follow-up and audit
sidebar_position: 10
description: How the class is doing, separating data from interpretation, and an audit of the whole course with recommendations by priority.
---

# 9. Follow-up and audit {#9-seguimiento-y-auditoría}

## How the class is doing {#cómo-va-la-clase}

With the first grades in, we ask about the class with the follow-up shortcut:

<Prompt>{`/miyagi:progress`}</Prompt>

It looks at the gradebook and the activity summary, and separates what's data from what's its interpretation:

<Shot src="/img/casos/44-progreso.webp" alt="The progress review: gradebook data (one student without any submission, two fails in the final project, one student with 9.38, the other activities not yet due, the course total not yet weighted) and its interpretation (what fails most is HAVING, LEFT JOIN and ordering; the likely cause; the test student); it publishes no announcement and saves the review in progress.md with no names.">Data on one side, interpretation on the other, and no unnecessary announcement.</Shot>

Two details matter here:

- **It doesn't publish announcements on its own.** With only one student not submitting and nothing else overdue, it sees no reason to write to the class.
- **It doesn't keep records on students.** The review stays in `knowledge/progress.md` as a class trend, with no names, to compare with the next one.

## Auditing the whole course {#auditar-el-curso-entero}

Before classes start, a full review:

<Prompt>{`/miyagi:audit`}</Prompt>

It goes through the course without changing anything (organisation, dates, assessment, accessibility, pedagogy, with a second opinion from the pedagogical reviewer) and returns recommendations by priority. The high-priority ones, in this case, weren't obvious:

<Shot src="/img/casos/45-auditoria-alta.webp" alt="The audit, high priority: the final project's test dates; that the quizzes don't measure well because the second attempt repeats the questions and the right answer shows after the first one; and that the interpretation of the rubric approved that day allows passing with a single correct query, with an alternative.">The three high-priority recommendations.</Shot>

The third is the most interesting: the interpretation of the rubric we approved when grading ("the criteria for use of SQL and readability are assessed on what works") has an effect nobody saw then. Whoever gets a single query right would get a 5.6 without a single `JOIN` or `HAVING`. It points that out, proposes an alternative and leaves the decision to the teacher.

Then come the medium- and low-priority ones: that there's no course guide, that `JOIN` reaches the final grade without any graded practice before it, that Unit 4 is overloaded, that completion tracking is off, that the course's end date isn't set…

<Shot src="/img/casos/46-auditoria-media-baja.webp" alt="The audit, medium and low priority: no course guide, Unit 4 reaches JOIN without graded practice and is overloaded, practical skills are assessed only with multiple-choice questions, completion tracking is off, and details such as different headings in the guided practicals or the course's end date.">Medium and low priority, and the question of where to start.</Shot>

The audit is saved with its date in `knowledge/course-audit.md`, so the next one will tell you what has improved.

## Applying a recommendation {#aplicar-una-recomendación}

We choose the one most visible to the students:

<Prompt>{`Do point 4: a "Course guide" page in General with the weights, the calendar, the late submission policy for all assignments and what to do if Docker doesn't work. We'll see to the rest another day.`}</Prompt>

It creates it hidden, reviews it as a teacher and at mobile width, and before showing it warns of two things it can't decide:

<Shot src="/img/casos/47-guia-resumen.webp" alt="The course guide's summary: what it contains (weights, calendar, late submissions, what to do if Docker doesn't work, where to ask), reviewed on mobile, and two warnings before showing it: the final project's dates and what alternative to offer whoever can't use Docker.">The guide, ready and hidden, with two questions before showing it.</Shot>

We asked it to put the final project back on its real dates (5 to 15 November, without touching the grades) and to show the guide as it was. This is how the students see it:

<Shot kind="moodle" src="/img/casos/48-guia-curso.webp" alt="The course guide page seen by a student: how the grade is worked out with a table of weights, the calendar of the six weeks with units and submissions, what happens with late submissions for each type of activity, how to check Docker before the first class, what to do if Docker doesn't work and where to ask.">The course guide: weights, calendar, late submissions and what to do if Docker fails.</Shot>

Next step: [your own skill](habilidad-propia.md).
