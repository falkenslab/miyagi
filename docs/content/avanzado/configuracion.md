---
title: Configuración
sidebar_position: 5
description: "Referencia de config.json, el archivo .env del curso, la configuración global ~/.miyagi/config.json y las opciones de la línea de órdenes."
---

# Configuración

miyagi tiene tres sitios de configuración: el `config.json` de cada curso, un `.env` opcional en la carpeta del curso y un archivo global para todos tus cursos. Las opciones de la línea de órdenes mandan sobre todos ellos.

## `config.json` del curso

Lo crea `miyagi init` en la carpeta de la asignatura. Es un JSON con `kind` (qué es: hoy siempre `"subject"`, una asignatura; miyagi lo escribe si falta), `classroom` (el curso de Moodle, opcional) y `agent` (cómo trabaja el asistente). Puedes editarlo a mano con cualquier editor; los cambios se aplican en la siguiente sesión.

Un ejemplo completo:

```json
{
  "classroom": {
    "label": "Introducción a SQL",
    "description": "1.º de DAW, grupo A",
    "url": "https://moodle.micentro.es",
    "courseId": "42",
    "connector": "moodle-teacher"
  },
  "agent": {
    "role": "teacher",
    "persona": "warm",
    "language": "español",
    "draftsLimits": {
      "downloadMB": 100,
      "unzipMB": 500,
      "unzipFiles": 5000
    }
  }
}
```

:::note[Sin contraseña]
`config.json` no guarda tu usuario ni tu contraseña de Moodle: inicias sesión tú en la ventana que abre la extensión [moodle-teacher](extensiones.md) y la sesión la guarda ella. Aun así, el asistente no puede leer ese archivo (ver [Seguridad y privacidad](seguridad-y-privacidad.md)), y el `.gitignore` que crea `init` lo deja fuera.
:::

### `classroom`

| Clave | Qué es | Si falta |
| --- | --- | --- |
| `label` | Nombre de la asignatura; aparece en la cabecera del chat. | Obligatoria. `init` la pide como nombre de la asignatura. |
| `description` | Descripción libre, para ti. | Sin descripción. |
| `url` | Dirección base de tu Moodle, sin `/course/view.php` (incluye la subcarpeta si Moodle está instalado en una). | Obligatoria. |
| `courseId` | Número del curso, el `id` de `course/view.php?id=…`. | Obligatoria. |
| `connector` | Cómo llega miyagi a tu Moodle: siempre `"moodle-teacher"`, la [extensión](extensiones.md) que trabaja en Moodle con tu propia sesión. `init` lo escribe así. | Es un aula de antes (ver abajo). |

La sesión la guarda la extensión: la primera vez que hace falta, moodle-teacher abre una ventana del navegador para que inicies sesión tú, y sirve para las siguientes sesiones hasta que caduque. miyagi y el modelo nunca ven tu contraseña. Si el aula es de moodle-teacher pero la extensión no está instalada o está desactivada, la sesión te avisa y trabaja sin el aula.

### Aulas de antes

Un aula creada antes de moodle-teacher (sin `connector`, o con `"browser"`) puede tener también `username` y `password`. Al abrir la asignatura en un chat (o en `run` desde la terminal, salvo en modo `autonomous`), miyagi te pregunta una vez por sesión si quieres pasarla ahora a moodle-teacher. Si dices que sí, instala la extensión con ese sitio, borra `username` y `password` de `config.json` y guarda `"connector": "moodle-teacher"`. Si dices que no (o no hay a quién preguntar, por ejemplo en `run` en modo `autonomous`), esa sesión trabaja sin el aula, solo con la programación y los borradores, y te dice cómo arreglarlo: abrirla en un chat o ejecutar `miyagi init -w <nombre>`. El navegador de antes ya no existe.

