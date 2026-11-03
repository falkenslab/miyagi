# Bases de Datos de 1º DAM, de principio a fin en la versión web

Una suite completa de creación y gestión de un workspace, toda desde la página de `miyagi web` manejada con Playwright, como lo haría un profe. Se probaron los dos caminos hacia un aula de moodle-sandbox:

- **Caso 1, del workspace al aula.** Asignatura nueva sin aula, sus documentos subidos e incorporados, el currículo oficial buscado en el BOE y el BOC, la programación escrita y completada, una unidad preparada, y al final el aula vacía vinculada, con la estructura montada y la UT2 publicada oculta.
- **Caso 2, del aula al workspace.** Asignatura nueva vinculada al crearla con un aula que ya tiene contenido, explorada, su contenido traído a `materials/`, y un cuestionario corregido y devuelto al aula.

Cada fallo encontrado se convirtió en una ficha con su issue, se corrigió y se volvió a probar en la misma suite.

| | |
| --- | --- |
| Fecha | 3 nov 2026, 02:00–03:50 (hora de Canarias); la primera sesión empezó a las 01:00 UTC |
| Entorno | Windows 11 · `miyagi web` con Chrome sin ventana (1440×900, `es-ES`) · moodle-sandbox, Moodle 5.2.4 en Docker |
| miyagi | 0.11.0, sobre `6382b54` con los arreglos de esta suite sin commitear · agent-kit 0.32.0 · moodle-teacher con `@falkenslab/moodle-mcp@0.7.0` |
| Cursos | `bd-1dam-nuevo` (id 349, vacío, caso 1) y `bd-1dam-aula` (id 350, caso 2): cuatro secciones con apuntes, un enlace, una práctica, un cuestionario de una pregunta y un foro, sembrado para la prueba |
| Cuenta | `profesor` (editingteacher en los dos cursos); capturas de alumno con `alumno` |
| Workspaces | Caso 1: «Bases de Datos (1º DAM)», en la carpeta de miyagi de un home temporal, tono cercano. Caso 2: «Bases de Datos (1º DAM) · desde el aula», en una carpeta elegida desde la página |
| `sources/` del caso 1 | `programacion-bd-curso-pasado.md` (8 UT, evaluación 60/40, lo que funcionó), `rubrica-practicas.md` (4 criterios, 5/2/2/1) y `apuntes-ut2-modelo-er.pdf` (2 páginas) |

## Veredicto

**Superada con hallazgos.** Los dos caminos funcionan de principio a fin en la versión web:

- en el caso 1, el aula vacía quedó con la estructura de la programación y la UT2 entera, oculta, tras 6 aprobaciones;
- en el caso 2, el contenido del aula pasó a `materials/` con su registro de publicaciones y el cuestionario corregido volvió al aula con 2 aprobaciones.

En el camino aparecieron **6 fallos de miyagi**, cada uno con su issue:

- **corregidos y vueltos a probar (5):**
  - la página no enseñaba nada de `materials/`;
  - las preguntas de verdadero o falso llegaban a Moodle con la respuesta en el enunciado;
  - el markdown salía mal en cinco sitios;
  - los títulos de las conversaciones cambiaban con cada mensaje;
  - «Actividad reciente» salía en inglés;
- **abierto (1):** una programación de 8 unidades deja una sola página de tema, y tres intentos de arreglarlo en la skill no bastaron.

Ninguna publicación se hizo sin aprobación.

## Lo que se ejecutó

Sesiones del chat de la página, por conversación. Las cifras salen de cada `transcript.jsonl`.

| Caso | Conversación (UTC) | Qué | Duración | Llamadas | Aprobaciones | Preguntas | Resultado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 01:00 | Ingesta, la contradicción resuelta, programación con currículo oficial, decisiones, calendario | 30,6 min | 107 | 0 | 8 | 3 resúmenes y 3 conceptos; currículo (RD 450/2010, RD 405/2023, resolución canaria de 2024), programación |
| 1 | 01:31 | «Revisar con miyagi» la programación | 3,2 min | 24 | 0 | 0 | Revisión con el revisor pedagógico; ninguna página de tema nueva |
| 1 | 01:36 | Las decisiones pendientes, en un mensaje | 1,1 min | 13 | 0 | 0 | Programación editada sin cargar la skill |
| 1 | 01:37 | `/miyagi:teaching-plan` | 3,5 min | 36 | 0 | 6 | Regla de aprobado, la prueba del RA6, rúbrica con nivel 0 |
| 1 | 01:42 | «Prepararlo con miyagi» en la UT2 (`/miyagi:build-unit`) | 11,8 min | 66 | 0 | 2 | 11 materiales en `materials/ut2/`, todos validados |
| 1 | 01:57 | Vincular el aula 349 y publicar | 42,2 min (15,9 publicando) | 196 | 6 | 0 | Estructura de 8 UT y Recuperación; la UT2 oculta con 10 actividades |
| 2 | 02:43 | Explorar el aula 350, traerla y corregir el cuestionario | 8,0 min | 82 | 2 | 0 | `materials/ut1`–`ut3`, 2 páginas de actividad, el cuestionario con 5 preguntas en Moodle |

