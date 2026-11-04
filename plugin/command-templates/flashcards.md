---
description: Flashcards to review a topic - a question or term on the front, the answer on the back
label: es=Tarjetas de repaso | en=Flashcards | fr=Cartes de révision | de=Lernkarten
icon: 🃏
group: create
applies-to: topic, page, source
produces: html-activity
parameters:
  - name: topic
    label: es=Temática | en=Topic | fr=Thème | de=Thema
    type: topic
    required: true
  - name: count
    label: es=Número de tarjetas | en=Number of cards | fr=Nombre de cartes | de=Anzahl der Karten
    type: number
    default: 12
    min: 4
    max: 40
  - name: level
    label: es=Nivel | en=Level | fr=Niveau | de=Niveau
    type: choice
    options: [basic, intermediate, advanced]
    default: basic
---

Make flashcards now. The values: $ARGUMENTS

- The cards from the topic's pages and sources in the knowledge base, at the level asked: one idea per card, the front short (a question or a term), the back the answer as the course explains it.
- One self-contained, accessible HTML file in `drafts/flashcards-<topic slug>/index.html`: one card at a time, turned with a click, a tap, Space or Enter, previous and next (arrow keys), "I knew it" and "Review again" to repeat the missed ones, the count left, and a print style with every card. No external resources.
- Check it in `drafts/` (`drafts_info`) and tell the teacher where it is and how many cards it has. It isn't published: to take it to the classroom, follow `activity-lifecycle`.
