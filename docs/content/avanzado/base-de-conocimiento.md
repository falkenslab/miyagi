---
title: La base de conocimiento
sidebar_position: 4
description: "sources, knowledge y drafts; qué hace miyagi ingest paso a paso, qué formatos lee, cómo se organizan sus páginas y qué no guarda nunca."
---

# La base de conocimiento

miyagi recuerda tu curso entre sesiones porque mantiene una **base de conocimiento**: una pequeña wiki de páginas Markdown enlazadas, en la carpeta `knowledge` del curso, que escribe y mantiene él mismo. No la toca con las herramientas de archivos, sino con las herramientas `knowledge_*` de agent-kit, que trabajan con páginas en lugar de archivos (el ADR-024 de agent-kit). Una sesión futura solo sabe lo que está escrito ahí. La parte genérica (capas, índice, diario, plantillas) viene de agent-kit; la parte de curso (temas, actividades, programación, progreso) la añade miyagi en [`prompts/system/course-knowledge.md`](https://github.com/falkenslab/miyagi/blob/main/prompts/system/course-knowledge.md).

## Tres carpetas, tres papeles

- **`sources/`: los originales.** Tu material (programación, apuntes, rúbricas, soluciones, criterios) y los documentos que el asistente añade con las herramientas de fuentes de agent-kit (ver [Las fuentes](#las-fuentes)). Para sus herramientas de archivos es de **solo lectura**: no puede cambiar ni borrar nada ahí.
- **`knowledge/`: sus páginas.** Lo que ha aprendido de tus documentos y de su trabajo. Solo llega a ella con las herramientas `knowledge_*`: las de archivos (`Read`, `Write`, `Edit`, `Grep`, `Glob`) no pueden leerla, escribirla ni buscar en ella.
- **`drafts/`: lo que construye para Moodle.** El código fuente editable de cada recurso (el HTML de una actividad, el archivo GIFT de un cuestionario, el texto de una página, sus imágenes), una carpeta por recurso. No son apuntes, así que no van en `knowledge/`; la página de la actividad o del tema enlaza a ellos. Ver [Aprobaciones y borradores](aprobaciones-y-borradores.md).

## Qué hace `miyagi ingest`

```bash
miyagi ingest                                  # todo lo de sources/ que aún no tiene resumen
miyagi ingest sources/rubrica-tarea-2.pdf      # solo esos archivos
```

Es una sesión sin navegador y sin Moodle: solo trabaja con archivos, y como no publica nada, no pide aprobaciones. Sus instrucciones ([`teacher-ingest.md`](https://github.com/falkenslab/miyagi/blob/main/prompts/system/teacher-ingest.md)) le marcan estos pasos, en orden:

1. Carga la habilidad `knowledge-ingest` antes de escribir ninguna página.
2. Mira el catálogo (`knowledge_index`), lee la visión general (`knowledge_read` de `overview`) y pregunta a `list_sources` qué documentos son nuevos o han cambiado desde que los incorporó.
3. Incorpora cada documento siguiendo `knowledge-ingest`: lo lee entero (no solo la primera página), crea su página de resumen (`summary/<slug>`) y las de los conceptos que trata con `knowledge_create`, que sin contenido le da la plantilla de cada tipo, o actualiza las que ya existen con `knowledge_edit`; lo enlaza desde la página del tema al que pertenece (y, si es una rúbrica o unos criterios de corrección, desde la de la actividad) y apunta cada operación en el diario con `knowledge_log`.
4. Carga `knowledge-lint` y revisa lo que ha tocado, empezando por `knowledge_check`, arreglando lo que encuentra.
5. Termina con un resumen: documentos incorporados, páginas creadas y actualizadas (contadas a partir de las que apuntó con `knowledge_log`, no estimadas) y lo que no pudo leer.

Un documento ya incorporado y sin cambios no se vuelve a procesar; si cambió, actualiza su página en lugar de crear otra. Desde el chat, `/knowledge:ingest` hace lo mismo.

### Formatos que lee

- **Sí, con `Read`**: Markdown y texto, PDF e imágenes (fotos de apuntes a mano, de diapositivas), que interpreta directamente.
- **Sí, con `extract_text`**: Word (`.docx`), PowerPoint (`.pptx`, diapositiva a diapositiva y con las notas del orador) y Excel (`.xlsx`), que convierte a Markdown.
- **No**: OpenDocument (`.odt`): lo dirá en el resumen final en lugar de inventarse su contenido; expórtalo a PDF o DOCX. Tampoco transcribe vídeos: los anota como recursos pendientes de revisar.
- **Enlaces**: un archivo de `sources/` que liste direcciones web (por ejemplo, un `enlaces.md`) es una fuente más. En `chat` y `run` puede visitar esas direcciones concretas con el navegador; en `ingest`, que no tiene navegador, puede leer las páginas públicas marcándolas como fuente externa al curso.

## Cómo se organiza

Cada página tiene un identificador `tipo/slug`, y así la nombra el asistente y así se enlazan unas con otras. Los tipos `summary`, `concept`, `entity` y `synthesis` son de agent-kit; `course`, `topic` y `activity` los declara miyagi ([`src/knowledgeTypes.ts`](https://github.com/falkenslab/miyagi/blob/main/src/knowledgeTypes.ts)). En el disco, cada página es un archivo Markdown:

```text
knowledge/
  index.md                el catálogo, una línea por página; lo genera agent-kit tras cada cambio
  log.md                  el diario de operaciones (knowledge_log)
  overview.md             la visión general del curso (overview), que reescribe según la entiende mejor
  summaries/              summary/<slug>: una página por documento incorporado (de sources, de Moodle o de la web)
  concepts/               concept/<slug>: una página por idea
  entities/               entity/<slug>: una página por cosa concreta (un sistema, una herramienta, un documento)
  syntheses/              synthesis/<slug>: respuestas que merece la pena guardar (comparaciones, análisis, informes)
  orientation.md          course/orientation: evaluación, plazos, canales y lo que su cuenta puede hacer
  course-map.md           course/course-map: las direcciones de Moodle de lo que ha visitado
  moodle-capabilities.md  course/moodle-capabilities: tipos de actividad y de pregunta que admite este Moodle
  progress.md             course/progress: historial de revisiones del progreso de la clase
  course-audit.md         course/course-audit: historial de auditorías del curso
  teaching-plan.md        course/teaching-plan: la programación didáctica (objetivos O1…, criterios CE…, temas, metodología, calificación)
  drafts.md               course/drafts: lo subido oculto a Moodle que los alumnos aún no ven
  topics/<tema>.md        topic/<tema>: una página por tema o sección (objetivos, plan, contenido creado, dudas del foro)
  activities/<act>.md     activity/<act>: una página por actividad evaluable (criterios aplicados, rúbrica, preguntas)
```

En la raíz de `knowledge/` solo van esas siete páginas `course/`, con `type: course` en su cabecera. Una base escrita con una versión anterior de miyagi se abre tal cual: al empezar cada sesión, miyagi añade `type: course` a las que no lo tienen, sin tocar el resto.

## Sus herramientas

| Herramienta | Qué hace |
| --- | --- |
| `knowledge_index` | El catálogo: cada página en una línea, por secciones. |
| `knowledge_search` | Las páginas que contienen unas palabras, las mejores primero. |
| `knowledge_read` | Una página (o el `overview`), con las páginas que la enlazan. |
| `knowledge_create` | Crea una página; sin contenido, devuelve la plantilla de su tipo. |
| `knowledge_edit` | Cambia un fragmento de una página. |
| `knowledge_rewrite` | Reescribe una página entera (o el `overview`) sin cambiar su identificador. |
| `knowledge_supersede` | Marca una página como superada por otra, con un aviso al principio. |
| `knowledge_retire` | Retira del índice y de la búsqueda una página que estaba mal; antes te pide aprobación, y la página no se borra. |
| `knowledge_log` | Añade una entrada fechada al diario. |
| `knowledge_check` | Los problemas mecánicos de una vez: enlaces rotos, páginas huérfanas, enlaces a páginas retiradas, documentos de `sources/` nuevos, cambiados o desaparecidos. |

Los ayudantes `researcher` y `pedagogy-reviewer` solo tienen las tres de lectura: `knowledge_index`, `knowledge_search` y `knowledge_read`.

Algunas reglas que sigue:

- El índice y los enlaces de vuelta los mantiene agent-kit, no el asistente: `knowledge_read` dice qué páginas enlazan a cada una.
- Un enlace solo puede apuntar a una página que existe; si no, la herramienta lo rechaza y el asistente crea antes la página.
- Nunca renombra, mueve ni borra una página: si queda superada, la marca con `knowledge_supersede` y enlaza a la nueva; si estaba mal, la retira con `knowledge_retire`, después de preguntarte.
- Las contradicciones no se sobrescriben: anota las dos versiones, cada una con su fuente.
- `course/progress`, `course/course-audit` y `synthesis/course-alignment` son historiales: añade una entrada con fecha cada vez y nunca reescribe las anteriores. La fecha la toma del reloj del sistema (`current_time`), y los plazos los calcula con `date_math`, nunca de memoria.
- `course/drafts` no es un historial: solo lista lo que sigue oculto, y quita cada elemento cuando se muestra o lo descartas.
- Cada página de tema y de actividad enlaza a los resúmenes en los que se basa.
- El contenido de las páginas va en el idioma en que hablas con él; los identificadores, en minúsculas y con guiones.

## Las fuentes

`sources/` se gestiona con las herramientas de fuentes de agent-kit; las de archivos solo pueden leerla:

| Herramienta | Qué hace |
| --- | --- |
| `list_sources` | Lista los originales con su estado: nuevo, incorporado, cambiado desde que se incorporó o desaparecido. |
| `extract_text` | Lee un Word, un PowerPoint o un Excel como Markdown. |
| `save_to_sources` | Guarda en `sources/` un archivo descargado de Moodle durante la sesión. |
| `download_to_sources` | Descarga un original de una dirección web; una página web la guarda también como Markdown, para citarla al pie de la letra. |
| `request_file` | Te pide un archivo en un panel: escribes su ruta (o lo arrastras a la terminal) o pulsas Intro si no lo tienes. |
| `retire_source` | Aparta un original equivocado o sustituido por otro, después de preguntarte. No lo borra: lo mueve a `sources/.agent-kit/retired/` y marca su resumen. |

`request_file` y `retire_source` no existen en `autonomous`. Puedes dejar tus archivos en `sources/` a mano cuando quieras: `list_sources` los verá como nuevos.

## Consultarla y revisarla

- **`/knowledge:query <pregunta>`**: responde a partir de la base, empezando por `knowledge_search` o `knowledge_index` y enlazando cada página que usa. Dice qué sale de la base, qué de un original y qué de fuera. Si la respuesta es un análisis que se volverá a pedir, la guarda en `syntheses/`.
- **`/knowledge:lint`**: revisa la base entera: primero lo mecánico con `knowledge_check` (enlaces rotos, páginas huérfanas, documentos de `sources/` sin resumen o cambiados), y luego conceptos duplicados, páginas que faltan, contradicciones y afirmaciones sin fuente. Arregla lo mecánico y te cuenta lo que necesita tu decisión.

## Leerla y editarla tú

Son archivos Markdown normales. Puedes abrirlos con cualquier editor o abrir la carpeta `knowledge` como bóveda de [Obsidian](https://obsidian.md) para ver el grafo de enlaces. Si corriges una página, la próxima sesión parte de tu versión.

## Tus criterios mandan

Para corregir, tus criterios de `sources/` (una rúbrica, un solucionario, tu política sobre entregas tardías o no presentadas) mandan sobre el criterio del asistente, y anota cuál aplicó en la página de la actividad.

## Lo que nunca guarda

**No hay páginas sobre alumnos concretos.** Las notas de progreso y del foro hablan de la clase y de patrones (cuántos se quedan atrás y por qué), nunca de un estudiante con nombre. Es una decisión de diseño ([ADR-005](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-005-no-individual-students-in-knowledge.md)): la base persiste entre sesiones, se reutiliza en las instrucciones y puede compartirse. Cuando una entrega se descarga para ejecutarla, va a `sources/<actividad>/<id-del-alumno>/`, con un identificador y nunca con el nombre del alumno en la ruta.

## Si venías de moodle-agent

Un aula de moodle-agent se abre tal cual. La primera vez, miyagi mueve la antigua carpeta `context/` a `sources/`, y una `knowledge/` con el formato viejo (con `README.md` y sin `index.md`) a `knowledge-legacy/`, con sus archivos descargados también en `sources/`. Después, el asistente reconstruye la base de conocimiento a partir de ahí.
