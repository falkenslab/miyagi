---
title: 8. Looking after the forum
sidebar_position: 9
description: miyagi answers real SQL questions in the forum and respectfully corrects a classmate's wrong answer.
---

# 8. Looking after the forum {#8-atender-el-foro}

In the Q&A forum it created with Unit 4 there are two threads from students:

- **Lucía**: when inserting an order she gets `ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails`, and doesn't understand why if the `INSERT` is well written.
- **Marcos**: can't see the difference between `WHERE` and `HAVING`. And Sara has replied with something **wrong**: that they're the same and that `HAVING` is used when there's an `ORDER BY`.

Just ask:

<Prompt>{`Now look at the Foro de dudas.`}</Prompt>

## A single approval, with the full texts {#una-sola-aprobación-con-los-textos-enteros}

It reads both threads and decides how to step in. Lucía's has no reply: it gives her a hint so she can solve it herself. In Marcos's, a classmate has to be corrected, respectfully and without leaving the wrong idea standing. It shows you both messages in full before publishing anything:

<Shot src="/img/casos/40-aprobacion-foro.webp" alt="Approval panel: publishing two replies in the Q&amp;A forum, with the full text of the reply to Lucía about ERROR 1452 (the foreign key requires the customer to exist, how to check it and the right order) and the start of the reply in Marcos's thread, where Sara had answered incorrectly.">Both replies, word by word, before publishing them.</Shot>

## What the class sees {#lo-que-ve-la-clase}

To Lucía it explains what the error means (it isn't badly written: customer 7 doesn't exist in her table), how to check it, which two paths she has and where it is in the notes. Without solving the exercise for her.

<Shot kind="moodle" src="/img/casos/42-foro-1452.webp" alt="The ERROR 1452 thread in the forum: Lucía's question with the INSERT and the error, and the teacher's reply explaining the foreign key, how to check it with SELECT, inserting the customer first and that AUTO_INCREMENT ids don't have to be consecutive.">The reply to Lucía: a hint, not the solution.</Shot>

In Marcos's thread, it thanks Sara for stepping in to answer and corrects the idea: `WHERE` filters rows before grouping, `HAVING` filters groups and accepts aggregates, and `ORDER BY` has nothing to do with it. With an example on the shop, a quick rule and a suggestion for practice:

<Shot kind="moodle" src="/img/casos/41-foro-having.webp" alt="The thread on the difference between WHERE and HAVING: Marcos's question, Sara's wrong answer and the teacher's reply, which thanks Sara, explains what each clause filters and when, the Invalid use of group function error, an example query with WHERE, GROUP BY, HAVING and ORDER BY on the shop, and a quick rule.">The correction to Sara, respectful and with an example.</Shot>

## It connects what it sees {#relaciona-lo-que-ve}

When it finishes, it connects the forum with what it saw when grading: the confusion between `WHERE` and `HAVING` is the same one that made Sara fail in the final project. It suggests spending a few minutes on it in class, and notes both doubts in the pages of Units 3 and 4 of its memory, for the next time it builds or reviews those units.

<Shot src="/img/casos/43-foro-resumen.webp" alt="The forum summary: one reply in each thread, the hint to Lucía without solving the exercise for her, the correction to Sara thanking her for helping, and the observation that the confusion between WHERE and HAVING is the same one that appeared when grading the final project.">The forum and the grading, connected.</Shot>

Next step: [follow-up and audit](seguimiento.md).
