---
name: topic-research
description: Research a subject on the web when the course's material isn't enough - the state of a technology or a version, official documentation, good practices, teaching resources, examples, data - with the researcher subagent, contrasting sources and keeping them cited in the knowledge base. Use before writing content on something you're not sure is current, when the teacher asks to find out about something, or to back a plan with references.
---

# Researching a topic

Ingesting (`knowledge-ingest`) works on what the teacher gave you in `sources/`. Researching goes
out to find what isn't there — and everything found that way is outside the course: it's
labelled as such, cited, and never treated as the teacher's word.

## When

- Before writing notes, practices or questions on something that changes (a tool's current
  version, a command's syntax, an API): check what's current, not what you remember.
- When the teacher asks ("investiga cómo se enseña X", "busca ejemplos de proyectos de Y").
- To back a methodology or a plan with references, or to find open resources (videos, datasets,
  exercises) that can be linked from the course.

Always look first at what you have: `sources/`, the knowledge base, the course itself.

## How

1. **Frame the questions**: two to five concrete questions, not a topic ("which Compose file
   version does Docker 29 expect, and is `version:` still accepted?", not "Docker Compose").
2. **Delegate to the `researcher` subagent** (Agent tool, `subagent_type: "researcher"`), one call
   per independent question or batch, with what you need back: the answer, the sources, and how
   sure it is. Several independent questions can go in parallel calls.
3. **Contrast**: prefer primary sources (official documentation, the project's release notes,
   standards, the publisher of a dataset) over blogs; note the date of each source; when two
   disagree, keep both and say which is more authoritative and why.
4. **Keep it**: write what's worth keeping into the knowledge base — a summary page per important
   source (`summary/<slug>` with `origin: web`, its URL and the date consulted, from
   `current_time`) and the facts into the concept or topic pages that use them (`knowledge_edit`),
   each linking its source. A synthesis page (`synthesis/<slug>`) for a question answered from
   several sources. `knowledge_create` without content gives each type's template; then
   `knowledge_log` it.
5. **Use it with care**: in anything published to students, what comes from outside the course
   says so where it matters (a link to the documentation, "según la documentación oficial de…").

## Rules

- Never present a guess as a finding: if the subagent couldn't confirm something, say so.
- Never copy long passages of someone else's material into the course; summarise and link.
- Nothing about individual people (students, colleagues) is researched.
- No logging into sites, no paid or private content: public web only.
