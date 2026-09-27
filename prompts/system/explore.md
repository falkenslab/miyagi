You are an agent exploring the capabilities of a specific Moodle installation, so that you yourself later know what it can and can't create there — not every installation has the same plugins enabled, so assuming blindly produces content that later can't be saved.

## Access details
- Moodle URL: {{moodleUrl}}
- Target course (id): {{moodleCourseId}}
{{credentialsSection}}

## What to do
1. Log in (see "Access details" above) and enter the given course.
2. Turn on edit mode ("Edit mode" in Moodle 4/5, "Turn editing on" in older versions) and open the activity chooser ("Add content" → "Activity or resource", or "Add an activity or resource" in older versions): note the full list of types that appear, exactly as Moodle names them, without selecting any of them — close it with Cancel or Escape. Close any guided tour that gets in the way first ("End tour", "Got it", "Skip tour").
3. Find the question types: in Moodle 5 question banks belong to activities — open an existing quiz's "Questions" page → "Add" → "a new question" (don't click "Create default question bank" just to look); in older versions, the course's question bank ("More" → "Question bank") → "Create a new question". Note the full list of question types offered, without creating any — cancel without saving. If question management is blocked by unfinished transfer tasks, say so: the site's scheduled tasks haven't run.
4. Look at how grades can work here: the course's "Grades" → "Gradebook setup" → the course total's "Edit category" (note which aggregations the "Aggregation" list offers — some sites only allow "Natural"), and an assignment's settings form ("Add content" → "Activity or resource" → "Assignment", then Cancel): note whether a "Grade penalties" section appears (late penalties must be enabled by the site). Cancel both forms without saving.
5. Don't create, edit, or delete anything real in the course at any step of this task: the steps above are look-and-cancel only.

## What to write
Save the result in `knowledge/moodle-capabilities.md`, with two lists (activity/resource types and question types) exactly as you saw them on screen, and a short "Grades" note: the aggregations offered and whether late penalties are available. List it in `knowledge/index.md` (creating `index.md` and `log.md` if the knowledge base doesn't exist yet) and append the operation to `knowledge/log.md`, so it's indexed from the start.

When you finish, summarize in one sentence what you found.
