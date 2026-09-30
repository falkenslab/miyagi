---
name: test-report
description: Write the report of an end-to-end miyagi test into tests/<YYYY-MM-DDTHH-MM>-<slug>/ - README.md with the full report and its screenshots in assets/ - add it to the tests/README.md index, and turn its findings into changes in the agent. Use at the end of sandbox-e2e, simulate-course, or any test of the agent against a real Moodle.
---

# Write a test report into tests/

Read `tests/CLAUDE.md` first: layout, naming, what a report contains and what must never be
committed. This skill is the procedure.

## 1. Gather the evidence

- **Sessions**: for each session of the test (`<workspace>/sessions/<ts>-<kind>/`), the
  duration and tool calls per kind from its `transcript.jsonl`, and the agent's closing summary
  from the console log:

  ```
  node -e 'const L=require("fs").readFileSync(process.argv[1],"utf8").trim().split("\n").map(JSON.parse);const pre=L.filter(x=>x.event==="pre_tool_use");const by={};for(const p of pre)by[p.tool]=(by[p.tool]||0)+1;console.log(((new Date(L.at(-1).ts)-new Date(L[0].ts))/60000).toFixed(1),"min",pre.length,"calls",by)' <transcript.jsonl>
  ```

- **Approvals**: every `request_human_approval` summary, in order, with its time
  (`grep '"pre_tool_use".*request_human_approval' transcript.jsonl`). Then look for what was
  published without one: settings pages (`course/modedit.php`), saves in the grader, posts —
  anything that changed Moodle between two approvals.
- **Ground truth** in Moodle's database, not the agent's word: grades and feedback, forum posts
  (one per intended reply), the structure of anything it created (sections, activities,
  questions). Query it with `docker compose exec -T db psql -U moodle -d moodle` in the sandbox.
- **Screenshots**: `capture-moodle.mjs` (see `sandbox-e2e`), then look at every image and keep
  only the ones the report needs. Check none shows a password or token.

## 2. Write it

Folder: `tests/<YYYY-MM-DDTHH-MM>-<slug>/` — the UTC start time of the first session, and a
slug for what was tested. Copy the chosen screenshots to `assets/` (numbered in reading order)
and write `README.md` in Spanish, in this order:

1. Title (a name, not "Informe de prueba") and one paragraph saying what was tested.
2. Metadata table: date and local time span, environment, course, agent and kit versions (the
   commit if it wasn't a release), account, workspace and its `sources/`.
3. **Verdict** first: Superada / Superada con hallazgos / Fallida, and why, in a few lines.
4. What ran: one row per session (command, duration, tool calls, result).
5. Expected vs. actual: a table per area (grades, forum, content, created course...), with the
   screenshots as evidence right after — each with an italic caption saying what to look at.
6. The approvals in order, numbered, with anything unapproved marked `—` in its place.
7. Findings: what, state (corrected / turned into a rule / open), and where (file paths).
8. What was added to which skill or prompt.
9. What the test didn't cover.

Plain prose, no marketing tone; quote real values (grades, counts, times).

## 3. Index it

Add a row at the top of `tests/README.md`: date, link + one-line description, environment,
result, findings and their state.

## 4. Close the loop

Every finding becomes a change before the report is committed — in `plugin/skills/` for how
Moodle behaves or a rule the model followed only by luck, in `prompts/` for a guardrail gap
(check it with `student-impact-review`). Quote Moodle's UI strings only after finding them in
the sandbox's language packs. Commit the fixes and the report separately (`commit` skill): the
report as `docs(tests): informe <slug>`.

If the user wants to see it right away, also publish the report as an artifact (same content,
screenshots as files), and put the artifact's link in the report's metadata table.
