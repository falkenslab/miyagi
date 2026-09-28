# Drafts folder and testing resources hidden in Moodle

## Goal

Give the resources the agent builds for Moodle a folder of their own (`drafts/`), and a way to test any of them before students see it: upload it hidden, try it in Moodle, and only then ask to show it.

## Context

- In a 2026-09-28 session, the teacher asked for "a gamified single-page activity with an HTML5 and a CSS3 editor … build it and open it in the browser".
- The agent wrote it in `knowledge/activities/`. `knowledge/` is the knowledge base: pages about the course, not deliverables.
- To open it, it tried `file://` (blocked on purpose: it would let the browser read any local file), then `Bash` (denied, ADR-003), a subagent with no type (refused), and finally `practice-runner`'s Docker. That only exists when the teacher enabled it, and the nginx container was left behind.
- A local preview would only cover what a browser opens (HTML, PDF, images). Most of what the agent uploads is something else (a quiz, H5P, SCORM, a book, a Moodle page), and what matters is how it looks and behaves inside Moodle.
- Docker is ruled out for this: too much to ask of teachers outside IT.
- Chosen by the teacher: test in Moodle, hidden from students. No local preview.

## Changes

- `drafts/` in every workspace:
  - writable by the main agent (`extraWritableDirs` in `toSessionConfig()`);
  - created by `init` and on opening an older workspace;
  - not in the workspace's `.gitignore`: it's the teacher's material;
  - the editable source of each resource (HTML, GIFT, images, text…), one subfolder per resource. `course-knowledge.md` names it as outside the knowledge base.
- The hidden-draft workflow, in the skills that build resources (a section in `publish-check`, or its own skill if it grows):
  1. Build the resource in `drafts/<slug>/`.
  2. Upload it with "Availability: Hide on course page" set in the same form, before the first save.
     - The approval summary says it goes up **hidden, to test** (the publish gate, ADR-008, asks for that save).
     - "Send content change notification" stays unticked.
  3. Test it in Moodle as the teacher: open it, try what it does (the quiz's "Preview", the H5P, the links, on a narrow window), fix it in `drafts/` and replace it.
  4. Report what was tested. Showing it to students is a separate approval ("Show on course page").
- Hidden drafts left in the course are recorded in the knowledge base (`knowledge/drafts.md`: name, link, what's pending; no student data), mentioned at the end of the session, and offered again in the next one, so none is forgotten.
- `practice-runner`'s prompt: it runs practices, it doesn't serve files.

## Acceptance

Against the sandbox, reported in `tests/`:

- Asked for an interactive HTML activity and for a quiz, the agent:
  - builds both in `drafts/`;
  - uploads them hidden, with an approval that says so;
  - tests them in Moodle and reports what it tried;
  - asks separately to show them;
  - calls neither `Bash`, `Agent` nor Docker.
- Logged in as a student, the hidden drafts don't appear: not on the course page, not in the gradebook, no notification.
- A draft left hidden appears in `knowledge/drafts.md` and in the session's closing message.
- `verify` passes.
