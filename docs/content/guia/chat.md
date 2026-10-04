---
title: El chat
sidebar_position: 4
description: "Cómo conversar con miyagi: aprobar o rechazar lo que publica, pedirle un plan antes de que actúe, interrumpirlo, retomar una conversación y usar los atajos."
---

# El chat

`miyagi chat` es la forma más cómoda de trabajar con el asistente: le pides las cosas con tus palabras y él te va enseñando lo que hace. Ábrelo siempre desde la carpeta del curso (o con `miyagi chat --dir <carpeta>` desde cualquier sitio).

## El chat en un minuto

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

## Cómo te pide permiso

Antes de guardar una nota, responder en el foro, publicar contenido o cambiar la configuración de una actividad, te muestra un panel con un resumen de lo que va a publicar y tres opciones: **Sí**, **No** y **Parar**.

- **Sí** (Intro, `1` o `y`): lo publica.
- **No** (`2` o `n`): no lo publica. Explícale por qué en tu siguiente mensaje; lo tiene en cuenta, por ejemplo, para el resto de notas de la misma tarea.
- **Parar** (`3`): detiene lo que estaba haciendo.

Una sola aprobación puede cubrir un lote (por ejemplo, seis notas), pero solo si el resumen enumera cada una con lo que se va a publicar.

Y no depende solo de que se acuerde de preguntar: si intenta pulsar un botón de publicar de Moodle sin haberte pedido permiso, el propio programa lo detiene y te pregunta. Lo tienes explicado a fondo en [Aprobaciones y borradores](../avanzado/aprobaciones-y-borradores.md).

## Tres formas de trabajar con él

El chat empieza siempre en modo **guided**: trabaja solo y te pide permiso únicamente antes de publicar algo que verán tus estudiantes.

Si quieres ver cómo trabaja paso a paso, pulsa `Shift+Tab`: pasa a modo **interactive** y te consultará antes de cada acción, aunque solo sea abrir una página.

Púlsalo otra vez y pasa a modo **plan**: lee tus documentos y sus apuntes, busca en internet si hace falta y te prepara un plan, sin cambiar nada y sin abrir Moodle. Cuando lo tiene, te lo enseña y eliges:

- **Ejecutarlo**: vuelve al modo de antes y se pone a ello.
- **Seguir planificando**: dile qué cambiar y te presenta otro.
- **Cancelar**: no hace nada y te pregunta qué prefieres.

Es útil antes de un encargo grande, como construir un tema entero. También puedes escribir `/plan` para entrar en el modo plan, y otra vez `/plan` para salir. Un tercer `Shift+Tab` te devuelve a guided.

## Lo que verás mientras trabaja

- **Su lista de tareas.** En un trabajo largo, encima de la caja de texto aparece la lista de lo que va a hacer: `☐` pendiente, `◼` en curso, `☑` hecho. Desaparece cuando lo ha terminado todo.
- **Preguntas con opciones.** Cuando necesita que decidas algo (cuántas sesiones dar a un tema, qué enfoque seguir), te muestra las opciones en un panel. Elige con las flechas y pulsa Intro; si te deja marcar varias, márcalas con la barra espaciadora. La última opción, «Otra», te deja escribir tu propia respuesta.
- **Fechas correctas.** Las fechas que apunta y los plazos que calcula salen del reloj de tu ordenador, no de lo que el modelo cree que es hoy.

## Interrumpir y retomar

- **`Esc`** corta lo que está haciendo sin cerrar el chat. Después dile qué hacer en su lugar.
- **`/exit`** cierra la sesión. No hay nada que guardar: todo se escribe en disco sobre la marcha. Al salir te dice dónde quedan la conversación y sus apuntes y, si ha dejado algo oculto en Moodle sin mostrar a los alumnos, te lo recuerda.
- **`miyagi chat --continue`** abre el chat con la última conversación de ese curso: recuerda lo que hablasteis.
- **`/resume`** dentro del chat te deja elegir cualquier conversación anterior del curso.

Aunque empieces una conversación nueva, el asistente no parte de cero: lee sus [apuntes del curso](memoria.md) al empezar.

## Atajos

Son instrucciones listas para usar. Escríbelos en el chat, con lo que necesites detrás.

| Atajo | Para qué |
| --- | --- |
| `/miyagi:orient` | Conocer el aula: evaluación, plazos y canales de comunicación |
| `/miyagi:grade` | Corregir las entregas pendientes con un criterio justo y coherente |
| `/miyagi:forum` | Revisar el foro y decidir si hace falta que intervenga el profesor |
| `/miyagi:progress` | Ver cómo va la clase y quién se queda atrás |
| `/miyagi:quiz <tema>` | Crear un cuestionario sobre ese tema, o añadirle preguntas |
| `/miyagi:build-unit <descripción>` | Construir un tema dentro del curso |
| `/miyagi:build-course <descripción>` | Construir un curso completo |
| `/miyagi:teaching-plan` | Escribir o revisar la programación didáctica |
| `/miyagi:align` | Comprobar que el aula sigue la programación y corregir lo que no |
| `/miyagi:audit` | Auditar el aula y proponer mejoras por prioridad |
| `/miyagi:research <tema>` | Investigar un tema en internet y guardar lo encontrado con sus fuentes |
| `/miyagi:map` | Ver las direcciones del curso que tiene apuntadas |
| `/knowledge:ingest` | Incorporar a sus apuntes los documentos nuevos de `sources` |
| `/knowledge:query <pregunta>` | Responder a partir de sus apuntes, sin abrir Moodle |
| `/knowledge:lint` | Revisar que sus apuntes estén completos y bien enlazados |

Los atajos son solo comodidad: *«corrige lo pendiente»* funciona igual que `/miyagi:grade`. Para verlos desde la terminal, `miyagi commands`. También puedes crear [atajos propios](../avanzado/atajos-e-instrucciones.md).

## Si no quieres pantalla completa

- `miyagi chat --inline` deja la conversación en el historial normal de la terminal, en lugar de ocupar toda la ventana.
- `miyagi chat --plain` usa un chat de texto simple, sin paneles.
- `miyagi chat --headless` trabaja sin mostrar la ventana de Chrome. Necesita tu usuario y contraseña guardados.
