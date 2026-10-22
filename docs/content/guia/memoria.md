---
title: La memoria del curso
sidebar_position: 7
description: "Qué recuerda miyagi de tu curso, dónde lo guarda, cómo corregirlo y qué no guarda nunca."
---

# La memoria del curso

Cada conversación nueva empieza de cero en el chat, pero **no en lo que sabe del curso**: el asistente toma apuntes en la carpeta `knowledge` del curso, los lee al empezar y los va ampliando mientras trabaja. Por eso, cuanto más lo usas, mejor conoce tu curso.

## Qué recuerda

| Recuerda | Dónde |
| --- | --- |
| Cómo se evalúa, los plazos y los canales del curso | `orientation.md` |
| Dónde está cada sección y actividad del curso: su número y su enlace | `course-map.md` |
| Qué tipos de actividad y de pregunta ha visto en tu curso, y cómo se calculan las notas | `moodle-capabilities.md` |
| Tu programación didáctica | `teaching-plan.md` |
| Cada tema: objetivos, lo que creó, las dudas que se repiten en el foro | `topics/` (una página por tema) |
| Cada actividad evaluable: criterios que aplicó, rúbrica, preguntas importadas | `activities/` (una página por actividad) |
| La evolución de la clase, revisión a revisión | `progress.md` |
| Las auditorías del curso, con su fecha | `course-audit.md` |
| Las actividades en marcha: en plan, construyéndose, ocultas para probarlas o recién servidas | `drafts.md` |
| Un resumen de cada documento que le diste | `summaries/` |
| Una visión general del curso | `overview.md` |
| Todo enlazado, con un índice y un diario de cambios | `index.md` y `log.md` |

## Cómo se nota en la práctica

Un ejemplo. Un lunes le dices:

> Corrige la Tarea 2. Las entregas tarde, un 20 % menos, y valora mucho que comenten el código.

Corrige y apunta en la página de esa tarea los criterios que aplicó. Días después, en otra conversación, llegan entregas tardías:

> Corrige las entregas nuevas de la Tarea 2.

Antes de empezar, lee en sus apuntes qué criterios aplicó la primera vez, para no ser más duro ni más blando con unos que con otros.

Lo mismo con la clase: como guarda cada revisión del progreso con su fecha, cuando le preguntas *«¿cómo va la clase comparado con la última vez?»* puede decirte qué ha mejorado y qué no.

## Las tres carpetas

- **`sources`: tus documentos.** La programación, las rúbricas, las soluciones, tus apuntes. Él solo los lee; nunca los cambia.
- **`knowledge`: sus apuntes.** Lo que ha aprendido del curso y de tus documentos.
- **`drafts`: lo que prepara para Moodle.** El texto de una página, un cuestionario, una actividad web, antes de subirlos.

## Puedes leerlos y corregirlos

Son archivos de texto normales, en formato Markdown. Ábrelos con cualquier editor, o con [Obsidian](https://obsidian.md) para ver cómo se enlazan unos con otros.

Si recuerda algo mal, tienes dos opciones:

- Díselo en el chat: *«El criterio de entregas tarde ha cambiado: ahora es un 10 % menos.»* Él actualiza la página.
- O edita tú la página en `knowledge` y guárdala.

Para consultarlos desde el chat sin abrir Moodle, usa `/knowledge:query` con tu pregunta. Para que revise que están completos y bien enlazados, `/knowledge:lint`.

## Lo que no guarda

- **No guarda fichas de estudiantes concretos.** En sus apuntes del progreso y del foro solo hay tendencias de la clase (cuántos se están quedando atrás y por qué), nunca un registro con nombres. Además, tus alumnos le llegan con un alias («Alumno 3»), no con su nombre.
- **No guarda tu contraseña.** Ni siquiera la conoce: inicias sesión tú en la ventana que abre la extensión moodle-teacher, y es ella la que guarda la sesión.

## Cada curso, su memoria

Cada curso tiene sus propios apuntes, en su carpeta. Lo que aprende de un curso no pasa a otro.

¿Quieres saber cómo se construye por dentro, qué hace `miyagi ingest` paso a paso o qué formatos admite? Está en [La base de conocimiento](../avanzado/base-de-conocimiento.md).
