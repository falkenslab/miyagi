---
title: 8. Looking after the forum
sidebar_position: 9
description: miyagi answers real questions about SQL in the forum and respectfully corrects a classmate's wrong answer.
---

# 8. Looking after the forum {#8-atender-el-foro}

In the Foro de dudas it created with Unit 4 there are two threads:

- **Lucía**: when inserting an order she gets `ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails`.
- **Marcos**: he can't see the difference between `WHERE` and `HAVING`. And Sara has answered him with something **wrong**: that they're the same and that `HAVING` is used when there's an `ORDER BY`.

All it takes is asking:

<Prompt>{`Now look at the Foro de dudas.`}</Prompt>

It reads the two threads, prepares two replies and shows them to you in full, word for word, in a single approval. In Marcos's, it corrects the mistaken idea without pointing at anyone.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-08-aprobacion-foro.webp" alt="Approval panel for publishing a post in the WHERE and HAVING thread, with the warning that the general praise could also be read as applying to a wrong contribution already corrected.">A forum approval. It's from another request, an example that we then rejected, and it shows how far it goes: it warns that general praise could be read as applying to a student's wrong answer.</Shot>

## What the class sees {#lo-que-ve-la-clase}

It explains to Lucía that the `INSERT` isn't wrong: the customer doesn't exist. How to check it with a `SELECT`, which two ways she has of solving it and where it is in the notes.

<Shot width="1400" height="1138" kind="moodle" src="/img/v2/moodle-alumno-foro-1452.webp" alt="The ERROR 1452 thread in the forum: Lucía's question and the teacher's reply with the explanation of the foreign key, how to check it and the two ways of solving it.">The reply to Lucía.</Shot>

In Marcos's thread it makes clear what each clause filters and at what moment, and that `ORDER BY` has nothing to do with it.

<Shot width="1400" height="1270" kind="moodle" src="/img/v2/moodle-alumno-foro-having.webp" alt="The thread on the difference between WHERE and HAVING: Marcos's question, Sara's wrong answer and the teacher's reply with the correction.">The correction, a respectful one.</Shot>

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-profesor-foro.webp" alt="The list of threads in the Foro de dudas seen by the teacher.">The forum's threads, from the teacher's account.</Shot>

## It connects what it sees {#relaciona-lo-que-ve}

When it finishes, it checks that each reply appears only once in its thread. It connects the forum with what it saw when grading: the confusion between `WHERE` and `HAVING` is the same one that made a final project submission fail, and it proposes a brief review in class. And it warns that when publishing, Moodle has subscribed you to those threads.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-08-foro-resumen.webp" alt="The forum summary: a table with the two threads, what was happening and what it has done, a proposal for your next class and the warning about the subscription to the threads.">The forum summary, connected with the grading.</Shot>

It notes the two questions in the pages for Units 3 and 4 of its memory, with no data about any student.

Next step: [follow-up and audit](seguimiento.md).
