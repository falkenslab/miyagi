---
title: Frequently asked questions
sidebar_position: 9
description: "What people ask most about miyagi: cost, safety, student data, languages, which Moodle it supports and more."
---

# Frequently asked questions {#preguntas-frecuentes}

## Before you start {#antes-de-empezar}

### How much does it cost? {#cuánto-cuesta}

miyagi is free and open source, under the MIT licence. There are no plans or fees. What makes the assistant work is your Claude subscription (Pro or Max).

### How is it different from asking an AI chat? {#en-qué-se-diferencia-de-preguntarle-a-un-chat-de-ia}

A chat gives you some text and you do the rest in Moodle. miyagi goes into your course and does the work there: it enters the grade with its feedback, replies in the forum, creates the assignment with its rubric. It also remembers your course from one session to the next and asks your permission before your students see anything.

### Does it work with my school's Moodle? {#funciona-con-el-moodle-de-mi-centro}

It works with the Moodle you already use and with your own teacher session, through the **moodle-teacher** extension: nothing needs to be installed on the server. It's made for Moodle 4 and 5, and it's tested on Moodle 5.2. When you connect the classroom, it can look (without changing anything) at which activity and question types it sees in your course.

### Do I need to know how to program? {#tengo-que-saber-programar}

No. You install it by pasting one line into the terminal and then you use it by talking to it. [Install](instalar.md) and [Getting started](primeros-pasos.md) walk you through it.

## Control and safety {#control-y-seguridad}

### Can it publish something without me noticing? {#puede-publicar-algo-sin-que-me-dé-cuenta}

In the chat, before saving a grade, replying in the forum or publishing content, it asks your permission with a summary of what it's going to publish. If it tries to change something in Moodle without having asked, the program itself stops it and asks you. To delete, remove or restore something it always asks you again. The only way for it to publish without asking is if you deliberately launch it in `autonomous` mode with `miyagi run`.

### What if it gets something wrong? {#y-si-se-equivoca}

You see every grade, every reply and every resource before it reaches your students, and you can say no or ask it to change it. Anything new it tests hidden in Moodle before showing it. If you don't like something about how it works, correct its notes or write it in `instructions.md`.

### Can it delete things or leave my course? {#puede-borrar-cosas-o-salirse-de-mi-curso}

It has instructions not to delete anything, not to change enrolments, not to touch Moodle's settings and not to go into other courses. Even so, use the chat or `guided` mode to review everything it publishes.

### Is my password safe? {#mi-contraseña-está-segura}

miyagi doesn't ask for it or store it. The first time it needs to get into Moodle, the moodle-teacher extension opens a browser window for you to log in yourself, and neither miyagi nor the model sees your password. The extension keeps that session, so it doesn't ask you again until it expires.

### What happens to my students' data? {#qué-pasa-con-los-datos-de-mis-alumnos}

It reads what you would see in Moodle in order to do its work, but your students reach it under an alias (“A-7KQ2XM”), never with their name. In its notes it doesn't keep records about individual students, only class trends. More detail in [Security and privacy](../avanzado/seguridad-y-privacidad.md).

### Does it run programs on my computer? {#ejecuta-programas-en-mi-ordenador}

No: miyagi has no terminal. For computing courses you can install the docker-lab extension, and then it runs practicals only inside Docker labs, without internet unless you allow it and without touching anything outside each lab. It's in [Practicals in Docker](../avanzado/practicas-docker.md).

## How it works {#su-forma-de-trabajar}

### Where are its notes? {#dónde-están-sus-apuntes}

In the course's `knowledge` folder: text files you can open with any editor (or with [Obsidian](https://obsidian.md), which shows how they link together). It's in [The course's memory](memoria.md).

### How does it test what it creates before students see it? {#cómo-prueba-lo-que-crea-antes-de-que-lo-vean-los-alumnos}

It prepares it in the course's `drafts` folder, uploads it to Moodle **hidden** (with your permission), tests it there as a teacher and asks your permission again to show it. Whatever you leave hidden is noted in `knowledge/drafts.md` and it reminds you when you close the session.

### Can I give it my own instructions? {#puedo-darle-instrucciones-propias}

Yes. Create an `instructions.md` file in the course folder and write there whatever you want it to always keep in mind: “grade out of 10”, “keep it short in the forum”, “spelling counts for 10%”. You can also create your own shortcuts and skills: [Shortcuts and instructions](../avanzado/atajos-e-instrucciones.md).

### What language does it speak? {#en-qué-idioma-habla}

The one you chose when setting up the course, which is also the language of its menus and messages if it's Spanish, English, French or German. To change the menus just once, add `--language=en` (or `es`, `fr`, `de`) to the command. If you write to it in another language, it follows you. What it publishes in Moodle is always in the course's language, whatever language you speak to it in.

### Can it download, compress or make PDFs? {#puede-descargar-comprimir-o-hacer-pdf}

Yes, inside the course's `drafts` folder and with its own tools, without a terminal: it downloads files and complete web pages, copies, compresses and decompresses (for example, for a SCORM package) and converts notes to PDF. For safety there are size limits, which you can change: [Configuration](../avanzado/configuracion.md).

### Does a browser window open while it works? {#se-abre-una-ventana-del-navegador-mientras-trabaja}

No. It works in Moodle without a window. One only opens for you to log in, the first time or when your session expires.

### Can I pick up a conversation from another day? {#puedo-retomar-una-conversación-de-otro-día}

Yes. `miyagi chat --continue` opens the last one, and `/resume` inside the chat lets you choose any earlier one. It's in [The chat](chat.md).

## If you came from another version {#si-venías-de-otra-versión}

### I was using teacher-agent {#venía-usando-teacher-agent}

It's the same project under another name since version 0.10. Install miyagi as explained in [Install](instalar.md); your configuration (including access to Claude) and your course folders work as they are. The `teacher-agent` command no longer gets new versions: remove the old package:

```bash
npm uninstall -g teacher-agent
```

### I was using moodle-agent {#venía-usando-moodle-agent}

Your teacher classroom folder works as it is: run `miyagi chat` inside it and the assistant will reorganise its notes into the new format the first time.
