# Estabilidad de Moodle 4.5-5.2 para un MCP sin clics

Anexo del informe [Moodle sin clics](README.md). Estudio del código de Moodle, hecho por un subagente sobre clones parciales de las ramas `MOODLE_405_STABLE` (4.5.15), `MOODLE_500_STABLE` (5.0.11), `MOODLE_501_STABLE` (5.1.8) y `MOODLE_502_STABLE` (5.2.4), para responder a una pregunta: ¿son iguales las URL, los nombres de campo y los servicios en todas las versiones y en los temas Boost y Classic? El informe principal lo comprobó después en la sandbox con 4.5 y 5.2. Desde la 5.1, el código web de Moodle está bajo `public/`.

## Veredicto

Sí, con dos matices.

- **Entre 4.5 y 5.2 las URL de los formularios y los nombres de sus campos son los mismos,** salvo excepciones localizadas.
  - Afecta a `course/modedit.php`, `course/editsection.php`, `mod/forum/post.php`, `mod/assign/view.php?action=...` y `mod/quiz/edit.php`.
  - Classic hereda de Boost (`$THEME->parents = ['boost']`) y no cambia ninguna plantilla de formulario ni de la página del curso.
  - Solo cambian la cabecera, el botón de edición y el índice del curso.
- **Los formularios no se pueden enviar construidos desde cero.**
  - Cada formulario lleva un campo oculto `_qf__<clase>` y el `sesskey`.
  - Los editores y los gestores de archivos llevan un `itemid` de borrador que genera el servidor.
  - Algunas clases de formulario cambian de archivo entre versiones.
  - La forma correcta: GET del formulario, conservar sus campos ocultos, cambiar solo lo necesario y POST.
- **Los servicios AJAX de sesión** (`lib/ajax/service.php` con el `sesskey`, solo las funciones marcadas `'ajax' => true`) no necesitan que el administrador active los servicios web, y para la estructura del curso son aún más estables que la interfaz.

## Diferencias entre versiones

- **Atto sale del núcleo en 5.0** (MDL-83282) y sigue existiendo como plugin aparte. En 4.5 el profesor puede tenerlo como editor preferido: enviar el campo `<editor>[text]` por POST evita depender del editor.
- **Banco de preguntas en 5.0** (MDL-71378): las preguntas pasan a módulos `mod_qbank`.
  - `question/bank/importquestions/import.php` exige el `cmid` del banco y ya no acepta `courseid`.
  - Los bancos de un curso están en `question/banks.php?courseid=` (en la 4.5 no existe).
- **Servicios obsoletos desde 5.0:** `core_courseformat_create_module` (se sustituye por `new_module`, que existe desde la 4.5.4), `core_course_edit_section`, `core_course_edit_module` y `core_course_get_module`.
- **Acciones de estructura:**
  - `section_move` se elimina en 5.2 (hay que usar `section_move_after`);
  - `section_duplicate` solo existe desde 5.1.
- **Campos nuevos en formularios:**
  - tarea: `gradepenalty` y `recalculatepenalty` (5.0); `markercount`, `mark` y `allocatedmarker[i]` para varios correctores (5.2);
  - todas las actividades: `enableaitools` (5.1);
  - foro: `lockdiscussionafter` pasa de desplegable a duración, y aparece `showimmediately` (5.2).
- **Fuera de rango:** Classic sale del núcleo en 5.3 (MDL-88351).

## Lo que no cambia entre versiones ni temas

- **Formularios:**
  - `modedit.php?add=<módulo>&course=&section=` y `?update=<cmid>` para página, archivo, URL, etiqueta, libro, tarea, cuestionario, foro, H5P, SCORM, consulta, encuesta, lección y carpeta;
  - `editsection.php?id=`;
  - los campos `name`, `introeditor[text|format|itemid]`, `page[text|format|itemid]`, `files`, `externalurl`, `visible` (1/0/-1), `availabilityconditionsjson`, `groupmode`, `groupingid`, los de finalización, `submitbutton` y `submitbutton2`.
