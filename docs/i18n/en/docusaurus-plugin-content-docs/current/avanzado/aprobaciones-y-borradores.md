---
title: Approvals and drafts
sidebar_position: 6
description: "How what reaches the students is controlled: the approval before publishing, the hook that enforces it, the hidden drafts, the GIFT review and what it never does."
---

# Approvals and drafts {#aprobaciones-y-borradores}

miyagi works with your account in your real course. Its whole design revolves around one rule: **the teacher approves every change the students will see**. This page explains the pieces that enforce it.

## The approval {#la-aprobación}

Right before saving a grade or feedback, posting in the forum, publishing new content or saving a change to an activity's or the course's settings, the assistant calls its `request_human_approval` tool with a summary of what it is going to publish. You see a panel with that summary and three options: **Yes**, **No** or **Stop**. If you say no, it doesn't publish it and tells you what happened.

The rules for when and how to ask for it are in the [`publish-check`](https://github.com/falkenslab/miyagi/blob/main/plugin/skills/publish-check/SKILL.md) skill:

- **One item per approval when it's new content**: a section's text, a page, an assignment statement, a set of questions (listing each one), a rubric. Three sections are three approvals; creating a quiz and importing its questions are two.
- **A batch only if the summary lists everything**: several grades can go in one approval if the summary names each student with their grade and the gist of the feedback.
- **The same settings change** on several items (unlimited attempts on three quizzes, for example) can share an approval if the summary names each item and the exact change.
- **Commitments on your behalf** (a reply deadline in the forum, feedback by a date, extra material) are your decision: if you didn't make them, it leaves them out of what the students read or names them one by one in the summary so you approve them knowingly.

The summary speaks to you in your language, and quotes verbatim, in the course's language, the text that is going to be published.

## The hook that enforces it {#el-gancho-que-la-hace-cumplir}

The assistant asking for permission doesn't depend only on it remembering to. In a real session, before this hook existed, a File resource stayed visible to the students for about 35 seconds before the assistant noticed and hid it ([ADR-008](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-008-publish-gate.md)). Since then, in `guided` mode, a hook in the program checks each tool of an extension (moodle-teacher, docker-lab) before it runs. It's agent-kit's, which miyagi relies on:

- If it's a tool that changes something and there's no current approval, it stops it and shows you the “Let moodle-teacher do this?” panel with the tool and its parameters. You answer **Yes** (that call), **Yes, for this session** (that tool, until you close the session), **Yes, always**, **No** or **No, never**. A no blocks it and tells the assistant not to repeat it without asking you first. “Always” and “never” are kept for the following sessions.
- An approval lasts until the next approval request or until your next message, so that an approval of six grades, with the summary listing them all, covers the six calls.
- Deleting, removing or resetting is never covered by an earlier approval. moodle-teacher asks you on every call, even if you've just approved something else, with a single question: its own. In `autonomous` nobody can answer it, so nothing gets deleted.
- To see or forget what you answered with “always” or “never”: `miyagi extension config moodle-teacher confirm=reset` (or `/extensions config` in the chat). `confirm=off` makes that extension never ask: your decision, and we don't recommend it for Moodle.

**What counts as publishing**: any tool of an extension that isn't marked as read-only. moodle-teacher marks that way the ones that only read (looking at the course, the submissions, the forum) and its session ones (signing in and out, choosing the site), which never ask; and the ones that delete, remove or reset are asked by the server itself, always. Whatever isn't marked asks: a false positive only costs one extra panel.

**When it acts**: only in `guided`, which is the chat's mode and the recommended one for `run`. In `interactive` you're already asked before each tool, in `plan` nothing changes in Moodle, and `autonomous` publishes without asking by design. If you switch mode in the chat with `Shift+Tab`, the hook follows it immediately. The helpers have no Moodle tools.

## New things, hidden first: the drafts {#lo-nuevo-primero-oculto-los-borradores}

Every new resource (a page, a file, a quiz, an H5P, an assignment, a whole unit) is tested in Moodle before the students see it ([ADR-009](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-009-hidden-drafts.md)):

1. **It builds it in `drafts/<slug>/`**: the editable source code (the HTML, the page's text, its images). It writes the questions and the quizzes in `materials/` and exports them to `drafts/materials/` with code ([Your materials](materiales.md)).
2. **It puts it hidden in the classroom**, from the first save (or hides the section if it's a new unit). The approval summary says it goes **hidden, to test it**. It doesn't notify the students of the change. How that's done in Moodle comes with moodle-teacher's publishing skill.
3. **It tests it as a teacher**: it reads what the classroom saved and checks that it works the way a student would use it: the quiz, the H5P, each link and each interactive part, and the page at a narrow width. Whatever its tools can't test, it asks you to test, with its link. If something fails, it fixes it in `drafts/` and replaces it (with another approval).
4. **It records it on the `course/drafts` page** (`knowledge/drafts.md`): one line per draft, starting with its phase (`hidden`), with its link and what's left.
5. **It tells you what it tested and asks your permission to show it.** Showing it is another publication, with its own approval. Afterwards it marks its line as `served` and reviews it as a student would see it, as far as the extension lets it (or asks you to look at it with the student view).

If you'd rather not show it yet, it stays hidden and in `drafts.md`.

## The activities in progress {#las-actividades-en-marcha}

`course/drafts` is the record of everything in progress, not only of what's hidden: one line per activity, with its phase first, in backticks, so the program can count them:

- `planning`: with its plan in `drafts/<slug>/plan.md`, waiting for you to approve it.
- `building`: being built in `drafts/<slug>/`.
- `hidden`: uploaded hidden to the classroom, being tested.
- `served`: the students already see it; the next session tells you so and removes it.

The first three phases are gone through by the `activity-lifecycle` skill for something new and complex, with an approval to move from each phase to the next; a hidden draft without that process is a `hidden` line. An older page, without phases, counts everything as `hidden`. When the session closes, miyagi tells you how many there are in each phase (“In the oven: 1 planning, 2 being built, 1 being tested hidden”), and the next chat tells you when it greets you.

Changes to something the students already see (a typo, a date, a broken link) don't go through a draft: they're saved in place, with their approval.

In its first test, this flow found two real bugs that the students never saw: the GIFT import lost the code's indentation, and an embedded HTML activity showed in a 500×400 px box on mobile ([report](https://github.com/falkenslab/miyagi/blob/main/tests/2026-09-28T15-41-draft-testing/README.md)).

## The GIFT review {#la-revisión-del-gift}

Before moodle-teacher imports questions in GIFT format into a bank (`import_questions`, with the GIFT as text or as a file), another hook ([`src/uploadGate.ts`](https://github.com/falkenslab/miyagi/blob/main/src/uploadGate.ts)) checks it with code. If it finds errors, it rejects the import with the list (line by line) so the assistant fixes the GIFT in `drafts/` and imports it again. Warnings let the import through but reach the assistant. It acts in every mode: a broken bank is never wanted, whoever approved it.

**In a GIFT**, what Moodle's importer would reject or misread:

- unbalanced `{ }` braces or more than one answer block per question;
- a question name (`::nombre::`) left unclosed or repeated;
- unescaped `=` or `~` inside an answer, or more than one unescaped `#`;
- multiple choice with no correct answer, or with several `=`;
- weights outside -100…100, or correct answers whose weights don't add up to 100 % (warning);
- badly written numerical answers (for example, with a decimal comma);
- matching questions missing `->`, or with fewer than 3 pairs (warning);
- indented lines, which the importer loses: code must go as `[html]` with `&nbsp;` inside `<pre>`.

## The `drafts/` toolbox {#la-caja-de-herramientas-de-drafts}

The main assistant has no terminal. To work with files inside `drafts/` it has a server of its own ([`src/drafts/`](https://github.com/falkenslab/miyagi/tree/main/src/drafts)), available in `chat` and `run`:

| Tool | What it does |
| --- | --- |
| `drafts_list` | Lists a folder in `drafts/` with each item's size and date. |
| `drafts_mkdir` | Creates a folder. |
| `drafts_copy` | Copies a file or a folder, binaries included. |
| `drafts_move` | Moves or renames a file or a folder. |
| `drafts_delete` | Deletes a file or a folder inside `drafts/` (never `drafts/` itself). |
| `drafts_download` | Downloads an http or https address to a file, with a size limit and a 60-second limit. |
| `drafts_fetch_site` | Loads a web page in a headless browser and saves it with everything it loads (HTML, CSS, JS, images, fonts), keeping the relative links. |
| `drafts_unzip` | Unzips a ZIP into a folder in `drafts/`. |
| `drafts_zip` | Compresses a folder into a ZIP (for example, a SCORM package). |
| `drafts_pdf` | Prints an HTML or Markdown file to PDF (A4). |
| `drafts_info` | Tells a file's real type (by its content, not its name), its size, its dimensions if it's an image and its SHA-256. |

Its guarantees: every path resolves inside `drafts/` (no `..`, absolute paths or links that lead out); it only downloads over http and https; a ZIP can't write outside its folder or exceed the size and file-count limits; nothing is executed. The web page and the PDF are generated with the system's own Chrome, headless. The limits are changed in [`draftsLimits`](configuracion.md).

## What it never does {#lo-que-nunca-hace}

Its instructions, in every mode, forbid it to:

- **delete** anything in Moodle it didn't create: what it leaves hidden stays hidden until you show it or remove it;
- **change the enrolments** of any student, or the groups;
- **touch the settings of the Moodle platform**;
- **leave your course** or go into other Moodle courses.

What moodle-teacher has no tool to do, it doesn't try some other way: it tells you, prepares it in `drafts/` and gives you the steps to do it yourself.

Even so, use `guided` (or the chat) to review what it publishes: the rule is in the instructions, and the publish hook would also stop an unapproved deletion.
