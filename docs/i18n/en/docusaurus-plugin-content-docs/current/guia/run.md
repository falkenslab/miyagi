---
title: Single-command tasks
sidebar_position: 8
description: "How to give miyagi a specific task, or a pass through the whole course, without a conversation: miyagi run and its modes."
---

# Single-command tasks {#encargos-de-una-sola-orden}

The chat is for conversation. If you already know what you want and don't need to talk it through, you can give it the task in one go with `miyagi run`, from the course's folder.

## A specific task: `--task` {#una-tarea-concreta---task}

Write the task in quotes:

<Terminal>{`$ miyagi run --task "Grade Assignment 2"
$ miyagi run --task "Check the forum and answer the unanswered questions"
$ miyagi run --task "Create a 10-question quiz on unit 3"
$ miyagi run --task "Audit the course and find problems"
$ miyagi run --task "Build an introduction to HTML5 and CSS3 course for first-year web development"`}</Terminal>

It does only that, with the same rules as in the chat. A shortcut works too: `miyagi run --task "/miyagi:build-course Introduction to Docker, 3 units, for vocational training"`.

## A pass through the whole course {#una-pasada-por-todo-el-curso}

<Terminal>{`$ miyagi run`}</Terminal>

Without `--task`, it goes through the course from start to finish: it grades pending submissions, looks after the forum, reviews or adds content if needed, and ends with a summary of how the class is going.

## How closely you want to supervise it {#cuánto-quieres-supervisarlo}

Before starting, it asks you which mode you want it to work in:

| Mode | What it means |
| --- | --- |
| `guided` (recommended) | It works on its own, but asks your permission before publishing anything your students see. |
| `interactive` | It asks you to confirm before each step. Useful for seeing how it works. |
| `autonomous` | It doesn't ask anything: it publishes without asking your permission. Only for test courses. |

To avoid choosing it every time, pass it in the command:

<Terminal>{`$ miyagi run --mode guided --task "Grade Assignment 2"`}</Terminal>

:::caution[The autonomous mode doesn't ask permission]
In `autonomous` nobody reviews what it publishes: grades, forum replies, new content. Use it only in a test course or when you fully trust what it's going to do.
:::

## While it works {#mientras-trabaja}

You'll see in the terminal what it's doing. If it's the first time it goes into Moodle (or your session has expired), a browser window opens for you to log in yourself. When it needs your permission, it will show you the same panel as in the chat: **Yes**, **No** or **Stop**.

If you want to cut it short, press `Ctrl+C`: it interrupts it and closes the session normally. If you press it again, it exits without waiting. Whatever it was doing at that moment may be left half done (an unsaved grade, for example); in the next session you can ask it to pick it up again.

## Other options {#otras-opciones}

- `--plain`: shows progress as plain text, without animations or panels. Useful if you save the output to a file.

All the commands and options are in the [Reference](referencia.md).
