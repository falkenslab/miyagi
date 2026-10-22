---
title: Sesiones y modos
sidebar_position: 8
description: "Los cuatro tipos de sesión (chat, run, ingest, explore), los modos de supervisión y el modo plan, cómo se retoma un chat y qué queda guardado en sessions/."
---

# Sesiones y modos

## Tipos de sesión

Cada orden abre un tipo de sesión, con sus propias instrucciones de sistema ([`prompts/system/`](https://github.com/falkenslab/miyagi/tree/main/prompts/system)) y sus propias herramientas:

| Sesión | Para qué | Moodle | Modo |
| --- | --- | --- | --- |
| `chat` | Conversación, a pantalla completa por defecto, que se puede retomar | Sí, con moodle-teacher cuando hace falta | Empieza en `guided`; `Shift+Tab` pasa a `interactive` y a `plan` |
| `run` | Una pasada por todo el curso, o el encargo de `--task` | Sí, con moodle-teacher | El de `--mode`, o lo pregunta (sin terminal interactiva, `guided`) |
| `ingest` | Incorporar documentos de `sources/` a la base de conocimiento | No | No publica nada: no pregunta |
| `explore` | Apuntar qué tipos de actividad y de pregunta admite tu Moodle (solo con aula) | Sí, solo para leer | `guided`, como mucho 80 turnos |

Sin aula conectada (sin `classroom` en `config.json`), ninguna sesión entra en Moodle: `chat` y `run` trabajan con la programación, los temas y los materiales en `drafts/`, sin nada que publicar ni aprobar, y la misión de `run` sin `--task` es repasar la materia (incorporar lo nuevo de `sources/` y revisar la programación).

Algunos detalles:

- **`chat`** saluda con lo que ya sabe, mirando el catálogo de la base de conocimiento (`knowledge_index`) y su visión general (`overview`), sin entrar en Moodle, y dice de cuándo es lo más reciente. Si hay borradores ocultos, lo menciona. Si la base de conocimiento está vacía, te ofrece explorar el curso o incorporar tus documentos. Luego espera tus instrucciones.
- **`run`** sin `--task` gestiona el curso en cuatro frentes: corregir lo pendiente, atender el foro, crear o arreglar contenido y resumir el progreso de la clase. Con `--task "…"`, ese encargo sustituye a la misión general, con todas las demás reglas (aprobaciones incluidas).
- **`ingest`** sin archivos procesa todo lo de `sources/` que aún no tiene página de resumen; con archivos, solo esos (rutas relativas a la carpeta actual). Ver [La base de conocimiento](base-de-conocimiento.md).
- **`explore`** usa solo las herramientas de lectura de moodle-teacher, sin cambiar nada. Escribe la página `course/moodle-capabilities` (`knowledge/moodle-capabilities.md`) con los tipos de actividad, los tipos de pregunta que ha podido ver y cómo pueden funcionar las calificaciones. Esas herramientas no listan los tipos de pregunta activados en tu Moodle, solo los que ya hay en los bancos de preguntas del curso ([falkenslab/moodle-mcp#49](https://github.com/falkenslab/moodle-mcp/issues/49)).

Las herramientas de `drafts/`, los ayudantes (`researcher`, `pedagogy-reviewer`) y los laboratorios de docker-lab ([Prácticas en Docker](practicas-docker.md)) solo existen en `chat` y `run`.

## Modos de supervisión

- **`guided`**: trabaja solo y pide aprobación antes de cada publicación. El [gancho de publicación](aprobaciones-y-borradores.md) detiene cualquier herramienta de moodle-teacher que cambie algo y no se haya aprobado.
- **`interactive`**: antes de cada herramienta que usa (leer un archivo, consultar el curso, publicar algo) te muestra cuál y con qué parámetros, y espera tu sí. Útil para ver cómo trabaja.
- **`autonomous`**: no pregunta nada y no tiene forma de pedirte ayuda. Publica sin aprobación. Al corregir, decide y guarda la nota por su cuenta.
- **`plan`** (solo en el chat): piensa antes de construir. Un gancho de agent-kit solo le deja leer (tus documentos con `Read`, `list_sources` y `extract_text`, la base de conocimiento con sus herramientas de lectura, la web), delegar en los ayudantes y preguntarte, y escribir solo el plan de una actividad (`drafts/<slug>/plan.md`, ver `activity-lifecycle`); cualquier otra herramienta se deniega, salvo listar e inspeccionar `drafts/`; de las de moodle-teacher, solo pasan las que la propia extensión declara de solo lectura, así que en este modo no cambia nada en Moodle. Cuando tiene el plan, lo presenta con `present_plan` y eliges: **ejecutarlo** (vuelve al modo anterior y se pone a ello), **seguir planificando** (le dices qué cambiar) o **cancelar**.

En el chat, `Shift+Tab` recorre `guided` → `interactive` → `plan` en cualquier momento, y `/plan` (también en el chat de texto simple) entra en el modo plan y, escrito otra vez, vuelve al modo de antes. El chat nunca va en `autonomous`; `run` no admite `plan`.

## Lo que el chat te muestra y te pregunta

- **Lista de tareas.** En un trabajo largo, el asistente lleva una lista de tareas (la herramienta `TodoWrite` del SDK) que el chat dibuja encima de la caja de texto: `☐` pendiente, `◼` en curso, `☑` hecha. Se queda mientras quede alguna y desaparece cuando están todas hechas.
- **Elegir entre opciones.** Cuando necesita que decidas algo, puede preguntarte con `ask_human`: un panel con dos a ocho opciones (una o varias, según la pregunta) y una última, «Otra», para escribir tu respuesta. En el chat de texto simple, las opciones salen numeradas y respondes con los números.
- **Fecha y hora.** Las entradas con fecha de la base de conocimiento y los plazos («dentro de 10 días») salen del reloj del sistema, con `current_time` y `date_math`, nunca de memoria del modelo.

## Retomar un chat

Cada chat es una carpeta propia en `sessions/` con toda la conversación ([ADR-011](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-011-resumable-chats.md)):

- `miyagi chat --continue` abre el chat con la última conversación del curso.
- `/resume`, dentro del chat, lista las conversaciones anteriores (`↑`/`↓` para elegir, Intro para retomar, `Esc` para cancelar).

Un chat retomado **nunca recupera sus aprobaciones**: cada vez que arranca miyagi, el gancho de publicación empieza sin ninguna aprobación vigente.

Aunque empieces una conversación nueva, la memoria del curso sigue ahí: la [base de conocimiento](base-de-conocimiento.md) es independiente de las conversaciones.

## Qué queda en `sessions/`

```text
sessions/
  history.jsonl                       los mensajes que has escrito en el chat (para ↑ y Ctrl+R)
  <fecha-hora>/                       un chat
    session.log                       la conversación, en texto plano
    transcript.jsonl                  cada acción del asistente y su resultado
    conversation.jsonl                la conversación completa, para retomarla
    session.json
    subagents/                        lo que hicieron los ayudantes
  <fecha-hora>-run/                   una sesión de run (igual con -ingest y -explore)
    transcript.jsonl
    ...
```

La conversación guardada para retomar el chat no se filtra, así que `sessions/` está en el `.gitignore` que crea `init`. Además, el Claude Agent SDK guarda su propia copia de la conversación en `~/.claude/projects/` (no se puede desactivar mientras se usa este almacenamiento).

Al cerrar cualquier sesión, miyagi te recuerda dónde ha quedado cada cosa y que no hay nada pendiente de guardar: todo se escribe en disco sobre la marcha.

## Pantalla completa, en línea o texto simple

- Por defecto, el chat ocupa toda la ventana de la terminal ([ADR-007](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-007-full-screen-ink-chat.md)), con la respuesta escrita en directo, cada herramienta con la primera línea de su resultado (`Ctrl+O` pliega cada grupo en una línea de resumen y vuelve a desplegarlo), paneles para las aprobaciones y selección con el ratón.
- `--inline` mantiene el mismo chat pero dentro del historial normal de la terminal.
- `--plain` usa un chat de texto simple línea a línea; en `run`, `ingest` y `explore`, texto simple sin animación ni paneles. Se activa solo si la entrada o la salida no son una terminal (por ejemplo, si rediriges la salida a un archivo).

## Contexto largo: autocompactado

Si una conversación llena el contexto del modelo, el SDK la resume automáticamente para poder seguir. Está activado por defecto; se desactiva con `"autoCompactEnabled": false` en `~/.miyagi/config.json`.

## Interrumpir

- En el chat, `Esc` corta la respuesta en curso sin cerrar la sesión; `/exit` (o `Ctrl+C` sin respuesta en curso) la cierra.
- En `run`, `ingest` y `explore`, el primer `Ctrl+C` interrumpe y cierra con normalidad; el segundo sale sin esperar. Lo que estaba a medias (una nota sin guardar, una respuesta sin publicar) puede quedar así: en la siguiente sesión puedes pedirle que lo retome.
