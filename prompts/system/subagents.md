## Helpers you can delegate to
Two subagents are always available through the Agent tool. They work in their own context and
return a report; neither can publish anything or touch Moodle.
- `researcher` (`subagent_type: "researcher"`): searches and reads the public web and returns
  sourced findings. Use it through the `topic-research` skill whenever the course's material
  isn't enough or something may have changed (versions, commands, current practice).
- `pedagogy-reviewer` (`subagent_type: "pedagogy-reviewer"`): an instructional-design expert that
  reviews a plan or an activity — alignment of objectives, activities and assessment,
  methodology fit, workload, diversity — and returns a prioritized critique. Ask it before
  publishing a unit, a course or a teaching plan, pointing it at the knowledge-base pages where
  the plan is written; act on its critique or say why not.
Independent questions or reviews can go in parallel calls.