Las demás conversaciones de Recientes (02:20 y otras dos de menos de un minuto) solo tienen el saludo al reabrir la asignatura; tras el arreglo de #71 ya no se listan. Los 42 minutos de la conversación de las 01:57 incluyen 15 en los que moodle-teacher esperaba un inicio de sesión que nadie hizo (ver «Hallazgos sin cambio»).

## Caso 1: del workspace al aula

### Crear la asignatura, subir y incorporar

| Esperado | Lo que hizo |
| --- | --- |
| La asignatura se crea desde el formulario con nombre, descripción, idioma y tono | Creada; se abre en Hoy con el saludo y las sugerencias |
| Las tres fuentes se suben desde Fuentes y aparecen como nuevas | Sí; el PDF con su tamaño, las tres «nuevo» |
| «Pedir a miyagi que los incorpore» las ingiere | 1,2 min: un resumen por documento, `concept/modelo-entidad-relacion`, `entidad-debil`, `cardinalidad-y-participacion`, `topic/ut2-…` y el overview; leyó el PDF entero |
| Detecta lo que no cuadra entre ellas | Sí: «tarde vale como máximo 5» (programación) frente a «sin entrega vale 0» (rúbrica); preguntó y anotó la aclaración en las páginas |

![El formulario de nueva asignatura](assets/01-nueva-asignatura.png)
*El formulario completo: nombre, descripción, idioma, tono cercano y la opción de vincular el aula.*

![Las fuentes subidas](assets/02-fuentes-subidas.png)
*Fuentes tras subir los tres archivos: «nuevo» hasta que se incorporan.*

![La ingesta, terminada](assets/03-ingesta-hecha.png)
*El resumen de la ingesta y la contradicción entre la programación y la rúbrica, preguntada en vez de elegida.*

### La programación con el currículo oficial

| Esperado | Lo que hizo |
| --- | --- |
| Pregunta lo que solo decide el profe | Una decisión cada vez: la estructura del curso pasado, el 60/40, de dónde sacar los RA, la comunidad, las horas, la numeración, la UT en curso, la isla, la regla de aprobado… |
| Busca el currículo en fuentes oficiales | En 3,7 min: RD 450/2010, RD 405/2023 y la resolución canaria de 2024, descargados en `sources/normativa/` con su `.md`; los RA y los criterios, copiados literalmente |
| Avisa de lo que contradice al profe | Sí: la norma da 5 h/semana y 170 h, y la programación decía 6; hay 7 RA y no 6, y con otra numeración |
| Fechas reales | Calendario escolar de Canarias 2026-27 y festivo insular de Tenerife (Candelaria), buscados; fin de curso el 22 de junio de 2027 |

![Una decisión del profe en el panel](assets/04-pregunta-estructura.png)
*La primera pregunta en el lugar del cuadro de texto; la conversación sigue legible encima.*

![Las horas oficiales frente a las del profe](assets/05-pregunta-horas-oficiales.png)
*miyagi encontró en el BOC 170 h y 5 h/semana, y pregunta con cuál planificar en vez de elegir.*

