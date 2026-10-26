---
description: Publish materials from materials/ to the classroom - a bank, a quiz, notes, an assignment with its rubric, or a whole unit - validated, exported by code, hidden first, with their approvals
---

Publish now with the `materials-format` skill: $ARGUMENTS

Find what was named in `materials/` (`materials_list`), validate it and, for a unit, every
material in it. Export each one, publish it hidden through the classroom extension's skills
(`publish-check`): a unit in its order, with the restrictions its `unit.md` says and its dates
resolved for the group asked (`materials_resolve`); test it as a student, show it with its
approval, and `record_publication` each one. Say what was published and where.

If nothing was given above (the line is empty), list the materials with `publication_status`
and ask which to publish, and for which group when the course has several.
