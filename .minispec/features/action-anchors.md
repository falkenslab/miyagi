# Actions on classroom items, conversations and views, with richer forms

Issue: [#107](https://github.com/falkenslab/miyagi/issues/107)

## Goal

Actions can sit on the classroom's activities, on submissions and forum threads, on conversations and messages, and in a view's bar, and their forms ask for dates, several choices, a classroom item or a file.

## Context

- Depends on `ui-schema`. Today actions sit on 8 knowledge-base kinds and selected text; the classroom's items (Tu aula) and the conversations have none, and a form has 7 field types.
- Decided by the teacher: classroom activities, submissions and threads, conversations, and views.

## Changes

- Entities in the schema and their data from the host: `activity` (assignment, quiz, forum, section…), `submission`, `thread`, `conversation`, `message`; anchors for their menus and for the bars of Today, Tu aula and Drafts.
- Form fields: `date`, `multichoice`, `classroom-item` (a picker of the course's items), `file` (into `sources/`), and `showIf` for a field that depends on another.
- Student data: a submission's or a thread's author reaches the agent as the alias it already uses, never the name.

- - -

## Acceptance

- An own command on `assignment` shows in its menu in Tu aula and gets its link, due date and pending count.
- A command on `conversation` gets the conversation's title and summary; one on a view shows in its bar.
- A form with a date, a classroom-item picker and a conditional field works at 360 and 1440 px.
- No student name reaches the agent through an action.

- - -
