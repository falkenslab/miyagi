---
title: Shortcuts and instructions
sidebar_position: 3
description: "Your own chat shortcuts in .claude/commands/, shortcuts with a form that miyagi writes with you, and the course's general instructions in instructions.md, with examples."
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

## Shortcuts with a form: ask miyagi {#atajos-con-formulario-pídeselo-a-miyagi}

If what you repeat changes each time in a few values (the topic, how many words, which ones, the level), you don't have to write the file by hand: ask miyagi to make you the command, or click **🛠️ Make my own command** in the chat's ＋ (also `/miyagi:new-command`).

<Prompt>{`I want a command to make word searches: the topic, the number of words and the words.`}</Prompt>

miyagi asks what it doesn't know (on which items it should show up, whether it's for this subject or all of them), starts from a template if one fits (word search, crossword, matching pairs, put in order, flashcards) and shows you how it will look: its name and icon, where it shows up and the form, field by field. **It only saves it if you say yes**, and you can ask it to change it later the same way.

From the next conversation (✎), the command shows in the ＋ catalog and in the **⋯** menu of the items it applies to. When you launch it, the page asks for its values in a form, with the topic already filled in if you opened it from a topic, and checks what's required and the numbers before sending it. In the conversation you see it by its name (🔤 Word search · …) and miyagi does it with the same approvals as always; what it prepares stays in **Materials**.

If the form has a word list and you open it from a topic, the list starts with the knowledge base's concepts linked to that topic; you can change it before sending. If the topic has no linked concepts, it stays empty and miyagi chooses the words.

To see or change your commands without talking to miyagi, go to **Extensions → My commands** and press **Edit**: its name, icon, where it shows, what it asks for and its instructions. **Try it** shows you how the form will look, and **Save**, once you confirm, applies the change in the same conversation, with the same checks as when miyagi saves one. **Delete** removes it, also after confirming. New commands are still made by talking to miyagi.

Where it's saved:

- **For this subject**: in its folder's `.claude/commands/`, like the shortcuts above; it's used as `/word-search`.
- **For all your subjects**: in `~/.miyagi/own/commands/`; it's used as `/own:word-search` and shows in all of them.

A command with a form is a shortcut with a longer header: its name in each language (`label`), its icon, which group of the catalog it goes in (`group`), on which items it shows up (`applies-to`: a topic, a source, a page, a material…) and its `parameters`, each with its name, its label, its type (text, number, an option from a list, a list of words, a topic, a source or a page), whether it's required, its default value and its limits. What you fill in arrives where the instructions say `$ARGUMENTS`, as `topic: Unit 3 E-R model; count: 10`.

### Variables: the item and the form {#variables-el-elemento-y-el-formulario}

The instructions can name the item you launch the command on and what you fill in its form, and miyagi puts them in when it's launched:

- `{{item.title}}`, `{{item.unit}}`, `{{item.path}}`…: the item's data (a topic has its title, unit, description and activities; a material, its path and date; a source, whether it's in the knowledge base yet).
- `{{form.<name>}}`: a parameter's value.
- `{{subject.name}}` and `{{today}}`: the subject and today's date.

```markdown title="~/.miyagi/own/commands/word-search.md"
---
description: A word search with a topic's vocabulary
label: es=Sopa de letras | en=Word search
applies-to: topic
parameters:
  - name: count
    label: es=Número de palabras | en=Number of words
    type: number
    default: 10
---
Make a word search of {{form.count}} words with the vocabulary of "{{item.title}}" ({{item.unit}}).
```

When the command is saved each variable is checked: an `{{item.date}}` that none of the `applies-to` items has is refused, saying which ones there are. Every item's fields are in the page's schema, [`schema/ui.schema.json`](https://github.com/falkenslab/miyagi/blob/main/schema/ui.schema.json), and miyagi knows them: ask it in the chat for "a command on every topic that…" and it writes the instructions with them.

:::info What a command can't do
A command is instructions, nothing more: it runs with the same approvals, the same permissions and the same checks as anything you ask in the chat. That's why miyagi won't save one that tries to give itself tools (`allowed-tools`), run something in the console (a line with !`…`) or pull a file in with @path.
:::

## Reference material {#material-de-referencia}

For it to take your material into account (rubrics, solutions, notes, the teaching plan), you need neither a shortcut nor an instruction: leave it in `sources` and run `miyagi ingest`. You have it in [The knowledge base](base-de-conocimiento.md).
