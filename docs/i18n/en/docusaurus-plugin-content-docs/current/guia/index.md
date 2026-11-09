---
title: What is miyagi?
sidebar_position: 1
description: "An assistant that prepares your subject with you and, if you connect your Moodle course, works in it and asks your permission before publishing anything."
---

# What is miyagi? {#qué-es-miyagi}

miyagi is an assistant for teachers. It helps you prepare your subject (teaching plan, units, materials, rubrics, quizzes) and, if you connect your Moodle course, it also helps you run it: it **grades submissions**, **answers in the forum**, **creates or reviews content** and **sums up how the class is going**. In Moodle it works with your own teacher session, through the moodle-teacher extension.

You talk to it in your own words, as you would with a colleague. And **nothing your students see is published without your permission**: before it saves a grade, replies in the forum or publishes a resource, it shows you what it's about to do and waits for your yes.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-navegador-moodle.webp" alt="The miyagi desktop app: on the left the icons, the conversations of the Introducción a SQL subject and the chat; on the right, in a tab, the Moodle course open with the teacher's session.">The miyagi desktop app: the conversation and, next to it, your Moodle course open in its built-in browser.</Shot>

## Three versions, one way of working {#tres-versiones}

There are three ways to use miyagi. They all open the same subjects and ask your permission in the same way:

- **The desktop app** is the main version and the one we recommend. It installs on Windows with a double click, with no terminal and no Node.js, and it's the most complete: it has its own window bar and a built-in browser so you can have Moodle next to the conversation.
- **The web version** is the same page, opened in a tab of your browser with `miyagi web`. It works on Windows, Mac and Linux.
- **The terminal** is the classic one: `miyagi chat` and single-command tasks, for those who prefer the keyboard.

Not sure which? We'll help you [choose your version](elegir-version.md). If you have Windows, start with the [desktop app](escritorio.md).

## What it does for you {#qué-hace-por-ti}

- **Grades with your rubric.** It applies your criteria the same way to everyone and writes useful feedback. It shows you each grade before saving it. Text submissions reach it directly; those that are a file, with the default data protection, don't: we explain it in the [tutorial](/casos-de-uso/corregir/).
- **Looks after the forum.** It finds unanswered questions, decides when to step in and replies in the tone you chose. It notes the questions that keep coming up.
- **Creates content.** Notes, assignments with their rubric, quizzes, glossaries, peer-assessment workshops, whole units and even a complete course.
- **Helps you with the teaching plan.** It writes it with you and checks that the Moodle classroom matches it.
- **Keeps track of the class.** It tells you who is falling behind and audits the course with recommendations ordered by priority.
- **Remembers your course.** It takes notes while it works (your criteria, the rubrics, the forum questions, how the class is evolving) and starts from there in the next conversation.

## Who it's for {#para-quién-es}

For teachers who run a course in Moodle and want to get rid of the repetitive work without losing control of what their students see. You don't need to know how to program: on Windows you install it with a double click, and after that you use it by talking to it.

The classroom is optional. Without connecting Moodle, miyagi still helps you with the teaching plan, the units and the materials.

## What you need {#qué-necesitas}

- **A Claude Pro or Max subscription**, or an API key. miyagi is free and open source (MIT license); what powers the assistant is Claude.
- **The Windows app** (64-bit Windows) or, for the web version and the terminal, **Node.js** 20 or later.
- **A browser** such as Chrome or Edge, to log in to Moodle.
- **A Moodle course where you have the teacher role**, if you want it to work in your classroom. There's nothing to install on your school's server: it works with your session, like you do.

## How it works, in three steps {#cómo-funciona-en-tres-pasos}

1. **You install it.** On Windows, an installer. On Mac and Linux, one line in the terminal. See [Install](instalar.md).
2. **You create your subject.** You give it a name, the tone and the language and, if you want, the address of your Moodle course (never your password: you log in yourself in a browser window). If you give it your teaching plan, your rubrics or your criteria, it takes them into account. See [Getting started](primeros-pasos.md).
3. **You ask, and you approve.** You talk to it or give it a task. When something is about to reach your students, it shows it to you and waits for your yes.

## Where to go next {#por-dónde-seguir}

- [Choose your version](elegir-version.md): desktop, web or terminal, and what each one needs.
- [The desktop app](escritorio.md): from installing it to the last part of the window.
- [Install](instalar.md): the requirements and the installation step by step.
- [An Introduction to SQL course, step by step](/casos-de-uso/): a complete walkthrough with real screenshots, from the empty subject to grading and looking after the forum.
- [What to ask it](ideas.md): ideas for using it, from the simplest to the most ambitious.
- [Frequently asked questions](preguntas-frecuentes.md).
