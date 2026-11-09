---
title: 9. Follow-up and audit
sidebar_position: 10
description: How the class is doing, separating data from interpretation, and an audit of the whole course with recommendations by priority.
---

# 9. Follow-up and audit {#9-seguimiento-y-auditoría}

## How the class is doing {#cómo-va-la-clase}

With the first grades in, we ask it about the class with the follow-up shortcut:

<Prompt>{`/miyagi:progress`}</Prompt>

It looks at the gradebook and the activity summary, and separates what's data from what's its interpretation. It also detects that the final project's dates don't match, a side effect of having brought them forward for the tutorial:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-09-progreso.webp" alt="The progress review: the average of those who submitted, a table of deadlines that don't match each other, the patterns detected and its reading of them, with no general notice.">Data on one side, interpretation on the other, and no unnecessary notices.</Shot>

Two details matter here:

- **It doesn't post notices on its own.** Since it's a single case, it sees no reason to write to the class.
- **It doesn't keep student records.** The review stays in its memory with no aliases or names, to compare with the next one.

It points out that the two students with a 4 are the ones in the thread about `WHERE` and `HAVING`, and says that "with 4 students the sample is very small".

## Auditing the whole course {#auditar-el-curso-entero}

<Prompt>{`/miyagi:audit`}</Prompt>

It goes through the course without changing anything (organization, dates, assessment, accessibility, pedagogy) and returns the recommendations by priority. And it says what it hasn't been able to check: how a student really sees it, that it has only reviewed 3 of the 14 question banks and that it hasn't run the practicals again.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-09-auditoria.webp" alt="The audit: low-priority recommendations, what's fine and what couldn't be checked.">The end of the audit, with what's fine and what it hasn't been able to check.</Shot>

## Applying a recommendation {#aplicar-una-recomendación}

We pick the one most visible to the students:

<Prompt>{`Make a "Guía del curso" page in General with the weights, the calendar, the late submission policy for all assignments and what to do if Docker doesn't work, and show it. Put the final project back on the dates in the teaching plan, without touching the grades. We'll see to the rest another day.`}</Prompt>

It creates it hidden, asks your permission, shows it with another permission and changes the dates with another. And it warns you of what you have to decide: the guide announces the Unit 1 quiz, which is still hidden; it promises a school computer for anyone who can't use Docker at home, with no procedure yet; and it gives the weights as percentages, although Moodle still calculates the total out of 70.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-09-guia-resumen.webp" alt="The summary of the course guide: the sections, the final project's dates before and now, and a list of what to bear in mind.">The guide, published, and what's worth fixing.</Shot>

This is how the students see it:

<Shot width="1400" height="1847" kind="moodle" src="/img/v2/moodle-alumno-guia.webp" alt="The Guía del curso page in Moodle seen by a student: weights, calendar, late submissions and what to do if Docker fails.">The Guía del curso.</Shot>

The audit and the progress review stay in its memory with their date, so next time it will tell you what has changed.

Next step: [your own skill](habilidad-propia.md).