Las opciones de la conexión no van en `config.json`, sino en la propia extensión: `sites` (el sitio de Moodle), `courses` (los cursos de tus asignaturas: cualquier otro de tu cuenta lo rechaza moodle-teacher; miyagi añade el de cada asignatura al conectarla o al abrirla por primera vez), `headless` (trabaja sin ventana; para iniciar sesión la abre igualmente), `access` (`write`: puede cambiar el curso, siempre con tu aprobación antes) y `student_data` (`pseudonymize`: los alumnos le llegan al modelo como alias). miyagi la instala con esos valores, y se cambian con `miyagi extension config moodle-teacher …` (ver [Extensiones](extensiones.md)).

### Sin aula

`classroom` es opcional. Sin ella, miyagi ayuda con la programación, los temas y los materiales (en `drafts/`), sin Moodle ni nada que publicar, y `explore` no hace nada. El nombre y la descripción van entonces en la raíz:

```json
{
  "label": "Programación 1.º DAM",
  "description": "Módulo de Programación, sin aula todavía",
  "agent": { "role": "teacher", "language": "español" }
}
```

| Clave | Qué es | Si falta |
| --- | --- | --- |
| `label` | Nombre de la materia; aparece en la cabecera del chat. Con aula, se usa el de `classroom`. | El nombre de la carpeta. |
| `description` | Descripción libre, para ti. | Sin descripción. |

Para conectar un aula más tarde, vuelve a ejecutar `miyagi init -w <nombre>`: te pregunta la dirección del curso (y su número si la dirección no lo lleva), guarda `classroom` con ese nombre y esa descripción e instala moodle-teacher con ese sitio (o se lo añade si ya está instalada). Ni usuario ni contraseña. Si `classroom` está pero le falta `url` o `courseId`, miyagi no arranca y te dice qué falta.

### `agent`

