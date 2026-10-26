---
title: Practicals in Docker
sidebar_position: 7
description: "How miyagi checks assignment statements, solutions and submissions by running them in labs of the docker-lab extension, with what limits and how to install it."
---

# Practicals in Docker {#prácticas-en-docker}

In a computing course (Docker, Linux, programming, databases), a practical that doesn't work as written costs the whole class the afternoon. And a submission graded “by reading the code” can get a grade for something that doesn't run. With the **docker-lab** extension, miyagi can actually run the practicals, inside Docker labs:

- **Before publishing a practical**, it follows it step by step as a student would and checks that the solution gives what the statement promises. If something fails, it fixes it before publishing it.
- **When grading**, it runs the student's submission and uses what comes out as evidence in the grade and in the feedback.

## What docker-lab is {#qué-es-docker-lab}

docker-lab is an [extension](extensiones.md) from the official repository ([falkenslab/agent-extensions](https://github.com/falkenslab/agent-extensions)) that starts docker-mcp, a server that runs **labs**: isolated Docker environments, each with its own rules. miyagi has no terminal, not even with docker-lab: everything it runs goes through the labs' tools ([ADR-024](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-024-no-shell-practices-in-docker-lab.md)).

## How to install it {#cómo-instalarla}

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (on Linux, Docker Engine), version 24 or later. If it's missing, docker-lab tells you what to install.
2. Install the extension in `lab` mode, the recommended one (labs only):

   ```bash
   miyagi extension add docker-lab --set mode=lab
   ```

Like any extension, you can install it for all your subjects or just for one with `--project` (see [Extensions](extensiones.md)). It's available in `chat` and `run`.

## The labs {#los-laboratorios}

A lab is a folder inside docker-lab's labs folder, with a `compose.yaml` and, if needed, a `lab.json` with its check. That folder is the extension's `labs_dir` option or, if you don't give it, `labs` inside the extension's data folder.

docker-mcp has no tools to write files, so miyagi writes the lab's files in that folder: with docker-lab enabled, it's the only one it can write to besides `drafts/` (see [Security and privacy](seguridad-y-privacidad.md)). It names each lab `<subject>-<activity>`, so that two subjects' labs don't get mixed up, and handles them with `lab_up` (start it), `lab_exec` (run something inside), `lab_check` (run its check) and `lab_down` (stop it).

## Each lab's policy {#la-política-de-cada-laboratorio}

docker-mcp enforces it when starting a lab, not instructions to the model: a lab that breaks it doesn't start.

- **No internet**, unless you allow it with the `allow_internet` option (off by default).
- **Nothing mounted outside the lab's folder**, and never the Docker socket.
- **CPU and memory limits** per service: the `cpus` (1 by default) and `memory` (`512m` by default) options.
- **No new privileges** inside the containers.

The options are given when installing the extension, with `--set clave=valor`, or when `miyagi extension add` asks you for them.

## What miyagi blocks {#lo-que-miyagi-bloquea}

docker-mcp also has tools that work with the computer's whole Docker: containers, images, volumes, networks, Compose projects and cleanup (`prune`). miyagi always takes them away, whatever the extension's mode: only the labs are left to it.

## How it works {#cómo-trabaja}

The assistant uses the [`practice-testing`](https://github.com/falkenslab/miyagi/blob/main/plugin/skills/practice-testing/SKILL.md) skill to know what to check and what to do with the result; the mechanics of setting up and running a lab belong to docker-lab's skills, `build-a-lab` and `verify-by-running`.

### Before publishing a practical {#antes-de-publicar-una-práctica}

1. It writes the lab: the `compose.yaml` with the image the students will use (with a pinned version, the one the statement says), the starting files, the solution if there is one and a `lab.json` whose check says whether the solution does what the statement promises.
2. It follows the statement step by step as a student, inside the lab, and notes where it breaks.
3. It runs the solution and the check. It fixes each failure (a missing step, a version that doesn't exist, an output different from the one promised) in the statement or in the solution and repeats until it passes. Only then does it publish the practical, with its approval.
4. It notes on the activity's page (`activity/<slug>`) that it was checked, when, with which image and which commands the student will run, and stops the lab.

### When grading a submission {#al-corregir-una-entrega}

1. It takes the student's files to a lab of the activity, in a folder with an identifier or an alias, never with their name.
2. It runs what the activity asked for (“the container has to respond on port 8080 with…”), with its check if it has one.
3. It grades with `grading-rubric`, using what was run as evidence, and quotes the relevant command and output in the feedback when they explain the grade. Running never sets the grade: the assistant sets it.

Running is checking, not publishing: before starting a lab, miyagi asks you for a single approval with what it's going to do (which lab, which image, what it will run inside and that it will stop it when done), and with that yes it does the whole check with no more questions. Stopping the lab is confirmed by docker-lab. Publishing the practical or saving a grade carry their own approval, as always.

## Without docker-lab {#sin-docker-lab}

If docker-lab isn't installed or is disabled, the `practice-testing` skill isn't offered. If you ask it to test a practical, miyagi will tell you it can't run anything and will suggest installing docker-lab; it will never present an untested practical as tested.

In the tutorial [An Introduction to SQL course](../casos-de-uso/index.md) you can see it checking MariaDB practicals.
