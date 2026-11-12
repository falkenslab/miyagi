---
title: 7. Grading with the rubric
sidebar_position: 8
description: miyagi grades the final project applying the teacher's rubric, with what data protection implies for submissions that are files, and shows each grade before saving it.
---

# 7. Grading with the rubric {#7-corregir-con-la-rúbrica}

Three test students have submitted the final project, each at a different level: Lucía all 10 queries correct; Marcos, only some; Sara, all 10 with conceptual mistakes. Alumno Demo hasn't submitted.

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

What you see isn't what the model sees. **In the app and the web version you see each student by name**: miyagi puts it on screen where the model has their alias, without the name leaving your computer. And if you talk about a student by their full name (say, “what is Sara Gil missing?”), the model gets their alias. To project in class, the eye button at the top right goes back to the aliases. The terminal always shows the aliases.

## Each grade, before saving it {#cada-nota-antes-de-guardarla}

With the results, it applies the rubric and shows you the grades in a single approval, with each student's breakdown by criterion and their comment.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-aprobacion-nota.webp" alt="Approval panel for the grading: Sara Gil (A-WS3G1P) 4/10 and Marcos López (A-N1XSAP) 4/10, with the rubric levels, the observations and each one's comment.">The detail of each grade before saving it, with each student's name next to their alias.</Shot>

Each student's grade, the same you'll later see in Moodle:

- **Lucía, 10.** All 10 queries correct.
- **Marcos, 4.** He's missing queries (it counts them as not submitted) and the ones he has fail on order and style.
- **Sara, 4.** Very well presented, but with conceptual mistakes: an aggregate in the `WHERE` (error 1111), an `INNER JOIN` where a `LEFT JOIN` was needed and a count without `GROUP BY`.
- **Alumno Demo, no grade.** They haven't submitted, but the deadline is still open, so it doesn't give them a 0 yet.

When it finishes, miyagi sums up what it has done. It says it has read each grade back from Moodle, that the students already see it because the assignment doesn't use the marking workflow, and that it has stopped the lab and deleted the submissions. It also points out what looks odd, such as submission dates before the assignment opened, instead of deciding it for you.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-correccion-resumen.webp" alt="The summary of the saved grading: Lucía Martín 10, Sara Gil 4 and Marcos López 4; Alumno Demo ungraded because the deadline is still open, the lab stopped and the submissions deleted.">The table of grades, with each student's name.</Shot>

## What each one sees {#lo-que-ve-cada-uno}

The teacher sees the grades in Moodle with their names:

<Shot width="1400" height="1386" kind="moodle" src="/img/v2/moodle-profesor-entregas.webp" alt="The table of submissions for the Práctica final in Moodle: Lucía 10, Marcos 4, Sara 4 and Alumno Demo 0, with their files and their comments.">The submissions and their grades. Alumno Demo's 0 is from an earlier grading, with the deadline already passed.</Shot>

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-profesor-corrector.webp" alt="Moodle's grader with Sara Gil's submission, her rubric and the review panel collapsed.">The grader, with the rubric applied.</Shot>

<Shot width="1400" height="595" kind="moodle" src="/img/v2/moodle-profesor-calificaciones.webp" alt="Moodle's grader report for the teacher, with the final project's grades.">The grader report.</Shot>

And the student sees their grade, the rubric with the levels marked and feedback that says what's wrong:

<Shot width="1400" height="2528" kind="moodle" src="/img/v2/moodle-alumna-practica-final.webp" alt="The final project seen by Sara: her submission, the rubric, the grade of 4 out of 10, the comment and the rubric's breakdown with the levels marked.">Sara's grade. The assignment's date is the real one, because we put it back in its place in step 9: that's why the submission shows up as "127 days early".</Shot>

<Shot width="1400" height="1361" kind="moodle" src="/img/v2/moodle-alumna-notas.webp" alt="Sara's gradebook in Moodle, with her grades.">Her grades, in her gradebook.</Shot>

:::info Your criteria rule
The rubric was the one in your Sources folder, and where it didn't say something miyagi interpreted it and showed it to you. If you don't agree, tell it: it regrades with your criteria and notes it in its memory for next time.
:::

Next step: [looking after the forum](foro.md).
