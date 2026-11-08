---
title: "4. Unit 1: MariaDB in Docker"
sidebar_position: 5
description: miyagi builds the first unit (notes, guided practical, deliverable and quiz) and tests the practical in Docker before publishing it.
---

# 4. Unit 1: MariaDB in Docker {#4-tema-1-mariadb-en-docker}

With the teaching plan closed, it's time to build the course in Moodle. We start with the first unit in a new chat, with the `/miyagi:build-unit` shortcut:

<Prompt>{`/miyagi:build-unit Unit 1: MariaDB in Docker, following the teaching plan. With notes explaining step by step how to start the container, connect with the client, and create the tienda database and a user with permissions only on it; the guided practical, tested in Docker before publishing it; the pass/fail deliverable and the unit's quiz.`}</Prompt>

## First, check that it works {#primero-comprobar-que-funciona}

Before writing a line of the notes, miyagi checks the practical in a **docker-lab lab** (the extension we installed when [preparing the classroom](preparar-el-aula.md)). Inside the lab it starts a real `mariadb:11`, connects, creates the database and the user, stops, starts and removes the server, and checks that the data survives thanks to the volume.

<Shot src="/img/casos/10-laboratorio.webp" title="PowerShell — miyagi chat" alt="The chat after repeating the practical in a docker-lab lab: the lab's check done and the summary of the steps (connecting as root, creating the tienda database and the tienda_app user, logging in as tienda_app) with the errors a student will see if they try to step outside their database.">Every step the students will later read, run in a lab.</Shot>

What it gets from that check doesn't stop at "it works": it brings back what a student will really run into. For example, that the first time MariaDB takes between 6 and 14 seconds to be ready, that the client is called `mariadb` and not `mysql`, or that the logs show a warning about `io_uring` that isn't an error. All of that ends up in the notes.

Then the **pedagogical reviewer** goes over the unit's plan. In this case it pointed out seven improvements, among them checking Docker before the first session and giving a second chance to whoever gets a fail. miyagi applies them before touching Moodle.

## What your students do {#lo-que-hacen-tus-alumnos}

These are the commands that end up in the practical, checked by miyagi in a docker-lab lab (and also when writing this tutorial):

<Terminal>{`# A volume for the data and the MariaDB 11 server
$ docker volume create datos-tienda
$ docker run -d --name mariadb-tienda -e MARIADB_ROOT_PASSWORD=YourStrongPassword -v datos-tienda:/var/lib/mysql -p 3306:3306 mariadb:11
$ docker logs mariadb-tienda          # wait for "ready for connections"

# Log in with the client as root
$ docker exec -it mariadb-tienda mariadb -u root -p`}</Terminal>

```sql
-- The database and a user who can only use that one
CREATE DATABASE tienda;
CREATE USER 'tienda_app'@'%' IDENTIFIED BY 'YourUserPassword';
GRANT ALL PRIVILEGES ON tienda.* TO 'tienda_app'@'%';
SHOW GRANTS FOR 'tienda_app'@'%';
```

<Terminal>{`# Stop, start and recreate the container without losing the data
$ docker stop mariadb-tienda
$ docker start mariadb-tienda
$ docker rm -f mariadb-tienda          # the datos-tienda volume is still there`}</Terminal>

## Each thing, with your permission {#cada-cosa-con-tu-permiso}

miyagi builds the unit piece by piece: it uploads it **hidden**, reviews it as a student would see it, and only then asks your permission to show it. Each panel says exactly what it's going to publish.

<Shot src="/img/casos/13-aprobacion-libro.webp" alt="Approval panel: publishing the book of notes on MariaDB in Docker with its 6 chapters, from what a DBMS is to stopping, starting and removing the container; all commands verified in Docker.">Before showing the notes: a 6-chapter book, with the commands already verified.</Shot>

The quiz is written in GIFT format and imported in one go. Before importing it, the program checks the GIFT and, if it has errors, doesn't import it and says on which lines they are. The panel shows each question with its right answer and its distractors, so you can review them before they exist in Moodle:

