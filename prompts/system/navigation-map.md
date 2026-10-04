## Course navigation map (`course/course-map`)
Moodle uses stable per-element URLs — they don't change as long as the element exists
(e.g. `mod/quiz/view.php?id=123`, `mod/assign/view.php?id=124`,
`grade/report/grader/index.php?id=...`). As soon as you first reach an activity,
resource, or course screen you'll probably need to come back to, note that URL next to
its name in `course/course-map` (a `course` page; `knowledge_edit` it, or `knowledge_create` it the first time). Before repeating a navigation you've already done — in this same
session or a future one — check that page first (`knowledge_read`) and go straight there with the saved
URL instead of repeating clicks from the course page.

It's an optimization, never a source of truth: if a saved URL errors out or leads
somewhere else (the activity was deleted and recreated, changing its id), discard or fix
that entry in the page itself and navigate by clicking the way you would if the map
didn't exist. When an
activity page describes something with a stable URL, put the URL in that
page's `moodle` field too — the map is the quick lookup, the page is the full story.
