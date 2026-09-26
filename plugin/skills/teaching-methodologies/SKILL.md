---
name: teaching-methodologies
description: Choose and apply a teaching methodology to a unit or activity - project-based, challenge-based and problem-based learning, flipped classroom, gamification and game-based learning, cooperative learning, case studies, service-learning, design thinking, inquiry, visible thinking, debate and role-play, formative assessment, universal design for learning - with when each fits, its phases, and how to build it in Moodle. Use whenever designing a unit, an activity or a course, or when the teacher asks for a specific methodology.
---

# Teaching methodologies

A methodology is a decision about how students learn, not a label to put on an activity. Pick it
from the objectives, the students and the time available — never the other way round — and say
why in the plan. Most units combine one main methodology with a few supporting techniques (a
project with cooperative roles and formative checkpoints). When unsure, ask the
`pedagogy-reviewer` subagent for a second opinion before building anything.

## Choosing

| If the objective is… | Consider |
| --- | --- |
| Applying several skills to a real product | Project-based learning |
| Solving an open, real-world problem with no single answer | Challenge-based or problem-based learning |
| Understanding theory students can read on their own, and practising it in class | Flipped classroom |
| Sustained practice and motivation over weeks | Gamification |
| Explaining, arguing, comparing views | Cooperative learning, debate, visible thinking |
| Taking decisions with incomplete information, professional judgment | Case study, role-play, simulation |
| Connecting learning with a real community need | Service-learning |
| Designing a solution for a user | Design thinking |
| Discovering a principle by investigating | Inquiry-based learning |

Check the constraints before committing: time (a project needs weeks, not a session), group
size, the students' autonomy and prior knowledge, and what the course's evaluation can absorb.
A methodology that doesn't fit the time available is worse than a well-run lecture plus practice.

## The methodologies

### Project-based learning (PBL)
- **What**: students build a real product (an app, a campaign, a report, a deployment) over
  several weeks, answering a driving question; the content is learned because the product needs it.
- **Fits**: integrating several objectives; students with some autonomy. **Doesn't fit**: a
  single isolated concept, or no time for iterations.
- **Phases**: driving question and final product → teams and roles → planning with milestones →
  research and building, with checkpoints → feedback and revision → public presentation →
  reflection.
- **Moodle**: a section per project; an assignment per milestone (`assignment-building`: group
  submission, drafts), a final assignment with rubric, a forum or wiki per team (group mode
  "Separate groups"), peer assessment of the product with a workshop (`activity-building`), a
  reflection assignment or journal at the end.
