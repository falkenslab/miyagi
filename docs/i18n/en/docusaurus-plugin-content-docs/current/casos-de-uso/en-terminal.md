---
title: Use cases in the terminal
sidebar_label: In the terminal
sidebar_position: 13
description: The same tasks from the SQL classroom done from the terminal, with miyagi init, ingest, chat, run and the extensions.
---

# Use cases in the terminal {#casos-de-uso-en-la-terminal}

The tasks in the [SQL tutorial](/casos-de-uso/) can also be done from the [terminal](/guia/terminal/). These screenshots are of the same subject.

## Prepare the subject {#preparar-la-asignatura}

<Terminal>{`$ miyagi init`}</Terminal>

<Shot width="1400" height="612" kind="terminal" src="/img/v2/terminal-init.webp" alt="The terminal with miyagi init on a demo subject: name, description, tone, language and no classroom.">`miyagi init` on a demo subject.</Shot>

## Give it your material {#darle-tu-material}

Copy your documents into `sources` and:

<Terminal>{`$ miyagi ingest -w introduccion-a-sql`}</Terminal>

<Shot width="1400" height="1066" kind="terminal" src="/img/v2/terminal-ingest-trabajando.webp" alt="miyagi ingest reading a demo subject's sources and creating pages.">`ingest` at work, on a demo subject.</Shot>

<Shot width="1400" height="873" kind="terminal" src="/img/v2/terminal-ingest-resumen.webp" alt="The summary of miyagi ingest, with the gaps it finds and the web sources it proposes.">And its summary.</Shot>

## See what the Moodle supports {#mirar-qué-admite-el-moodle}

<Terminal>{`$ miyagi explore -w introduccion-a-sql`}</Terminal>

<Shot width="1400" height="883" kind="terminal" src="/img/v2/terminal-explore.webp" alt="The end of miyagi explore: what it has seen in the course and the page saved in its memory.">What it has seen in the course, in `course/moodle-capabilities`.</Shot>

## Grading {#corregir}

<Terminal>{`$ miyagi chat -w introduccion-a-sql`}</Terminal>

<Prompt>{`Which submissions of the Práctica final do I have left to grade?`}</Prompt>

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-chat.webp" alt="The terminal chat answering with a table of aliases, whether they submitted and whether they're still to be graded.">The state of the submissions, only reading. The students appear as aliases here too, and if the submission is a file it asks your permission to save it [just as in the app](/casos-de-uso/corregir/#archivos).</Shot>

Before publishing it asks your permission just as in the other versions:

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-aprobacion.webp" alt="The approval panel in the terminal for renaming a section, with the options Yes, No and Stop.">Yes, No or Stop, from the keyboard.</Shot>

## One-command tasks {#encargos-de-una-sola-orden}

For something specific, without a conversation:

<Terminal>{`$ miyagi run --task "Dime cuántas entregas sin corregir tiene la Práctica final, sin cambiar nada"`}</Terminal>

<Shot width="1400" height="883" kind="terminal" src="/img/v2/terminal-run.webp" alt="The terminal with a read-only miyagi run --task and the reply.">A read-only task.</Shot>

## Your own skill, and the extensions {#tu-propia-habilidad-y-las-extensiones}

`miyagi skills` lists the skills, including yours:

<Shot width="1400" height="1456" kind="terminal" src="/img/v2/terminal-skills.webp" alt="miyagi skills with the estilo-sql skill marked as your own at the end.">The `estilo-sql` skill, at the end of the list.</Shot>

And `miyagi extension list` the extensions:

<Shot width="1400" height="346" kind="terminal" src="/img/v2/terminal-extensiones.webp" alt="miyagi extension list with docker-lab and moodle-teacher enabled.">The subject's extensions.</Shot>

The shortcuts are under `miyagi commands`, and the commands in the [Reference](/guia/referencia/).

<Shot width="1400" height="1110" kind="terminal" src="/img/v2/terminal-comandos.webp" alt="miyagi commands with the list of the conversation's shortcuts.">`miyagi commands`.</Shot>
