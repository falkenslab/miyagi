# A process for building activities: plan, build, test, serve

Issue: [#17](https://github.com/falkenslab/teacher-agent/issues/17)

## Goal

Give new or complex activities a process with four phases — a plan agreed with the teacher, the build in `drafts/`, a hidden test in Moodle, and opening it to students — with one approval to move from each phase to the next, and a check of what was built against the plan.

## Context

- Today an activity goes straight from the request to building: `publish-check` already makes every new resource go up hidden and be tested before it's shown (build in `drafts/<slug>/`, upload hidden, test as the teacher, note it in `knowledge/drafts.md`, ask to show it), but there's no step where the teacher and the agent agree on *what* to build before it's built. The teacher finds out what the activity is like when it's already in Moodle.
- The pieces exist: `drafts/` for the source; the `pedagogy-reviewer` subagent, which critiques a plan or an activity (objectives, activities and assessment aligned; methodology; workload; diversity); `request_human_approval`; the hidden-draft flow.
- An agent that's asked to plan can still build: nothing keeps it to the plan. agent-kit's plan mode (falkenslab/agent-kit#8: only reading and the plan file can be written; Shift+Tab) is what makes the planning phase real. This feature depends on it.
- Asked by the teacher (2026-09-30). Optional: suggested for new or complex activities (a unit's project, a gamified activity, a SCORM package, a workshop), not for a quick question or a small edit.

## Changes

- A skill, `activity-process`, that the building skills (`unit-building`, `assignment-building`, `activity-building`, `quiz-building`, `scorm-packaging`) point to for new or complex activities:
  1. **Plan**, in the kit's plan mode: `drafts/<slug>/plan.md` — objectives and the curriculum it serves, what students do and produce, how it's assessed, the Moodle pieces and settings, materials, timing, risks. Iterated with the teacher; `pedagogy-reviewer` reviews it and its critique is addressed or answered in the plan. Approval to build.
  2. **Build** in `drafts/<slug>/`. When done, compare what was built with `plan.md`, point by point, and say what differs and why. Approval to upload.
  3. **Test**: upload hidden and test it as the teacher (`publish-check`). Approval to open it.
  4. **Serve**: show it to students, check it as a student.
  Each approval's summary says which phase ends and what the next one does.
- The agent suggests the process when a request fits (and the teacher can decline it); it can also be asked for ("con el proceso completo").
- `plan.md` is the activity's reference afterwards: the activity's knowledge page links to it.
- The phase of each activity is recorded in `knowledge/drafts.md` (see `drafts-oven`).
- Prompts and `check-prompts.mjs` for the plan mode's wording in teacher-agent (what the plan is for, `planFiles` = `drafts/*/plan.md`, which browser actions modify, reusing the publish gate's classification).

## Acceptance

- Against the sandbox, reported in `tests/`: asked for a new gamified activity with the process, the agent writes `plan.md` in plan mode (nothing else written, no browser action that changes anything), iterates it with the teacher and `pedagogy-reviewer`, and asks to build; builds, compares with the plan, uploads hidden, tests, and asks to open it — one approval per phase, each saying which phase ends.
- A small request (fix a typo in a page) doesn't trigger the process.
- `verify` passes.
