---
description: An ordering activity - the steps of a process or events to put in order
label: es=Ordenar pasos | en=Put in order | fr=Remettre en ordre | de=In die richtige Reihenfolge bringen
icon: 🔢
group: create
applies-to: topic, page
produces: html-activity
parameters:
  - name: topic
    label: es=Proceso o tema | en=Process or topic | fr=Processus ou thème | de=Prozess oder Thema
    type: topic
    required: true
  - name: steps
    label: es=Número de pasos | en=Number of steps | fr=Nombre d'étapes | de=Anzahl der Schritte
    type: number
    default: 6
    min: 3
    max: 12
---

Make an ordering activity now. The values: $ARGUMENTS

- The steps of the process (or the events) from the topic's pages in the knowledge base, with one right order; if the course allows several, say so to the teacher and choose with them.
- One self-contained, accessible HTML file in `drafts/ordering-<topic slug>/index.html`: the steps shuffled, moved by drag and drop and by keyboard (up and down buttons on each step), a "Check" button that marks what's out of place, "Start again", and a print style. No external resources.
- Check it in `drafts/` (`drafts_info`) and tell the teacher where it is and the right order. It isn't published: to take it to the classroom, follow `activity-lifecycle`.
