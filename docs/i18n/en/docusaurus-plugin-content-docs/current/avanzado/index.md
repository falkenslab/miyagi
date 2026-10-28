---
title: How it works inside
sidebar_position: 1
description: "miyagi's architecture: agent-kit, the Claude Agent SDK, the moodle-teacher extension, the session kinds, the modes, the helpers and the course folder."
---

# How it works inside {#cómo-funciona-por-dentro}

This section is for whoever wants to understand or adapt miyagi: curious teachers, the school's IT staff or anyone who wants to customize it for their subject. Everything here comes from the code and from the assistant's own instructions, which you can read on [GitHub](https://github.com/falkenslab/miyagi).

## The pieces {#las-piezas}

- **The model.** miyagi is an agent on the [Claude Agent SDK](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk): the reasoning is done by Claude, with your subscription.
- **agent-kit.** The common base ([`@falkenslab/agent-kit`](https://www.npmjs.com/package/@falkenslab/agent-kit)) provides what every agent needs: the supervision modes, the approvals, the extensions, the knowledge base, the limit on the folders it can write to, the terminal chat and the log of each session.
- **moodle-teacher.** miyagi has no browser of its own: it reaches your classroom only through the moodle-teacher extension, from the official repository [falkenslab/agent-extensions](https://github.com/falkenslab/agent-extensions). It runs moodle-mcp, a fixed set of tools that work in Moodle with your own session, without clicking through the screens. The first time it's needed, it opens a browser window for you to sign in yourself; miyagi and the model never see your password.
- **Extensions.** What miyagi doesn't come with is added through [extensions](extensiones.md) from Falken's Lab's official repository, for all your subjects or just for one.
- **The teacher's craft.** What miyagi knows about the teacher's craft lives in text files: the system instructions in [`prompts/`](https://github.com/falkenslab/miyagi/tree/main/prompts) and the skills and shortcuts in [`plugin/`](https://github.com/falkenslab/miyagi/tree/main/plugin). How each thing is done in Moodle comes from the extension's `moodle-teacher:*` skills.

```text
miyagi (CLI)
 ├─ carpeta del curso: config.json, instructions.md, .claude/
 └─ sesión (agent-kit + Claude Agent SDK)
     ├─ instrucciones de sistema (prompts/system/*.md + instructions.md)
     ├─ habilidades y atajos (plugin/, el plugin de conocimiento de agent-kit, .claude/ del curso, extensiones)
     ├─ herramientas de archivos: escriben solo en drafts/ y materials/ (y en los laboratorios de docker-lab, si está activada; sources/ solo lectura)
     ├─ herramientas knowledge_* de agent-kit: lo único que llega a knowledge/
     ├─ herramientas de fuentes de agent-kit: list_sources, extract_text, save_to_sources…
     ├─ extensión moodle-teacher (moodle-mcp) ──> tu Moodle, con tu sesión
     ├─ extensión docker-lab (docker-mcp, opcional) ──> laboratorios de Docker, solo eso
     ├─ caja de herramientas de drafts/ (descargar, comprimir, PDF…)
     ├─ caja de herramientas de materials/ (comprobar, exportar, exámenes en papel, registro)
     ├─ ganchos: aprobación antes de publicar, revisión del GIFT antes de importarlo
     └─ ayudantes: researcher, pedagogy-reviewer
```

## Session kinds {#tipos-de-sesión}

Each command opens a different kind of session:

- **`chat`**: a full-screen conversation that can be resumed. It always starts in guided mode.
- **`run`**: a one-off job, with no conversation. It goes through the whole course or does the `--task` job.
- **`ingest`**: adds your documents to the knowledge base. No Moodle: files only.
- **`explore`**: a short visit (80 turns at most) to note which kinds of activity and question your Moodle supports and how grades can work. It uses only moodle-teacher's read tools; it creates and changes nothing.

You have it in detail in [Sessions and modes](sesiones-y-modos.md).

## Supervision modes {#modos-de-supervisión}

- **`guided`**: works on its own and asks for approval before publishing anything students will see. A hook in the program enforces it, not just the instructions.
- **`interactive`**: asks for confirmation before every tool it uses.
- **`autonomous`**: asks nothing. It has no tool to ask for approval.
- **`plan`**: chat only. It reads and prepares a plan without changing anything, and presents it to you so you decide whether it runs it.

`chat` and `explore` always start in guided (in the chat, `Shift+Tab` cycles through guided, interactive and plan, and `/plan` enters and leaves plan mode). `run` asks for the mode or takes it from `--mode`. `ingest` publishes nothing and asks nothing.

## The helpers {#los-ayudantes}

In `chat` and `run`, the main assistant can delegate to two helpers (subagents), each with its own tools:

- **`researcher`**: searches and reads the public web and returns what it found with sources and dates. Tools: web search, web reading and file reading.
- **`pedagogy-reviewer`**: an instructional design expert who reviews a plan or an activity. It can only read files.
Neither can publish to Moodle or has a terminal. There's no terminal anywhere in miyagi: agent-kit denies `Bash` to the main assistant and only lets it delegate to those kinds of helper. Practicals run in the docker-lab extension's labs (see [Practicals in Docker](practicas-docker.md)).

## The course folder {#la-carpeta-del-curso}

```text
mi-curso/
  config.json        la conexión con Moodle y las opciones del agente (el asistente no puede leerlo)
  .env               optional: a Claude API key of this course's own (the assistant can't read it)
  .gitignore         creado por init: deja fuera config.json, .env y sessions/
  instructions.md    opcional: tus instrucciones, añadidas al final de las suyas
  .claude/skills/    opcional: tus habilidades propias
  .claude/commands/  opcional: tus atajos propios
  sources/           tus documentos originales (solo lectura para el asistente)
  knowledge/         su base de conocimiento del curso
  materials/         tus preguntas y cuestionarios, escritos una vez
  drafts/            lo que construye para Moodle, editable
  sessions/          una carpeta por sesión: registro, transcripción y conversación
```

## Read on {#sigue-leyendo}

- [Your own skills](habilidades-propias.md) and [Shortcuts and instructions](atajos-e-instrucciones.md): adapting it to your subject.
- [The knowledge base](base-de-conocimiento.md): what it keeps and how.
- [Configuration](configuracion.md): every key in `config.json` and the global configuration.
- [Approvals and drafts](aprobaciones-y-borradores.md): how what reaches students is controlled.
- [Practicals in Docker](practicas-docker.md), [Sessions and modes](sesiones-y-modos.md) and [Security and privacy](seguridad-y-privacidad.md).
