---
title: Configuración
sidebar_position: 5
description: "Referencia de config.json, el archivo .env del curso, la configuración global ~/.miyagi/config.json y las opciones de la línea de órdenes."
---

# Configuración

miyagi tiene tres sitios de configuración: el `config.json` de cada curso, un `.env` opcional en la carpeta del curso y un archivo global para todos tus cursos. Las opciones de la línea de órdenes mandan sobre todos ellos.

## `config.json` del curso

Lo crea `miyagi init` en la carpeta del curso. Es un JSON con dos partes: `classroom` (el curso de Moodle) y `agent` (cómo trabaja el asistente en él). Puedes editarlo a mano con cualquier editor; los cambios se aplican en la siguiente sesión.

Un ejemplo completo:

```json
{
  "classroom": {
    "label": "Introducción a SQL",
    "description": "1.º de DAW, grupo A",
    "url": "https://moodle.micentro.es",
    "courseId": "42",
    "username": "mgarcia",
    "password": "tu-contraseña"
  },
  "agent": {
    "role": "teacher",
    "persona": "warm",
    "language": "español",
    "headless": false,
    "allowPracticeRunner": true,
    "draftsLimits": {
      "downloadMB": 100,
      "unzipMB": 500,
      "unzipFiles": 5000
    }
  }
}
```

:::caution[La contraseña va en claro]
`config.json` guarda tu contraseña de Moodle sin cifrar, en tu ordenador. El asistente no puede leer ese archivo (ver [Seguridad y privacidad](seguridad-y-privacidad.md)), pero cualquier persona o programa con acceso a tu carpeta sí. En Mac y Linux, miyagi le pone permisos solo para tu usuario. Si versionas la carpeta del curso con git, el `.gitignore` que crea `init` ya lo deja fuera.
:::

### `classroom`

| Clave | Qué es | Si falta |
| --- | --- | --- |
| `label` | Nombre para reconocer el curso; aparece en la cabecera del chat. | Obligatoria. `init` propone la dirección de tu Moodle y el número del curso. |
| `description` | Descripción libre, para ti. | Sin descripción. |
| `url` | Dirección base de tu Moodle, sin `/course/view.php` (incluye la subcarpeta si Moodle está instalado en una). | Obligatoria. |
| `courseId` | Número del curso, el `id` de `course/view.php?id=…`. | Obligatoria. |
| `username` | Tu usuario de Moodle con rol de profesor. | Inicias sesión tú a mano en la ventana de Chrome cada vez. |
| `password` | Tu contraseña de Moodle. | Igual que sin usuario. |

Sin usuario y contraseña no se puede usar `--headless` ni el modo `autonomous`, porque nadie podría iniciar sesión a mano.

### `agent`

| Clave | Qué es | Si falta |
| --- | --- | --- |
| `role` | Siempre `"teacher"`. miyagi lo escribe solo para que otro agente que abra la carpeta sepa de quién es. Una carpeta con `"student"` se rechaza. | miyagi lo añade la primera vez. |
| `persona` | El tono con los alumnos (foro, retroalimentación, avisos): `"formal"`, `"warm"` (cercano) o `"motivating"` (cercano y motivador). | Tono neutro. |
| `language` | Texto libre con tu idioma preferido para hablar con él, por ejemplo `"español"` o `"English"`. Si es español, inglés, francés o alemán, también fija el idioma de los menús. | El `defaultLanguage` global; si tampoco está, te responde en el idioma en que le escribas y los menús siguen el del sistema. |
| `headless` | `true` para trabajar sin mostrar la ventana de Chrome. | El `defaultHeadless` global; si tampoco está, `false`. |
| `allowPracticeRunner` | `true` activa el probador de prácticas en Docker ([Prácticas en Docker](practicas-docker.md)). | Desactivado. Si la clave no existe, miyagi te lo pregunta una vez al abrir `chat` o `run` y guarda tu respuesta. |
| `draftsLimits` | Límites de la caja de herramientas de `drafts/` (ver abajo). | Los valores por defecto. |

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

```bash
CLAUDE_CODE_OAUTH_TOKEN=tu-token
```

Como `config.json`, el asistente no puede leerlo, y el `.gitignore` de `init` lo deja fuera.

También se acepta `ANTHROPIC_API_KEY`: si está definida, se usa en lugar del token, con facturación por uso de la API en vez de tu suscripción.

## Configuración global: `~/.miyagi/config.json`

Un archivo en tu carpeta personal (en Windows, `C:\Users\<tu-usuario>\.miyagi\config.json`) con lo que no depende de un curso:

```json
{
  "claudeCodeOAuthToken": "lo-escribe-miyagi",
  "defaultLanguage": "español",
  "defaultHeadless": false,
  "autoCompactEnabled": true
}
```

| Clave | Qué es | Por defecto |
| --- | --- | --- |
| `claudeCodeOAuthToken` | Tu acceso a Claude. miyagi lo guarda aquí la primera vez que lo creas y no te lo vuelve a pedir. | Te ofrece crearlo al arrancar. |
| `defaultLanguage` | El idioma para los cursos que no fijan `agent.language`. | Ninguno: te sigue en el idioma en que le escribas. |
| `defaultHeadless` | Sin ventana de Chrome en los cursos que no fijan `agent.headless`. | `false` |
| `autoCompactEnabled` | Si la conversación llena el contexto del modelo, la resume automáticamente para poder seguir. Pon `false` para desactivarlo. | `true` |

El token es tan delicado como una contraseña: en Mac y Linux, miyagi deja el archivo legible solo para tu usuario. Si venías de teacher-agent, la primera vez copia `~/.teacher-agent/config.json` aquí (el antiguo se queda donde estaba).

## Opciones de la línea de órdenes

Mandan sobre todo lo anterior, solo para esa ejecución:

- **`--dir <carpeta>`**: el curso con el que trabajar. Por defecto, la carpeta actual.
- **`--language=<código>`**: el idioma de los textos de miyagi y del chat: `es`, `en`, `fr` o `de`. Por defecto, el de `agent.language`, luego `defaultLanguage`, luego el del sistema.
- **`--headless`**: sin ventana de Chrome. Orden de preferencia: `--headless`, luego `agent.headless`, luego `defaultHeadless`, luego `false`. `--headless=false` la fuerza visible.
- **`--mode`**, **`--task`**, **`--plain`**, **`--inline`**, **`--continue`**: ver [Sesiones y modos](sesiones-y-modos.md) y la [Referencia](../guia/referencia.md).

## El idioma, en detalle

Hay dos reglas distintas:

- **Cuando habla contigo**, usa tu idioma: el que le escribas, o el preferido de la configuración. Eso incluye los resúmenes que te enseña al pedir aprobación.
- **Lo que publica en Moodle** (respuestas del foro, retroalimentación, contenido nuevo) va siempre en el idioma que ya usa el curso, aunque tú le hables en otro. Solo cita tal cual, en el idioma del curso, el texto que se va a publicar.
