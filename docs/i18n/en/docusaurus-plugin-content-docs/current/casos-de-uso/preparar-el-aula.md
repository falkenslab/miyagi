---
title: 1. Prepare the classroom
sidebar_position: 2
description: Create the subject in the desktop app, link an empty Moodle course and add docker-lab to test the practicals.
---

# 1. Prepare the classroom {#1-preparar-el-aula}

We start from an empty Moodle course, "Introducción a SQL", in which we have the teacher role. Everything else is done from the [desktop app](/guia/escritorio/).

## Create the subject {#crear-la-asignatura}

We click **New subject** and fill in the form: name, a description, the language and the tone (Warm, which is how it will speak to the students in the forum and in feedback).

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-nueva-asignatura.webp" alt="The New subject form filled in: Introducción a SQL, an Introduction to SQL unit with MariaDB in Docker, first year of DAM, Spanish language, Warm tone.">The "Introducción a SQL" subject.</Shot>

## Link the course {#vincular-el-curso}

In **Your classroom** we click **Link a classroom** and paste the course's address, the one we see in the browser.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-vincular-direccion.webp" alt="Link a classroom, step 1: the field with the test Moodle's course address filled in.">Step 1: the course's address.</Shot>

miyagi tells us what it's going to do: install the classroom extension (moodle-teacher) and give it this campus and this course, so that it can only enter the linked courses.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-vincular-confirmar.webp" alt="Link a classroom, step 2: the confirmation of the campus and the course, and the note that the first time a campus window will open for logging in.">Step 2: what it's going to do, before doing it.</Shot>

The first time miyagi needs to enter Moodle, a window of that Moodle opens so that you log in yourself, with your username and password. Neither miyagi nor the model sees them. moodle-teacher keeps that session, so it doesn't ask again until it expires.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-aula-vinculada.webp" alt="The Your classroom view with the classroom linked, the Moodle address and the course number.">The classroom, linked.</Shot>

## The practicals, in Docker labs {#las-prácticas-en-laboratorios-de-docker}

The course is about MariaDB in Docker and we want miyagi to check the practicals before publishing them. For that, in **Extensions > Catalog** we add **docker-lab**: miyagi checks each practical in a Docker lab, isolated and without touching anything else on the computer. It needs Docker Desktop installed.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-extension-docker-lab.webp" alt="The catalog's Add docker-lab dialog: what it does, no remote servers, it needs Docker, and its capabilities, with the Cancel and Add buttons.">Before installing it, what the extension declares.</Shot>

It's explained in [Docker practicals](/avanzado/practicas-docker/).

Next step: [give it your material](tu-material.md).
