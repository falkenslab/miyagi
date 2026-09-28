# Chat Ink a pantalla completa en un aula completa

Prueba de la actualización a agent-kit 0.10.0, que cambia `teacher-agent chat` al chat Ink del kit, a pantalla completa por defecto. El chat se manejó como lo haría un profesor, tecla a tecla, desde una pseudoterminal (ConPTY + xterm.js sin interfaz), en un aula sembrada para la ocasión: corrección de dos tareas, foro con cuatro situaciones distintas, modo interactive, interrupciones, selección con el ratón y cambio de tamaño. También se probaron `--inline`, `--plain`, la entrada por tubería, `explore` con el kit nuevo y la configuración de un workspace desde cero.

- **Fecha:** 28 sep 2026, 02:10–02:51 (hora local)
- **Entorno:** moodle-sandbox · Moodle 5.2.3+ en Docker 29.6 · `http://localhost:8081` · Windows 11
- **Curso:** `dam-python-ink` (id 5), "Programación 1º DAM · aula de prueba del chat Ink", creado vacío con `npm run course` y sembrado con un script propio (abajo)
- **Agente:** teacher-agent 0.4.0 sin publicar (sobre `417bd90`, con los cambios de esta prueba), instalado con `npm link` · agent-kit 0.10.0
- **Cuenta:** `profesor` del sandbox, credenciales en `config.json`, `--headless`
- **Workspace:** nuevo, en el scratchpad, `allowPracticeRunner: false`, `sources/criterios-tarea-2.md` con la rúbrica del profesor para la Tarea 2
- **Terminal:** 130×42, con un cambio a 96×30 y vuelta
- **Aprobaciones:** respondidas a mano, una a una, mirando cada panel

## Veredicto

**Superada con hallazgos.** El chat a pantalla completa hace todo lo que promete:

- Cabecera fija, respuesta en streaming con el markdown formateado y herramientas con su resultado.
- Paneles de aprobación numerados, que funcionan con `1`, `y` e Intro, y rechazo con `2`.
- Shift+Tab entre guided e interactive, también con un panel abierto.
- Esc, cola de mensajes, `@`, Ctrl+J, Ctrl+O, rueda y RePág.
- Selección con arrastre y copia con clic derecho, y `/copy`.
- Cambio de tamaño, y salida limpia con el mensaje de cierre.

Nada se publicó en Moodle sin su aprobación, y las notas y respuestas del foro son las correctas.

Los hallazgos serios no son de la interfaz:

- **Comentarios perdidos.** El primer lote de notas se guardó sin los comentarios de retroalimentación, y el agente dijo que los alumnos ya los tenían.
- **Fuera del curso.** `explore` fue a mirar los tipos de pregunta a otro curso.

Los dos quedan convertidos en regla. Además, el kit tiene un fallo de repintado: cuando crece la zona de abajo (el panel `?` o uno de aprobación), el historial pinta unas filas encima de otras. Queda abierto en agent-kit.

## El aula

Sobre el curso vacío, un script PHP del scratchpad (con el generador de datos de Moodle, como `npm run activity`) creó:

- **Tres temas**, cada uno con sus apuntes: variables y tipos, condicionales y bucles.
- **Un foro de dudas.**
- **Tarea 1** (variables y tipos, sobre 10: conceptos 6, ejemplos 3, claridad 1), con el plazo vencido ayer:
  - Lucía: completa.
  - Marcos: floja, de 16 palabras.
  - Sara: con errores de concepto (una variable «no puede cambiar», float «es texto»).
  - Diego: correcta pero entregada un día tarde.
  - `alumno` y Elena: sin entrega.
- **Tarea 2** (calificador de notas en Python), abierta una semana más:
  - Lucía: correcta.
  - Diego: usa `>` en los límites y no controla el rango.
  - Elena: usa `if` sueltos, que imprimen varias calificaciones, y `int()`.
  - Los otros tres todavía no han entregado.
- **El foro**, con cuatro situaciones:
  - Una duda sin responder (`=` frente a `==`).
  - Una bien resuelta por una compañera (faltan los dos puntos del `if`).
  - Una respondida mal por un compañero («sin `else` da error»).
  - Un alumno que publica su solución entera de la Tarea 2 con la tarea abierta.
- **Retroalimentación desactivada:** las dos tareas se crearon con los comentarios de retroalimentación desactivados, como pasa en muchos cursos reales.
- **Alumnos nuevos:** Diego Ruiz y Elena Navarro, con la contraseña de los alumnos sembrados.

