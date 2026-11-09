---
title: 7. Grading with the rubric
sidebar_position: 8
description: miyagi grades the final project applying the teacher's rubric, with what data protection implies for submissions that are files, and shows each grade before saving it.
---

# 7. Grading with the rubric {#7-corregir-con-la-rúbrica}

Three test students have submitted the final project, each at a different level: Lucía all 10 queries correct; Marcos, only some; Sara, all 10 with conceptual mistakes. Alumno Demo hasn't submitted, and the deadline has passed.

In a new conversation, with the grading shortcut:

<Prompt>{`/miyagi:grade Grade the Práctica final "Consultas sobre la tienda" with the rubric I left you in sources. Run the submissions in Docker against the shop's data to check the results. I brought the deadline forward for this test and it has already passed.`}</Prompt>

## miyagi can't read the submitted files {#archivos}

This is the step most worth reading before using it with your class.

:::caution Important: with the default data protection, submissions that are files don't reach miyagi
To protect your students, the moodle-teacher extension works by default with `student_data: pseudonymize`: the students reach the model with an alias ("A-6KTXW8") and never with their name. That has a practical consequence: **miyagi can read a text submission, but not an attached file**, because the content of a file can't be pseudonymized. **Text** submissions do reach it.

If the assignment is submitted as a file, miyagi tells you so and asks you to pass it each submission yourself, with its alias. And here's the problem: in Moodle you see the students by their name, and miyagi only gives you the alias. **The only way to know which alias belongs to which student is by comparing the time of each submission**. It's awkward, it's prone to errors and we're working on it ([issue #95](https://github.com/falkenslab/miyagi/issues/95)). Before really grading with files, keep this in mind.
:::

In the tutorial, miyagi says so right at the start:

> I can't download the 3 submissions from Moodle (A-Z63WCA, A-6KTXW8 and A-5MTSQM). How shall we proceed?

The options it proposes are for you to pass them to it, to change the Moodle server's configuration, or to enter only the 0 for the student who didn't submit. We choose to pass them. It asks for them one at a time, in this panel, and reminds you to check that the file doesn't have the student's name in the comments.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-entrega-con-alias.webp" alt="The panel The agent asks for a file: I need the consultas.sql file that A-Z63WCA submitted in the Práctica final; a box for dragging the file and the Answer button.">The panel that asks you for each alias's file.</Shot>

The opposite happens too: if you talk to it about a student by name, it doesn't know which is their alias. It asks you, showing you what grades each alias has, and your eyes in Moodle are what bridge the gap.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-alias-que-alumno.webp" alt="miyagi asks which alias is Sara Gil's, with four aliases and their current grade as options.">miyagi asks which alias belongs to the student we named. You can see it in Moodle by comparing the submission times.</Shot>

With the files in place, it saves them in Sources under the alias and runs them in a lab against the shop's data, comparing each query with the solution.

## Each grade, before saving it {#cada-nota-antes-de-guardarla}

With the results, it applies the rubric and shows you the four grades in a single approval, with each student's breakdown by criterion and their comment.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-aprobacion-nota.webp" alt="Approval panel for saving the grading of A-Z63WCA: correct results 1 out of 5, use of SQL 1 out of 3, readability 2 out of 2, and the comment to the student with each query that fails.">The detail of a grade before saving it. This screenshot is of an example request that we then rejected.</Shot>

The grade is clear for each alias, and it's what you'll later see in Moodle with their name:

- **Lucía, 10.** All 10 queries correct.
- **Marcos, 4.** He's missing queries (it counts them as not submitted) and the ones he has fail on order and style.
- **Sara, 4.** Very well presented, but with conceptual mistakes: an aggregate in the `WHERE` (error 1111), an `INNER JOIN` where a `LEFT JOIN` was needed and a count without `GROUP BY`.
- **Alumno Demo, 0**, with the comment "No submission has been received", because the deadline has passed.

When it finishes, miyagi sums up what it has done. It warns that it hasn't sent notifications and that the late penalty is yours to apply. And it's honest about what it hasn't been able to confirm: that Moodle doesn't give it back the remarks per criterion when saving.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-correccion-resumen.webp" alt="The grading summary: a table with alias, correct queries, points per criterion and grade: A-5MTSQM 10, A-Z63WCA 4, A-6KTXW8 4, A-8BY92W 0.">The table of grades, by alias.</Shot>

## What each one sees {#lo-que-ve-cada-uno}

The teacher sees the grades in Moodle with their names:

<Shot width="1400" height="1386" kind="moodle" src="/img/v2/moodle-profesor-entregas.webp" alt="The table of submissions for the Práctica final in Moodle: Lucía 10, Marcos 4, Sara 4 and Alumno Demo 0, with their files and their comments.">The submissions and their grades. The submission times are the only thing that lets you match each alias to each student.</Shot>

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-profesor-corrector.webp" alt="Moodle's grader with Sara Gil's submission, her rubric and the review panel collapsed.">The grader, with the rubric applied.</Shot>

<Shot width="1400" height="595" kind="moodle" src="/img/v2/moodle-profesor-calificaciones.webp" alt="Moodle's grader report for the teacher, with the final project's grades.">The grader report.</Shot>

And the student sees their grade, the rubric with the levels marked and feedback that says what's wrong:

<Shot width="1400" height="2528" kind="moodle" src="/img/v2/moodle-alumna-practica-final.webp" alt="The final project seen by Sara: her submission, the rubric, the grade of 4 out of 10, the comment and the rubric's breakdown with the levels marked.">Sara's grade. The assignment's date is the real one, because we put it back in its place in step 9: that's why the submission shows up as "127 days early".</Shot>

<Shot width="1400" height="1361" kind="moodle" src="/img/v2/moodle-alumna-notas.webp" alt="Sara's gradebook in Moodle, with her grades.">Her grades, in her gradebook.</Shot>

:::info Your criteria rule
The rubric was the one in your Sources folder, and where it didn't say something miyagi interpreted it and showed it to you. If you don't agree, tell it: it regrades with your criteria and notes it in its memory for next time.
:::

Next step: [looking after the forum](foro.md).
