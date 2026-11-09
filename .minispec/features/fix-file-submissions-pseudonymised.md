# Grading file submissions needs the teacher to hand over each file

Issue: [#95](https://github.com/falkenslab/miyagi/issues/95)

## Problem

With moodle-teacher's default `student_data: pseudonymize`, `/miyagi:grade` can't read a submission that is a file. It reports «No puedo descargar las 3 entregas» and offers to have the teacher pass the files one by one, each under an alias such as `A-6KTXW8`. The teacher sees students by name in Moodle and has no way to tell which alias is which, except by comparing submission times. The docs' SQL tutorial still says miyagi takes the submissions and runs them in Docker by itself.

## Cause

By design in moodle-mcp 0.8.0: `get_submissions` gives only the file's name when pseudonymizing, and `download_file` refuses because «a file's content can't be» pseudonymized. Text submissions do reach the agent. The other option, `clear`, is documented as only for an AI running on the teacher's computer, so it isn't a way out with Claude.

## Solution

Pending, tracked in https://github.com/falkenslab/moodle-mcp/issues/59. Decide the flow for file submissions: for instance, the teacher gives a Moodle bulk download and miyagi or moodle-mcp strips the names and pairs each file with its alias on the computer, without the names reaching the model. Whatever the flow, the panel must tell the teacher how to find the right file, and the docs must describe it.

## Verification

Pending. Grade a three-student file assignment on the sandbox with `pseudonymize` on, check that no student name reaches the transcript, and that each grade lands on its student.
