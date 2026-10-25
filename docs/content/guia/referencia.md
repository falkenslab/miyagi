---
title: Referencia
sidebar_position: 11
description: "Todas las órdenes de miyagi, sus opciones y los atajos del chat, de un vistazo."
---

# Referencia

## Órdenes

| Orden | Qué hace |
| --- | --- |
| `miyagi init` | Prepara una asignatura nueva (las preguntas de [Primeros pasos](primeros-pasos.md)) en la carpeta de miyagi, o en la de `--dir`, con o sin aula Moodle, y ofrece explorar tu Moodle si la conectas. Con `-w` en una asignatura sin aula, te ofrece conectarla; en una que ya la tiene, la vuelve a conectar. |
| `miyagi chat` | Conversación con el asistente a pantalla completa, siempre pidiendo permiso antes de publicar. |
| `miyagi run` | Recorre el curso entero de una sentada: corrige, atiende el foro, revisa el contenido y resume cómo va la clase. |
| `miyagi run --task "…"` | Hace solo el encargo que le indicas, con las mismas reglas. |
| `miyagi explore` | Mira, sin crear nada, qué tipos de actividad y de pregunta ve en tu curso y cómo se calculan las notas, y lo apunta. Sin aula conectada, te avisa y no hace nada. |
| `miyagi ingest` | Incorpora a sus apuntes los documentos de `sources` que aún no tenía, sin abrir Moodle. |
| `miyagi ingest <archivos…>` | Incorpora solo esos documentos. |
| `miyagi skills` | Lista sus habilidades, incluidas las tuyas (marcadas `[propia]`). |
| `miyagi commands` | Lista los atajos del chat, incluidos los tuyos. |
| `miyagi web` | El chat de miyagi en tu navegador, solo en tu ordenador. Muestra una dirección con su llave: ábrela y no la compartas (ver [miyagi en el navegador](../avanzado/navegador.md)). |
| `miyagi workspaces` | Lista tus asignaturas, con el nombre para `-w` y su carpeta. Marca las que ya no encuentra. |
| `miyagi workspaces forget <nombre>` | Quita una asignatura de la lista. Su carpeta no se toca. |
| `miyagi extension …` | Instala, configura, activa o quita [extensiones](../avanzado/extensiones.md): `search`, `add`, `list`, `config`, `enable`, `disable`, `update`, `remove`. |
| `miyagi --help` | Muestra la ayuda con todas las órdenes y opciones. |
| `miyagi --version` | Muestra la versión instalada. |

Sin ninguna orden (`miyagi` a secas), te pregunta si quieres `run` o `chat` y, si no estás dentro de la carpeta de una asignatura, con cuál de tu lista. Si eliges una nueva, te hace las preguntas de `init`, la guarda y termina: vuelve a lanzarlo para empezar.

## Opciones

| Opción | Para qué | En qué órdenes |
| --- | --- | --- |
| `-w <nombre>`, `--workspace <nombre>` | Trabajar con esa asignatura de tu lista, desde cualquier carpeta | Todas |
| `--dir <carpeta>` | Trabajar con la asignatura de esa carpeta, o crearla ahí con `init` | Todas |
| `--language=<código>` | Idioma de los menús y avisos: `es`, `en`, `fr` o `de` | Todas |
| `--plain` | Texto simple, sin pantalla completa, paneles ni animaciones | `chat`, `run`, `explore`, `ingest` |
| `--inline` | El chat en el historial normal de la terminal, sin ocupar toda la ventana | `chat` |
| `--continue` | Retomar la última conversación del curso | `chat` |
| `--mode <modo>` | Elegir el modo sin que te lo pregunte: `guided`, `interactive` o `autonomous` | `run` |
| `--task "<encargo>"` | Hacer solo ese encargo en lugar de recorrer el curso entero | `run` |

## Atajos del chat

| Atajo | Qué hace |
| --- | --- |
| `/miyagi:orient` | Se orienta en el curso: evaluación, plazos y canales de comunicación. |
| `/miyagi:grade` | Corrige las entregas pendientes con un criterio justo y coherente. |
| `/miyagi:forum` | Revisa el foro y decide si hace falta que intervenga el profesor. |
| `/miyagi:progress` | Revisa cómo va la clase y quién se está quedando atrás. |
| `/miyagi:quiz <tema>` | Crea un cuestionario sobre ese tema (o le añade preguntas), con las preguntas importadas de golpe. |
| `/miyagi:build-unit <descripción>` | Construye un tema dentro del curso, encajado en su programación, su calendario y su estilo. |
| `/miyagi:build-course <descripción>` | Construye un curso completo: planifica, crea cada sección y lo revisa como lo vería un alumno. |
| `/miyagi:teaching-plan` | Escribe o revisa tu programación didáctica a partir de tu material y tus decisiones. |
| `/miyagi:align` | Comprueba si el aula está acorde con tu programación y corrige lo que no. |
| `/miyagi:audit` | Auditoría completa del curso con recomendaciones priorizadas. |
| `/miyagi:research <tema>` | Investiga un tema en internet y guarda lo que encuentra con sus fuentes. |
| `/miyagi:map` | Muestra dónde está cada sección y actividad del curso: su número y su enlace. |
| `/knowledge:ingest` | Incorpora a sus apuntes lo que haya en `sources` sin procesar. |
| `/knowledge:query <pregunta>` | Responde a partir de sus apuntes del curso. |
| `/knowledge:lint` | Revisa que sus apuntes estén completos y bien enlazados. |
| `/plan` | Entra en el modo plan (te propone un plan sin cambiar nada) o, si ya estás en él, vuelve al modo de antes. |
| `/resume` | Elige una conversación anterior para retomarla. |
| `/extensions` | Muestra con qué extensiones trabaja la sesión, y las activa o desactiva. |
| `/copy` | Copia su última respuesta. |
| `/exit` | Cierra la sesión. |

Las teclas del chat (aprobar, rechazar, interrumpir, cambiar de modo) están en [El chat](chat.md).
