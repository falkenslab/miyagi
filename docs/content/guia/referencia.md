---
title: Referencia
sidebar_position: 11
description: "Todas las órdenes de miyagi, sus opciones y los atajos del chat, de un vistazo."
---

# Referencia

## Órdenes

| Orden | Qué hace |
| --- | --- |
| `miyagi init` | Prepara una carpeta nueva para un curso (las preguntas de [Primeros pasos](primeros-pasos.md)) y ofrece explorar tu Moodle. |
| `miyagi chat` | Conversación con el asistente a pantalla completa, siempre pidiendo permiso antes de publicar. |
| `miyagi run` | Recorre el curso entero de una sentada: corrige, atiende el foro, revisa el contenido y resume cómo va la clase. |
| `miyagi run --task "…"` | Hace solo el encargo que le indicas, con las mismas reglas. |
| `miyagi explore` | Mira, sin crear nada, qué tipos de actividad y de pregunta admite tu Moodle y lo apunta. |
| `miyagi ingest` | Incorpora a sus apuntes los documentos de `sources` que aún no tenía, sin abrir Moodle. |
| `miyagi ingest <archivos…>` | Incorpora solo esos documentos. |
| `miyagi skills` | Lista sus habilidades, incluidas las tuyas (marcadas `[propia]`). |
| `miyagi commands` | Lista los atajos del chat, incluidos los tuyos. |
| `miyagi --help` | Muestra la ayuda con todas las órdenes y opciones. |
| `miyagi --version` | Muestra la versión instalada. |

Sin ninguna orden (`miyagi` a secas), te pregunta si quieres `run` o `chat`. Si la carpeta aún no es un curso, primero te hace las preguntas de `init`, guarda la configuración y termina: vuelve a lanzarlo para empezar.

## Opciones

| Opción | Para qué | En qué órdenes |
| --- | --- | --- |
| `--dir <carpeta>` | Trabajar con el curso de esa carpeta sin entrar en ella | Todas |
| `--language=<código>` | Idioma de los menús y avisos: `es`, `en`, `fr` o `de` | Todas |
| `--headless` | Trabajar sin mostrar la ventana de Chrome (necesita usuario y contraseña guardados) | `chat`, `run`, `explore` |
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
| `/miyagi:map` | Muestra las direcciones del curso que tiene apuntadas. |
| `/knowledge:ingest` | Incorpora a sus apuntes lo que haya en `sources` sin procesar. |
| `/knowledge:query <pregunta>` | Responde a partir de sus apuntes del curso. |
| `/knowledge:lint` | Revisa que sus apuntes estén completos y bien enlazados. |
| `/resume` | Elige una conversación anterior para retomarla. |
| `/copy` | Copia su última respuesta. |
| `/exit` | Cierra la sesión. |

Las teclas del chat (aprobar, rechazar, interrumpir, cambiar de modo) están en [El chat](chat.md).