- **Assessment**: rubric for the product and one for the process (milestones, teamwork);
  self- and peer assessment; individual accountability inside the group (each member's part).

### Challenge-based / problem-based learning
- **What**: a real, open challenge or ill-structured problem ("reduce the energy use of the
  school's servers") that students investigate and solve, often proposing more than one solution.
- **Phases** (challenge): big idea → essential question → challenge → guiding questions,
  activities and resources → solution → implementation and evaluation.
- **Moodle**: a page presenting the challenge (context, data, constraints), a forum for guiding
  questions, a database or glossary to collect sources, an assignment for the proposal and one
  for the solution, a presentation or video.
- **Assessment**: quality of the analysis and justification, not "the right answer".

### Flipped classroom
- **What**: the explanation happens before class (video, reading, interactive content); class
  time goes to practice, doubts and projects.
- **Fits**: content students can follow alone. **Watch**: without a check, many won't prepare.
- **Moodle**: a short resource (page, book, H5P interactive video) + a quick check before
  class (a short quiz, completion required); restrict the in-class activity until the check is
  completed (`activity-building`: completion and "Restrict access"); a forum for questions
  that feeds the session.

### Gamification and game-based learning
- **Gamification**: game mechanics on normal learning — points, levels, badges, progress,
  unlockable content, narrative, challenges. **Game-based learning**: learning through an actual
  game (an escape room, a simulation, a quiz game).
- **Do**: reward progress and effort, give frequent feedback, offer choice (optional
  challenges), keep a narrative light and coherent. **Don't**: rank students publicly by default,
  or turn rewards into the only reason to learn.
- **Moodle (core, no plugins)**: completion tracking + "Restrict access" to unlock levels in
  order; badges ("Manage badges" → "Add a new badge", awarded on activity or course
  completion); quizzes with several attempts as "missions"; a lesson with branching as an
  escape room (`activity-building`); the gradebook as experience points if the teacher wants.
  Plugins like leaderboards or XP blocks are not core: check `moodle-capabilities.md` first.

### Cooperative learning
- **What**: structured group work where everyone is needed (positive interdependence) and
  everyone is accountable (individual accountability).
- **Structures**: jigsaw (each member becomes an expert in one part and teaches it to the team),
  think-pair-share, numbered heads, roles (coordinator, secretary, spokesperson, reviewer),
  1-2-4.
- **Moodle**: groups and groupings; a wiki or forum per group; a group assignment with each
  member's part stated; the jigsaw's expert parts as separate resources restricted by group.
- **Assessment**: the group product plus an individual component (a quiz, each member's part, a
  reflection); peer assessment of contribution.

### Case study
- **What**: a realistic situation with a dilemma or a decision; students analyse it, propose and
  justify a course of action.
- **Moodle**: a page or book with the case (data, documents, constraints); a forum for the
  debate (Q and A forum if you want everyone to answer before seeing others); an assignment
  for the written analysis with a rubric (diagnosis, alternatives, justification, decision).

### Service-learning
- **What**: a project that meets a real need of the community (a website for a local NGO, a
  workshop for older people) while learning the course's content.
- **Moodle**: like a project, plus a reflection journal and the partner's feedback as evidence.
  Needs the teacher's coordination with the partner: propose, don't promise.

### Design thinking
- **Phases**: empathise → define → ideate → prototype → test. Good for products with users.
- **Moodle**: a phase per week with its deliverable (interviews, problem statement, ideas,
  prototype, test results), feedback between phases, a final pitch.

### Inquiry-based learning
- **What**: students formulate questions, investigate (experiments, data, sources) and build
  conclusions; the teacher guides the process rather than giving the answer.
- **Moodle**: a question in a forum, a database to collect evidence, a lab-report assignment.

### Visible thinking routines
- Short routines that make reasoning explicit: "See-Think-Wonder", "Think-Puzzle-Explore",
  "Claim-Support-Question", "I used to think… now I think…". Ideal to open or close a unit.
- **Moodle**: a forum or a short online-text assignment with the routine's prompts.

### Debate, role-play and simulation
- Structured debate (positions assigned, arguments with evidence, rebuttal); role-play of a
  professional situation (client meeting, incident response); simulations.
- **Moodle**: forum with groups per side, a choice to assign positions, a rubric for
  argumentation; the role-play's brief as a page restricted by group.

### Formative assessment and feedback
- Applies to every methodology: clear success criteria shared in advance (the rubric visible
  from day one), frequent low-stakes checks, feedback that says what to do next, time to act on
  it (drafts, resubmission), self- and peer assessment.
- **Moodle**: quizzes with several attempts and feedback, assignments with "Allowed attempts"
  and "Grant attempts" when feedback should lead to a resubmission, workshops for peer
  assessment with a rubric, a self-assessment step ("Use self-assessment" in a workshop).

### Universal design for learning (UDL)
- Plan for variability from the start instead of adapting afterwards: several ways to access
  the content (text, video, diagram), several ways to show learning (written, oral, a product),
  several ways to engage (choice, relevance, self-regulation).
- **Moodle**: the same content as a page and a video or H5P; an assignment that accepts
  different formats; optional extension activities; clear structure and deadlines. Combine with
  `accessibility`.

## Writing it down

In the unit's topic page (and in the course plan or teaching plan), state the methodology, why
it fits those objectives, its phases with dates, and how each phase is assessed. That is what
`pedagogy-reviewer` and `course-alignment` check against, and what the teacher reads first.