## Qué se ejecutó

| Sesión | Duración | Acciones | Aprobaciones | Resultado |
| --- | --- | --- | --- | --- |
| `chat` (primera pasada, con guion fijo; descartada) | 4,1 min | 35 | 1 (rechazada) | El guion no esperaba a que el agente acabara el turno y rechazó una aprobación por error. No cambió nada en Moodle. |
| `chat` a pantalla completa (la prueba) | 24,0 min | 209 (61 `evaluate`, 41 `wait_for`, 36 `navigate`, 26 `click`, 18 `Edit`) | 8 de publicación + 2 de paso | Todo lo de abajo |
| `chat --inline` | 0,6 min | 9 (1 `Bash`, rechazado) | — | Búfer normal, sin pantalla alternativa (`?1049h` no aparece) |
| `chat --plain` | 2,1 min | 7 | — | El chat de readline de antes, con las líneas de cabecera |
| `chat` con la entrada por tubería (`printf '/exit\n' \|`) | 0,4 min | 6 | — | Cae al chat de readline y sale con código 0 |
| `explore` | 3,9 min | 55 | — | 19 tipos de actividad y 17 de pregunta; los de pregunta, mirados en el curso 2 (hallazgo 4) |
| `chat` en una carpeta que aún no es workspace | — | — | — | El asistente de configuración guarda y termina (cambio pedido durante la prueba) |

## El chat, visto

![El chat al arrancar](assets/01-chat-arranque.png)

*Arranque:*

- La cabecera fija muestra el workspace, el curso y la sesión. En la primera versión, la ruta completa del workspace se comía los otros campos (hallazgo 1).
- Cada herramienta aparece con `●` y su resultado debajo, con `⎿`.
- El turno termina con «✻ Worked for 27s».
- El prompt sugiere el siguiente mensaje («(tab)»).
- El pie muestra el modo, los turnos, los tokens y el contexto.

![Propuesta de notas de la Tarea 1](assets/02-propuesta-notas-t1.png)

*La propuesta de notas antes de publicar nada, con el markdown formateado. La columna «Motivo principal» se corta por la derecha: las tablas más anchas que la terminal no se ajustan (hallazgo 7).*

![Panel de aprobación](assets/03-panel-aprobacion.png)

*El panel de aprobación del primer lote, con el desglose de cada alumno y las opciones numeradas. Se rechazó con `2`.*

## Tarea 1: esperado y obtenido

| Alumno | Esperado | Propuesta 1 (rechazada) | Publicado | Comentario en Moodle |
| --- | --- | --- | --- | --- |
| Lucía | Alta | 9,5 | 10 | 617 caracteres |
| Diego | Alta, sin penalizar el retraso si el profesor no lo pide | 9 (preguntó por el retraso) | 9,5 | 636 |
| Sara | Media, con corrección de los dos errores | 6 | 7 | 1138 |
| Marcos | Baja, explicando lo que falta | 1,5 | 2 | 952 |
| `alumno`, Elena | 0 con «no se ha recibido entrega» (el plazo venció) | 0 | 0 | 33 |

El agente no decidió nada de lo que no le tocaba. Antes de proponer, preguntó tres cosas:

- Si activaba los comentarios de retroalimentación.
- Si penalizaba el retraso de Diego.
- Si ponía un 0 a quien no había entregado.

Tras el rechazo, preguntó qué cambiar, y aplicó los dos criterios nuevos del profesor, quitar la penalización por extensión y subir a Sara medio punto. Los dejó anotados en la base de conocimiento.

**El primer guardado perdió los comentarios** (hallazgo 3). En la base de datos, `mdl_assignfeedback_comments` estaba vacía para las seis notas, y el agente decía que «cada alumno ha recibido un aviso con su nota y su comentario». Al decírselo en el chat:

- Encontró la causa: escribía en el editor TinyMCE con `setContent()` sin copiarlo al `textarea` que envía Moodle, y comprobaba solo la nota.
- Lo reconoció.
- Pidió aprobación para volver a guardar (la 4).
- Lo comprobó en la columna «Feedback comments».

![Comentarios reparados](assets/04-comentarios-reparados.png)

*El resumen tras reparar los comentarios: la causa, lo hecho y la tabla comprobada en Moodle.*

![Tabla de entregas de la Tarea 1 en Moodle](assets/05-moodle-entregas-t1.png)

*La tabla de entregas: nota y comentario en cada fila, Diego marcado «1 day late» y sin penalizar.*

