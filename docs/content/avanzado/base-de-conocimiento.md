---
title: La base de conocimiento
sidebar_position: 4
description: "sources, knowledge y drafts; qué hace miyagi ingest paso a paso, qué formatos lee, cómo se organizan sus páginas y qué no guarda nunca."
---

# La base de conocimiento

miyagi recuerda tu curso entre sesiones porque mantiene una **base de conocimiento**: una pequeña wiki de páginas Markdown enlazadas, en la carpeta `knowledge` del curso, que escribe y mantiene él mismo. Una sesión futura solo sabe lo que está escrito ahí. La parte genérica (capas, índice, diario, plantillas) viene de agent-kit; la parte de curso (temas, actividades, programación, progreso) la añade miyagi en [`prompts/system/course-knowledge.md`](https://github.com/falkenslab/miyagi/blob/main/prompts/system/course-knowledge.md).

## Tres carpetas, tres papeles

- **`sources/`: los originales.** Tu material (programación, apuntes, rúbricas, soluciones, criterios) y los documentos del curso que el asistente descarga de Moodle con su herramienta `save_to_sources`, que nunca sobrescribe. Para el asistente es de **solo lectura**: no puede cambiar ni borrar nada ahí.
- **`knowledge/`: sus páginas.** Lo que ha aprendido de tus documentos y de su trabajo. Es lo único, junto con `drafts/` (y `practice/` con el probador de prácticas), donde puede escribir.
- **`drafts/`: lo que construye para Moodle.** El código fuente editable de cada recurso (el HTML de una actividad, el archivo GIFT de un cuestionario, el texto de una página, sus imágenes), una carpeta por recurso. No son apuntes, así que no van en `knowledge/`; la página de la actividad o del tema enlaza a ellos. Ver [Aprobaciones y borradores](aprobaciones-y-borradores.md).

## Qué hace `miyagi ingest`

```bash
miyagi ingest                                  # todo lo de sources/ que aún no tiene resumen
miyagi ingest sources/rubrica-tarea-2.pdf      # solo esos archivos
```

Es una sesión sin navegador y sin Moodle: solo trabaja con archivos, y como no publica nada, no pide aprobaciones. Sus instrucciones ([`teacher-ingest.md`](https://github.com/falkenslab/miyagi/blob/main/prompts/system/teacher-ingest.md)) le marcan estos pasos, en orden:

1. Carga las habilidades `knowledge-ingest` y `knowledge-pages` antes de escribir ninguna página.
2. Lee `knowledge/index.md` y `overview.md`. Si la base aún no existe, crea primero `index.md`, `overview.md` y `log.md`.
3. Incorpora cada documento siguiendo `knowledge-ingest`: lo lee entero (no solo la primera página), escribe su página de resumen en `summaries/`, crea o actualiza las páginas de los conceptos que trata, y lo enlaza desde la página del tema al que pertenece (y, si es una rúbrica o unos criterios de corrección, desde la de la actividad).
4. Carga `knowledge-lint` y revisa lo que ha tocado (enlaces rotos, índice, páginas huérfanas, enlaces de ida sin vuelta), arreglando lo que encuentra.
5. Termina con un resumen: documentos incorporados, páginas creadas y actualizadas (contadas en `log.md`) y lo que no pudo leer.

Un documento ya incorporado y sin cambios no se vuelve a procesar; si cambió, actualiza su página en lugar de crear otra. Desde el chat, `/knowledge:ingest` hace lo mismo.

### Formatos que lee

- **Sí**: Markdown y texto, PDF, DOCX, e imágenes (fotos de apuntes a mano, de diapositivas), que interpreta directamente.
- **No**: OpenDocument (`.odt`): lo dirá en el resumen final en lugar de inventarse su contenido; expórtalo a PDF o DOCX. Tampoco transcribe vídeos: los anota como recursos pendientes de revisar.
- **Enlaces**: un archivo de `sources/` que liste direcciones web (por ejemplo, un `enlaces.md`) es una fuente más. En `chat` y `run` puede visitar esas direcciones concretas con el navegador; en `ingest`, que no tiene navegador, puede leer las páginas públicas marcándolas como fuente externa al curso.

## Cómo se organiza

```text
knowledge/
  index.md                el catálogo: una línea por página; lo lee siempre primero
  log.md                  el diario de cambios, solo se añade al final
  overview.md             la visión general del curso, que reescribe según la entiende mejor
  summaries/              una página por documento incorporado (de sources, de Moodle o de la web)
  concepts/               una página por idea
  entities/               una página por cosa concreta (un sistema, una herramienta, un documento)
  syntheses/              respuestas que merece la pena guardar: comparaciones, análisis, informes
  orientation.md          evaluación, plazos, canales y lo que su cuenta puede hacer (course-orientation)
  course-map.md           las direcciones de Moodle de lo que ha visitado
  moodle-capabilities.md  tipos de actividad y de pregunta que admite este Moodle (explore)
  progress.md             historial de revisiones del progreso de la clase (progress-monitoring)
  course-audit.md         historial de auditorías del curso (course-auditor)
  teaching-plan.md        la programación didáctica: objetivos O1…, criterios CE…, temas, metodología, calificación
  topics/<tema>.md        una página por tema o sección: objetivos, plan, contenido creado, dudas del foro
  activities/<act>.md     una página por actividad evaluable: criterios aplicados, rúbrica, preguntas
  drafts.md               lo subido oculto a Moodle que los alumnos aún no ven
```

Algunas reglas que sigue:

- Los enlaces son enlaces Markdown relativos y van en las dos direcciones: si A enlaza a B, B enlaza a A.
- Nunca renombra, mueve ni borra una página: si queda superada, lo dice al principio y enlaza a la nueva.
- Las contradicciones no se sobrescriben: anota las dos versiones, cada una con su fuente.
- `progress.md`, `course-audit.md` y `syntheses/course-alignment.md` son historiales: añade una entrada con fecha cada vez y nunca reescribe las anteriores.
- `drafts.md` no es un historial: solo lista lo que sigue oculto, y quita cada elemento cuando se muestra o lo descartas.
- Cada página de tema y de actividad enlaza a las fuentes en las que se basa.
- El contenido de las páginas va en el idioma en que hablas con él; los nombres de archivo, en minúsculas y con guiones.

## Consultarla y revisarla

- **`/knowledge:query <pregunta>`**: responde a partir de la base, empezando por el índice y enlazando cada página que usa. Dice qué sale de la base, qué de un original y qué de fuera. Si la respuesta es un análisis que se volverá a pedir, la guarda en `syntheses/`.
- **`/knowledge:lint`**: revisa la base entera: enlaces rotos, páginas fuera del índice, huérfanas, enlaces de un solo sentido, conceptos duplicados, contradicciones, afirmaciones sin fuente y documentos de `sources/` sin resumen. Arregla lo mecánico y te cuenta lo que necesita tu decisión.

## Leerla y editarla tú

Son archivos Markdown normales. Puedes abrirlos con cualquier editor o abrir la carpeta `knowledge` como bóveda de [Obsidian](https://obsidian.md) para ver el grafo de enlaces. Si corriges una página, la próxima sesión parte de tu versión.

## Tus criterios mandan

Para corregir, tus criterios de `sources/` (una rúbrica, un solucionario, tu política sobre entregas tardías o no presentadas) mandan sobre el criterio del asistente, y anota cuál aplicó en la página de la actividad.

## Lo que nunca guarda

**No hay páginas sobre alumnos concretos.** Las notas de progreso y del foro hablan de la clase y de patrones (cuántos se quedan atrás y por qué), nunca de un estudiante con nombre. Es una decisión de diseño ([ADR-005](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-005-no-individual-students-in-knowledge.md)): la base persiste entre sesiones, se reutiliza en las instrucciones y puede compartirse. Cuando una entrega se descarga para ejecutarla, va a `sources/<actividad>/<id-del-alumno>/`, con un identificador y nunca con el nombre del alumno en la ruta.

## Si venías de moodle-agent

Un aula de moodle-agent se abre tal cual. La primera vez, miyagi mueve la antigua carpeta `context/` a `sources/`, y una `knowledge/` con el formato viejo (con `README.md` y sin `index.md`) a `knowledge-legacy/`, con sus archivos descargados también en `sources/`. Después, el asistente reconstruye la base de conocimiento a partir de ahí.
