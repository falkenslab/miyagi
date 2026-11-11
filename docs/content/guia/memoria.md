---
title: La memoria del curso
sidebar_position: 11
description: "Qué recuerda miyagi de tu curso y de ti, dónde lo guarda, cómo corregirlo y qué no guarda nunca."
---

# La memoria del curso

Cada conversación nueva empieza de cero, pero **no en lo que sabe del curso**: el asistente toma apuntes en la carpeta `knowledge` del curso, los lee al empezar y los va ampliando mientras trabaja. Por eso, cuanto más lo usas, mejor conoce tu curso.

En la [aplicación de escritorio](escritorio.md#vistas) y en la versión web los tienes en la vista **Memoria**, con sus pestañas **Base de conocimiento** (sus apuntes) y **Fuentes** (tus documentos).

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-base-conocimiento.webp" alt="La vista Base de conocimiento: la lista de páginas por secciones y el mapa del curso abierto.">Sus apuntes, en la aplicación.</Shot>

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
| Las actividades en marcha: en plan, construyéndose, ocultas para probarlas o recién publicadas | `drafts.md` |
| Un resumen de cada documento que le diste | `summaries/` |
| Una visión general del curso | `overview.md` |
| Todo enlazado, con un índice y un diario de cambios | `index.md` y `log.md` |

## Cómo se nota en la práctica

Un ejemplo. Un lunes le dices:

<Prompt>{`Corrige la Tarea 2. Las entregas tarde, un 20 % menos, y valora mucho que comenten el código.`}</Prompt>

Corrige y apunta en la página de esa tarea los criterios que aplicó. Días después, en otra conversación, llegan entregas tardías:

<Prompt>{`Corrige las entregas nuevas de la Tarea 2.`}</Prompt>

Antes de empezar, lee en sus apuntes qué criterios aplicó la primera vez, para no ser más duro ni más blando con unos que con otros.

Lo mismo con la clase: como guarda cada revisión del progreso con su fecha, cuando le preguntas *«¿cómo va la clase comparado con la última vez?»* puede decirte qué ha mejorado y qué no.

## Las tres carpetas

- **`sources`: tus documentos.** La programación, las rúbricas, las soluciones, tus apuntes. Él solo los lee; nunca los cambia.
- **`knowledge`: sus apuntes.** Lo que ha aprendido del curso y de tus documentos.
- **`drafts`: lo que prepara para Moodle.** El texto de una página, un cuestionario, una actividad web, antes de subirlos.

## Puedes leerlos y corregirlos

En la aplicación y en la web puedes leerlos en **Base de conocimiento**, con su buscador y los enlaces entre ellas. Son archivos de texto normales, en formato Markdown: ábrelos también con cualquier editor, o con [Obsidian](https://obsidian.md) para ver cómo se enlazan unos con otros.

Si recuerda algo mal, tienes dos opciones:

- Díselo en la conversación: *«El criterio de entregas tarde ha cambiado: ahora es un 10 % menos.»* Él actualiza la página.
- O edita tú la página en `knowledge` y guárdala.

Para consultarlos sin abrir Moodle, usa `/knowledge:query` con tu pregunta. Para que revise que están completos y bien enlazados, `/knowledge:lint`.

## Lo que no guarda

- **No guarda fichas de estudiantes concretos.** En sus apuntes del progreso y del foro solo hay tendencias de la clase (cuántos se están quedando atrás y por qué), nunca un registro con nombres. Además, tus alumnos le llegan con un alias («A-7KQ2XM»), no con su nombre.
- **No guarda tu contraseña.** Ni siquiera la conoce: inicias sesión tú en la ventana que abre la extensión moodle-teacher, y es ella la que guarda la sesión.

## Cada curso, su memoria

Cada curso tiene sus propios apuntes, en su carpeta. Lo que aprende de un curso no pasa a otro.

## Lo que recuerda de ti, en todos tus cursos

Aparte de los apuntes de cada curso, miyagi recuerda **cómo quieres trabajar tú**, en todas tus asignaturas: cómo quieres que te llame, el tono, cómo escribir la retroalimentación al alumnado, tus formatos y tus herramientas. Basta con decírselo una vez («llámame Paco», «la retroalimentación, breve y empezando por lo que está bien») y en otra asignatura lo sigue desde el primer mensaje.

- Solo guarda lo que **tú le escribes**, con tus palabras; nunca lo que sale de un documento o de una página.
- Lo que es de un curso (su programación, un criterio de corrección, lo que vale en un examen) va a los apuntes de ese curso, no aquí.
- **Nunca guarda a un alumno**, aunque le hables de él: ni su nombre ni sus necesidades ni sus notas.
- Escribe `/memory:list` en el chat para ver lo que recuerda y `/memory:forget` con el nombre de una entrada para que la olvide. Está en tu ordenador, en `~/.miyagi/memory/`, un fichero por entrada.

¿Quieres saber cómo se construye por dentro, qué hace la ingesta (`miyagi ingest` en la terminal) paso a paso o qué formatos admite? Está en [La base de conocimiento](../avanzado/base-de-conocimiento.md).