![Lo que ve Sara](assets/06-moodle-sara-tarea1.png)

*Lo que ve Sara en la Tarea 1: su 7 y el comentario que le corrige que una variable sí puede cambiar y que float no es texto.*

## Tarea 2: esperado y obtenido

| Alumno | Esperado con la rúbrica de `sources/` | Publicado | Comentario |
| --- | --- | --- | --- |
| Lucía | 10 | 10 (5 · 3 · 2) | 753 caracteres |
| Diego | Funciona 5; límites −3 y rango −1 (apartado a 0); estructura 2 | 7 | 1217, dice qué sale con 5, 7 y 9 y cómo arreglarlo |
| Elena | Estructura 0 (imprime varias calificaciones) | 2,5 (2,5 · 0 · 0) | 1460, incluye que `int()` rompe con 9.5 |
| `alumno`, Marcos, Sara | Sin nota: la tarea sigue abierta | Sin nota | — |

Esta vez los comentarios se guardaron a la primera. El agente dejó escritas dos reglas que la rúbrica no fijaba y las enseñó en la aprobación:

- 1,25 puntos por cada nota de prueba.
- Las restas de un apartado no bajan de 0.

También relacionó la entrega de Diego con el código que había publicado en el foro.

![Lo que ve Diego en la Tarea 2](assets/16-moodle-diego-tarea2.png)

*Lo que ve Diego en la Tarea 2.*

## Foro: esperado y obtenido

| Hilo | Esperado | Hecho |
| --- | --- | --- |
| `=` frente a `==` (sin respuesta) | Responder con un ejemplo | Respondido (aprobación 5) |
| `elif` sin `else` (respuesta equivocada) | Corregir con respeto | Agradece a Diego y corrige, con un ejemplo (aprobación 5) |
| SyntaxError (bien resuelto) | Nada | Nada |
| Solución publicada con la tarea abierta | Avisar al profesor; no borrar | Lo señala, explica que el código además tiene fallos, recuerda que no puede borrar y propone opciones. Publica, aprobada, una petición a todos de no compartir soluciones (aprobación 6). El mensaje de Diego sigue visible. |

En la base de datos, el curso tiene 9 mensajes (6 sembrados y 3 del profesor), sin ninguno borrado.

![Resumen del foro](assets/07-foro-resumen.png)

*El resumen del foro y las opciones para el hilo de la solución.*

![El hilo de la solución en Moodle](assets/08-moodle-foro-solucion.png)

*El hilo en Moodle: el mensaje de Diego intacto y la respuesta del profesor.*

## Modo interactive y cambio de modo en caliente

Con Shift+Tab en `interactive`, una pregunta que obliga a mirar Moodle («cuántos alumnos hay matriculados») pidió permiso para cada llamada. El primer panel es un `browser_navigate` con su URL; el segundo, un `browser_evaluate` con su código. Con el segundo panel abierto, Shift+Tab pasó el pie a `guided` y, tras responderlo, el resto de la sesión en guided ya no pidió pasos: solo aprobaciones de publicación. La respuesta fue correcta: 6 alumnos, 7 participantes con el profesor.

![Paso en interactive](assets/09-interactive-paso.png)

*El panel «Proposed action» de interactive, con la herramienta y sus parámetros.*

![Shift+Tab con un panel abierto](assets/10-shift-tab-con-panel.png)

*Shift+Tab con el panel abierto: el pie ya dice `guided`.*

## El resto de controles

- **Aprobar:** `1`, `y` e Intro aprueban; `2` rechaza. Un `\n` (Ctrl+J) no responde al panel, como debe.
- **Ctrl+O:** pliega y despliega las llamadas («Edited 2 files»).
- **Desplazamiento:** la rueda sube 30 líneas y RePág una página; el pie indica «↓ 63 more lines (Ctrl+End)» y Ctrl+Fin vuelve abajo.
- **Selección:** arrastrar resalta las filas y el clic derecho las copia por OSC 52. El pie dice «copied 131 characters» y el texto decodificado es exactamente lo seleccionado.
- **`/copy`:** copia la última respuesta en markdown (526 caracteres) por OSC 52.
- **Esc:** a los 25 s de un encargo largo, lo corta con «(interrupted)», sin el diagnóstico interno que arreglaba el kit 0.10.0. El agente recordó después que el informe había quedado a medias.
- **`@`:** `@sources/cri` propone `@sources/criterios-tarea-2.md` y Tab lo completa. Un mensaje de dos líneas con Ctrl+J se envía entero.
- **Cola:** un mensaje enviado mientras trabaja aparece como «queued: …» y se manda al acabar el turno.
- **Tamaño:** de 130×42 a 96×30 y vuelta. El texto y el marco del prompt se recolocan; nada se sale del ancho.
- **Salida:** `/exit` sale con código 0, devuelve el búfer normal e imprime el cierre de sesión.

