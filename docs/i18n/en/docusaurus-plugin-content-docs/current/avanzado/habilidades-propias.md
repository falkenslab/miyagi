---
title: Your own skills
sidebar_position: 2
description: "How to teach miyagi a new skill for your subject with a SKILL.md file, with a complete example of SQL style conventions."
---

# Your own skills {#habilidades-propias}

If there's something in your subject that the assistant should always do in a particular way, you can write it down for it as **your own skill**: a text file with instructions that the assistant loads when the task calls for it, just like [its own](../guia/habilidades.md). No programming needed.

## Where it goes {#dónde-va}

Inside the course folder, one folder per skill with a `SKILL.md` file:

```text
mi-curso/
  .claude/
    skills/
      estilo-sql/
        SKILL.md
```

The `.claude` folder starts with a dot, so on Mac and Linux it may be hidden in the file explorer. Create it anyway; miyagi looks for it in the course folder every time it starts.

## What it looks like {#qué-forma-tiene}

The file starts with a header (frontmatter) between two `---` lines and continues with the instructions in Markdown:

```markdown
---
name: estilo-sql
description: Una línea que dice qué hace y cuándo usarla.
---

# Título

Las instrucciones, paso a paso.
```

- **`name`**: the skill's name. Use the same as the folder, in lowercase and with hyphens.
- **`description`**: the most important part. The assistant sees the name and description of all its skills, and it's from the description that it decides **when** to load the rest of the file. Say what it does and in which situations it's used (“use it when writing...”, “when asked to grade...”). Write it on a single line: `miyagi skills` only shows one-line descriptions.
- **The body**: the steps, as you'd explain them to a student teacher. Be specific: file paths, criteria, examples, what it must not do.

## A complete example: the course's SQL style {#un-ejemplo-completo-el-estilo-sql-del-curso}

In an Introduction to SQL course, you want all the SQL students see (notes, assignment statements, solutions, quiz questions, forum replies) to follow the same conventions, and for them to be taken into account when grading. Create `.claude/skills/estilo-sql/SKILL.md` with this:

````markdown
---
name: estilo-sql
description: Convenciones de estilo SQL de este curso (MariaDB) - úsala siempre que escribas o revises SQL que vayan a ver los alumnos (apuntes, enunciados, soluciones, preguntas de cuestionario, respuestas del foro) y al corregir entregas con SQL.
---

# Estilo SQL del curso

Todo el SQL que publiques en este curso sigue estas convenciones, sin excepciones. Los alumnos
aprenden imitando: un ejemplo con otro estilo les enseña ese otro estilo.

## Convenciones

1. Palabras reservadas en MAYÚSCULAS: `SELECT`, `FROM`, `WHERE`, `INSERT INTO`, `VARCHAR`,
   `PRIMARY KEY`, `NOT NULL`...
2. Nombres de tablas y columnas en snake_case y minúsculas, sin tildes ni eñes:
   `clientes`, `fecha_alta`, `id_cliente`. Tablas en plural, como en la base de datos `tienda`.
3. Una cláusula por línea (`SELECT`, `FROM`, `JOIN`, `WHERE`, `GROUP BY`, `HAVING`,
   `ORDER BY`), y las columnas de un `SELECT` largo, una por línea con cuatro espacios.
4. `INSERT` siempre con la lista de columnas explícita. Nunca `INSERT INTO alumno VALUES (...)`.
5. Nunca `SELECT *` en soluciones ni en apuntes, salvo en el primer ejemplo del tema 4, donde se
   explica qué hace y por qué no se usa.
6. `JOIN` siempre explícito con `ON`; nunca la coma en el `FROM` con la condición en el `WHERE`.
7. Alias de tabla cortos y con `AS`: `FROM clientes AS c`.
8. Cada sentencia termina en punto y coma.
9. Comentarios con `--` y un espacio, en español.

## Ejemplo de referencia

```sql
-- Pedidos de cada cliente, de más a menos
SELECT
    c.nombre AS cliente,
    COUNT(p.id_pedido) AS pedidos
FROM clientes AS c
LEFT JOIN pedidos AS p ON p.id_cliente = c.id_cliente
GROUP BY c.id_cliente, c.nombre
ORDER BY pedidos DESC;

INSERT INTO clientes (nombre, email, ciudad)
VALUES ('Ana Pérez', 'ana@ejemplo.com', 'La Laguna');
```

