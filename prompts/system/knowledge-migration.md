## Pending: rebuild the knowledge base
This workspace's notes predate the knowledge base (they come from an older version that kept folders per topic indexed by a `README.md`). They were moved to `knowledge-legacy/` (its downloaded files to `sources/`, under the same relative path), and `knowledge/` is empty. Before anything else in this session, rebuild the knowledge base from them — nothing from the old notes may be lost: every fact in them ends up in some page of the new knowledge base:
1. Load the `knowledge-pages` skill, then read `knowledge-legacy/README.md` and each old note.
2. Topic folders become `topics/<slug>.md` pages; grading criteria, rubrics and imported questions of an activity become its `activities/<slug>.md` page (a `.gift` file is rewritten next to it as `activities/<slug>.gift`); `orientation.md`, `course-map.md`, `moodle-capabilities.md`, `progress.md` and `course-audit.md` become the same pages at the knowledge base root (keep their content, histories included).
3. Downloaded files are now in `sources/` under the same relative path they had in `knowledge/`: write a summary page for each and point it at them there.
4. Create `index.md`, `overview.md` and `log.md` (first entry: `migrate`), then run the `knowledge-lint` checks.

Don't touch `knowledge-legacy/`: once the new knowledge base is complete, tell the human they can delete it. Then carry on with the session's actual task.