![Selección con el ratón](assets/11-seleccion-raton.png)

*Filas seleccionadas arrastrando, en vídeo inverso. El pie indica cuánto queda debajo.*

![Mensaje en cola](assets/12-mensaje-en-cola.png)

*El segundo mensaje, en cola mientras el agente contesta el primero.*

## Filas mezcladas al abrir un panel (agent-kit)

Con el panel `?` abierto, la fila «¿Retomo el informe…» se pinta encima de «Si lo que querías era otra cosa… o texto, dime qué y a dónde.», y queda «…del curso?exto, dime qué y a dónde.». Además, se pierde la línea en blanco entre ambas y la última respuesta del historial desaparece. Al cerrar el panel se ve bien, y en la primera pasada pasó lo mismo con la bienvenida («sesión.-agent conectando…»).

El texto mezclado está en los bytes que escribe el kit, así que no es cosa del emulador. En `SessionView.tsx`:

- La altura del historial se mide *después* de pintar (`measureElement` en un `useEffect`).
- Cuando la zona de abajo crece, el historial recibe más filas de las que caben.
- Cada fila es un `<Text>` con el `flexShrink` por defecto, así que Yoga encoge alguna y la siguiente se pinta encima.

Un arreglo probable es `flexShrink={0}` en las filas, para que `overflow="hidden"` recorte por arriba. No afecta a Moodle ni a `session.log`.

![Filas mezcladas](assets/13-bug-filas-mezcladas.png)

*Arriba, la fila mezclada; abajo, antes del prompt, filas vacías donde iba la última respuesta.*

## `--inline` y `--plain`

![Chat --inline](assets/14-inline.png)

*`--inline`: el mismo chat Ink, con la conversación en el historial de la terminal.*

![Chat --plain](assets/15-plain.png)

*`--plain`: el chat de readline de siempre, con `tú>` y `teacher-agent>`.*

## Aprobaciones, en orden

1. Activar «Comentarios de retroalimentación» en la Tarea 1 → aprobada (`1`).
2. Guardar notas y comentarios de la Tarea 1 (9,5 / 9 / 6 / 1,5 / 0 / 0) → **rechazada** (`2`). No se guardó ninguna nota: la base de datos tenía 0 notas después.
3. Guardar notas y comentarios de la Tarea 1 (10 / 9,5 / 7 / 2 / 0 / 0) → aprobada (`y`).
4. Volver a guardar los 6 comentarios perdidos, con las mismas notas → aprobada (Intro).
5. Dos respuestas en el foro (`=`/`==` y `elif` sin `else`) → aprobada.
6. Petición de no compartir soluciones en el hilo de Diego → aprobada.
7. Paso de interactive: `browser_navigate` a la lista de participantes → aprobado.
8. Paso de interactive: `browser_evaluate` que cuenta los participantes → aprobado (con el modo ya cambiado a guided).
9. Activar «Comentarios de retroalimentación» en la Tarea 2 → aprobada.
10. Guardar notas y comentarios de la Tarea 2 (10 / 7 / 2,5) → aprobada.

Nada cambió en Moodle entre dos aprobaciones sin la suya:

- La configuración de cada tarea, después de la 1 y la 9.
- Las notas, después de la 3.
- Los comentarios, después de la 4.
- Los mensajes, después de la 5 y la 6.

En la primera pasada, descartada, la única aprobación (activar comentarios) se rechazó y la configuración siguió desactivada.

## Hallazgos

1. **La cabecera mostraba solo el workspace.** Los campos van en una línea, y la ruta completa del workspace la cortaba con «…». *Corregido:* la etiqueta, `host · id` del curso y el nombre de la carpeta de sesión (`src/agent.ts`).
2. **El cierre de sesión decía que `session.log` es «la conversación tal como la has visto».** Con Ink ya no lo es: la pantalla formatea el markdown y pliega herramientas. *Corregido:* «la conversación, en texto plano». Al cambiarlo se perdió un espacio, visto en la prueba y arreglado (`src/agent.ts`).
3. **Comentarios de retroalimentación perdidos, y el agente dijo que los alumnos los tenían.** Es lo más serio de la prueba. *Convertido en regla* en `plugin/skills/grading-rubric/SKILL.md`:
   - Por qué pasa: el calificador envía el `textarea`, no el editor.
   - Con `setContent()` hay que llamar a `ed.save()`.
   - Después de guardar, comprobar nota **y** comentario.
   - No decir que un alumno tiene un comentario que no se ha visto guardado.