## Al escribir para los alumnos

- Antes de publicar cualquier bloque SQL, repásalo contra la lista de arriba.
- En el editor de Moodle, el SQL va en un bloque de código (`<pre>`), con su sangría.
- En las preguntas de cuestionario con código, el código cumple estas convenciones también
  en los distractores: que una opción sea incorrecta por su lógica, no por su estilo.

## Al corregir

- El estilo no cambia la nota salvo que la rúbrica de la actividad lo diga (la de la práctica
  final, sources/rubrica-practica-consultas.md, lo puntúa en «Legibilidad»). Si no lo dice,
  menciónalo solo en la retroalimentación, con la línea concreta y cómo quedaría.
- Un `INSERT` sin lista de columnas sí es un error, no de estilo: se rompe en cuanto la tabla
  cambia. Explícalo así en la retroalimentación.

## Lo que no debes hacer

- No reescribas el SQL que un alumno escribió en el foro: si respondes, muestra tu versión
  aparte.
- No cambies estas convenciones por tu cuenta. Si una no encaja en un caso, pregúntame.
````

The tutorial [An Introduction to SQL course](../casos-de-uso/index.md) shows this skill in action.

## Checking that it sees it {#comprobar-que-la-ve}

From the terminal, in the course folder:

```bash
miyagi skills
```

Your skill shows up in the list marked `[own]`, with its description. Then try it in the chat by asking for exactly that task, for example *“write three JOIN examples for the unit 4 notes”*. If the task matches the description, it will load it; if not, adjust the description so it names that situation.

Skills are read when miyagi starts: if you had the chat open, close it with `/exit` and open it again (with `--continue` if you want to carry on with the same conversation).

## What a skill can and can't do {#lo-que-una-habilidad-puede-y-no-puede-hacer}

A skill teaches it **how** to do something with the tools it already has: those of the moodle-teacher extension with your Moodle, its notes, the `drafts` folder, the documents in `sources` and those of the [extensions](extensiones.md) you have enabled, like the [docker-lab](practicas-docker.md) labs. **It doesn't give it new tools.**

- **It can**: set criteria, steps, conventions, templates and examples; tell it which document in `sources` to read; build on other skills (for example, “grade with `grading-rubric`” or “test it with `practice-testing`”).
- **It can't**: give it a terminal, let it touch `knowledge` without its `knowledge_*` tools, write files outside `drafts` (and the docker-lab labs folder, if you have it enabled), read `config.json` or `.env`, skip the approvals or connect it to other services.

That's why a skill that says “run this program” will only work if you have the [docker-lab](practicas-docker.md) extension installed and enabled, and then inside one of its labs. Without it, the assistant will tell you it can't run anything.

## Another example: grading Docker Compose practicals {#otro-ejemplo-corregir-prácticas-de-docker-compose}

A skill that builds on the docker-lab labs:

```markdown
---
name: corregir-practicas-docker
description: Corregir las prácticas de Docker Compose de este curso ejecutándolas - úsala al corregir cualquier tarea cuyo nombre empiece por "Práctica".
---

# Corregir una práctica de Docker Compose

1. Con la habilidad practice-testing, lleva los archivos de la entrega a un laboratorio de
   la práctica, en una carpeta con el id del alumno (nunca su nombre).
2. Levanta lo que pide el enunciado y comprueba que el servicio web responde en el puerto 8080
   con la página del enunciado.
3. Aplica la rúbrica de la práctica (sources/rubricas/):
   - Arranca sin errores: 4 puntos.
   - Responde en el 8080 con lo pedido: 4 puntos.
   - Usa volúmenes para los datos, como pide el enunciado: 2 puntos.
4. En la retroalimentación, copia la línea exacta del error si algo no arranca.
```

## Tips {#consejos}

- **One skill, one job.** Better `estilo-sql` and `corregir-practicas-docker` separately than a single one that mixes everything: each one's description says clearly when to use it.
- **What always applies goes in `instructions.md`.** If it doesn't depend on the task (“grade out of 10”), it isn't a skill: it's a [general instruction](atajos-e-instrucciones.md).
- **Your documents go in `sources`.** A skill can point to your rubric instead of copying it.
- **No personal data.** Don't write students' names in a skill: it's a file the assistant reads every time it uses it.
