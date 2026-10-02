---
title: Cómo funciona por dentro
sidebar_position: 1
description: "La arquitectura de miyagi: agent-kit, el Claude Agent SDK, Playwright con el Chrome del sistema, los tipos de sesión, los modos, los ayudantes y la carpeta del curso."
---

# Cómo funciona por dentro

Esta sección es para quien quiere entender o adaptar miyagi: profesores curiosos, personal de informática del centro o quien quiera personalizarlo para su asignatura. Todo lo que se cuenta aquí sale del código y de las instrucciones del propio asistente, que puedes leer en [GitHub](https://github.com/falkenslab/miyagi).

## Las piezas

- **El modelo.** miyagi es un agente sobre el [Claude Agent SDK](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk): el razonamiento lo hace Claude, con tu suscripción.
- **agent-kit.** La base común ([`@falkenslab/agent-kit`](https://www.npmjs.com/package/@falkenslab/agent-kit)) aporta lo que todo agente necesita: los modos de supervisión, las aprobaciones, el inicio de sesión manual, la base de conocimiento, el límite de carpetas en las que puede escribir, el chat de la terminal y el registro de cada sesión.
- **Playwright MCP y Chrome.** Para trabajar en Moodle, miyagi arranca el servidor [Playwright MCP](https://github.com/microsoft/playwright-mcp), que maneja el Google Chrome instalado en tu ordenador: abre páginas, lee su estructura, pulsa botones y rellena formularios, como lo harías tú.
- **El dominio de Moodle.** Lo que miyagi sabe del oficio de profesor está en archivos de texto: las instrucciones de sistema en [`prompts/`](https://github.com/falkenslab/miyagi/tree/main/prompts) y las habilidades y atajos en [`plugin/`](https://github.com/falkenslab/miyagi/tree/main/plugin).

```text
miyagi (CLI)
 ├─ carpeta del curso: config.json, instructions.md, .claude/
 └─ sesión (agent-kit + Claude Agent SDK)
     ├─ instrucciones de sistema (prompts/system/*.md + instructions.md)
     ├─ habilidades y atajos (plugin/, el plugin de conocimiento de agent-kit, .claude/ del curso)
     ├─ herramientas de archivos, limitadas a knowledge/, drafts/ y practice/ (sources/ solo lectura)
     ├─ Playwright MCP ──> Chrome ──> tu Moodle
     ├─ caja de herramientas de drafts/ (descargar, comprimir, PDF…)
     ├─ ganchos: aprobación antes de publicar, validación de subidas
     └─ ayudantes: researcher, pedagogy-reviewer, practice-runner (opcional) ──> Docker
```

## Tipos de sesión

Cada orden abre un tipo de sesión distinto:

- **`chat`**: una conversación a pantalla completa, que se puede retomar. Siempre empieza en modo guided.
- **`run`**: un encargo de una sola vez, sin conversación. Recorre el curso entero o hace la tarea de `--task`.
- **`ingest`**: incorpora tus documentos a la base de conocimiento. Sin navegador y sin Moodle: solo archivos.
- **`explore`**: una visita corta (como mucho 60 turnos) para apuntar qué tipos de actividad y de pregunta admite tu Moodle y cómo se calculan las notas. Solo mira y cancela; no crea nada.

Lo tienes en detalle en [Sesiones y modos](sesiones-y-modos.md).

## Modos de supervisión

- **`guided`**: trabaja solo y pide aprobación antes de publicar algo que verán los alumnos. Un gancho del programa lo hace cumplir, no solo las instrucciones.
- **`interactive`**: pide confirmación antes de cada herramienta que usa.
- **`autonomous`**: no pregunta nada. No tiene herramienta para pedir aprobación ni para pedir que alguien inicie sesión a mano.

`chat` y `explore` van siempre en guided (en el chat, `Shift+Tab` alterna con interactive). `run` pregunta el modo o lo toma de `--mode`. `ingest` no publica nada y no pregunta.

## Los ayudantes

En `chat` y `run`, el asistente principal puede delegar en tres ayudantes (subagentes), cada uno con sus propias herramientas:

- **`researcher`**: busca y lee la web pública y devuelve lo encontrado con fuentes y fechas. Herramientas: búsqueda web, lectura web y lectura de archivos.
- **`pedagogy-reviewer`**: experto en diseño didáctico que revisa un plan o una actividad. Solo puede leer archivos.
- **`practice-runner`**: ejecuta prácticas en contenedores Docker. Desactivado por defecto; es lo único que tiene una terminal. Ver [Prácticas en Docker](practicas-docker.md).

Ninguno puede publicar en Moodle. El asistente principal no tiene terminal: agent-kit le deniega `Bash` y solo le deja delegar en esos tipos de ayudante.

## La carpeta del curso

```text
mi-curso/
  config.json        la conexión con Moodle y las opciones del agente (el asistente no puede leerlo)
  .env               opcional: un token de Claude propio de este curso (el asistente no puede leerlo)
  .gitignore         creado por init: deja fuera config.json, .env, sessions/ y practice/
  instructions.md    opcional: tus instrucciones, añadidas al final de las suyas
  .claude/skills/    opcional: tus habilidades propias
  .claude/commands/  opcional: tus atajos propios
  sources/           tus documentos originales (solo lectura para el asistente)
  knowledge/         su base de conocimiento del curso
  drafts/            lo que construye para Moodle, editable
  practice/          solo con el probador de prácticas: una carpeta por práctica
  sessions/          una carpeta por sesión: registro, transcripción, conversación, perfil del navegador
```

## Sigue leyendo

- [Habilidades propias](habilidades-propias.md) y [Atajos e instrucciones](atajos-e-instrucciones.md): adaptarlo a tu asignatura.
- [La base de conocimiento](base-de-conocimiento.md): qué guarda y cómo.
- [Configuración](configuracion.md): todas las claves de `config.json` y la configuración global.
- [Aprobaciones y borradores](aprobaciones-y-borradores.md): cómo se controla lo que llega a los alumnos.
- [Prácticas en Docker](practicas-docker.md), [Sesiones y modos](sesiones-y-modos.md) y [Seguridad y privacidad](seguridad-y-privacidad.md).