- **Subida al área de borrador:**
  - `repository/repository_ajax.php?action=upload` con `repo_id`, `itemid`, `ctx_id` y el archivo en `repo_upload_file`;
  - el `repo_id` cambia de un sitio a otro y se lee de la propia página.
- **Servicios AJAX con la misma firma en las cuatro versiones:**
  - `core_courseformat_update_course`: `section_add`, `section_delete`, `section_hide`, `section_show`, `section_move_after`, `cm_move`, `cm_show`, `cm_hide`, `cm_duplicate`, `cm_delete`, `cm_*groups`…;
  - `core_courseformat_get_state` y `core_update_inplace_editable` (sección: `format_topics` o `format_weeks`, `sectionname`; actividad: `core_course`, `activityname`);
  - `mod_assign_submit_grading_form`, `mod_assign_list_participants`, `mod_forum_add_discussion_post`, `mod_quiz_add_random_questions` y `mod_quiz_update_slots`.
- **No son AJAX** (solo con token): `core_course_get_contents`, `mod_forum_add_discussion`, `mod_assign_save_grade`, `core_grades_update_grades` y `core_webservice_get_site_info`.
- **Calificación:**
  - el formulario de la tarea (`grade`, `assignfeedbackcomments_editor[text]`, `sendstudentnotifications`, `workflowstate`…);
  - la rúbrica (`advancedgrading[criteria][<id>][levelid]` y `[remark]`);
  - el calificador (`grade_<userid>_<itemid>`).
- **Restricciones:** el formato de `availabilityconditionsjson` (`{"op":"&","c":[...],"showc":[...]}`) y las condiciones de fecha, finalización, nota, grupo, agrupamiento y perfil.
- **La página del curso:**
  - los ganchos `[data-for=section][data-id]` y `[data-for=cmitem][data-id]`;
  - `editmode.php` para el modo edición, que funciona en los dos temas. El interruptor es solo de Boost; Classic tiene el botón «Activar edición».
- **Formatos de curso:** temas y semanas usan las mismas plantillas y acciones. Solo cambia el componente al renombrar secciones, y en semanas el nombre por defecto es el rango de fechas. Los formatos de terceros pueden romperlo todo: hay que mirar el formato antes de actuar.

## Estrategia por operación

| Operación | Vía | Alternativa |
| --- | --- | --- |
| Leer la estructura | AJAX `core_courseformat_get_state` | `data-for`/`data-id` de la página |
| Crear una actividad con contenido | `modedit.php?add=` (GET, cambiar, POST) | — (`new_module` solo crea subsecciones, comprobado en la sandbox) |
| Editar una actividad | `modedit.php?update=` | — |
| Renombrar | AJAX `core_update_inplace_editable` | formularios |
| Añadir, mover, ocultar, duplicar o borrar | AJAX `update_course` | `course/format/update.php` (solo desde 5.0) |
| Sección con resumen o restricciones | `editsection.php` | — |
| HTML en un editor | POST de `<campo>[text]`, `[format]` y `[itemid]` | `tinymce.setContent` + guardar |
| Archivos | `repository_ajax.php?action=upload` | `setInputFiles` en el selector |
| Calificar | AJAX `mod_assign_submit_grading_form` (formulario de `core_get_fragment`, `gradingpanel`) | `view.php?action=grade` |
| Responder en el foro | AJAX `mod_forum_add_discussion_post` | `post.php?reply=` |
| Abrir un debate | `post.php?forum=` | — |
| Importar preguntas | `import.php` con `courseid` (4.5) o con el `cmid` del banco (5.x) | — |
| Montar el cuestionario | `mod/quiz/edit.php` POST `add` + `q<id>` | `mod_quiz_add_random_questions` para aleatorias |
| Modo edición | `editmode.php` | `course/view.php?edit=on` |

Reglas comunes: partir siempre del GET del formulario, comprobar el resultado (un formulario con errores devuelve 200: buscar `.invalid-feedback` o `#id_error_<campo>`), y detectar la versión y el formato del curso antes de actuar.
