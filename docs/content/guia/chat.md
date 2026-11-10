---
title: La conversación
sidebar_position: 8
description: "Cómo conversar con miyagi en la aplicación, en la web y en la terminal: aprobar o rechazar lo que publica, pedirle un plan antes de que actúe, interrumpirlo, retomar una conversación y usar los atajos."
---

# La conversación

Le pides las cosas con tus palabras y él te va enseñando lo que hace. La conversación funciona igual en las tres versiones: en la [aplicación de escritorio](escritorio.md#chat) y en la [versión web](web.md) la tienes en la página, y en la terminal con `miyagi chat`. Esta página cuenta primero la aplicación; las teclas de la terminal están al final.

## Pedirle algo

Escribe en el cuadro y pulsa `Intro`. `Mayús+Intro` salta de línea. Con **+** añades un archivo a tus fuentes o eliges una acción del catálogo, y con **/** ves los atajos.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-chat.webp" alt="Una conversación en la aplicación: la petición y miyagi trabajando, con sus acciones plegadas en líneas tenues.">Una conversación en la aplicación.</Shot>

Mientras trabaja, ves qué está haciendo en cada momento y sus tareas encima del cuadro. La pestaña **Actividad** del [panel lateral](escritorio.md#panel-lateral) lo cuenta paso a paso.

En la aplicación y en la web puedes **escribirle mientras trabaja**: una pregunta, una corrección o «eso no, haz esto otro». Tu mensaje sale **en cola** hasta que lo lee, en cuanto termina la acción en curso, y lo tiene en cuenta sin parar lo que estaba haciendo. Si está esperando a un subagente, lo lee cuando este acaba. Los comandos (`/…`) esperan a que termine. Para que cambie de rumbo ya, páralo con `Esc` o con el botón ■. En la terminal hay que esperar a que acabe o pararlo.

Bajo cada cosa que hace en Moodle tienes **Ver en el aula**, que abre esa misma página del curso: en la aplicación, en una pestaña del [navegador integrado](escritorio.md#navegador-integrado); en la web, en una pestaña nueva de tu navegador. La abres con tu propia sesión de Moodle, y miyagi no recibe nada de ese enlace.

## Cómo te pide permiso {#permiso}

Antes de guardar una nota, responder en el foro, publicar contenido o cambiar la configuración de una actividad, la aprobación ocupa el sitio del cuadro para escribir, con un resumen de lo que va a publicar y tres botones: **Aprobar**, **Rechazar** y **Parar todo**.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-aprobacion-nota.webp" alt="El panel de aprobación para guardar una nota: la rúbrica y el comentario para el alias A-Z63WCA, con los botones Parar todo, Rechazar y Aprobar.">La aprobación de una nota: el resumen dice exactamente qué se va a guardar.</Shot>

- **Aprobar**: lo publica.
- **Rechazar**: no lo publica. Explícale por qué en tu siguiente mensaje; lo tiene en cuenta, por ejemplo, para el resto de notas de la misma tarea.
- **Parar todo**: detiene lo que estaba haciendo.

Una sola aprobación puede cubrir un lote (por ejemplo, seis notas), pero solo si el resumen enumera cada una con lo que se va a publicar.

Y no depende solo de que se acuerde de preguntar: si intenta cambiar algo en Moodle sin haberte pedido permiso, el propio programa lo detiene y te pregunta. Para borrar, quitar o restaurar algo te pregunta siempre otra vez. Lo tienes explicado a fondo en [Aprobaciones y borradores](/avanzado/aprobaciones-y-borradores/).

## Tres formas de trabajar con él {#modos}

El selector de modo está junto al cuadro para escribir, y también se cambia con `Mayús+Tab`.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-modo.webp" alt="El selector de modo abierto: Guiado, Interactivo y Plan, con su descripción.">El selector de modo.</Shot>

- **Guiado**: trabaja solo y te pide permiso únicamente antes de publicar algo que verán tus estudiantes. Es el modo con el que empieza siempre.
- **Interactivo**: te consulta antes de cada acción, aunque solo sea leer algo en Moodle.
- **Plan**: lee tus documentos y sus apuntes, busca en internet si hace falta y te prepara un plan, sin cambiar nada y sin abrir Moodle. Cuando lo tiene, te lo enseña y eliges **ejecutarlo**, **seguir planificando** o **cancelar**. Es útil antes de un encargo grande, como construir un tema entero.

## Lo que verás mientras trabaja

- **Su lista de tareas.** En un trabajo largo, encima del cuadro aparece la lista de lo que va a hacer.
- **Preguntas con opciones.** Cuando necesita que decidas algo (cuántas sesiones dar a un tema, qué enfoque seguir), te muestra las opciones en el sitio del cuadro. La última, «Otra», te deja escribir tu propia respuesta.
- **Fechas correctas.** Las fechas que apunta y los plazos que calcula salen del reloj de tu ordenador, no de lo que el modelo cree que es hoy.

## Interrumpir y retomar

- **`Esc`** o el botón **■** cortan lo que está haciendo sin cerrar la conversación. Después dile qué hacer en su lugar.
- Para salir **no hay nada que guardar**: todo se escribe sobre la marcha. Si ha dejado algo oculto en Moodle sin mostrar a los alumnos, sigue en **En el horno**, y te lo recuerda la campana.
- En la aplicación y en la web, cualquier conversación anterior está en la columna de conversaciones, y **Buscar conversaciones** las encuentra por una palabra.

Aunque empieces una conversación nueva, el asistente no parte de cero: lee sus [apuntes del curso](memoria.md) al empezar.

Si una conversación no arranca en cinco minutos, se reabre sola y te avisa.

## Atajos {#atajos}

Son instrucciones listas para usar. Escríbelos con lo que necesites detrás, en cualquiera de las versiones. En la aplicación y en la web, escribe `/` en el cuadro vacío.

| Atajo | Para qué |
| --- | --- |
| `/miyagi:orient` | Conocer el aula: evaluación, plazos y canales de comunicación |
| `/miyagi:grade` | Corregir las entregas pendientes con un criterio justo y coherente |
| `/miyagi:forum` | Revisar el foro y decidir si hace falta que intervenga el profesor |
| `/miyagi:progress` | Ver cómo va la clase y quién se queda atrás |
| `/miyagi:quiz <tema>` | Crear un cuestionario sobre ese tema, o añadirle preguntas |
| `/miyagi:exam <cuestionario>` | Imprimir un cuestionario como examen en papel, en varias versiones |
| `/miyagi:publish <material o tema>` | Publicar en el aula materiales o un tema entero de `materials/` |
| `/miyagi:build-unit <descripción>` | Construir un tema dentro del curso |
| `/miyagi:build-course <descripción>` | Construir un curso completo |
| `/miyagi:teaching-plan` | Escribir o revisar la programación didáctica |
| `/miyagi:align` | Comprobar que el aula sigue la programación y corregir lo que no |
| `/miyagi:audit` | Auditar el aula y proponer mejoras por prioridad |
| `/miyagi:research <tema>` | Investigar un tema en internet y guardar lo encontrado con sus fuentes |
| `/miyagi:map` | Ver dónde está cada sección y actividad del curso: su número y su enlace |
| `/miyagi:new-command <qué debe hacer>` | Crear un comando propio con formulario |
| `/knowledge:ingest` | Incorporar a sus apuntes los documentos nuevos de `sources` |
| `/knowledge:query <pregunta>` | Responder a partir de sus apuntes, sin abrir Moodle |
| `/knowledge:lint` | Revisar que sus apuntes estén completos y bien enlazados |

Los atajos son solo comodidad: *«corrige lo pendiente»* funciona igual que `/miyagi:grade`. Para verlos desde la terminal, `miyagi commands`. También puedes crear [atajos propios](/avanzado/atajos-e-instrucciones/).

## En la terminal {#terminal}

El chat de la terminal es `miyagi chat`. Ábrelo con el nombre de tu asignatura, `miyagi chat -w <nombre>`, desde cualquier sitio (o sin `-w`, dentro de su carpeta).

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-chat.webp" alt="El chat de miyagi en la terminal, con una respuesta en forma de tabla y el modo guiado en la barra inferior.">El chat en la terminal.</Shot>

| Qué quieres | Qué haces |
| --- | --- |
| Pedirle algo | Escríbelo con tus palabras y pulsa Intro |
| Escribir en varias líneas | `\` y luego Intro, o `Ctrl+J` |
| Aprobar lo que va a publicar | Intro, `1` o `y` |
| Rechazarlo | `2` o `n`, y dile qué cambiar |
| Pararlo todo en una aprobación | `3` (Parar) |
| Cortar lo que está haciendo sin salir | `Esc` |
| Que te consulte cada paso, no solo lo que publica | `Shift+Tab` (pasa de guided a interactive) |
| Que primero te proponga un plan, sin cambiar nada | `/plan`, o `Shift+Tab` hasta llegar a plan |
| Ver lo que ya ha salido de pantalla | Rueda del ratón o `RePág`/`AvPág` |
| Copiar texto | Arrástralo con el ratón y haz clic derecho |
| Copiar su última respuesta | `/copy` |
| Resumir en una línea las herramientas que ha usado, o volver a verlas una a una | `Ctrl+O` |
| Mencionar un archivo de la carpeta del curso | `@` y el nombre del archivo |
| Recuperar un mensaje que ya escribiste | Flechas arriba y abajo, o `Ctrl+R` para buscar |
| Ver todos los atajos de teclado | `?` con el mensaje vacío |
| Salir | `/exit` (todo se guarda solo) |
| Seguir la última conversación | `miyagi chat --continue` |
| Elegir una conversación anterior | `/resume` dentro del chat |

En la terminal el panel de permiso dice **Sí** (Intro, `1` o `y`), **No** (`2` o `n`) y **Parar** (`3`), y los modos son `guided`, `interactive` y `plan`: `Shift+Tab` pasa de uno a otro.

`/exit` cierra la sesión. Al salir te dice dónde quedan la conversación y sus apuntes y, si ha dejado algo oculto en Moodle sin mostrar a los alumnos, te lo recuerda.

Si no quieres pantalla completa:

- `miyagi chat --inline` deja la conversación en el historial normal de la terminal, en lugar de ocupar toda la ventana.
- `miyagi chat --plain` usa un chat de texto simple, sin paneles.