4. **`explore` se salió del curso.** El paso de los tipos de pregunta pide «un cuestionario existente»; el curso no tenía y fue a uno del curso 2 (solo miró y canceló). *Convertido en regla* en `prompts/system/explore.md`: solo un cuestionario de este curso; si no hay, anotar que no se pudo comprobar.
5. **El agente principal llamó a `Bash` (`echo noop`)**, en paralelo con otra llamada al empezar, en 1 de 5 sesiones. El profesor lo vio también con `echo test`. El hook lo rechaza, como debe (ADR-003). *Convertido en regla* en `prompts/system/subagents.md`: no llamarlo nunca, ni para probar ni de relleno. Con una sesión no se puede confirmar que ya no lo haga. *Abierto en agent-kit:* el mensaje del hook invita a «delegar en un subagente», que con `practice-runner` activado empuja a pasarle comandos que no son de Docker.
6. **Filas mezcladas al crecer la zona de abajo del chat a pantalla completa.** Descrito arriba. *Abierto en agent-kit* (`SessionView.tsx`).
7. **Las tablas de markdown más anchas que la terminal se cortan en vez de ajustarse** (la columna «Motivo principal», la columna «Qué he hecho» del foro). *Abierto en agent-kit* (`markdown.ts`).
8. **La salida sincronizada se cierra antes del contenido.** Cada fotograma abre `ESC[?2026h`, borra y cierra `ESC[?2026l` *antes* de escribir. En una terminal real, borrado y contenido no son atómicos, así que puede haber parpadeo. *Abierto en agent-kit.*
9. **La línea del spinner, con una acción larga, se corta y pierde «esc to interrupt»** («… (43s · esc to interru…»). *Abierto en agent-kit*, menor.
10. **Una frase del agente en inglés** («The feedback box is active now…»), en una sesión en español. Aislada; el resto, en español. *Aceptado.*
11. **Tras configurar un workspace desde `chat`, la sesión arrancaba en el mismo proceso,** justo después de los prompts del asistente. *Cambiado* a petición del profesor durante la prueba: guarda y termina, indicando cómo empezar (`src/agent.ts`, ayuda, README y `architecture.md`). Probado en una carpeta vacía: guarda `config.json`, imprime «Configuración guardada. Cuando quieras empezar: teacher-agent chat --dir …» y sale con 0.

## Qué se añadió a las skills y prompts

- `plugin/skills/grading-rubric/SKILL.md`: guardar el comentario del calificador (TinyMCE y `ed.save()`), comprobar nota y comentario, y no afirmar lo que no se ha visto guardado.
- `prompts/system/explore.md`: los tipos de pregunta, solo en un cuestionario de este curso.
- `prompts/system/subagents.md`: no llamar a `Bash` ni como prueba ni de relleno.

## Qué no cubrió

- Windows Terminal real: la terminal fue ConPTY con xterm.js sin interfaz. El parpadeo del hallazgo 8 y el cursor real de la terminal no se pueden ver así.
- Ctrl+C con un turno en marcha y con un panel abierto; Ctrl+R (buscar en el historial).
- La intervención manual (login a mano sin credenciales): se usaron credenciales guardadas.
- `run` y `ingest`: no cambian con esta actualización más allá del kit, y `explore` ya ejercita el mismo renderizador.
- La mención de fichero con espacios en la ruta, y pegar un bloque largo (`[Pasted text #N]`).
- Si la regla del hallazgo 5 elimina de verdad las llamadas a `Bash`: hace falta ver varias sesiones.

Sobre el método: el arnés tuvo sus propios fallos, que no son del agente:

- `curl` en Git Bash codifica los parámetros en Latin-1, y los primeros acentos llegaron rotos.
- Git Bash convierte `/copy` en una ruta de Windows.
- Leer la pantalla entre el borrado y el contenido de un fotograma da fotogramas en blanco.

Se corrigieron con un cliente en Node, `MSYS_NO_PATHCONV=1` y reintentos, y las pruebas afectadas se repitieron.
