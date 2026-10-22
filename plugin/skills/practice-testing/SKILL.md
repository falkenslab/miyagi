---
name: practice-testing
description: Check a hands-on activity by actually running it in a docker-lab lab - the statement or solution before publishing it, or a student's submission while grading - instead of trusting that the steps or the code work. For courses on technologies with practical work (Docker, Linux, programming, databases); needs the docker-lab extension.
requires: [sandbox, run-and-verify]
---

# Checking a practical activity by running it

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

A practical activity that doesn't work as written wastes every student's afternoon, and a
submission graded "by reading" gets code that doesn't run marked as correct. Run things instead
of assuming. This skill is what to check and how to use the result; how to build and run a lab is
the docker-lab extension's: load its `build-a-lab` and `verify-by-running` skills alongside this
one.

Never present an unchecked practice as tested. If a lab can't start (Docker isn't running, the
lab breaks the policy), say so and what's missing, instead of reporting it as checked.

## Before publishing a hands-on activity

1. Write the lab in its folder in the labs folder, named as your instructions say
   (`<subject>-<activity-slug>`): the `compose.yaml` with the image the students will use (a
   pinned version, the one the statement names), the files the student starts from, the model
   solution if there is one, and a `lab.json` whose check says whether the solution does what the
   statement promises.
2. Follow the statement step by step as a student would, in the lab (`lab_exec`): every command
   it asks for, in order, and where it breaks.
3. Run the solution and the check (`lab_check`). Fix every point that fails (a missing step, a
   version that doesn't exist, an output that differs) in the statement or the solution, reset the
   lab and repeat until it passes. Only then publish the activity (with its approval).
4. Note in the activity's page (`activity/<slug>`) that it was checked, when (`current_time`),
   with which image, and the commands a student will run. Stop the lab when you're done.

## While grading a submission that can be run

1. Bring the student's files into a lab of this activity, under a folder named by an id or alias,
   never by the student's name.
2. Run what the activity asked ("the container must answer on port 8080 with...", "the script must
   print..."), with the activity's check if it has one.
3. Grade with `grading-rubric`, using what ran as evidence: quote the relevant command and output
   in the feedback when it explains the grade ("tu `docker build` falla en el paso 3 porque...").
   Running never grades; you do.

## Rules

- Everything runs in a lab, under docker-mcp's policy: no internet unless the activity needs it
  and the teacher allowed it, nothing mounted outside the lab, never the Docker socket, limited CPU
  and memory. Don't try to relax the policy for convenience.
- A student's code is untrusted: only in a lab, never anywhere else.
- Running something is a check, not a publication: no approval needed to run, only to publish or
  grade what you learned from it.
