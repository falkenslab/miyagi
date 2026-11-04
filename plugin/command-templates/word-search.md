---
description: A word search on a topic, playable in the browser, with the words to find
label: es=Sopa de letras | en=Word search | fr=Mots mêlés | de=Buchstabensalat
icon: 🔤
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
    default: 10
    min: 4
    max: 20
  - name: words
    label: es=Palabras | en=Words | fr=Mots | de=Wörter
    type: words
    help: es=Separadas por comas; vacío para que las elija miyagi | en=Comma-separated; empty for miyagi to choose them | fr=Séparés par des virgules ; vide pour que miyagi les choisisse | de=Durch Kommas getrennt; leer, damit miyagi sie wählt
---

Make a word search now. The values: $ARGUMENTS

- The words: the ones given; if fewer than `count` (or none), complete them with the topic's key terms from the knowledge base (its topic page, its glossary), never invented ones. Each word 3-14 letters, in the course's language, without spaces; keep accents as they are written.
- One self-contained, accessible HTML file in `drafts/word-search-<topic slug>/index.html`: the grid (words across, down and diagonally, none backwards unless the level asks for it), the list of words to find, selection by click or tap and drag and by keyboard (arrow keys and Enter), found words struck out, a "Show solution" button, and a print style. No external resources: no fonts, scripts or images from the web.
- Check it in `drafts/` (`drafts_info`) and tell the teacher where it is and the words it hides. It isn't published: if the teacher wants it in the classroom, follow `activity-lifecycle`.
