---
name: smoke-ingest
description: Run a real `teacher-agent ingest` on a fixed fixture (a topic syllabus and an assignment rubric) in a scratch workspace and check the knowledge base it builds (links, index, one summary per source, the course layer's topic and activity pages, the teacher's grading criteria kept, no student names). Use after changing prompts/, plugin/skills that feed the knowledge base, or the agent-kit knowledge plugin - typecheck can't catch a prompt the model stops following.
---

# Smoke-test the knowledge base with a real ingest

Prompt changes are only proven by running the model. This costs a few minutes and some tokens, so it's for changes to how the knowledge base is built or read, not every commit.

## 1. Scratch workspace

Never inside this repo, and never in a real course workspace: use the session's scratchpad.

```
WS=<scratchpad>/smoke-ingest
rm -rf "${WS:?}" && mkdir -p "$WS/knowledge" && cp -r .claude/skills/smoke-ingest/fixture/sources "$WS/"
cat > "$WS/config.json" <<'JSON'
{ "classroom": { "label": "smoke", "url": "https://moodle.example.com", "courseId": "4" },
  "agent": { "role": "teacher", "language": "español" } }
JSON
```

The fixture is a teacher's syllabus for topic 1 (objectives, contents, how the topic is assessed, common mistakes from previous years) and the rubric of its assignment (weights, levels, a late and a missing-submission policy). Together they exercise the teacher's layer: a topic page, an activity page holding the grading criteria, and the "teacher's criteria win" rule.

## 2. Run it

```
npm run build
node dist/cli.js ingest --dir "$WS" </dev/null > "$WS/../smoke-ingest.log" 2>&1
```

It takes a few minutes: run it in the background and wait for it to finish. A Claude token must be available (environment or `~/.teacher-agent/config.json`); the run is non-interactive.

## 3. Check

```
node .claude/skills/smoke-ingest/check-knowledge.mjs "$WS"
```

Must pass: no broken links, every page in `index.md` (the script exits 1 otherwise), and both fixture files mentioned by some page. Then look at, in the log and the pages:

- **Skills loaded**: the log shows `knowledge:knowledge-ingest`, `knowledge:knowledge-pages` and `knowledge:knowledge-lint` being applied.
- **Course layer**: a `topics/` page for topic 1 linking both summaries, and an `activities/` page for "Tarea 1" holding the rubric's weights and both submission policies (late ×0.8, missing → 0 with "No se ha recibido ninguna entrega") — that page is what `grading-rubric` reads before grading.
- **Concepts**: variable, the four types and type conversion get their own pages, with the syllabus's common mistakes attached to them.
- **The closing summary** counts pages from `log.md` and matches the files on disk.

Report what passed and what didn't, quoting the offending page lines. A failure here usually means a prompt or skill instruction the model skipped: fix the wording and run again rather than adjusting the check.
