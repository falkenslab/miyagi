---
title: Configuration
sidebar_position: 5
description: "Reference for config.json, the course's .env file, the global configuration ~/.miyagi/config.json and the command-line options."
---

# Configuration {#configuración}

miyagi has three places for configuration: each course's `config.json`, an optional `.env` in the course folder and a global file for all your courses. The command-line options take precedence over all of them.

## The course's `config.json` {#configjson-del-curso}

`miyagi init` creates it in the subject's folder. It's a JSON with `kind` (what it is: today always `"subject"`, a subject; miyagi writes it if missing), `classroom` (the Moodle course, optional) and `agent` (how the assistant works). You can edit it by hand with any editor; the changes apply in the next session.

A complete example:

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

:::note[No password]
`config.json` doesn't keep your Moodle username or password: you sign in yourself in the window the [moodle-teacher](extensiones.md) extension opens, and the extension keeps the session. Even so, the assistant can't read that file (see [Security and privacy](seguridad-y-privacidad.md)), and the `.gitignore` that `init` creates leaves it out.
:::

### `classroom` {#classroom}

| Key | What it is | If missing |
| --- | --- | --- |
| `label` | The subject's name; it appears in the chat's header. | Required. `init` asks for it as the subject's name. |
| `description` | Free description, for you. | No description. |
| `url` | Base address of your Moodle, without `/course/view.php` (include the subfolder if Moodle is installed in one). | Required. |
| `courseId` | The course's number, the `id` in `course/view.php?id=…`. | Required. |
| `connector` | How miyagi reaches your Moodle: always `"moodle-teacher"`, the [extension](extensiones.md) that works in Moodle with your own session. `init` writes it that way. | It's an older classroom (see below). |

The extension keeps the session: the first time it's needed, moodle-teacher opens a browser window for you to sign in yourself, and it serves the following sessions until it expires. miyagi and the model never see your password. If the classroom uses moodle-teacher but the extension isn't installed or is disabled, the session warns you and works without the classroom.

### Older classrooms {#aulas-de-antes}

