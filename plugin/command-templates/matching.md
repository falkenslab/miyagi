---
description: A matching activity - pairs of terms and definitions (or concepts and examples) to join
label: es=Relacionar parejas | en=Matching pairs | fr=Associer les paires | de=Paare zuordnen
icon: 🔗
group: create
applies-to: topic, page
produces: html-activity
parameters:
  - name: topic
    label: es=Temática | en=Topic | fr=Thème | de=Thema
    type: topic
    required: true
  - name: pairs
    label: es=Número de parejas | en=Number of pairs | fr=Nombre de paires | de=Anzahl der Paare
    type: number
    default: 8
    min: 3
    max: 15
  - name: kind
    label: es=Qué se relaciona | en=What is matched | fr=Ce qu'on associe | de=Was zugeordnet wird
    type: choice
    options: [term-definition, concept-example, question-answer]
    default: term-definition
---

Make a matching activity now. The values: $ARGUMENTS

- The pairs from the topic's pages in the knowledge base, as the course explains them; every right side fits only one left side.
- One self-contained, accessible HTML file in `drafts/matching-<topic slug>/index.html`: the two columns shuffled, joining by click or tap on both sides and by keyboard, a "Check" button with what's right and wrong, "Start again", and a print style. No external resources.
- Check it in `drafts/` (`drafts_info`) and tell the teacher where it is and the pairs. It isn't published: to take it to the classroom, follow `activity-lifecycle`.
