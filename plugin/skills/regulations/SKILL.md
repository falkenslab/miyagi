---
name: regulations
description: Work with the education norms the teacher brings in sources/ or asks you to find - the official curriculum of their subject or module, the evaluation order, start-of-year instructions, diversity measures, the school calendar, work placements - knowing what each one is and how much it weighs, keeping what it requires cited (curriculum/ and regulation/ pages) and applying it when planning, assessing or dating. Use when a source is a norm, when the teacher asks to follow one or to find one, and whenever a decision depends on what a norm says.
---

# The norms the teacher brings

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

The norms that apply to a teacher depend on where and what they teach, and they're theirs to
bring: a law, a decree, an order, a resolution, the start-of-year instructions, the school
calendar, the school's own template. Reading them well is your craft: knowing what each one is,
keeping what it obliges word for word, and applying it with its article in hand. A deadline or a
percentage misremembered, or taken from another region's norm, is worse than none: the plan looks
compliant and isn't.

## 1. Where they come from

- **From `sources/`**, the usual way: the teacher leaves the norm there. Read it in full.
- **On request**, if the teacher asks you to find one: only in official sources (the official
  gazettes, the education authority's sites; `topic-research` for the search), and keep each
  original in `sources/` (`download_to_sources`): never a school's copy, a blog or a summary.
  The request covers **the norm they named** (and what later amended it), nothing else: being
  asked for the school calendar isn't being asked for the curriculum.
- **Never on your own.** A course description that names a level or a qualification says who
  the students are, not that a norm must be quoted. If a decision or a question depends on a norm
  you don't have (a norm another one refers to included), say which one and ask whether to look
  for it, or for the teacher to bring it; don't search for it, and don't assume what it says.
  Answer what the norms you have do settle, and say what's left open.

## 2. What it is and how much it weighs

For each norm, find out and write down:

- its **rank** (law, decree, order, resolution, instructions, a school's own document), **who
  issues it** (the state, the region, the school) and its **date**;
- whether it's **in force** for the teacher's region and school year: the consolidated text if
  there is one, and what later changed or replaced it. Having it in `sources/` doesn't make it
  current: say what you couldn't confirm;
- how it relates to the others: a lower-rank norm can't contradict a higher one, a regional one
  develops the state's, and instructions can't contradict an order. When two seem to clash, say
  so, citing both; don't pick silently.

## 3. Keep it

With `knowledge_create` / `knowledge_edit`:

- **A curriculum** (what a subject or module teaches and assesses) goes in `curriculum/` pages:
  `curriculum/provisions` (each norm: rank and number, date, URL, in force and how you checked,
  the date consulted from `current_time`) and one page per subject or module with its outcomes,
  competences, criteria, contents and hours **verbatim**, with their official numbering, each
  block citing the article or annex.
- **Any other norm** gets a `regulation/<slug>` page: what it obliges, as a list, each item with
  its article; **verbatim** when it's a deadline, a percentage, a number or a condition (calls,
  promotion, absences, hours, what a document must contain), and your summary apart from it. For
  a school calendar: the first and last school day, the evaluation periods and every non-school
  day, by date.
- Every one of these pages carries the fields `url` (the norm's), `date` (its date) and
  `consulted`; `curriculum/provisions`, which lists several, takes the main one's (the norm that
  sets the subject's or module's curriculum).

Never invent, complete or "improve" an article, a criterion or a figure; never mix regions,
titles or school years.

## 4. Apply it

When a decision depends on a norm, consult its page and cite the article in what you write:

- **The teaching plan** (`teaching-plan`): the elements a norm requires of it, the curriculum's
  criteria with their numbering, how grading and recovery work, the hours.
- **Assessment** (`criterial-assessment`, `rubric-design`, `grading-rubric`): calls, how grades
  are expressed, promotion, what counts as passing, as the evaluation norm says.
- **Dates** (`course-design`, `unit-building`): units and deadlines on school days, the
  evaluation periods, never on a non-school day of the calendar. A day off the calendar doesn't
  list (a holiday you think applies, a local one) isn't assumed: list it for the teacher to
  confirm.
- **A document a norm asks for** (a format for units, a project shared by several modules):
  follow the structure it sets, quoting it, with the generic skills for the craft.

If the teacher's instructions clash with a norm they brought, tell them, citing it, and let them
decide.
