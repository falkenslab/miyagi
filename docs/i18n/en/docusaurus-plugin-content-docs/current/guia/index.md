---
title: What is miyagi?
sidebar_position: 1
description: "An assistant that works in your Moodle course the way you would, and asks your permission before publishing anything."
---

# What is miyagi? {#qué-es-miyagi}

miyagi is an assistant that helps you run your Moodle course. It works in your course with your own teacher session, through the moodle-teacher extension, and does what you would do: it **grades submissions**, **answers in the forum**, **creates or reviews content** and **sums up how the class is going**.

You talk to it in the terminal, in your own words, as you would with a colleague. And **nothing your students see is published without your permission**: before it saves a grade, replies in the forum or publishes a resource, it shows you what it's about to do and waits for your yes.

![miyagi in the chat: it checks in Moodle what's left to grade and how the forum is doing, and answers with a table of pending work and what to do next](/img/chat.png)

## What it does for you {#qué-hace-por-ti}

- **Grades with your rubric.** It applies your criteria the same way to everyone and writes useful feedback. It shows you each grade before saving it.
- **Looks after the forum.** It finds unanswered questions, decides when to step in and replies in the tone you chose. It notes the questions that keep coming up.
- **Creates content.** Notes, assignments with their rubric, quizzes, glossaries, peer-assessment workshops, whole units and even a complete course.
- **Helps you with the teaching plan.** It writes it with you and checks that the Moodle classroom matches it.
- **Keeps track of the class.** It tells you who is falling behind and audits the course with recommendations ordered by priority.
- **Remembers your course.** It takes notes while it works (your criteria, the rubrics, the forum questions, how the class is evolving) and starts from there in the next session.

## Who it's for {#para-quién-es}

For teachers who run a course in Moodle and want to get rid of the repetitive work without losing control of what their students see. You don't need to know how to program: you install it by pasting one line into the terminal, and after that you use it by talking to it.

## What you need {#qué-necesitas}

- **A browser** such as Chrome or Edge, to log in to Moodle.
- **Node.js** 20 or later, the program that makes miyagi run.
- **A Claude Pro or Max subscription**. miyagi is free and open source (MIT license); what powers the assistant is your Claude subscription.
- **A Moodle course where you have the teacher role**. There's nothing to install on your school's server: it works with your session, like you do.

## How it works, in three steps {#cómo-funciona-en-tres-pasos}

1. **You install it.** One line in the terminal, on Windows, Mac or Linux. See [Install](instalar.md).
2. **You introduce your course to it.** `miyagi init` asks you for the subject's name and the tone and, if you want, the address of your Moodle course (never your password: you log in yourself in a browser window). Then it can explore your Moodle (without touching anything) to learn what's in it. If you give it your teaching plan, your rubrics or your criteria, it takes them into account. See [Getting started](primeros-pasos.md).
3. **You ask, and you approve.** You talk to it in the [chat](chat.md) or give it a task in a single command. When something is about to reach your students, it shows it to you and waits for your yes.

## Where to go next {#por-dónde-seguir}

- [Install](instalar.md): the requirements and the installation step by step.
- [Getting started](primeros-pasos.md): connecting it to your course and your first conversation.
- [An Introduction to SQL course, step by step](../casos-de-uso/index.md): a complete walkthrough with real screenshots, from the empty course to grading and looking after the forum.
- [What to ask it](ideas.md): ideas for using it, from the simplest to the most ambitious.
- [Frequently asked questions](preguntas-frecuentes.md).
