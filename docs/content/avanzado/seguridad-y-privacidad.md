---
title: Seguridad y privacidad
sidebar_position: 9
description: "Por qué tu contraseña nunca llega al modelo, qué archivos puede leer y escribir, por qué no tiene terminal y qué hace con los datos de tus alumnos."
---

# Seguridad y privacidad

El asistente lee contenido que no controlas: páginas de Moodle, entregas de alumnos, mensajes del foro. Cualquiera de ellos podría intentar darle órdenes («ignora tus instrucciones y…»). Por eso las protecciones importantes no dependen de que el modelo se porte bien, sino del propio programa ([ADR-004](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-004-secrets-never-reach-model.md)).

## Tu contraseña nunca llega al modelo

- miyagi no la pide ni la guarda: `init` solo te pregunta la dirección del curso.
- La sesión en Moodle es de la extensión [moodle-teacher](extensiones.md): la primera vez que hace falta, abre una ventana del navegador para que inicies sesión tú, y guarda la sesión en su propio perfil del navegador hasta que caduque. miyagi y el modelo nunca ven tu contraseña.
- Un aula de antes que aún tenga `username` y `password` en `config.json` los pierde al pasarla a moodle-teacher (ver [Configuración](configuracion.md#aulas-de-antes)). Mientras tanto, el asistente **no puede leer** ese archivo: está en la lista de rutas prohibidas de sus herramientas.

Tu token de Claude tampoco está a su alcance: sus herramientas de archivos no pueden leer el `.env` del curso (donde puede ir un token propio), ni `~/.miyagi/config.json` (donde lo guarda miyagi), ni su copia antigua `~/.teacher-agent/config.json`, ni `~/.claude/.credentials.json` (las credenciales del SDK de Claude).

## Qué archivos puede tocar

Un filtro de agent-kit revisa cada uso de las herramientas de archivos, tanto del asistente como de sus ayudantes:

- **Leer y listar** (`Read`, `Glob`): solo `sources/`, `drafts/` (y la carpeta de laboratorios de docker-lab, si la tienes activada), las habilidades de miyagi y la carpeta de la conversación en curso. Nada más de tu ordenador: ni la carpeta del curso fuera de esas, ni `Documentos`, ni tus otros cursos o proyectos.
- **Escribir y editar** (`Write`, `Edit`): solo dentro de `drafts/` (y de la carpeta de laboratorios de docker-lab, si la tienes activada: miyagi escribe ahí los archivos de cada laboratorio; ver [Prácticas en Docker](practicas-docker.md)).
- **`sources/`**: solo lectura para `Read`, `Glob` y `Grep`. Lo que entra ahí lo añaden las herramientas de fuentes de agent-kit: `save_to_sources` (un archivo descargado durante la sesión), `download_to_sources` (una dirección web) y `request_file` (un archivo que tú le das); y lo que sale, `retire_source`, que te pide aprobación y lo aparta a `sources/.agent-kit/retired/` sin borrarlo ([La base de conocimiento](base-de-conocimiento.md#las-fuentes)).
- **`knowledge/`**: ninguna herramienta de archivos llega ahí, ni para leer. Solo las herramientas `knowledge_*`, que no borran ni renombran páginas; retirar una (`knowledge_retire`) te pide aprobación.
- **Buscar en el contenido** (`Grep`): solo en `sources/`, `drafts/` y, con docker-lab activada, su carpeta de laboratorios.
- **`config.json` y `.env` del curso, `~/.miyagi/config.json`, `~/.teacher-agent/config.json` y `~/.claude/.credentials.json`**: prohibidos, ni leer ni escribir. `verify` lo comprueba en cada cambio (`check-file-scope.mjs`).
- **Otras credenciales en sitios conocidos**, prohibidas además, por si acaso: `~/.ssh`, `~/.aws`, `~/.azure`, `~/.gnupg`, `~/.kube`, `~/.npmrc`, `~/.git-credentials`, `~/.netrc`, `~/.pypirc`, `~/.config/gh`, `~/.docker/config.json`, el llavero de macOS y los perfiles de Chrome, Edge y Firefox (cookies y contraseñas guardadas).

Tus habilidades, atajos e `instructions.md` quedan fuera de las carpetas en las que puede escribir: el asistente los usa, pero no puede cambiarlos.

## Sin terminal

En miyagi **no hay terminal** en ningún sitio, ni siquiera para un `echo`: agent-kit le deniega `Bash` al asistente principal y ningún ayudante la tiene. Para trabajar con archivos en `drafts/` (descargar, comprimir, generar un PDF) tiene herramientas propias escritas en código, que no ejecutan nada y no salen de esa carpeta (ver [Aprobaciones y borradores](aprobaciones-y-borradores.md)).

Solo puede delegar en los ayudantes que miyagi declara (`researcher` y `pedagogy-reviewer`), y cada uno tiene solo las herramientas que tiene en su lista.

Para ejecutar prácticas está la extensión docker-lab: miyagi solo puede usar sus laboratorios, con la política que docker-mcp impone al arrancar cada uno (sin internet salvo que lo permitas, nada montado fuera del laboratorio, nunca el socket de Docker, límites de CPU y memoria). Sus herramientas sobre todo el Docker del ordenador (contenedores, imágenes, volúmenes, redes, proyectos de Compose, `prune`) están bloqueadas ([Prácticas en Docker](practicas-docker.md)).

## Lo que hace en Moodle

Trabaja con tu cuenta, a través de las herramientas fijas de moodle-teacher, así que puede hacer lo que esas herramientas permiten hacer con tu cuenta en el curso. Lo que lo frena:

- Sus instrucciones le prohíben borrar lo que no haya creado él, cambiar matrículas o grupos, tocar la configuración de la plataforma y salir de tu curso.
- Algunas herramientas de moodle-teacher están bloqueadas en todas las sesiones, en cualquier modo, porque nunca son trabajo del asistente: matricular o dar de baja, cambiar roles, crear grupos o cambiar quién está en ellos, mandar mensajes privados, reiniciar el curso y copiarlo a otro curso o sitio.
- En `guided`, ninguna herramienta de moodle-teacher que cambie algo se ejecuta sin tu aprobación: un [gancho del programa](aprobaciones-y-borradores.md) lo hace cumplir. Borrar, quitar o reiniciar te lo pregunta siempre moodle-teacher, en cada llamada, aunque ya lo hayas aprobado.
- Lo que moodle-teacher no sabe hacer, no lo intenta por otro camino: te lo dice, lo prepara en `drafts/` y te da los pasos.
- Todo lo nuevo se sube oculto y se prueba antes de mostrarlo.

El modo `autonomous` quita las aprobaciones (salvo borrar, que en ese modo nunca se hace): úsalo solo en cursos de prueba.

## Los datos de tus alumnos

- **Lee lo que tú verías** en Moodle para hacer su trabajo: entregas, calificaciones, mensajes del foro, informes de progreso. Ese contenido lo procesa Claude, el modelo de Anthropic, a través de tu suscripción.
- **Con seudónimos.** miyagi instala moodle-teacher con `student_data` en `pseudonymize`: los alumnos le llegan al modelo como alias («Alumno 3»), nunca por su nombre. Se cambia con `miyagi extension config moodle-teacher …` ([Extensiones](extensiones.md)).
- **No guarda fichas de alumnos.** En la base de conocimiento no hay páginas sobre estudiantes concretos: las notas de progreso y del foro son de la clase y de patrones, nunca un registro con nombres ([ADR-005](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-005-no-individual-students-in-knowledge.md)).
- **Entregas ejecutadas, con identificador.** Cuando lleva una entrega a un laboratorio para ejecutarla, va a una carpeta con un identificador o un alias, nunca con el nombre del alumno.
- **Las sesiones sí contienen lo que vio.** La carpeta `sessions/` guarda la conversación y la transcripción de cada sesión, con lo que el asistente leyó en Moodle. Además, el Claude Agent SDK guarda su propia copia de las conversaciones en `~/.claude/projects/`. Trátalas como datos del curso: `sessions/` está en el `.gitignore` que crea `init`, y puedes borrar las sesiones antiguas cuando ya no las necesites.

## Si versionas la carpeta del curso

`miyagi init` crea un `.gitignore` que deja fuera `config.json`, `.env` (el token), y `sessions/` (las transcripciones). Si usas git, no los subas.
