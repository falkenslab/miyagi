---
title: Extensions
sidebar_position: 10
description: "How to add capabilities to miyagi with extensions from Falken's Lab's official repository: installing them for all your subjects or just for one, configuring them, disabling them and what happens with other people's repositories."
---

# Extensions {#extensiones}

An **extension** gives miyagi something it doesn't come with: new tools (for example, testing code in a Docker lab) or knowing how to do something in a particular way (for example, a visual style for what it publishes). Each extension brings its own skills, which the assistant uses like its own.

Extensions are managed by agent-kit, the base miyagi is built on. miyagi only decides where they come from and which ones it shows you.

## Where they come from {#de-dónde-salen}

- **The official repository**, [`falkenslab/agent-extensions`](https://github.com/falkenslab/agent-extensions), is published by Falken's Lab. miyagi already knows it, and what you install from it doesn't ask for confirmation. The catalog shows you only the extensions meant for miyagi.
- **Other repositories** you can add yourself, but miyagi warns you first: their code runs on your computer with your permissions, and it isn't Falken's Lab's. You have to type its name to confirm, and when you install something from it, it asks you again. There's no community catalog.

## The ones that go with miyagi {#las-que-van-con-miyagi}

From the official repository, meant for miyagi:

- **moodle-teacher**: your Moodle classroom, with your session and the students under pseudonyms. miyagi installs it when connecting the classroom (see [Configuration](configuracion.md)).
- **docker-lab**: testing practicals in Docker labs (see [Practicals in Docker](practicas-docker.md)).
- **moodle-ui-kit**: a visual style for what it publishes in Moodle.

## For all your subjects or just for one {#para-todas-tus-asignaturas-o-solo-para-una}

- **For all** (the usual): it's installed in `~/.miyagi/extensions/`.
- **Just for one**, with `--project`: the subject keeps only an `extensions/extensions.lock.json` with which extension it uses and in which version, and the code goes to `~/.miyagi/` all the same. If you share the subject's folder with a colleague, `miyagi extension restore` downloads the same for them, and `miyagi extension trust` asks them before letting it run.

## The commands {#las-órdenes}

They all accept `--dir <folder>` to work on that subject.

| Command | What it does |
| --- | --- |
| `miyagi extension search [palabras]` | What the catalog offers. |
| `miyagi extension add <name> [--project]` | Installs it and asks you for its settings, if it has any (`--set clave=valor` gives them without asking). |
| `miyagi extension list` | The installed ones, where, and whether they're enabled. |
| `miyagi extension info <name>` | What it offers and what it needs on your computer. |
| `miyagi extension config <name> [clave=valor…]` | See or change its settings. A secret is asked for without showing what you type. |
| `miyagi extension enable` / `disable <name>` | Enable or disable it without removing it. |
| `miyagi extension update [nombre]` | Move to the version its repository offers now, keeping its data and settings. |
| `miyagi extension remove <name>` | Remove it. It asks whether to delete its data too. |
| `miyagi extension marketplace add` / `list` / `remove` | Manage other people's repositories. |

`miyagi extension` on its own explains each one. Inside the chat, `/extensions` shows which extensions it's working with, and enabling or disabling one from there reopens the session without losing the conversation.

In the [app and in the browser](navegador.md#extensiones) all of this is in **Extensions**, without typing commands, and what you install from there starts working in the open conversation.

In the terminal, an installed or changed extension takes effect in the next session, not in the one already open. `miyagi skills` lists its skills with the extension's name in square brackets.

## What an extension can't get around {#lo-que-una-extensión-no-puede-saltarse}

Wherever it comes from, an extension doesn't change miyagi's rules ([Security and privacy](seguridad-y-privacidad.md)):

- any tool of its own that can change something asks for your approval, like miyagi's;
- its secrets reach only it, and its programs start without your environment variables (or your access to Claude);
- what its tools return is treated as data, never as orders;
- nothing about a specific student goes into the knowledge base.
