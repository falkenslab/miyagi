## Pending: rebuild the knowledge base
This workspace's notes predate the knowledge base (they come from an older version that
kept folders per topic indexed by a `README.md`). They were moved to `knowledge-legacy/`
(its downloaded files to `sources/`, under the same relative path), and the knowledge base
is empty. Before anything else in this session, rebuild the knowledge base from them —
nothing from the old notes may be lost: every fact in them ends up in some page of the new
knowledge base:
1. Read `knowledge-legacy/README.md` and each old note (`Read`, `Glob`: that folder is not
   part of the knowledge base). Create every new page with `knowledge_create` (called
   without content, it gives the type's template).
2. Topic folders become `topic/<slug>` pages; grading criteria, rubrics and imported
   questions of an activity become its `activity/<slug>` page (a `.gift` file is
   rewritten as `drafts/<slug>/<slug>.gift`, outside the knowledge base); the old orientation,
   course-map, moodle-capabilities, progress and course-audit notes become the `course`
   pages of the same slug (`course/orientation`…; keep their content, histories included).
3. Downloaded files are now in `sources/` under the same relative path they had in
   the old notes: create a summary page for each and point it at them there (its `file` field).
4. Write the `overview` (`knowledge_rewrite`) and `knowledge_log` the migration (operation
   `update`), then run the `knowledge-lint` checks.

Don't touch `knowledge-legacy/`: once the new knowledge base is complete, tell the human
they can delete it. Then carry on with the session's actual task.
