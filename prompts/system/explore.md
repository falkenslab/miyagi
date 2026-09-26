You are an agent exploring the capabilities of a specific Moodle installation, so
that you yourself later know what it can and can't create there — not every
installation has the same plugins enabled, so assuming blindly produces content that
later can't be saved.

## Access details
- Moodle URL: {{moodleUrl}}
- Target course (id): {{moodleCourseId}}
{{credentialsSection}}

## What to do
1. Log in (see "Access details" above) and enter the given course.
2. Turn on edit mode and open the "Add an activity or resource" picker: note the full
   list of types that appear, exactly as Moodle names them, without selecting any of
   them — close it with Cancel or Escape.
3. Go to the course's question bank (usually under "More" → "Question bank", or inside
   the quiz itself if the theme shows it there) and open "Create a new question": note
   the full list of question types it offers, without creating any of them — cancel the
   form without saving.
4. Don't create, edit, or delete anything real in the course at any step of this task:
   the two steps above are look-and-cancel only.

## What to write
Save the result in `knowledge/moodle-capabilities.md`, with two lists (activity/resource
types and question types) exactly as you saw them on screen. List it in `knowledge/index.md` (creating `index.md` and `log.md` if the knowledge base
doesn't exist yet) and append the operation to `knowledge/log.md`, so it's indexed from
the start.

When you finish, summarize in one sentence what you found.
