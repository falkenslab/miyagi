---
name: student-impact-review
description: Review any change that affects what miyagi publishes or changes in Moodle (grades, feedback, forum replies and announcements, new or edited content, quiz imports) against what students will see and the guardrails that protect them - the approval step, fairness and consistency, no deletions or enrolment changes, no personal data in the knowledge base. Use when changing prompts/system/teacher-*, evaluable-submission-*, plugin/skills that act in Moodle, or the approval wiring.
---

# Review a change against what students will see

Everything miyagi publishes lands on real students: a grade and its feedback, a reply
under their question, an announcement to the whole class, a quiz they'll sit. It's hard to
take back once seen. A change that works but weakens one of the guardrails below is a
regression, even if no test fails.

## Questions for the change

1. **Is the approval step intact?** In `guided` (run) and `chat`, `request_human_approval`
   must come right before each save/post/publish — not before browsing, not batched after the
   fact. `interactive` reviews every step; only `autonomous` publishes unasked. Check the
   rendered prompts with `verify` (`approval before publishing` in `check-prompts.mjs`).
2. **Is grading fair and consistent?** The teacher's own criteria (Moodle's rubric, then
   `sources/`) win over the agent's judgment; the same answer gets the same grade; every grade
   has feedback that says what failed and how to improve; a missing submission is 0 only once
   the deadline has passed (and the teacher's policy in `sources/` overrides that).
3. **Does it stay inside the course?** No other courses, no platform settings, no deletions,
   no enrolment or role changes — the "General rules" of `teacher-run.md`/`teacher-chat.md`.
   A new skill that needs any of those must say so and go to the user, not quietly widen them.
4. **What does the class see, and when?** A correction of a student's wrong forum answer is
   respectful and explains why; the teacher doesn't answer first what a classmate could; an
   announcement leads with the deadline or change. New content is checked with "Preview" or as
   a student before being called done.
5. **Where does student data go?** The knowledge base keeps class-level patterns
   (`progress.md`, forum doubts per topic), never a per-student record with names, grades or
   quotes. `check-knowledge.mjs --names "..."` fails on a page naming an enrolled student.
6. **Is it truthful about what happened?** The closing summary counts what was actually
   graded or posted; anything left half-done after an interruption is reported, never implied
   done.

## Known traps

- **Settings changes are publications too**: in the first sandbox run the agent enabled
  "Feedback comments" on the assignment (so it could write the feedback the rubric requires)
  without asking — the prompts only listed grades, forum posts and new content. Changing an
  existing activity's or the course's settings is now an explicit checkpoint; keep it listed.
- **A batch approval must list every item**: one approval may cover a batch (the publish gate,
  ADR-008, lets a batch through until the next approval request or the teacher's next
  message), but only if its summary names each item with what gets published — every student
  with their grade and the gist of their feedback. "Approval of the grades" with no list
  would publish them unreviewed.
- **Moodle saves grades immediately** in the grader view: "approve then save" must be the
  order, never "save then report".
- **Group assignments**: one grade and feedback apply to every member; grading "per student"
  there repeats (and may contradict) the same correction.
- **Rejected approval**: the agent must not retry the same publication with different words;
  it moves on and tells the human (`human-approval-rejected.md`).

## Check

- Run `verify`.
- For anything that changes what gets published, run it against the sandbox (`sandbox-e2e`):
  its seeded workload has a right answer for each grade and each reply. Look at the grader
  report and the forum as the students would.
