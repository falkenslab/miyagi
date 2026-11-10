---
title: Casos de uso en la terminal
sidebar_label: En la terminal
sidebar_position: 13
description: Las mismas tareas del aula de SQL hechas desde la terminal, con miyagi init, ingest, chat, run y las extensiones.
---

# Casos de uso en la terminal

Las tareas del [tutorial de SQL](/casos-de-uso/) también se pueden hacer desde la [terminal](/guia/terminal/). Estas capturas son de la misma asignatura.

## Preparar la asignatura

<Terminal>{`$ miyagi init`}</Terminal>

<Shot width="1400" height="612" kind="terminal" src="/img/v2/terminal-init.webp" alt="La terminal con miyagi init sobre una asignatura de demostración: nombre, descripción, tono, idioma y sin aula.">`miyagi init` en una asignatura de demostración.</Shot>

## Darle tu material

Copia tus documentos en `sources` y:

<Terminal>{`$ miyagi ingest -w introduccion-a-sql`}</Terminal>

<Shot width="1400" height="1066" kind="terminal" src="/img/v2/terminal-ingest-trabajando.webp" alt="miyagi ingest leyendo las fuentes de una asignatura de demostración y creando páginas.">`ingest` trabajando, en una asignatura de demostración.</Shot>

<Shot width="1400" height="873" kind="terminal" src="/img/v2/terminal-ingest-resumen.webp" alt="El resumen de miyagi ingest, con las lagunas que encuentra y las fuentes web que propone.">Y su resumen.</Shot>

## Mirar qué admite el Moodle

<Terminal>{`$ miyagi explore -w introduccion-a-sql`}</Terminal>

<Shot width="1400" height="883" kind="terminal" src="/img/v2/terminal-explore.webp" alt="El final de miyagi explore: lo que ha visto en el curso y la página guardada en la memoria.">Lo que ha visto en el curso, en `course/moodle-capabilities`.</Shot>

## Corregir

<Terminal>{`$ miyagi chat -w introduccion-a-sql`}</Terminal>

<Prompt>{`¿Qué entregas de la Práctica final tengo sin corregir?`}</Prompt>

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-chat.webp" alt="El chat de la terminal respondiendo con una tabla de alias, si entregaron y si quedan por calificar.">El estado de las entregas, solo leyendo. Los alumnos también aparecen como alias aquí, y si la entrega es un archivo te pide permiso para guardarla [igual que en la aplicación](/casos-de-uso/corregir/#archivos).</Shot>

Antes de publicar te pide permiso igual que en las otras versiones:

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-aprobacion.webp" alt="El panel de aprobación en la terminal para renombrar una sección, con las opciones Sí, No y Parar.">Sí, No o Parar, con el teclado.</Shot>

## Encargos de una sola orden

Para algo concreto, sin conversar:

<Terminal>{`$ miyagi run --task "Dime cuántas entregas sin corregir tiene la Práctica final, sin cambiar nada"`}</Terminal>

<Shot width="1400" height="883" kind="terminal" src="/img/v2/terminal-run.webp" alt="La terminal con miyagi run --task de solo lectura y la respuesta.">Un encargo de solo lectura.</Shot>

## Tu propia habilidad, y las extensiones

`miyagi skills` lista las habilidades, incluidas las tuyas:

<Shot width="1400" height="1456" kind="terminal" src="/img/v2/terminal-skills.webp" alt="miyagi skills con la habilidad estilo-sql marcada como propia al final.">La habilidad `estilo-sql`, al final de la lista.</Shot>

Y `miyagi extension list` las extensiones:

<Shot width="1400" height="346" kind="terminal" src="/img/v2/terminal-extensiones.webp" alt="miyagi extension list con docker-lab y moodle-teacher activadas.">Las extensiones de la asignatura.</Shot>

Los atajos están con `miyagi commands`, y las órdenes en la [Referencia](/guia/referencia/).

<Shot width="1400" height="1110" kind="terminal" src="/img/v2/terminal-comandos.webp" alt="miyagi commands con la lista de atajos de la conversación.">`miyagi commands`.</Shot>
