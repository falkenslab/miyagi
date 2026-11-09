---
title: The terminal
sidebar_position: 6
description: "miyagi in the terminal: init, chat, run, ingest, explore and extensions, for those who prefer the keyboard or want single-command tasks."
---

# The terminal {#la-terminal}

The terminal is the version of miyagi for those who prefer the keyboard or want single-command tasks. It does the same as the [desktop app](escritorio.md), with the same permissions before publishing and the same subjects. You need to [install it from the terminal](instalar.md#instalarlo).

<Shot width="1400" height="1456" kind="terminal" src="/img/v2/terminal-ayuda.webp" alt="The output of miyagi --help: the commands and their options.">miyagi's commands, with `miyagi --help`.</Shot>

## Creating a subject: `miyagi init` {#init}

<Terminal>{`$ miyagi init`}</Terminal>

It asks you for the name, the description, the tone and the language, whether you want to create `instructions.md` and whether you're connecting a Moodle classroom now.

<Shot width="1400" height="612" kind="terminal" src="/img/v2/terminal-init.webp" alt="The terminal with miyagi init on a demo subject: name, description, tone, language, and the option of not connecting the classroom.">`miyagi init`, without connecting a classroom.</Shot>

The subject is saved in `~/.miyagi/workspaces/<name>/` and you open it from anywhere by its name, for example `miyagi chat -w bases-de-datos`. `miyagi workspaces` shows you which ones you have. The details are in [Getting started](primeros-pasos.md).

## Talking to it: `miyagi chat` {#chat}

<Terminal>{`$ miyagi chat -w bases-de-datos`}</Terminal>

The chat fills the whole terminal window. It greets you with what it already knows about the course, and you ask for things in your own words.

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-chat.webp" alt="miyagi chat with a read-only reply about the submissions for the final practical, with a table of aliases and their state.">A real reply in the terminal chat.</Shot>

Before publishing, it asks your permission with a panel: **Yes** (Enter, `1` or `y`), **No** (`2` or `n`) or **Stop** (`3`).

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-aprobacion.webp" alt="The terminal chat with the approval panel for renaming a section and the Yes, No and Stop options.">The approval in the terminal.</Shot>

Shortcuts are typed with `/`, and `miyagi commands` lists them:

<Shot width="1400" height="1110" kind="terminal" src="/img/v2/terminal-comandos.webp" alt="The output of miyagi commands: the list of chat shortcuts.">The chat shortcuts.</Shot>

All the keys and the modes are in [The conversation](chat.md).

## Single-command tasks: `miyagi run` {#run}

If you already know what you want, give it the task in one go:

<Terminal>{`$ miyagi run --task "Which submissions do I have left to grade?"`}</Terminal>

<Shot width="1400" height="883" kind="terminal" src="/img/v2/terminal-run.webp" alt="The terminal with a read-only miyagi run --task and its reply.">A read-only task with `miyagi run --task`.</Shot>

It's explained in [Single-command tasks](run.md).

## Give it your material: `miyagi ingest` {#ingest}

Copy your documents into the subject's `sources` folder and:

<Terminal>{`$ miyagi ingest -w bases-de-datos`}</Terminal>

It doesn't open Moodle: it reads each document and turns it into pages of its course memory, linked to each other.

<Shot width="1400" height="1066" kind="terminal" src="/img/v2/terminal-ingest-trabajando.webp" alt="miyagi ingest working on a demo subject: it reads the sources and creates pages as it goes.">`miyagi ingest` at work.</Shot>

<Shot width="1400" height="873" kind="terminal" src="/img/v2/terminal-ingest-resumen.webp" alt="The summary of miyagi ingest: the gaps it finds and the web sources it suggests.">And its summary, with the gaps it found.</Shot>

## Looking at your Moodle: `miyagi explore` {#explore}

With the classroom connected, `miyagi explore` looks, without changing anything, at which activity and question types it sees in your course and how grades are calculated, and notes it down in `course/moodle-capabilities`.

<Terminal>{`$ miyagi explore -w bases-de-datos`}</Terminal>

<Shot width="1400" height="883" kind="terminal" src="/img/v2/terminal-explore.webp" alt="The end of miyagi explore: a summary of what it has seen and the page saved in course/moodle-capabilities.">The end of `miyagi explore`.</Shot>

## Extensions: `miyagi extension` {#extensiones}

<Terminal>{`$ miyagi extension list
$ miyagi extension add docker-lab`}</Terminal>

<Shot width="1400" height="346" kind="terminal" src="/img/v2/terminal-extensiones.webp" alt="The output of miyagi extension list: docker-lab and moodle-teacher enabled.">`miyagi extension list`.</Shot>

All the commands are in [Extensions](/avanzado/extensiones/). Inside the chat, `/extensions` shows which ones the session works with.

## Its skills: `miyagi skills` {#skills}

<Terminal>{`$ miyagi skills`}</Terminal>

<Shot width="1400" height="1456" kind="terminal" src="/img/v2/terminal-skills.webp" alt="The output of miyagi skills with the list of skills and, at the end, estilo-sql marked as your own.">`miyagi skills`, with a skill of your own at the end.</Shot>

You can see it in real tasks in [Use cases in the terminal](/casos-de-uso/en-terminal/). All the commands and options are in the [Reference](referencia.md).