A classroom created before moodle-teacher (without `connector`, or with `"browser"`) may also have `username` and `password`. When you open the subject in a chat (or in `run` from the terminal, except in `autonomous` mode), miyagi asks you once per session whether you want to move it to moodle-teacher now. If you say yes, it installs the extension with that site, deletes `username` and `password` from `config.json` and saves `"connector": "moodle-teacher"`. If you say no (or there's nobody to ask, for example in `run` in `autonomous` mode), that session works without the classroom, only with the teaching plan and the drafts, and tells you how to fix it: open it in a chat or run `miyagi init -w <name>`. The old browser no longer exists.

The connection's options don't go in `config.json` but in the extension itself: `sites` (the Moodle site), `courses` (your subjects' courses: moodle-teacher rejects any other course of your account; miyagi adds each subject's when connecting it or opening it for the first time), `headless` (works without a window; to sign in it opens one anyway), `access` (`write`: it can change the course, always with your approval first) and `student_data` (`pseudonymize`: students reach the model as aliases). miyagi installs it with those values, and they're changed with `miyagi extension config moodle-teacher …` (see [Extensions](extensiones.md)).

### Without a classroom {#sin-aula}

`classroom` is optional. Without it, miyagi helps with the teaching plan, the units and the materials (in `drafts/`), with no Moodle and nothing to publish, and `explore` does nothing. The name and the description then go in the root:

```json
{
  "label": "Programación 1.º DAM",
  "description": "Módulo de Programación, sin aula todavía",
  "agent": { "role": "teacher", "language": "español" }
}
```

| Key | What it is | If missing |
| --- | --- | --- |
| `label` | The subject's name; it appears in the chat's header. With a classroom, the one in `classroom` is used. | The folder's name. |
| `description` | Free description, for you. | No description. |

To connect a classroom later, run `miyagi init -w <name>` again: it asks you for the course's address (and its number if the address doesn't include it), saves `classroom` with that name and that description and installs moodle-teacher with that site (or adds the site to it if it's already installed). No username or password. If `classroom` is there but lacks `url` or `courseId`, miyagi doesn't start and tells you what's missing.

### `agent` {#agent}

| Key | What it is | If missing |
| --- | --- | --- |
| `role` | Always `"teacher"`. miyagi writes it only so that another agent that opens the folder knows whose it is. A folder with `"student"` is rejected. | miyagi adds it the first time. |
| `persona` | The tone with the students (forum, feedback, announcements): `"formal"`, `"warm"` (friendly) or `"motivating"` (friendly and motivating). | Neutral tone. |
| `language` | Free text with your preferred language to talk to it in, for example `"español"` or `"English"`. If it's Spanish, English, French or German, it also sets the language of the menus. | The global `defaultLanguage`; if that isn't set either, it answers in the language you write to it in and the menus follow the system's. |
| `draftsLimits` | Limits of the `drafts/` toolbox (see below). | The default values. |
| `appearance` | The visual style of what it exports from `materials/`: `"course"` (your classroom's theme) or the name of an installed style extension, such as `"moodle-ui-kit"`. The assistant changes it when you ask. See [Your materials](materiales.md#el-estilo-de-lo-que-publicas). | `"course"`. |

### `draftsLimits` {#draftslimits}

For safety, the tools the assistant uses to download and unzip files in `drafts/` have limits. You can raise or lower them key by key; the ones you don't set keep their default value.

| Key | What it limits | Default |
| --- | --- | --- |
| `downloadMB` | Size of a download (and of each file when saving a whole web page), in MB | `50` |
| `unzipMB` | Total size of what it writes when unzipping a ZIP, in MB | `200` |
| `unzipFiles` | Number of files it writes when unzipping a ZIP | `2000` |

Each value must be a positive number and one of those three keys: otherwise, miyagi refuses to start and tells you which one is wrong.

## The course's `.env` {#env-del-curso}

Optional. A `.env` file in the course folder with environment variables that miyagi loads at startup, over the ones the system already has. It serves to use, in that course, access to Claude different from the global one:

```text title=".env"
ANTHROPIC_API_KEY=sk-ant-api…
```

Like `config.json`, the assistant can't read it, and `init`'s `.gitignore` leaves it out.

It's an API key, billed per use instead of through your subscription. A `CLAUDE_CODE_OAUTH_TOKEN` in this file is ignored: with your subscription, you [sign in](../guia/instalar.md#conectar-tu-cuenta-de-claude) instead of keeping a token.

## Global configuration: `~/.miyagi/config.json` {#configuración-global-miyagiconfigjson}

A file in your home folder (on Windows, `C:\Users\<your-user>\.miyagi\config.json`) with what doesn't depend on a course:

```json
{
  "defaultLanguage": "español",
  "autoCompactEnabled": true
}
```

| Key | What it is | Default |
| --- | --- | --- |
| `claudeCodeOAuthToken` | No longer used. If an earlier version saved it, miyagi removes it on start: Anthropic's terms don't let it keep your token. Claude Code keeps your Claude session. | None |
| `anthropicApiKey` | A Claude API key (`sk-ant-api…`), if you pasted one on [miyagi's page](navegador.md). Billed per use. | None |
| `defaultLanguage` | The language for the courses that don't set `agent.language`. | None: it follows you in the language you write to it in. |
| `autoCompactEnabled` | If the conversation fills the model's context, it summarizes it automatically so it can go on. Set `false` to turn it off. | `true` |

The API key is as sensitive as a password: on Mac and Linux, miyagi leaves the file readable only by your user.

## The list of subjects: `~/.miyagi/workspaces.json` {#la-lista-de-asignaturas-miyagiworkspacesjson}

miyagi records here each subject you create or open, so you can open it by its name (`-w`) from anywhere. New ones are saved in `~/.miyagi/workspaces/<name>/` unless you use `--dir`.

```json
{
  "workspaces": [
    { "id": "bases-de-datos", "name": "Bases de Datos", "kind": "subject", "dir": "C:\\Users\\ana\\.miyagi\\workspaces\\bases-de-datos", "createdAt": "…", "openedAt": "…" }
  ]
}
```

`id` is the short name `-w` accepts (the full name works too). If you move a subject's folder, `miyagi workspaces` marks it as not found; open it once with `--dir` in its new place, or remove it with `miyagi workspaces forget <name>`. None of this ever deletes a folder. It keeps no secret.

## Command-line options {#opciones-de-la-línea-de-órdenes}

They take precedence over everything above, only for that run:

- **`-w <name>`** (`--workspace`): the subject from your list to work with.
- **`--dir <folder>`**: the subject in that folder (or where to create it with `init`). Without either of the two, the one in the current folder if it is one; otherwise, it asks you.
- **`--language=<code>`**: the language of miyagi's texts and of the chat: `es`, `en`, `fr` or `de`. By default, the one in `agent.language`, then `defaultLanguage`, then the system's.
- **`--mode`**, **`--task`**, **`--plain`**, **`--inline`**, **`--continue`**: see [Sessions and modes](sesiones-y-modos.md) and the [Reference](../guia/referencia.md).

## The language, in detail {#el-idioma-en-detalle}

There are two separate rules:

- **When it talks to you**, it uses your language: the one you write to it in, or the preferred one in the configuration. That includes the summaries it shows you when asking for approval.
- **What it publishes in Moodle** (forum replies, feedback, new content) always goes in the language the course already uses, even if you talk to it in another. It only quotes verbatim, in the course's language, the text that is going to be published.
