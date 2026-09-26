---
name: simulate-course
description: Simulate teacher-agent building a complete course from a description passed as the argument (e.g. "Introducción a Docker, 3 temas, FP de grado superior") - create an empty course in moodle-sandbox, run teacher-agent with the course-building skill, auto-approve and log every publication, capture the result and write the test report into tests/. Use to test or demo course creation end to end.
---

# Simulate building a complete course

The course to build: **$ARGUMENTS**

If that line is empty, ask for a description (subject, level, length) before doing anything.

This drives teacher-agent against the sandbox with no human answering approvals: every
publication is approved automatically and logged, and the review happens afterwards, in the
report. That's only acceptable against moodle-sandbox — never point this at a real Moodle.

## 1. Sandbox and build

Follow steps 1-2 of `sandbox-e2e` (find the sandbox, check it's up; ask before a first setup).
Build teacher-agent from the working tree: `npm run build`.

## 2. An empty course

Derive a short name from the description (lowercase, hyphens, e.g. `docker-intro`) and create
the course, enrolling the sandbox's teacher and students:

```
(cd "$SANDBOX" && npm run --silent course -- <shortname> "<Full name>" --json)
```

→ `{ id, shortname, fullname, url, created }`. If `created` is false the course already
exists: if it has content (look at it), pick another short name rather than building over
someone else's run.

## 3. Workspace

In the scratchpad (never in the repo), like `sandbox-e2e` step 5 but with the new course's id
and the teacher's account from `npm run info -- --json`, piped straight into `config.json`
so no password is printed. Label it with the course's name. If the description is about a
technology with hands-on practice (Docker, Linux, a programming language) and Docker is
installed here (`docker version`), set `"allowPracticeRunner": true` so the agent can check its
own practical activities in containers; otherwise set it to `false` explicitly.

Run `explore` first if the workspace has no `knowledge/moodle-capabilities.md`.

## 4. Build it

Start the auto-approver, then the session, both in the background:

```
node .claude/skills/simulate-course/auto-approve.mjs <ws> <scratchpad>/build.log <scratchpad>/approvals.jsonl
node dist/cli.js run --dir <ws> --mode guided --headless \
  --task "Build the complete course described here with the course-building skill: <description>" \
  </dev/null > <scratchpad>/build.log 2>&1
```

A course takes a long time (tens of minutes, many approvals): wait for the notification, and
while it runs, look at `build.log` and `approvals.jsonl` now and then. If the session stalls on
an approval (the log stops at "Asking for human approval" for minutes), the approver isn't
answering: check it's still running before anything else.

## 5. Check the course

- Structure, from the database: sections with their names and summaries, and the modules in
  each (`mdl_course_sections`, `mdl_course_modules` joined with `mdl_modules`), quizzes with
  their question count and `sumgrades`, assignments with due dates and grading.
- Against the plan the agent wrote (`knowledge/course-plan.md`): everything planned exists, in
  order, and nothing is empty or placeholder.
- As a student: the screenshots below include the course seen by a student.

## 6. Screenshots and report

```
(cd "$SANDBOX" && npm run --silent info -- --json) | node .claude/skills/simulate-course/capture-course.mjs <scratchpad>/shots <courseId>
```

It captures the course front page, every activity and resource in course order, each
assignment's "Advanced grading" page (its rubric), each quiz's questions, and the front page
as the student "Alumno Demo". Look at every image, keep what
the report needs, and write it with the `test-report` skill: folder
`tests/<YYYY-MM-DDTHH-MM>-course-<shortname>/`, with the course's structure as built (one row
per section), the plan vs. what exists, the approvals from `approvals.jsonl` (as a list, since
nobody reviewed them live: flag any you wouldn't have approved), the findings, and the lessons
fed back into `plugin/skills/` (most often `course-building`, `content-authoring`,
`activity-design`, `quiz-design`, `moodle-navigation`).
