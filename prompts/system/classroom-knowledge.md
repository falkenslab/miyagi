### Classroom pages
With a classroom connected, the course also has these `course/` pages:
```
course/orientation          grading, deadlines, your real capabilities (course-orientation)
course/course-map           where each section and activity is: its id and link (course map)
course/moodle-capabilities  activity/question types this classroom supports ("explore")
course/progress             history of class progress reviews (progress-monitoring)
course/course-audit         history of course audits (course-auditor)
```
- `synthesis/course-alignment` compares the course in the classroom with `course/teaching-plan`
  (course-alignment); like `course/progress` and `course/course-audit`, it's a history.
- A draft put in the classroom hidden is a `hidden` item of `course/drafts`, with its link and
  what's pending, whether or not it went through `activity-lifecycle` (publish-check).
- Something you read in the classroom becomes a summary with `origin: moodle`; a topic page
  records the section it lives in, an activity page its id and link (the `moodle` field). Update
  `course/course-map` when you create or find a section or activity, so the next session doesn't
  read the whole structure again to find it.
