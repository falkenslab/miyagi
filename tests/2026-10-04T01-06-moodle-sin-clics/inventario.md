# Inventario: lo que miyagi hace en Moodle

Anexo del informe [Moodle sin clics](README.md). Recuento de lo que hizo el agente en el navegador en las sesiones reales guardadas hasta el 4 de octubre de 2026, para decidir qué herramientas debe tener el MCP de Moodle ([ADR-019](../../.minispec/decisions/ADR-019-moodle-mcp.md), [#40](https://github.com/falkenslab/miyagi/issues/40)). Lo hizo un subagente con unos scripts que emparejan cada llamada a Playwright con su resultado, normalizan las URL de Moodle (los ids pasan a `N`) y agrupan las llamadas seguidas en episodios. Aquí solo hay patrones de URL, campos de la interfaz y recuentos: ningún nombre ni texto de alumnos.

## Fuentes

- **Transcripciones:** 101 `transcript.jsonl` de 10 workspaces de `moodle-courses/`. No se leyó ningún perfil de navegador.
- **Conversaciones:** los mensajes de error de las 10 `conversation.jsonl` que existen.
- **Informes:** los 10 informes de [tests/](../README.md) que prueban Moodle.

## Cifras

- **Volumen:** 101 sesiones, 91 de ellas con navegador. 4.995 llamadas al navegador, de las que 260 (5,2 %) no tienen resultado.
- **Para qué se usa el navegador:**
  - 47,8 % para orientarse: `snapshot` 633, `find` 408, `wait_for` 723, `take_screenshot` 224, más las lecturas con `evaluate`;
  - 35,0 % para actuar;
  - 17,1 % para navegar (`navigate` 856).
- **Por sitio:**
  - Aulatic (4.5, Classic, CAS): 4.222 llamadas, 3,2 % de fallos.
  - Sandbox (5.2, Boost): 755 llamadas, 15,6 % de fallos.
- **Por papel:**
  - 58,3 % son de participante: las sesiones de Aulatic son de cuando el agente también hacía de alumno, con cuestionarios, encuestas, vídeos, H5P y foros como participante.
  - Solo el 9,6 % (481 llamadas) es trabajo de profesor, casi todo en dos sesiones de la sandbox.
  - No hay ninguna sesión de profesor en Aulatic.
- **Login:** 70 inicios de sesión en 67 sesiones. Mediana de 4 llamadas y máximo de 9; el 56 % con algún fallo.
- **Falso fallo al guardar:**
  - 72 clics en «Guardar y volver», «Guardar cambios» o «Acceder» dieron error de tiempo (5 s), aunque Moodle había guardado.
  - En 18 de los 20 casos comprobados, la página siguiente ya era la de destino.
  - En los otros 52 el agente no lo comprobó: siguió adelante, o volvió a pulsar el botón, con riesgo de duplicar.
- **`browser_evaluate` (796 llamadas):**
  - 452 manejan vídeo como participante;
  - 200 leen el DOM;
  - 70 escriben en el DOM;
  - 26 escriben HTML en TinyMCE y 7 lo leen;
  - 23 intentan cargar pdf.js desde unpkg para leer un PDF: fallaron por la política de seguridad de la página y el agente acabó con capturas página a página.
- **Servicios AJAX:** ninguna sesión real los usa.
- **Editor:** siempre TinyMCE; Atto no aparece.
- **Subida de archivos:**
  - 9 `file_upload`: 2 en el selector de archivos, 5 imágenes en el diálogo de TinyMCE, 1 adjunto de foro y 1 fallido;
  - 1 `browser_drop`.

## Casos de uso de profesor, por prioridad

Prioridad = veces × mediana de llamadas × (0,2 + tasa de fallo).

| Caso de uso | Veces | Llamadas (mediana/máx) | Fallos típicos | URL y campos |
| --- | --- | --- | --- | --- |
| Iniciar sesión | 70 | 4 / 9 | 56 %: falso fallo del clic en «Acceder», referencias caducadas | `login/index.php`; CAS `educacion/cau_ce/cas/login` |
| Leer la estructura del curso | 174 | 2 / 31 | capturas enormes, búsquedas repetidas | `course/view.php`, `course/section.php` (Classic, una sección por página) |
| Editar una actividad | 16 | 4 / 16 | 94 %: falso fallo de `#id_submitbutton2`; TinyMCE forzado con `triggerSave` | `course/modedit.php?update=N`: `#id_name`, `page[text]`, `introeditor` |
| Crear una página | 10 | 6 / 8 | 100 %: falso fallo al guardar | `course/mod.php?add=page` → `modedit.php` |
| Crear un recurso Archivo | 2 | 13 / 13 | subida sin selector abierto, sección Apariencia plegada | `modedit.php?add=resource`, selector o zona de soltar |
| Editar una sección | 6 | 3 / 4 | 100 %: falso fallo de «Guardar cambios» | `course/editsection.php?id=N` |
| Añadir preguntas a un cuestionario | 2 | 14 / 19 | callejón sin salida en el diálogo de nueva pregunta | `mod/quiz/edit.php`, `question/bank/editquestion/...` |
| Abrir el selector de actividades | 4 | 5 / 16 | el modal falla; el agente lo evita con `course/mod.php?add=X` | `data-action="open-chooser"` |
| Foro (debate, respuesta) | 4 | 5 / 20 | el envío falla una vez; TinyMCE por `evaluate` | `mod/forum/post.php` |
| Modo edición | 7 | 2 / 4 | referencia caducada | interruptor de edición |
| Crear y renombrar secciones | 9 | 2-3 / 4 | 33 % al crear | botón «Añadir sección», título en línea |

De los informes de prueba (sin transcripciones guardadas):

| Caso de uso | Informes | Fallos típicos |
| --- | --- | --- |
| Importar GIFT y montar el cuestionario | 6 | orden de las preguntas perdido (4 informes), sangría del código perdida, escapes |
| Tarea con rúbrica | 5 | tareas sin rúbrica, nota máxima por defecto que obliga a reeditar |
| Calificar entregas | 4 | comentario perdido por `setContent` sin guardar (6 entregas), nota dada por guardada sin comprobarla |
| Libro de calificaciones | 4 | pesos puestos con JS que no se guardan |
| Oculto → probar → mostrar | 5 | campo en una sección plegada, aprobación en cada capítulo |
| Contenido rico | 4 | formato de código perdido al escribir |
| Responder en el foro | 4 | mensaje vacío porque el editor no había cargado |

## Lecturas que el agente necesita

- **Estructura del curso:** secciones y módulos, con id, tipo, nombre, visibilidad y URL.
- **El contenido de una actividad**, también antes de editarla.
- **El texto de un PDF del curso.**
- **Para el seguimiento:** el calificador, el informe del cuestionario, los participantes, la tabla de entregas, la rúbrica y el árbol del libro de calificaciones.
- **Los hilos del foro.**
- **Las capacidades del sitio:** tipos de actividad y de pregunta, agregaciones y tipos de archivo.
- **El estado de la sesión.**

## Casos raros: sin herramienta, pasos para el profesor

- Idioma del usuario o administración (con errores 404).
- Borrar una actividad (1 vez).
- Mover una actividad (1 vez, 10 llamadas).
- Ajustes generales del curso.
- Previsualizar un cuestionario como profesor.
- Taller, insignias, agrupamientos y SCORM (1 informe cada uno).

## Primeras herramientas propuestas

Todas las de publicación devuelven lo que quedó guardado y crean oculto por defecto.

1. **`session_ensure`:** login único, por formulario o por CAS.
2. **`get_course_structure`.**
3. **`create_module` y `update_module`, con `upload_file`.**
4. **`upsert_section`:** crear, renombrar y resumen.
5. **`set_visibility`.**
6. **`get_activity`.**
7. **`import_gift` y `set_quiz_questions`,** en orden.
8. **`define_rubric`, `list_submissions` y `grade_submission`.**
9. **`forum_post`.**
10. **`get_site_capabilities`, `get_file_text` y `get_grades`.**

## Anomalías

- **Pocos datos de profesor:** las transcripciones de los informes de prueba no se conservaron; conviene guardarlas en las próximas.
- **Sin Web Services en Aulatic:** sin token de servicios web, `modedit`, las rúbricas y la calificación necesitan formularios con `sesskey`.
- **Experimentos fuera de lugar:** el agente cargó código de unpkg y jsdelivr dentro del Moodle del curso.
- **Datos personales en scripts:** algunos `evaluate` de encuestas (como participante) llevan datos personales en el código de la transcripción. No se han copiado aquí.
