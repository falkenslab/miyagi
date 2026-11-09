---
title: La terminal
sidebar_position: 6
description: "miyagi en la terminal: init, chat, run, ingest, explore y extensiones, para quien prefiere el teclado o quiere encargos de una sola orden."
---

# La terminal

La terminal es la versión de miyagi para quien prefiere el teclado o quiere encargos de una sola orden. Hace lo mismo que la [aplicación de escritorio](escritorio.md), con los mismos permisos antes de publicar y las mismas asignaturas. Necesitas [instalarlo con la terminal](instalar.md#instalarlo).

<Shot width="1400" height="1456" kind="terminal" src="/img/v2/terminal-ayuda.webp" alt="La salida de miyagi --help: las órdenes y sus opciones.">Las órdenes de miyagi, con `miyagi --help`.</Shot>

## Crear una asignatura: `miyagi init` {#init}

<Terminal>{`$ miyagi init`}</Terminal>

Te pregunta el nombre, la descripción, el tono, el idioma, si quieres crear `instructions.md` y si conectas un aula de Moodle ahora.

<Shot width="1400" height="612" kind="terminal" src="/img/v2/terminal-init.webp" alt="La terminal con miyagi init sobre una asignatura de demostración: nombre, descripción, tono, idioma, y la opción de no conectar el aula.">`miyagi init`, sin conectar aula.</Shot>

La asignatura se guarda en `~/.miyagi/workspaces/<nombre>/` y la abres desde cualquier sitio con su nombre, por ejemplo `miyagi chat -w bases-de-datos`. Con `miyagi workspaces` ves cuáles tienes. Los detalles están en [Primeros pasos](primeros-pasos.md).

## Conversar: `miyagi chat` {#chat}

<Terminal>{`$ miyagi chat -w bases-de-datos`}</Terminal>

El chat ocupa toda la ventana de la terminal. Te saluda con lo que ya sabe del curso, y le pides las cosas con tus palabras.

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-chat.webp" alt="miyagi chat con una respuesta de solo lectura sobre las entregas de la Práctica final, con una tabla de alias y su estado.">Una respuesta real en el chat de la terminal.</Shot>

Antes de publicar, te pide permiso con un panel: **Sí** (Intro, `1` o `y`), **No** (`2` o `n`) o **Parar** (`3`).

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-aprobacion.webp" alt="El chat de la terminal con el panel de aprobación para renombrar una sección y las opciones Sí, No y Parar.">La aprobación en la terminal.</Shot>

Los atajos se escriben con `/`, y `miyagi commands` los lista:

<Shot width="1400" height="1110" kind="terminal" src="/img/v2/terminal-comandos.webp" alt="La salida de miyagi commands: la lista de atajos del chat.">Los atajos del chat.</Shot>

Todas las teclas y los modos están en [El chat](chat.md).

## Encargos de una sola orden: `miyagi run` {#run}

Si ya sabes lo que quieres, encárgaselo de una vez:

<Terminal>{`$ miyagi run --task "¿Qué entregas tengo sin corregir?"`}</Terminal>

<Shot width="1400" height="883" kind="terminal" src="/img/v2/terminal-run.webp" alt="La terminal con miyagi run --task de solo lectura y su respuesta.">Un encargo de solo lectura con `miyagi run --task`.</Shot>

Lo tienes explicado en [Encargos de una sola orden](run.md).

## Dale tu material: `miyagi ingest` {#ingest}

Copia tus documentos en la carpeta `sources` de la asignatura y:

<Terminal>{`$ miyagi ingest -w bases-de-datos`}</Terminal>

No abre Moodle: lee cada documento y lo convierte en páginas de su memoria del curso, enlazadas entre sí.

<Shot width="1400" height="1066" kind="terminal" src="/img/v2/terminal-ingest-trabajando.webp" alt="miyagi ingest trabajando sobre una asignatura de demostración: lee las fuentes y va creando páginas.">`miyagi ingest` trabajando.</Shot>

<Shot width="1400" height="873" kind="terminal" src="/img/v2/terminal-ingest-resumen.webp" alt="El resumen de miyagi ingest: las lagunas que encuentra y las fuentes web que propone.">Y su resumen, con las lagunas que encontró.</Shot>

## Mirar el Moodle: `miyagi explore` {#explore}

Con el aula conectada, `miyagi explore` mira sin cambiar nada qué tipos de actividad y de pregunta ve en tu curso y cómo se calculan las notas, y lo apunta en `course/moodle-capabilities`.

<Terminal>{`$ miyagi explore -w bases-de-datos`}</Terminal>

<Shot width="1400" height="883" kind="terminal" src="/img/v2/terminal-explore.webp" alt="El final de miyagi explore: resumen de lo que ha visto y la página guardada en course/moodle-capabilities.">El final de `miyagi explore`.</Shot>

## Extensiones: `miyagi extension` {#extensiones}

<Terminal>{`$ miyagi extension list
$ miyagi extension add docker-lab`}</Terminal>

<Shot width="1400" height="346" kind="terminal" src="/img/v2/terminal-extensiones.webp" alt="La salida de miyagi extension list: docker-lab y moodle-teacher activadas.">`miyagi extension list`.</Shot>

Todas las órdenes están en [Extensiones](/avanzado/extensiones/). Dentro del chat, `/extensions` muestra con cuáles trabaja la sesión.

## Sus habilidades: `miyagi skills` {#skills}

<Terminal>{`$ miyagi skills`}</Terminal>

<Shot width="1400" height="1456" kind="terminal" src="/img/v2/terminal-skills.webp" alt="La salida de miyagi skills con la lista de habilidades y, al final, estilo-sql marcada como propia.">`miyagi skills`, con una habilidad propia al final.</Shot>

Puedes verlo en tareas reales en [Casos de uso en la terminal](/casos-de-uso/en-terminal/). Todas las órdenes y opciones están en la [Referencia](referencia.md).