<Shot src="/img/casos/14-aprobacion-gift.webp" alt="Approval panel: importing 10 GIFT questions into the Unit 1 quiz's bank, each with its wording, the right answer and the distractors, for example which command deletes the data for good: docker volume rm.">Ten questions focused on what the deliverable doesn't check: stopping, starting and removing without losing data, and permissions.</Shot>

In total, Unit 1 went through ten approvals: the section's name and summary, the notes, the guided practical, an "Apto / No apto" (pass/fail) scale (the Moodle only had scales in English), the deliverable, the questions, the quiz and the deliverable's weight in the gradebook (0%, because we decided it doesn't count towards the grade).

It asks even when you tell it there's no need. When asked to rename a section "without asking me for approval", it replied that its instructions require it to confirm any change students will see, and it opened the panel anyway (the change was refused and wasn't made):

<Shot src="/img/casos/11-aprobacion.webp" title="PowerShell — miyagi chat" alt="The chat: the teacher asks to rename section 1 without approval; miyagi replies that it must confirm it anyway and opens the panel saying human confirmation is needed before publishing, with the change's summary and the options Yes, No and Stop" />

:::caution And if it tries to publish without asking
Approval doesn't depend only on the agent remembering. The program watches every change it's about to make in Moodle and, if the agent hasn't asked permission right before, it stops it and asks you in a panel "Do you let moodle-teacher do this?". Deleting or removing something it always asks about, even if you approved it before.
:::

## The result {#el-resultado}

This is how a student sees the unit: the section with its summary and the order to follow, and the four pieces with their dates.

<Shot kind="moodle" src="/img/casos/17-tema1-alumno.webp" alt="The course seen by a student: the Unit 1 section, MariaDB in Docker, with its summary and order to follow, and four items: Notes (book), Guided practical (page), a pass/fail deliverable opening on 6 and closing on 8 October, and the Unit 1 quiz opening on 6 and closing on 11 October.">Unit 1 from a student's account.</Shot>

<Shot kind="moodle" src="/img/casos/20-quiz-preguntas.webp" alt="The 10 questions of the Unit 1 quiz in Moodle, from T1-01 to T1-10, one point each, 10 in total.">The ten questions, now in the quiz, in order.</Shot>

When it finishes, it sums up what it did, the decisions it made on its own and what you should review:

<Shot src="/img/casos/15-tema1-resumen.webp" alt="The final summary of Unit 1: the four pieces created, the decisions made on its own (the pass/fail scale, the split by sessions), what changed after the pedagogical review and what to review: the dates and the quiz's weight.">The unit's summary, with what you should review.</Shot>

## Reviewing and asking for changes {#revisar-y-pedir-cambios}

Reviewing as a student pays off. When we opened the guided practical we saw that the commands were inside the text, with no code formatting: they couldn't be copied properly.

<Shot kind="moodle" src="/img/casos/18-practica-antes.webp" alt="The guided practical with its nine steps as plain paragraphs, the commands mixed into the sentence.">Before: the commands, lost in the text.</Shot>

We told it in our own words:

<Prompt>{`The dates work for me. One thing: in the Guided practical the commands show up as plain text inside the paragraph. Put them in code blocks, one per step, so they can be copied.`}</Prompt>

It redid the page, reviewed it again and saved it with our permission:

<Shot kind="moodle" src="/img/casos/19-practica-despues.webp" alt="The corrected guided practical: each step with its title in bold and its command in a monospaced code block, ready to copy.">After: each step with its command in a code block.</Shot>

We asked for the same in the notes and it applied it to every chapter. The lesson also went into miyagi's skills, so the next units come out right the first time.

:::note
A full unit on this slow test Moodle took over an hour and reached a session's turn limit. Telling it "carry on where you left off" was enough: it picked up the unit's plan from its memory and finished it.
:::

Next step: [Units 2 and 3](temas-ddl-dml.md).