| Clave | Qué es | Si falta |
| --- | --- | --- |
| `role` | Siempre `"teacher"`. miyagi lo escribe solo para que otro agente que abra la carpeta sepa de quién es. Una carpeta con `"student"` se rechaza. | miyagi lo añade la primera vez. |
| `persona` | El tono con los alumnos (foro, retroalimentación, avisos): `"formal"`, `"warm"` (cercano) o `"motivating"` (cercano y motivador). | Tono neutro. |
| `language` | Texto libre con tu idioma preferido para hablar con él, por ejemplo `"español"` o `"English"`. Si es español, inglés, francés o alemán, también fija el idioma de los menús. | El `defaultLanguage` global; si tampoco está, te responde en el idioma en que le escribas y los menús siguen el del sistema. |
| `draftsLimits` | Límites de la caja de herramientas de `drafts/` (ver abajo). | Los valores por defecto. |
| `appearance` | El estilo visual de lo que exporta desde `materials/`: `"course"` (el tema de tu aula) o el nombre de una extensión de estilo instalada, como `"moodle-ui-kit"`. Lo cambia el asistente cuando se lo pides. Ver [Tus materiales](materiales.md#el-estilo-de-lo-que-publicas). | `"course"`. |

### `draftsLimits`

Por seguridad, las herramientas con las que el asistente descarga y descomprime archivos en `drafts/` tienen límites. Puedes subirlos o bajarlos clave a clave; las que no pongas mantienen su valor por defecto.

| Clave | Qué limita | Por defecto |
| --- | --- | --- |
| `downloadMB` | Tamaño de una descarga (y de cada archivo al guardar una página web completa), en MB | `50` |
| `unzipMB` | Tamaño total de lo que escribe al descomprimir un ZIP, en MB | `200` |
| `unzipFiles` | Número de archivos que escribe al descomprimir un ZIP | `2000` |

Cada valor tiene que ser un número positivo y una de esas tres claves: si no, miyagi se niega a arrancar y te dice cuál está mal.

## `.env` del curso

Opcional. Un archivo `.env` en la carpeta del curso con variables de entorno que miyagi carga al arrancar, por encima de las que ya tenga el sistema. Sirve para usar en ese curso un acceso a Claude distinto del global:

```text title=".env"
ANTHROPIC_API_KEY=sk-ant-api…
```

Como `config.json`, el asistente no puede leerlo, y el `.gitignore` de `init` lo deja fuera.

Es una clave de API, que se paga por uso en lugar de con tu suscripción. Un `CLAUDE_CODE_OAUTH_TOKEN` en este archivo se ignora: con tu suscripción, [inicias sesión](../guia/instalar.md#conectar-tu-cuenta-de-claude) en lugar de guardar un token.

## Configuración global: `~/.miyagi/config.json`

Un archivo en tu carpeta personal (en Windows, `C:\Users\<tu-usuario>\.miyagi\config.json`) con lo que no depende de un curso:

```json
{
  "defaultLanguage": "español",
  "autoCompactEnabled": true
}
```

| Clave | Qué es | Por defecto |
| --- | --- | --- |
| `claudeCodeOAuthToken` | Ya no se usa. Si lo guardó una versión anterior, miyagi lo borra al arrancar: las condiciones de Anthropic no le dejan guardar tu token. Tu sesión de Claude la guarda Claude Code. | Ninguno |
| `anthropicApiKey` | Una clave de API de Claude (`sk-ant-api…`), si la pegaste en la [página de miyagi](navegador.md). Se paga por uso. | Ninguno |
| `defaultLanguage` | El idioma para los cursos que no fijan `agent.language`. | Ninguno: te sigue en el idioma en que le escribas. |
| `autoCompactEnabled` | Si la conversación llena el contexto del modelo, la resume automáticamente para poder seguir. Pon `false` para desactivarlo. | `true` |

La clave de API es tan delicada como una contraseña: en Mac y Linux, miyagi deja el archivo legible solo para tu usuario.

## La lista de asignaturas: `~/.miyagi/workspaces.json`

miyagi apunta aquí cada asignatura que creas o abres, para que la abras por su nombre (`-w`) desde cualquier sitio. Las nuevas se guardan en `~/.miyagi/workspaces/<nombre>/` salvo que uses `--dir`.

```json
{
  "workspaces": [
    { "id": "bases-de-datos", "name": "Bases de Datos", "kind": "subject", "dir": "C:\\Users\\ana\\.miyagi\\workspaces\\bases-de-datos", "createdAt": "…", "openedAt": "…" }
  ]
}
```

`id` es el nombre corto que acepta `-w` (también vale el nombre completo). Si mueves la carpeta de una asignatura, `miyagi workspaces` la marca como no encontrada; ábrela una vez con `--dir` en su sitio nuevo, o quítala con `miyagi workspaces forget <nombre>`. Nada de esto borra nunca una carpeta. No guarda ningún secreto.

## Opciones de la línea de órdenes

Mandan sobre todo lo anterior, solo para esa ejecución:

- **`-w <nombre>`** (`--workspace`): la asignatura de tu lista con la que trabajar.
- **`--dir <carpeta>`**: la asignatura de esa carpeta (o dónde crearla con `init`). Sin ninguna de las dos, la de la carpeta actual si lo es; si no, te pregunta.
- **`--language=<código>`**: el idioma de los textos de miyagi y del chat: `es`, `en`, `fr` o `de`. Por defecto, el de `agent.language`, luego `defaultLanguage`, luego el del sistema.
- **`--mode`**, **`--task`**, **`--plain`**, **`--inline`**, **`--continue`**: ver [Sesiones y modos](sesiones-y-modos.md) y la [Referencia](../guia/referencia.md).

## El idioma, en detalle

Hay dos reglas distintas:

- **Cuando habla contigo**, usa tu idioma: el que le escribas, o el preferido de la configuración. Eso incluye los resúmenes que te enseña al pedir aprobación.
- **Lo que publica en Moodle** (respuestas del foro, retroalimentación, contenido nuevo) va siempre en el idioma que ya usa el curso, aunque tú le hables en otro. Solo cita tal cual, en el idioma del curso, el texto que se va a publicar.
