---
name: publish-check
description: The last check before anything goes out to students, and the checklist for reviewing what's already published - the writing (no filler, redundancy or unverified claims, the course's own terms), accessibility (headings, alt text, link text, tables, color), and how it actually looks and works for a student (preview or "Switch role to..."). Use on every page, activity, question, feedback or forum post before saving it, and on existing content when auditing.
---

# Checking before publishing

Whatever skill produced the content (`resource-authoring`, `assignment-building`,
`activity-building`, `quiz-building`, `forum`, `grading-rubric`'s feedback…), it goes through this
before it's saved — and the same checklist is how `course-auditor` reviews what's already there.
Three passes, in order.

## 1. The writing

- **Remove**: the same point restated a few sentences later; generic openings and closings ("In
  this post I'd like to…", "I hope this helps!") — say the thing directly; inflated words where a
  plain one says the same.
- **Keep consistent**: the term the course itself uses for a concept (check `sources/`, the
  knowledge base's concept pages, the course's material), and a length proportional to the context
  — a quick forum reply isn't graded feedback on a full submission.
- **Unverified claims**: anything stated as fact that wasn't confirmed by the course material, the
  student's submission, a Moodle page you read or a cited source — verify it, soften it, or remove
  it.
- **Read it as the recipient**: does it sound like a person wrote it for them? If a workspace
  skill defines a personal or department style, apply it now, on top of these rules.

## 2. Accessibility

- **Headings**: real headings from the editor's styles, in order, no skipped levels — not bold or bigger text. Moodle already shows the page's or activity's name as the `h1`, so the content's own headings start at `h2`, in pages, descriptions and section summaries alike.
- **Images**: alt text that conveys what the image shows (a process, a result), not the file name;
  empty alt text only for purely decorative images.
- **Links**: text that says where it goes ("descarga el programa en PDF"), never "click here".
- **Tables**: only for tabular data, with header cells marked as headers.
- **Color**: never the only carrier of meaning ("the green box") — add text, an icon or a label.
- **Readability**: short paragraphs, lists and headings in long pages; clear sentences at the
  course's level.
- **Media**: videos with captions or a transcript when the content depends on what's said.

## 3. As a student sees it

Save (with its approval), then look at it from the student's side — "Switch role to..." →
"Student" from the user menu (back with "Return to my normal role"), or the activity's
"Preview" — and check:

- it reads in order and nothing is empty, placeholder, or broken (links, images, code blocks
  keeping their indentation);
- instructions say what to do, how to hand it in, by when and how it's graded;
- dates, attempts and submission types are the ones the text promises;
- locked content says what unlocks it (restrictions, completion);
- quizzes: questions in order, feedback and review options as intended, a non-zero total;
- rubrics visible where they're meant to be.

Fix what you find — each fix is another publication with its approval.

## Approvals

Every save in Moodle is a publication: in `guided` and `chat` it needs its approval right before
saving, with a summary of what's being published.

- **One item per approval when it's new content** — a section's text, a page, a statement, a set
  of questions (listing each question, see `quiz-building`), a rubric. Three sections are three
  approvals; creating a quiz and importing its questions are two.
- **Commitments in the teacher's name** — a reply time in the forum, feedback by a date, extra material on request — are the teacher's decision: if the teacher didn't make them, leave them out of what students read (keep them as a proposal in `teaching-plan.md`), or, in `guided`/`chat`, name each one in the approval summary so it's approved knowingly.
- A summary that announces "and then I'll add X", or bundles several different texts, hides them
  from whoever approves it.
- The one exception: the **same setting change** on several items (unlimited attempts on three
  quizzes, the same cut-off date rule on three assignments) can share one approval if the summary
  names every item and the exact change.

## When auditing

The same three passes over existing content, reported as concrete issues (the missing alt text on
image X, the "click here" link on page Y, the quiz that shows answers during the attempt), not a
vague "could be improved".