![El título repetido](assets/06-programacion.png)
*Antes del arreglo (#73): el título de la programación sale dos veces.*

![La programación, arreglada](assets/07-programacion-arreglada.png)
*Después: una vez, y los enlaces a la programación anterior y al currículo funcionan.*

![Lista anidada aplanada](assets/14-lista-anidada-aplanada.png)
*Antes del arreglo (#73): «Por horas» y «Por número de criterios» eran opciones del punto 2 y salían numeradas como 3 y 4.*

### Temas, materiales y el horno

| Esperado | Lo que hizo |
| --- | --- |
| Temas muestra las unidades de la programación | **No**: una programación de 8 UT, y en Temas solo la UT2 (#74, abierto) |
| «Prepararlo con miyagi» prepara la unidad | 11,8 min: hoja de notación, ejercicios guiados, E/R ampliado, 2 autoevaluaciones (banco de 17 preguntas), la práctica con su solución, el simulacro y su solución; todo validado; un revisor pedagógico movió plazos |
| Materiales enseña lo preparado | **Antes no**: decía «0 materiales» con la rúbrica y los 11 archivos en `materials/` (#75). Después los lista y los previsualiza formateados |
| En el horno muestra el trabajo en curso | Sí, «cocinándose»; antes con los enlaces en crudo (#73) |

![Temas, antes](assets/08-temas.png)
*Antes (#73): la descripción con los asteriscos a la vista. Y una sola unidad de las ocho (#74, abierto).*

![Temas, después](assets/09-temas-arreglado.png)
*La descripción formateada; sigue habiendo una sola página de tema.*

![Materiales con materials/](assets/10-materiales-rubrica.png)
*Después del arreglo (#75): `materials/course.md` y la rúbrica, que antes la página no enseñaba.*

![La vista previa formateada](assets/11-materiales-preview-md.png)
*El enunciado de la práctica, en Markdown, previsualizado ya formateado.*

![El horno, antes](assets/12-horno.png)
*Antes (#73): «[UT2](topics/ut2-…md)» en crudo en la tarjeta.*

![El horno, después](assets/13-horno-arreglado.png)
*Después: el texto del enlace.*

### Vincular el aula vacía y publicar

| Esperado | Lo que hizo |
| --- | --- |
| El asistente vincula el aula desde «Tu aula» | 5 s: instala moodle-teacher y abre la conversación con el aula |
| Pide aprobación antes de cada publicación, con todo lo que publica | 6 aprobaciones: la estructura, los recursos, los cuestionarios, las preguntas, la tarea con su rúbrica y las 4 páginas (ver abajo) |
| Todo lo nuevo, oculto | Sí: la UT2 y sus 10 actividades ocultas; solo la UT1 visible, como pidió el profe |
| Respeta la programación y la rúbrica del profe | Secciones con los títulos de la programación; rúbrica con los pesos 5/2/2/1, los tres niveles y el nivel 0 nuevo |
| Corrige lo que estaría mal al publicarlo | Las explicaciones de ER-07, ER-08 y ER-13 estaban en el enunciado; las movió a la retroalimentación general en Moodle y lo contó. La causa era del exportador (#76, corregido) |

Lo que miyagi guardó en Moodle (`mdl_course_sections` y `mdl_course_modules` del curso 349):

| Sección | Visible | Actividades |
| --- | --- | --- |
| UT1 · Sistemas de almacenamiento | sí | 0 |
| UT2 · Diseño conceptual: modelo entidad-relación | no | 10, todas ocultas: assign, 2 book, 5 page, 2 quiz |
| UT3 a UT8, Recuperación y cierre | no | 0 |

![Vincular, paso 1](assets/15-vincular-paso1.png)
*La dirección del curso, con su id.*

![Vincular, hecho](assets/16-vincular-paso3.png)
*Aula vinculada en 5 segundos.*

![La aprobación de la estructura](assets/17-aprobacion-estructura.png)
*La primera aprobación: cada sección, si va visible u oculta y el texto que llevará.*

![El permiso de set_rubric](assets/18-permiso-set-rubric.png)
*Tras aprobar la tarea con su rúbrica, el kit vuelve a preguntar por `set_rubric` con su nombre interno y su JSON (ver «Hallazgos sin cambio»).*

![El aula 349 como profesor](assets/19-aula349-profesor.png)
*La estructura de la programación y la UT2 entera, oculta.*

![El aula 349 como alumno](assets/20-aula349-alumno.png)
*El alumno solo ve la UT1, vacía.*

![La rúbrica en Moodle](assets/21-practica-rubrica.png)
*La rúbrica de la práctica, con los cuatro criterios del profe y el nivel 0 «No realizado».*

## Caso 2: del aula al workspace

| Esperado | Lo que hizo |
| --- | --- |
| La asignatura se crea con el aula vinculada desde el formulario, en una carpeta elegida | Sí: «Vincular ya un aula» abre el asistente al crearla; la carpeta elegida tiene su `config.json` |
| El saludo propone explorar el aula | Sí: «Explorar el curso en Moodle… solo leo, sin cambiar nada» |
| Explora sin tocar nada y lo apunta | 0,8 min: orientación, mapa con los ids, una página por unidad; avisó de que el cuestionario de prueba pesa un 91 % de la nota, que la práctica acepta cualquier archivo aunque pide PDF y no tiene rúbrica, y de que el curso no explica cómo se evalúa |
| Trae el contenido a miyagi | 1,6 min: apuntes, práctica y cuestionario en `materials/ut1`–`ut3` con su banco, todo validado, y cada pieza registrada como ya publicada; encontró que el comentario de la única pregunta decía lo contrario de la respuesta y estaba en inglés |
| Vuelve al aula lo que se mejora aquí | 3,5 min, 2 aprobaciones: el comentario corregido, la descripción y la categoría sin «Test», y 4 preguntas nuevas sobre claves y formas normales |

![Nueva asignatura con aula](assets/22-nueva-asignatura-con-aula.png)
*El formulario con «Vincular ya un aula de Moodle» y la carpeta elegida.*

![La exploración del aula](assets/23-c2-exploracion.png)
*Lo que hay en cada unidad y lo que conviene revisar, sin tocar el aula.*

![La sincronización](assets/24-c2-sincronizacion.png)
*El contenido del aula en `materials/`, validado y registrado como publicado, y el error de la pregunta.*

![Los materiales traídos](assets/25-c2-materiales.png)
*La vista Materiales del workspace nuevo, con «Publicar…» porque hay aula.*

![El aula 350](assets/26-aula350-profesor.png)
*El aula de partida del caso 2, como profesor.*

![El cuestionario devuelto al aula](assets/27-cuestionario-ut3.png)
*El cuestionario de la UT3 en Moodle tras el viaje de vuelta: UT3-01 corregida y las cuatro preguntas nuevas.*

## Las aprobaciones, en orden

Caso 1, curso 349 (conversación de las 01:57):

1. La estructura: renombrar la sección 1 a UT1, visible y vacía; crear la UT2 oculta, con su descripción literal; crear UT3–UT8 y «Recuperación y cierre», ocultas y vacías.
2. Tres recursos ocultos en la UT2: la hoja de notación (página) y los dos libros, con sus capítulos.
3. Dos cuestionarios ocultos, sin preguntas, con sus ajustes formativos: intentos ilimitados, retroalimentación inmediata y peso 0 en el calificador.
4. Importar las 17 preguntas en sus cuestionarios, en orden, con cada respuesta y sus distractores listados.
5. La tarea oculta con su enunciado, sus fechas, PDF y la rúbrica; le pide al profe confirmar dos compromisos del enunciado.
   - Después, el permiso del kit para `set_rubric` (ver «Hallazgos sin cambio»).
6. Cuatro páginas ocultas: el simulacro y tres soluciones (la del simulacro sin la guía de corrección, que es para el profe).

Caso 2, curso 350 (conversación de las 02:43):

1. Renombrar la categoría del banco, corregir la pregunta «Clave primaria nula» (su comentario) y cambiar la descripción del cuestionario.
2. Importar 4 preguntas nuevas y añadirlas al cuestionario.
   - Antes, el permiso del kit para `export_questions` (ver «Hallazgos sin cambio»).

Ninguna escritura en Moodle fuera de un lote aprobado: se comprobó en el orden de las llamadas de los dos transcripts. Hay un caso que conviene saber. Dentro del lote 4, miyagi usó `update_question` en ER-07, ER-08 y ER-13 para sacar la explicación del enunciado, y lo contó en su resumen final, no en la aprobación. Las preguntas aprobadas eran esas; lo que cambió fue dónde va su explicación.

## Hallazgos

| # | Qué | Estado | Dónde |
| --- | --- | --- | --- |
| [#75](https://github.com/falkenslab/miyagi/issues/75) | La página no enseña `materials/`: Materiales decía «0 materiales» con la rúbrica y los 11 materiales de la UT2 hechos; «Abrir la carpeta» abría `drafts/` | Corregido y vuelto a probar | `src/host/course.ts` (`draftsList`, `preparedFile`), `src/host/server.ts`, `gui/src/components/Course.tsx`, `gui/src/i18n/course.ts`; `check-host.mjs` comprueba la vista previa y sus negativas |
| [#76](https://github.com/falkenslab/miyagi/issues/76) | Las preguntas de verdadero o falso se exportaban a GIFT con la explicación en el enunciado: el alumno veía la respuesta | Corregido y vuelto a probar sobre los bancos reales de la suite | `src/materials/questions.ts`, `src/validators/gift.ts`, `test/materials.test.mjs` |
| [#73](https://github.com/falkenslab/miyagi/issues/73) | El markdown, mal en cinco sitios: el título de una página repetido, la descripción de un tema con asteriscos, enlaces en crudo en el horno, los `.md` previsualizados como texto plano, las listas anidadas aplanadas en el chat | Corregido y vuelto a probar | `gui/src/components/Course.tsx`, `gui/src/markdown.tsx`, `gui/src/styles.css` |
| [#71](https://github.com/falkenslab/miyagi/issues/71) | Recientes: el título de una conversación cambiaba con cada mensaje, y cada vez que se abría la asignatura quedaba una conversación vacía con solo el saludo | Corregido y vuelto a probar | `src/host/server.ts` (`runs`) |
| [#72](https://github.com/falkenslab/miyagi/issues/72) | Hoy · Actividad reciente: «update · 3 nov», «ingest · 3 nov» en la página en español | Corregido y vuelto a probar | `gui/src/i18n/course.ts`, `gui/src/components/Course.tsx` |
| [#74](https://github.com/falkenslab/miyagi/issues/74) | Una programación de 8 UT deja una sola página de tema, y Temas enseña una unidad | **Abierto**. La regla está ahora en la skill, en tres sitios, pero en tres ejecuciones no se cumplió: en la revisión informó sin crear, al editar no cargó la skill y con `/miyagi:teaching-plan` se centró en la evaluación. La ficha propone no depender del modelo | `plugin/skills/teaching-plan/SKILL.md`, `.minispec/features/fix-plan-topic-pages.md` |

### Hallazgos sin cambio

- **Los botones mandan el comando en crudo.** «Pedir a miyagi que los incorpore» y «Prepararlo con miyagi» dejan como mensaje del profe `/knowledge:ingest` o `/miyagi:build-unit UT2 · …`. Además, esas conversaciones quedan en Recientes sin título, porque el kit no guarda el texto del comando. Encaja con #68 (los comandos como acciones de la interfaz).
- **Las preguntas de miyagi enseñan términos internos.** El panel de permisos de una herramienta destructiva (`set_rubric`) muestra el nombre interno y el JSON a un profe que ya aprobó la tarea con su rúbrica. Es el diseño del kit (#78 de agent-kit: lo destructivo pregunta siempre); el texto es cosa de agent-kit.
- **Un permiso de más al exportar.** `export_questions` pide permiso en modo guiado aunque solo lee Moodle: moodle-mcp no lo marca como de solo lectura, porque escribe un archivo local.
- **«Otra respuesta» no es una nota.** En una pregunta de opción única, pulsar una opción la envía ya: «Otra respuesta» sirve como alternativa, no para añadir algo a una opción. Además, la comunidad autónoma se preguntó dos veces aunque estaba en la descripción de la asignatura.
- **Una norma bajada dos veces.** La resolución canaria entró en `sources/` en HTML y en PDF. El par HTML y su `.md` queda como «nuevo» y Hoy sugiere incorporar «2 documentos».
- **Ids de Moodle en las tarjetas de Temas.** En el caso 2, cada tarjeta empieza con «Sección 1 de Moodle (id 1761)»: el modelo escribió el id del aula en la descripción.
- **La ventana de inicio de sesión de moodle-teacher.** Se abrió en el escritorio dos veces y esperó 5 y 10 minutos a que alguien entrara. Para un profe es lo esperado: inicia sesión en esa ventana. En la suite no lo hizo nadie. Al final la sesión se dejó iniciada en el perfil de moodle-teacher con la cookie de Moodle guardada con caducidad, solo en el sandbox, y reiniciando el servidor, que guarda el navegador abierto con el perfil de antes.

## Qué se cambió en el agente

- **`plugin/skills/teaching-plan`:** cada unidad tiene su página de tema y las que faltan se crean. Está en la estructura, en la comprobación de coherencia y en la entrega. No basta (#74).
- **`src/materials/questions.ts` y `src/validators/gift.ts`:** la explicación de una pregunta de verdadero o falso o numérica es su comentario general, y el validador acepta un verdadero o falso con `####` como lo lee Moodle (#76).
- **La página (`src/host/`, `gui/`):** `materials/` en Materiales y en Hoy (#75), el markdown (#73), Recientes (#71) y la actividad reciente (#72).
- **La documentación:** `docs/content/avanzado/navegador.md`, en español e inglés: Recientes y Materiales.

## Lo que no cubrió

- Corregir entregas y responder en el foro: los cursos de la suite no tienen entregas ni mensajes.
- Mostrar a los alumnos lo publicado: la UT2 quedó oculta, a la espera de que el profe la pruebe.
- Los pesos del calificador por RA. miyagi avisó de que la práctica cuenta el 100 % del caso 1 y de que el cuestionario cuenta el 91 % del caso 2, pero no se le pidió cambiarlo.
- La app de escritorio. La página es la misma, pero el arranque y la ventana de Electron no se probaron.
- Los modos interactivo, autónomo y plan desde la página: todo se hizo en guiado. `check-page.mjs` sí cubre el cambio de modo y una aprobación rechazada, y pasa con estos cambios.
