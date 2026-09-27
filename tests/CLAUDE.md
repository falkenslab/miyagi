# CLAUDE.md — tests/

This folder is the record of every end-to-end test of teacher-agent against a real Moodle (usually moodle-sandbox). It is not a unit-test suite: nothing here runs in CI. Each report is the evidence that a behavior worked, and the source of the lessons that went into the agent.

## Layout

```
tests/
  README.md                          index, newest first (one row per test)
  CLAUDE.md                          this file
  <YYYY-MM-DDTHH-MM>-<slug>/
    README.md                        the full report
    assets/NN-<what>.png             its screenshots, referenced relatively
```

- The folder name is the test's start time in UTC (from the first session folder's name, `sessions/2026-09-26T12-53-21-628Z-run` → `2026-09-26T12-53`) plus a short slug for what was tested (`guided-run`, `course-docker-intro`...). It sorts chronologically.
- Screenshots are numbered in reading order. Keep them PNG, only those the report uses, and a few hundred kB each at most: this is a public repo, and every image stays in its history.

## Writing a report

Use the `test-report` skill; `sandbox-e2e` and `simulate-course` end with it. A report has, in this order: a metadata table (date, environment, course, agent and kit versions, account, workspace), the **verdict** first, what ran (sessions with duration and tool-call counts taken from their `transcript.jsonl`, never estimated), the expected answer vs. what the agent did, screenshots with a caption saying what to look at, every approval in order — and anything published **without** one —, findings with where each was fixed, what was added to which skill, and what the test didn't cover.

Write it in Spanish, for the project's maintainer.

## Never commit

- Passwords or tokens: the sandbox's (from `npm run info`), the Claude token. Grep the report and check the screenshots (a login form, a URL with a token) before committing.
- Real people's data. Only the sandbox's fictitious students may appear by name; a test on a real course gets anonymized screenshots or none.
- Workspace files (`config.json`, `sessions/`, transcripts): quote the relevant lines instead.

## Updating the index

Add the new row at the top of the table in `README.md`: date, a link to the report with a one-line description, the environment, the result (Superada / Superada con hallazgos / Fallida) and the number of findings with their state. Reports are never rewritten after the fact: if a later change fixes something a report found, the later report says so.
