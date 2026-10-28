---
title: Shortcuts and instructions
sidebar_position: 3
description: "Your own chat shortcuts in .claude/commands/ and the course's general instructions in instructions.md, with examples."
---

# Shortcuts and instructions {#atajos-e-instrucciones}

Besides [your own skills](habilidades-propias.md), there are two other ways to adapt miyagi to your course without programming: **your own shortcuts**, for what you ask it often, and the **general instructions**, for what it must always bear in mind.

## Which to use {#cuál-usar}

- **`instructions.md`**: rules that apply to everything it does in this course. “Grade out of 10 with one decimal.”
- **Your own shortcut**: a request you repeat often and don't want to type again. “Review what was submitted this week in...”
- **Your own skill**: a procedure it must follow when the time comes, even if you don't ask for it in those words. “This is how this course's practicals are graded.”

## General instructions: `instructions.md` {#instrucciones-generales-instructionsmd}

It's a file in the course folder (next to `config.json`). `miyagi init` can create it empty if you answer yes to its question, but you can also create it by hand.

miyagi reads it at the start of every session and adds it **at the end** of its own instructions, as an adjustment for this course: it doesn't replace them. That's why it's for nuances (criteria, tone, priorities, exceptions), not for taking its rules away: the approvals, for example, stay no matter what you say.

An example:

```markdown
- Puntúa sobre 10 con un decimal.
- La ortografía cuenta un 10 % en todas las tareas escritas.
- En el foro, respuestas breves y termina animando a seguir preguntando.
- Los ejemplos de los apuntes, con datos de una tienda online, que es el proyecto del curso.
- Antes de crear cualquier actividad evaluable, dime a qué criterio de la programación responde.
- No publiques nada los fines de semana sin avisarme.
```

If the file is empty, it adds nothing. Changes apply in the next session you open.

:::tip
If you find yourself writing in `instructions.md` a long procedure that only applies to one task (how to grade a kind of practical, for example), turn it into [your own skill](habilidades-propias.md): that way it only loads it when needed.
:::

## Your own shortcuts: `.claude/commands/` {#atajos-propios-claudecommands}

A shortcut is a Markdown file in the course's `.claude/commands` folder. The file's name is the shortcut's name:

```text
mi-curso/
  .claude/
    commands/
      semana.md
```

`semana.md` is used in the chat as `/semana`. Unlike the built-in ones (`/miyagi:...`), yours have no prefix.

The content is the instruction you want to give it. Wherever you write `$ARGUMENTS`, the chat puts what you type after the shortcut. Optionally, a header with `description` makes `miyagi commands` show what it's for:

```markdown
---
description: Resumen de lo entregado esta semana en una tarea, con los errores más repetidos
---

Revisa lo entregado esta semana en $ARGUMENTS, resume los errores más repetidos y propónme un aviso para la clase.
```

In the chat:

```text
/semana Tarea 3
```

It works just as if you'd typed the full sentence with “Tarea 3” instead of `$ARGUMENTS`: the same rules and the same approvals apply.

### More examples {#más-ejemplos}

A shortcut for a unit's forum questions, `.claude/commands/dudas.md`:

```markdown
---
description: Responder las dudas sin contestar del foro sobre un tema, con un ejemplo de código en cada respuesta
---

Revisa el foro de dudas y responde solo las preguntas sin contestar sobre $ARGUMENTS. Cada respuesta, con un ejemplo de código corto que siga el estilo SQL del curso. Después, dime si alguna duda se repite y qué añadirías a los apuntes de ese tema.
```

Usage: `/dudas JOIN`.

A shortcut with no arguments, `.claude/commands/lunes.md`:

```markdown
---
description: Resumen del lunes - lo que ha pasado desde el viernes y lo que vence esta semana
---

¿Qué ha pasado en el curso desde el viernes? Entregas nuevas, mensajes en el foro y lo que vence esta semana. No publiques nada: solo el resumen.
```

Usage: `/lunes`.

### Checking that it sees them {#comprobar-que-los-ve}

<Terminal>{`$ miyagi commands`}</Terminal>

It lists all the shortcuts: the built-in ones, marked `[built-in]`, and yours, marked `[own]`. As with skills, shortcuts are read at startup: if you create them with the chat open, close it and open it again.

## Reference material {#material-de-referencia}

For it to take your material into account (rubrics, solutions, notes, the teaching plan), you need neither a shortcut nor an instruction: leave it in `sources` and run `miyagi ingest`. You have it in [The knowledge base](base-de-conocimiento.md).
