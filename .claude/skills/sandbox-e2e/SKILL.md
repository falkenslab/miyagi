---
name: sandbox-e2e
description: Exercise teacher-agent end to end against a local Moodle from the moodle-sandbox repo - locate the sandbox, check it's up, seed the teacher's workload (students, submissions, forum doubts), build a scratch workspace from the sandbox's info contract, run explore/run/chat, check what the students would see (grades, feedback, forum replies), and deliver a report with screenshots whose lessons go back into the agent's skills. Use to validate changes that act in Moodle (grading, forum, content, explore) before trying them on a real course.
---

# End-to-end test against the Moodle sandbox

moodle-sandbox (github.com/falkenslab/moodle-sandbox) is a disposable Moodle 5 in Docker with
a seeded course (`sandbox-course`) and teacher/student accounts. It's its own repo on
purpose, not a submodule: one shared service for every agent (its Docker project name is
fixed, so two checkouts would fight over the same containers and volumes). student-agent's
sessions use it too: look before you change anything there, and never `reset` it without
asking.

## 1. Find it

`SANDBOX=${MOODLE_SANDBOX_DIR:-../moodle-sandbox}`. If there's no `package.json` there, stop
and tell the user how to get it rather than guessing another path:

```
git clone https://github.com/falkenslab/moodle-sandbox.git ../moodle-sandbox
```

## 2. Is it up?

```
git -C "$SANDBOX" status -sb      # someone else's uncommitted work? leave it alone
(cd "$SANDBOX" && npm run status)
```

If it isn't installed or running, `npm run setup` / `npm run up` there — ask first: the first
setup takes 40-60 minutes on Windows, and its port may clash with another Moodle
(`MOODLE_SANDBOX_PORT` in its `.env`; see its `moodle-sandbox-troubleshooting` skill).

## 3. Give the teacher something to do

The base seed has activities but no student work. `npm run activity` in the sandbox adds, once
(it's a no-op afterwards):
- coherent content for topic 1 (variables and data types) in the page, the assignment
  ("Tarea 1: explica qué es una variable", graded out of 10 with its criteria in the prompt)
  and the forum;
- three more students — Lucía Martín, Marcos López, Sara Gil — whose submissions are good,
  thin, and conceptually wrong respectively (the seeded `alumno` submits nothing);
- two forum threads: a doubt nobody answered, and one a classmate answered **wrongly**
  (variables "can't change"), which a good teacher must correct.

That's what makes a run checkable: there's a right answer for each grade and each reply.

`seed` and `activity` end by running Moodle's pending ad-hoc tasks (the sandbox has no cron).
If `explore` reports the question bank as blocked by `transfer_question_categories`, the
sandbox predates that fix: `npm run tasks` there.

## 4. Connection info

Depend only on the sandbox's contract, never on its internals:

```
(cd "$SANDBOX" && npm run --silent info -- --json)
```

→ `{ url, running, course: { id, shortname }, teacher: { username, password }, ... }`, exit ≠ 0
if it isn't installed, running or seeded.

## 5. Scratch workspace

Never commit or print the sandbox's passwords: write the workspace with a script that pipes
the info straight into `<scratchpad>/sandbox-teacher/config.json`:

```json
{ "classroom": { "label": "sandbox (profesor)", "url": "<url>", "courseId": "<course.id>",
                 "username": "<teacher.username>", "password": "<teacher.password>" },
  "agent": { "role": "teacher", "language": "español" } }
```

To exercise the "teacher's criteria win" rule, drop a rubric into `sources/` (e.g. one that
weighs concepts 6, examples 3, clarity 1, and says a missing submission gets 0 with the note
"no submission received").

## 6. Run it

A Claude token must be available: `CLAUDE_CODE_OAUTH_TOKEN` in the environment, or the one
saved in `~/.teacher-agent/config.json` (or `~/.student-agent/config.json`, passed through the
environment for the run — never copied into a workspace file). In Git Bash, build that path
with `path.join(os.homedir(), ".student-agent", "config.json")` inside `node -e`: a literal
`"/.student-agent/..."` argument gets rewritten to `C:/Program Files/Git/...`, the variable
ends up empty, and the run stops at agent-kit's interactive token prompt.

- `explore` first (short, look-and-cancel, nothing created):
  `node dist/cli.js explore --dir <ws> --headless </dev/null > <scratchpad>/explore.log 2>&1`
  → `knowledge/moodle-capabilities.md` with the activity and question types.
- `chat` needs a real terminal: ask the user to run
  `node dist/cli.js chat --dir <ws>` and tell you what to try ("corrige la Tarea 1", "¿hay
  dudas sin responder en el foro?").
- `run` in the background, `guided` so every grade or post stops for approval:
  `node dist/cli.js run --dir <ws> --mode guided --headless`. Without a terminal nobody answers
  the approval; either ask the user to run it, or use `--mode autonomous` — which publishes
  without asking and is **only** acceptable against the sandbox.

## 7. Inspect

- The console log and `sessions/<latest>/transcript.jsonl`: which skills were loaded
  (`grading-rubric`, `forum-facilitation`...), which pages it read, what it published.
- In Moodle, as admin (from `info`): the grader report — Lucía high, Marcos low with feedback
  on what's missing, Sara penalised on the concepts with a correction, and `alumno` left
  ungraded (the due date is a week after seeding: `grading-rubric` only gives 0 for a missing
  submission once the deadline has passed) — and the forum: the bool doubt answered with an
  example, Sara's wrong reply corrected respectfully.
- The knowledge base: `node .claude/skills/smoke-ingest/check-knowledge.mjs <ws> --names "Lucía,Marcos,Sara,Martín,López,Gil"`
  — no broken links, and no student names in any page (class-level notes only).

## 8. Report, and feed the lessons back

A test isn't finished with a chat summary. Deliver an elaborate report with screenshots, and
turn every lesson into a change in the agent itself.

1. **Screenshots of the final state**, as admin, plus one student's view:

   ```
   (cd "$SANDBOX" && npm run --silent info -- --json) | node .claude/skills/sandbox-e2e/capture-moodle.mjs <scratchpad>/shots ["Sara Gil"]
   ```

   It captures the course, the submissions table, the grader per seeded student, the
   gradebook, each forum thread (deduplicated), the quiz's questions and front page, and the
   assignment and a thread as the chosen student ("Log in as"). It hides the fixed course
   index and sticky footer, which otherwise cover the start of full-page captures. Look at
   the images before using them.
2. **The report**, with the `test-report` skill: the evidence from the transcripts and the
   database, the report in `tests/<YYYY-MM-DDTHH-MM>-<slug>/README.md` with the screenshots
   in `assets/`, its row in `tests/README.md`, and every finding turned into a change in
   `plugin/skills/` or `prompts/` before committing.
