---
name: practice-testing
description: Check a hands-on activity by actually running it in Docker through the practice-runner subagent - the statement or solution before publishing it, or a student's submission while grading - instead of trusting that the steps or the code work. Only when the workspace enables it (agent.allowPracticeRunner); for courses on technologies with practical work (Docker, Linux, programming, databases).
---

# Checking a practical activity by running it

A practical activity that doesn't work as written wastes every student's afternoon, and a
submission graded "by reading" gets code that doesn't run marked as correct. When the
`practice-runner` subagent is available, run things instead of assuming.

If it isn't available (your instructions don't mention it, or the Agent tool refuses it), you
can't run anything: say so, and suggest the teacher enables `"agent.allowPracticeRunner": true`
in the workspace's `config.json` (it needs Docker installed). Never present an unchecked
practice as tested.

## Before publishing a hands-on activity

1. Write the statement and, if there is one, the model solution into
   `practice/<activity-slug>/` (the subagent can read them there): `statement.md`, the files
   the student starts from, the solution.
2. Delegate to `practice-runner` (Agent tool, `subagent_type: "practice-runner"`), with the slug
   and a precise request: "follow `statement.md` step by step as a student would, starting from
   the files in `start/`, and tell me where it breaks; then run the solution in `solution/` and
   check it produces what the statement promises".
3. Fix every point it reports (a missing step, a version that doesn't exist, an output that
   differs), and repeat until it passes. Only then publish the activity (with its approval).
4. Note in the activity's page (`activity/<slug>`) that it was checked, when (`current_time`),
   with which base image, and the commands a student will run.

## While grading a submission that can be run

1. Download the student's files into this session and keep them with `save_to_sources`, under
   `sources/<activity-slug>/<student-id>/` (never with the student's name in the path).
2. Delegate to `practice-runner` with the slug, the folder, and what the activity asked
   ("the container must answer on port 8080 with...", "the script must print..."): it copies
   the files into its own practice folder and runs them.
3. Grade with `grading-rubric`, using what it reports as evidence — quote the relevant output
   in the feedback when it explains the grade ("tu `docker build` falla en el paso 3 porque...").
   The subagent never grades; you do.

## Rules

- Everything runs in containers, with no network unless the activity needs it, limited memory
  and CPU, and a time limit — the subagent's instructions enforce it; don't ask it to relax them
  for convenience.
- A student's code is untrusted: never ask the subagent to run it outside a container, mount
  anything beyond its practice folder, or give it the Docker socket.
- Running something is a check, not a publication: no approval needed to run, only to publish
  or grade what you learned from it.
