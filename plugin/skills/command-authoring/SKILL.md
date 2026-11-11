---
name: command-authoring
description: Write the teacher's own command by talking - something they make again and again with values that change each time (a word search on a topic with its number of words, a crossword, flashcards, a weekly summary) - as a command with parameters the page turns into a form, from a template or from scratch, saved only after their yes, for this subject or for all of them; and edit or replace one they already have. Use when the teacher asks for "a command", "a button", "a shortcut" or "something reusable" to make a kind of activity or material, or to change one of their own commands.
---

# Writing the teacher's own commands

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. The command's labels go in the teacher's language (and the others, if they want); its instructions in English, like miyagi's.

A command is a page of instructions with a name, an icon and the values that change each time.
The page shows it in the catalog (＋) and in the ⋯ menu of the items it applies to, and asks its
values in a form; the values reach you as `name: value` pairs where the instructions say
`$ARGUMENTS`. It's instructions, not code: it runs as any turn, with the same approvals.

## 1. What it makes

Ask, briefly and only what you can't tell:

- What it should make, and what the teacher would change each time (the topic, how many, the
  words, the level…). Those are its parameters; everything else is fixed in the instructions.
- On which items it should show up: a topic, a source, a knowledge page, a material, selected text.
- For this subject only, or for all their subjects.

Look at what exists first (`commands_list`): if a template fits (word search, crossword,
matching, ordering, flashcards), start from it (`commands_read` with `from: "template"`) and
adapt it; if the teacher already has a similar command, offer to edit it instead.

## 2. Write it

The file, frontmatter then instructions:

```markdown
---
description: One line, in English, of what it makes
label: es=Sopa de letras | en=Word search
icon: 🔤
group: create            # day, create, plan, memory or classroom
applies-to: topic        # topic, material, quiz, source, page, plan, draft, text
produces: html-activity  # html-activity, quiz, document or page
parameters:
  - name: topic          # lowercase, digits, _
    label: es=Temática | en=Topic
    type: topic          # text, number, choice, words, topic, source or page
    required: true
  - name: count
    label: es=Número de palabras | en=Number of words
    type: number
    default: 10
    min: 4
    max: 20
---

Make a word search now. The values: $ARGUMENTS
...
```

- A `topic`, `source` or `page` parameter is filled from the item the teacher launched it on;
  `words` is a list separated by commas; `choice` needs its `options`. Up to 8 parameters, few is
  better: what miyagi can decide well, don't ask.
- The instructions say what to make, from what (the knowledge base, the sources, never invented),
  where it goes (`drafts/<kind>-<slug>/`, or `materials/` for a quiz or notes) and what to report;
  and that nothing reaches the classroom without the usual process (`activity-lifecycle`).
- Not allowed, and refused when saved: any frontmatter key not shown above (allowed-tools above all, which would grant tools), a line
  like !`…`, an @path. A command never gets more power than the session has.

Check it with `commands_check` until it's valid.

## 3. The teacher's yes, then save

Show the teacher what they'll get, in their language: its name and icon, where it shows up, the
form (each field with its label, type, default and whether it's required), where it's saved and,
in a sentence, what it does. Then `request_human_approval` with that as its summary, naming the
command by its file name, and right after the yes, `commands_save`. Without that yes it isn't
saved (the save is refused).

Say it shows in ＋ and on its items from the next conversation (✎). To change it later, read it
(`commands_read`), edit it the same way and save it again under the same name: one approval each time.
