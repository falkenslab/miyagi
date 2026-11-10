---
title: 7. Grading with the rubric
sidebar_position: 8
description: miyagi grades the final project applying the teacher's rubric, with what data protection implies for submissions that are files, and shows each grade before saving it.
---

# 7. Grading with the rubric {#7-corregir-con-la-rúbrica}

Three test students have submitted the final project, each at a different level: Lucía all 10 queries correct; Marcos, only some; Sara, all 10 with conceptual mistakes. Alumno Demo hasn't submitted, and the deadline has passed.

In a new conversation, with the grading shortcut:

<Prompt>{`/miyagi:grade Grade the Práctica final "Consultas sobre la tienda" with the rubric I left you in sources. Run the submissions in Docker against the shop's data to check the results. I brought the deadline forward for this test and it has already passed.`}</Prompt>

## Submissions that are files {#archivos}

This is the step most worth reading before using it with your class.

To protect your students, the moodle-teacher extension works by default with `student_data: pseudonymize`: the students reach the model with an alias ("A-6KTXW8") and never with their name. **Text** submissions reach it that way. Those that are **files** it doesn't read from Moodle: to read them, miyagi asks you to save them on your computer, a folder per student under their alias and with neutral file names.

It asks you in a panel of the classroom extension, with the folder where it will save them: `submissions`, inside the subject. You can say no, and then it doesn't read them.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-guardar-entregas.webp" alt="The moodle panel: save the files submitted to assignment 1939 in the subject's submissions folder, a folder per student, warning that a name written inside a PDF, a document or an image isn't hidden; with the Yes, do it box and the Cancel, No and Send buttons.">miyagi asks for permission to save the submissions on your computer.</Shot>

:::caution What isn't hidden
In text files, like a `.sql`, names are replaced by the alias. But **a name written inside a PDF, a document or an image isn't hidden**, and the model will see it. If your students sign their work inside the file, keep it in mind before saying yes.
:::

With your permission, it reads them in `submissions`, copies those it has to run into the lab and runs them against the shop's data, comparing each query with the solution. When the grading is done it **deletes every copy**, the subject's and the lab's, and says so in its summary. If the grading stops halfway, whatever is left is deleted the next time you open the subject.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-entregas-borradas.webp" alt="The end of a grading summary: what failed in each submission, a pending decision about the student who didn't submit and the line saying the lab was stopped and the copies of the submissions deleted.">At the end of the summary, the lab stopped and the copies deleted.</Shot>

What doesn't change is that **you see your students by name and miyagi by alias**. If you talk to it about a student by name, it doesn't know which is their alias. It asks you, showing you what grades each alias has, and your eyes in Moodle are what bridge the gap.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-alias-que-alumno.webp" alt="miyagi asks which alias is Sara Gil's, with four aliases and their current grade as options.">miyagi asks which alias belongs to the student we named. You can see it in Moodle by comparing the submission times.</Shot>

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
