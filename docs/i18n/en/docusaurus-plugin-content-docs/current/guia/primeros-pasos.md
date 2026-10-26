---
title: Getting started
sidebar_position: 3
description: "Prepare a folder for your course with miyagi init, give it your material and start your first conversation."
---

# Getting started {#primeros-pasos}

You already have miyagi [installed](instalar.md). Now you'll prepare a subject and, if you want, connect it to your Moodle course. You do this only once per subject.

:::tip[The complete walkthrough, with screenshots]
This page is the summary. If you'd rather see it all done for real, step by step and with Moodle screenshots, follow the tutorial [An Introduction to SQL course](../casos-de-uso/index.md).
:::

## 1. One subject for each course {#1-una-asignatura-para-cada-curso}

Each subject you prepare with miyagi has its own folder, with its settings, your documents and the assistant's notes. You don't have to create it or remember where it is: `miyagi init` keeps it inside miyagi's folder (`~/.miyagi/workspaces/<name>/`, on Windows `C:\Users\<your-user>\.miyagi\workspaces\`), outside the folders that sync with the cloud, and adds it to your list of subjects.

After that you open it by its name from anywhere, for example `miyagi chat -w bases-de-datos`. With plain `miyagi` it asks you which one you want to work with. `miyagi workspaces` tells you which ones you have and which folder each one is in.

If you'd rather use a folder of your own, create it with `miyagi init --dir <folder>`. It's also added to the list, and inside that folder miyagi uses it without you having to say so.

## 2. Introduce the course to it: `miyagi init` {#2-preséntale-el-curso-miyagi-init}

```bash
miyagi init
```

It will ask you a few questions, one after another:

- **Subject name.** A name to recognize it by, like `Bases de Datos 1.º DAW`. It's also the one you'll use with `-w`.
- **Description.** Optional, for you.
- **Tone of voice.** How it will talk to your students in the forum, in feedback and in announcements: no preference (neutral), formal, warm, or warm and motivating.
- **Language.** The language you'd rather talk to it in, for example `English`. It also sets the language of its menus and messages if that's Spanish, English, French or German. Left blank, it answers in the language you write to it in.
- **Create `instructions.md`?** A file where you write the instructions you want it to always keep in mind, like “grade out of 10”. You can create it by hand later.
- **Connect a Moodle classroom now?** By default, no: miyagi helps you just the same with the teaching plan, the units and the materials. You can connect it whenever you want with `miyagi init -w <name>`, or in the app from **Your classroom** ([Your classroom](../avanzado/navegador.md#tu-aula)). If you say yes, it asks you for:
  - **Moodle URL.** The easiest way: open your course in the browser and copy the full address, something like `https://moodle.myschool.edu/course/view.php?id=42`. From it, it works out your Moodle's address and the course number by itself.
  - **Course ID.** Only if the address you pasted didn't include it: the number after `id=`.

  It doesn't ask for a username or password. miyagi installs the **moodle-teacher** [extension](../avanzado/extensiones.md), which works in Moodle with your own session: the first time it needs it, it opens a browser window for you to log in yourself, and it never sees your password. By default it can change your course, always asking your permission first, and your students reach it under an alias, never by their name.

If you've connected a classroom, at the end it offers to **explore your Moodle now**. We recommend saying yes: it goes into your course, looks at which activity and question types it sees there and how grades are calculated, and takes note of it. It doesn't create or change anything. If something fails (you don't manage to log in in the window, for example), the subject is set up anyway and you can repeat it whenever you want with `miyagi explore`.

If it's the first time you use miyagi on this computer, at this point it will ask you to [connect your Claude account](instalar.md).

When it's done, your subject's folder will contain this:

```text
bases-de-datos/
  config.json        your subject and your Moodle's address (the assistant can't read it)
  instructions.md    your standing instructions (if you said yes)
  sources/           this is where you put YOUR documents: teaching plan, rubrics, solutions
  knowledge/         this is where IT writes: its notes on the course
  drafts/            what it prepares for Moodle before uploading it
```

## 3. Give it your material {#3-dale-tu-material}

This step is optional, but it makes the difference. Copy into the `sources` folder whatever you have: the teaching plan, the rubrics, the assignment briefs with their solution, your criteria (“late submissions, 20% off”). PDF, Word, PowerPoint (it also reads the speaker notes), Excel and text documents all work, and even photos of handwritten notes or of slides.

Then, in the terminal:

```bash
miyagi ingest
```

It reads your documents without opening Moodle and adds them to its notes: a summary of each one, linked to the unit or activity it belongs to. When grading, **your criteria take precedence** over its own.

When you add new documents, run it again: it only processes the ones it didn't have yet. You can also ask for it from the chat with `/knowledge:ingest`.

## 4. Your first conversation {#4-tu-primera-conversación}

```bash
miyagi chat
```

The chat fills the whole terminal window. The assistant greets you with what it already knows about the course, from its notes, without going into Moodle yet. If it doesn't know anything yet, it offers to explore the course or read your documents. The first time something you ask for needs to go into Moodle, a browser window opens for you to log in yourself; after that it works without a window.

A good first message:

```text
/miyagi:orient
```

It looks for the course guide, the welcome page or the general instructions, and notes how the course is assessed, the deadlines and where the class communicates. From there, ask it for whatever you need in your own words.

To exit, type `/exit`. There's nothing to save: everything is saved as you go.

## Next step {#siguiente-paso}

- [The chat](chat.md): how to approve, reject, interrupt and resume a conversation.
- [What to ask it](ideas.md): ideas to get started, from simple to more ambitious.
