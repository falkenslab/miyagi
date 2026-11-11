---
title: "4. Unit 1: MariaDB in Docker"
sidebar_position: 5
description: miyagi builds the first unit (notes, guided practical, deliverable and quiz), tests the practical in a lab and publishes it hidden, with one permission for each piece.
---

# 4. Unit 1: MariaDB in Docker {#4-tema-1-mariadb-en-docker}

With the teaching plan closed, it's time to build the course in Moodle. We start with the first unit in a new conversation, with the `/miyagi:build-unit` shortcut:

<Prompt>{`/miyagi:build-unit Unit 1: MariaDB in Docker, following the teaching plan. With notes explaining step by step how to start the container, connect with the client, and create the tienda database and a user with permissions only on it; the guided practical, with the commands in code blocks, tested in Docker before publishing it; the pass/fail deliverable and the unit's quiz. The dates you propose work for me. The container is always called mariadb-tienda.`}</Prompt>

## First, check that it works {#primero-comprobar-que-funciona}

Before publishing anything, miyagi tests the practical in a **docker-lab lab**: it starts a real MariaDB, follows every step the students will later read, provokes the errors the notes are going to explain, and checks that the check fails when nothing has been done yet. It warns you before starting the lab, and asks you before stopping it because its data is lost.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-04-laboratorio.webp" alt="The conversation: the lab starts, checks that the verification fails before anything is done, follows the practical, and when publishing it appears that the Moodle browser has closed half-way and miyagi checks whether the change was saved.">The practical, tested step by step in the lab.</Shot>

In this screenshot the teacher tells it the lab "is already in the labs folder", because in that run it was copied by hand. Since then miyagi can write in that folder without restarting. Notice too what happens next: the browser moodle-teacher uses to work in Moodle drops, and miyagi checks whether the change was saved before repeating it, so as not to apply it twice.

## Each piece, with its permission {#cada-pieza-con-su-permiso}

miyagi builds the unit piece by piece. First it leaves it in `materials/` and in `drafts/`, then it uploads it to Moodle **hidden** and at the end it asks your permission to show it. Each panel says exactly what it's going to publish. In Unit 1: the section, a page on how to install and check Docker, the notes in a 7-chapter book, the guided practical, an "apto/no apto" (pass/fail) scale (that Moodle only came with scales in English), the deliverable, the quiz, its 20 questions and, at the end, showing it.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-04-aprobacion-libro.webp" alt="Approval panel for adding a hidden chapter to the Unit 1 book of notes, with the chapter's full text and the Stop all, Reject and Approve buttons.">An approval panel for adding a chapter. This screenshot is of an example request that we then rejected: the book was already uploaded.</Shot>

:::caution And if it tries to publish without asking
Approval doesn't depend only on the agent remembering. The program watches every change it's about to make in Moodle and, if it hasn't asked permission just before, stops it and asks you. Deleting or removing something always asks you, even if you've approved it before.
:::

## What failed {#lo-que-falló}

Publishing the unit took more than expected, because the Moodle browser closed several times during the work. miyagi carried on, checking in Moodle what had been saved before repeating each step, and at the end of the conversation it tells you what it has done and what's left.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-04-tema1-resumen.webp" alt="The Unit 1 conversation: miyagi publishes each piece hidden, warns that the Moodle browser has closed half-way and gives intermittent errors, checks whether each change was saved so as not to duplicate it, and launches the operations one at a time.">While publishing: the browser fails on and off and miyagi checks before repeating.</Shot>

The quiz was left half-way in this first attempt: there were questions still to import. It was completed later, in [step 6](tema-4-consultas.md). We tell you what to do when this happens in [Tips and problems](/guia/problemas/).

## The result {#el-resultado}

This is how a student sees the unit:

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-alumno-tema1.webp" alt="Moodle in English seen by a student: Unit 1 with its summary and its activities with dates.">Unit 1 from a student's account.</Shot>

<Shot width="1400" height="888" kind="moodle" src="/img/v2/moodle-alumno-libro.webp" alt="The first chapter of the Unit 1 book of notes in Moodle, seen by a student.">The notes, in a Moodle book.</Shot>

<Shot width="1400" height="1361" kind="moodle" src="/img/v2/moodle-alumno-practica-guiada.webp" alt="The Unit 1 guided practical seen by a student, with each command in a code block.">The guided practical, with each command in its code block.</Shot>

And this is how the teacher sees it:

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-profesor-tema.webp" alt="Unit 1 seen by the teacher in Moodle, with its activities.">Unit 1 from the teacher's account.</Shot>

<Shot width="1400" height="1458" kind="moodle" src="/img/v2/moodle-profesor-banco.webp" alt="The course's question bank in Moodle, with questions T1-01 onwards.">The question bank, with those of Unit 1.</Shot>

<Shot width="1400" height="1527" kind="moodle" src="/img/v2/moodle-profesor-preguntas-t1.webp" alt="The Unit 1 quiz's questions in Moodle: random slots by assessment criterion.">The Unit 1 quiz: 10 random slots by criterion, drawn from 20 questions.</Shot>

:::note
The Unit 1 quiz stayed hidden until the end: we'll see it in the **Drafts** view, in [step 6](tema-4-consultas.md).
:::

Next step: [Units 2 and 3](temas-ddl-dml.md).
