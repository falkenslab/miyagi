---
description: A crossword on a topic, playable in the browser, with definitions as clues
label: es=Crucigrama | en=Crossword | fr=Mots croisés | de=Kreuzworträtsel
icon: ✏️
group: create
applies-to: topic
produces: html-activity
parameters:
  - name: topic
    label: es=Temática | en=Topic | fr=Thème | de=Thema
    type: topic
    required: true
  - name: count
    label: es=Número de palabras | en=Number of words | fr=Nombre de mots | de=Anzahl der Wörter
    type: number
    default: 8
    min: 4
    max: 15
  - name: words
    label: es=Palabras | en=Words | fr=Mots | de=Wörter
    type: words
    help: es=Separadas por comas; vacío para que las elija miyagi | en=Comma-separated; empty for miyagi to choose them | fr=Séparés par des virgules ; vide pour que miyagi les choisisse | de=Durch Kommas getrennt; leer, damit miyagi sie wählt
---

Make a crossword now. The values: $ARGUMENTS

- The words: the ones given, completed up to `count` with the topic's key terms from the knowledge base; each clue a short definition in the course's language, true to how the course explains it (its topic page), never giving the word away.
- One self-contained, accessible HTML file in `drafts/crossword-<topic slug>/index.html`: the grid, the clues across and down, typing in the cells with the keyboard, a "Check" button that marks wrong letters, a "Show solution" button and a print style. No external resources.
- Check it in `drafts/` (`drafts_info`) and tell the teacher where it is, with the words and their clues. It isn't published: to take it to the classroom, follow `activity-lifecycle`.
