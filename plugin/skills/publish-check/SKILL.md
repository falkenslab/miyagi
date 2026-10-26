---
name: publish-check
description: The last check before anything goes out to students, and the checklist for reviewing what's already published - new resources go up hidden and are tested in the classroom before being shown (drafts/, the course/drafts page), the writing (no filler, redundancy or unverified claims, the course's own terms), accessibility (headings, alt text, link text, tables, color), and how it actually looks and works for a student. Use on every page, activity, question, feedback or forum post before saving it, and on existing content when auditing.
---

# Checking before publishing

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

Needs a connected classroom; without one, build what you can in `drafts/` and say so.

Whatever skill produced the content (`resource-authoring`, `assignment-building`,
`activity-building`, `quiz-design`, `forum`, `grading-rubric`'s feedback…), it goes through this
before it's saved, and the same checklist is how `course-auditor` reviews what's already there.
How to put something in the classroom hidden, show it and change it in place is the classroom
extension's: load its publishing skill alongside this one. Three passes, in order.

## New resources: a hidden draft first

Anything new you build for the course (a page, a file such as an HTML activity or a PDF, a quiz,
an H5P, an assignment, a whole unit) is tested in the classroom before students can see it,
whatever its type:

1. **Build it** from `materials/` (notes, assignments, rubrics, quizzes and their questions,
   exported to `drafts/materials/` by code: `materials-format`) or, for what isn't one of those (an
   HTML activity, a SCORM package), in `drafts/<slug>/`. Never in the knowledge base; the activity's or topic's page names it. Beyond
   writing text files, the drafts toolbox (`drafts_*` tools) downloads files and whole pages,
   copies and moves binaries, zips and unzips (a SCORM package: the classroom extension's SCORM
   skill), prints HTML or Markdown to PDF and tells a file's real type: use it, never a shell.
2. **Put it in the classroom hidden**, from its first save: students never see a half-made
   resource. For a new section, hide the section. The approval summary says it goes up
   **hidden, to test it**. Don't notify students of the change.
3. **Test it as the teacher**: read back what the classroom stored, and check it works the way a
   student would use it (the quiz, the H5P, every link and interactive part, the page at a narrow
   width). What the tools can't try, ask the teacher to try, with its link. If something fails,
   fix it in `drafts/` and replace it (another approval).
4. **Note it in `course/drafts`** (`knowledge_edit`): one list item per hidden draft, starting
   with `` `hidden` `` (the register's format is in `activity-lifecycle`), with its link and
   what's pending.
5. **Report what you tested, and ask to show it**: showing it is a publication with its own
   approval. The same change on several drafts (a whole unit) can share one approval if the
   summary names each. Once shown, mark its item `` `served` `` with the date (a later session
   tells the teacher and takes it off) and do pass 3 below as a student would see it.

A draft the teacher doesn't want shown yet stays hidden and in `course/drafts`: say so when you
finish, and offer it again when the teacher next asks what's pending.

Changes to something students can already see (a typo, a date, a fixed link) don't go through
a draft: they're saved in place, with their approval.

## 1. The writing

- **Remove**: the same point restated a few sentences later; generic openings and closings ("In
  this post I'd like to…", "I hope this helps!"): say the thing directly; inflated words where a
  plain one says the same.
- **Keep consistent**: the term the course itself uses for a concept (check `sources/`, the
  knowledge base's concept pages, the course's material), and a length proportional to the
  context: a quick forum reply isn't graded feedback on a full submission.
- **Unverified claims**: anything stated as fact that wasn't confirmed by the course material, the
  student's submission, something you read in the classroom or a cited source: verify it, soften
  it, or remove it.
- **Read it as the recipient**: does it sound like a person wrote it for them? If a workspace
  skill defines a personal or department style, apply it now, on top of these rules.

## 2. Accessibility

- **Headings**: real headings, in order, no skipped levels, not bold or bigger text. The
  classroom already shows the page's or activity's name as the main heading, so the content's
  own headings start at `h2`, in pages, descriptions and section summaries alike.
- **Images**: alt text that conveys what the image shows (a process, a result), not the file name;
  empty alt text only for purely decorative images.
- **Links**: text that says where it goes ("descarga el programa en PDF"), never "click here".
- **Tables**: only for tabular data, with header cells marked as headers.
- **Color**: never the only carrier of meaning ("the green box"): add text, an icon or a label.
- **Readability**: short paragraphs, lists and headings in long pages; clear sentences at the
  course's level.
- **Media**: videos with captions or a transcript when the content depends on what's said.

## 3. As a student sees it

Once it's visible (a new resource, after its hidden draft is shown), look at it from the
student's side, as the classroom extension lets you (or ask the teacher to look with a student's
view), and check:

- it reads in order and nothing is empty, placeholder, or broken (links, images, code blocks
  keeping their indentation);
- instructions say what to do, how to hand it in, by when and how it's graded;
- dates, attempts and submission types are the ones the text promises;
- locked content says what unlocks it (restrictions, completion);
- quizzes: questions in order, feedback and review options as intended, a non-zero total;
- rubrics visible where they're meant to be.

Fix what you find: each fix is another publication with its approval.

## Approvals

Every save in the classroom is a publication: in `guided` and `chat` it needs its approval right
before saving, with a summary of what's being published.

- **One item per approval when it's new content**: a section's text, a page, a statement, a set
  of questions (listing each question, see `quiz-design`), a rubric. Three sections are three
  approvals; creating a quiz and importing its questions are two.
- **Commitments in the teacher's name** (a reply time in the forum, feedback by a date, extra
  material on request) are the teacher's decision: if the teacher didn't make them, leave them out
  of what students read (keep them as a proposal in `course/teaching-plan`), or, in
  `guided`/`chat`, name each one in the approval summary so it's approved knowingly.
- A summary that announces "and then I'll add X", or bundles several different texts, hides them
  from whoever approves it.
- The one exception: the **same setting change** on several items (unlimited attempts on three
  quizzes, the same cut-off date rule on three assignments) can share one approval if the summary
  names every item and the exact change.
- Deleting or resetting something always asks on its own, whatever was approved before.

## When auditing

The same three passes over existing content, reported as concrete issues (the missing alt text on
image X, the "click here" link on page Y, the quiz that shows answers during the attempt), not a
vague "could be improved".
