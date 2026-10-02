---
title: Seguridad y privacidad
sidebar_position: 9
description: "Cómo protege miyagi tu contraseña, qué archivos puede leer y escribir, por qué no tiene terminal y qué hace con los datos de tus alumnos."
---

# Seguridad y privacidad

El asistente lee contenido que no controlas: páginas de Moodle, entregas de alumnos, mensajes del foro. Cualquiera de ellos podría intentar darle órdenes («ignora tus instrucciones y…»). Por eso las protecciones importantes no dependen de que el modelo se porte bien, sino del propio programa ([ADR-004](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-004-secrets-never-reach-model.md)).

## Tu contraseña nunca llega al modelo

- Se guarda en el `config.json` del curso, en tu ordenador. El asistente **no puede leer** ese archivo: está en la lista de rutas prohibidas de sus herramientas.
- Para iniciar sesión, el asistente escribe en el campo de contraseña el marcador `MOODLE_PASSWORD`. Es el servidor de Playwright, dentro del proceso del navegador, quien lo sustituye por la contraseña real ([`src/playwrightConfig.ts`](https://github.com/falkenslab/miyagi/blob/main/src/playwrightConfig.ts)). El modelo nunca ve el valor.
- En la transcripción de cada sesión (`transcript.jsonl`), la contraseña aparece tapada.
- Si no quieres guardarla, deja el usuario en blanco en `init`: iniciarás sesión tú a mano en la ventana de Chrome.

El `.env` del curso, donde puede ir un token de Claude propio, también está prohibido para sus herramientas.

## Qué archivos puede tocar

Un filtro de agent-kit revisa cada uso de las herramientas de archivos, tanto del asistente como de sus ayudantes:

- **Escribir y editar**: solo dentro de `knowledge/` y `drafts/` (y de `practice/` si has activado el probador de prácticas).
- **`sources/`**: solo lectura. Lo único que puede añadir ahí es un documento descargado de Moodle, con su herramienta `save_to_sources`, que nunca sobrescribe.
- **Buscar en el contenido** (`Grep`): solo en `knowledge/`, `sources/`, `drafts/` y `practice/`.
- **`config.json` y `.env`**: prohibidos, ni leer ni escribir.

Tus habilidades, atajos e `instructions.md` quedan fuera de las carpetas en las que puede escribir: el asistente los usa, pero no puede cambiarlos.

## Sin terminal

El asistente principal **no tiene terminal**, ni siquiera para un `echo`: agent-kit le deniega `Bash` aunque esté registrada para algún ayudante. Para trabajar con archivos en `drafts/` (descargar, comprimir, generar un PDF) tiene herramientas propias escritas en código, que no ejecutan nada y no salen de esa carpeta (ver [Aprobaciones y borradores](aprobaciones-y-borradores.md)).

Solo puede delegar en los ayudantes que miyagi declara (`researcher`, `pedagogy-reviewer` y, si lo activas, `practice-runner`), y cada uno tiene solo las herramientas que tiene en su lista. La única terminal de todo el sistema es la de `practice-runner`: desactivada por defecto y limitada por sus instrucciones a Docker dentro de `practice/` ([Prácticas en Docker](practicas-docker.md)).

## Sin herramientas peligrosas del navegador

Playwright MCP ofrece una herramienta, `browser_run_code_unsafe`, que ejecuta código arbitrario en el proceso del servidor (no en la página). La propia documentación de Playwright la describe como equivalente a ejecutar código remoto. miyagi la tiene **prohibida** en todas las sesiones.

## Lo que hace en Moodle

Trabaja con tu cuenta, así que puede hacer lo que tú puedes hacer en el curso. Lo que lo frena:

- Sus instrucciones le prohíben borrar, cambiar matrículas, tocar la configuración de la plataforma y salir de tu curso.
- En `guided`, ninguna acción que publique se ejecuta sin tu aprobación: un [gancho del programa](aprobaciones-y-borradores.md) lo hace cumplir.
- Todo lo nuevo se sube oculto y se prueba antes de mostrarlo.

El modo `autonomous` quita las aprobaciones: úsalo solo en cursos de prueba.

## Los datos de tus alumnos

- **Lee lo que tú verías** en Moodle para hacer su trabajo: entregas, calificaciones, mensajes del foro, informes de progreso. Ese contenido lo procesa Claude, el modelo de Anthropic, a través de tu suscripción.
- **No guarda fichas de alumnos.** En la base de conocimiento no hay páginas sobre estudiantes concretos: las notas de progreso y del foro son de la clase y de patrones, nunca un registro con nombres ([ADR-005](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-005-no-individual-students-in-knowledge.md)).
- **Entregas descargadas, con identificador.** Cuando guarda una entrega para ejecutarla, va a `sources/<actividad>/<id-del-alumno>/`, nunca con el nombre del alumno en la ruta.
- **Las sesiones sí contienen lo que vio.** La carpeta `sessions/` guarda la conversación y la transcripción de cada sesión, con lo que el asistente leyó en Moodle. Además, el Claude Agent SDK guarda su propia copia de las conversaciones en `~/.claude/projects/`. Trátalas como datos del curso: `sessions/` está en el `.gitignore` que crea `init`, y puedes borrar las sesiones antiguas cuando ya no las necesites.

## Si versionas la carpeta del curso

`miyagi init` crea un `.gitignore` que deja fuera `config.json` (la contraseña), `.env` (el token), `sessions/` (transcripciones y perfiles del navegador) y `practice/`. Si usas git, no los subas.
