// The landing page in English (#28): the same page as src/pages/index.js, translated. Keep both
// in step: a change to one is made to the other.
import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Logo from "@site/src/components/Logo";
import s from "@site/src/pages/index.module.css";

const INSTALL = "npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz";

// The closing headline cycles through these: each is a chore miyagi really takes on.
const MOTTOS = ["Open the forum, close the doubts", "Set the task, give the grade", "Write the rubric, apply the rubric", "Upload the unit, build the quiz", "Review the course, fix the dates"];

function Motto() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % MOTTOS.length), 3200);
    return () => clearInterval(id);
  }, []);
  return <span key={i} className={s.motto}>{MOTTOS[i]}</span>;
}

const SCENES = [
  {
    id: "corregir",
    label: "Grading",
    you: "Grade Assignment 2 with the unit's rubric",
    tools: ["Reading your rubric and your criteria", "Opening Assignment 2's submissions", "Grading 3 submissions, criterion by criterion"],
    agent: "All three are graded, with the breakdown by criterion. Starting with Lucía's: 7.5.",
    ask: "Your confirmation is needed before publishing",
    what: "Save Lucía's grade (7.5) and her feedback: the query works, but it doesn't validate the input; I explain how to do it.",
  },
  {
    id: "foro",
    label: "Forum",
    you: "Anything new in the forum?",
    tools: ["Opening the questions forum", "Reading the unanswered threads"],
    agent: "There's a new question from Marcos: “What's the difference between break and continue?”. It's the second time it comes up: maybe Unit 3 needs one more example.",
    ask: "Your confirmation is needed before publishing",
    what: "Reply to Marcos in the forum: break leaves the loop; continue skips to the next iteration, with two code examples.",
  },
  {
    id: "tema",
    label: "Build a unit",
    you: "Add a Unit 4 on security, as a team challenge",
    tools: ["Reading your teaching plan", "Preparing notes, challenge, rubric and quiz", "Uploading the unit hidden and testing it as a teacher"],
    agent: "Unit 4 is ready and hidden: notes, the team challenge with its rubric and a review quiz. I've tested it and everything works.",
    ask: "Your confirmation is needed before showing it",
    what: "Make the section “Unit 4: Security” visible to students, with its four activities.",
  },
];

const TABS = [
  {
    id: "crear", label: "Build courses", title: "Builds whole courses and units",
    text: "You describe the course or the unit and it builds it: first the teaching plan, then each unit with real notes, assignments with their rubric and quizzes, and finally it reviews it as a student would see it.",
    says: "“Build a four-unit Introduction to SQL course for first-year software development”",
    ticks: ["Notes as pages or books, citing their sources", "Assignments of every kind: written, in groups, by drafts, portfolio", "Peer-assessment workshops, branching lessons, glossaries, wikis and H5P", "Completion, access restrictions, badges and groups", "Downloads materials, zips them or turns them into PDF"],
  },
  {
    id: "cuestionarios", label: "Quizzes and games", title: "Quizzes that teach, and games that score",
    text: "Writes questions with believable distractors, varied levels and feedback that explains, and imports them in one go. If you have a game or a web simulation, it packages it so the grade reaches the gradebook on its own.",
    says: "“Create a 10-question quiz on Unit 3”",
    ticks: ["Sets dates, attempts and review options", "Imports the questions in bulk (GIFT format)", "Reviews and improves the quizzes you already have", "Games and simulations as a SCORM package, with grade and completion"],
  },
  {
    id: "corregir", label: "Grading", title: "Grades with your rubric, the same for everyone",
    text: "Applies your rubric and your criteria with the same yardstick to the whole class, and writes feedback that says what went wrong and how to improve it. It shows you every grade before saving it.",
    says: "“Grade Assignment 2 with the unit's rubric”",
    ticks: ["Assignments, open quiz answers and graded forums", "Your criteria come before its own", "Feedback with the breakdown by criterion", "Designs rubrics with observable criteria and clear levels", "In computing courses, it can run the submitted work and use the result as evidence"],
  },
  {
    id: "foro", label: "Forum", title: "Looks after the forum, missing nothing",
    text: "Finds the unanswered questions, decides when to step in and when to let the class help each other, and replies in the tone you chose. If a question keeps coming back, it tells you: the notes are missing something.",
    says: "“Anything new in the forum?”",
    ticks: ["Replies and corrections with examples", "Announcements to the whole class", "Each message is posted only once", "Remembers the questions that keep coming back"],
  },
  {
    id: "programacion", label: "Teaching plan", title: "Your teaching plan, written and followed",
    text: "Writes it with you from your material, asks you what only you decide (hours, calendar, weights) and has a teaching expert review it. Then it checks the classroom matches it: every criterion is assessed, and dates and weights add up.",
    says: "“Help me with my teaching plan and tell me if the classroom matches it”",
    ticks: ["Objectives, units, methodology, assessment and diversity", "Linked to each unit in its notes", "Proposes the classroom's fixes and applies them with your permission", "Not published in Moodle unless you ask for it"],
  },
  {
    id: "seguimiento", label: "Follow-up", title: "Follows the class and reviews the course",
    text: "Tells you how the class is doing, starting with whoever is falling behind, and audits the whole course with recommendations ordered by priority.",
    says: "“Which students are falling behind?”",
    ticks: ["Submissions, grades and which units are hardest", "The course's organisation, pedagogy and assessment", "Accessibility: headings, alt text, links, colours", "Broken links and outdated content"],
  },
];

const METHODS = ["Project-based learning", "Challenges and problems", "Flipped classroom", "Gamification", "Cooperative learning", "Case studies", "Service learning", "Design thinking", "Inquiry-based learning", "Thinking routines", "Debate, role play and simulation", "Formative assessment", "Universal Design for Learning (UDL)"];

const FAQ = [
  ["How much does it cost?", "miyagi is free and open source. What powers the assistant is your Claude subscription (Pro or Max)."],
  ["How is it different from asking an AI chat?", "A chat gives you a text and you do the rest in Moodle. miyagi goes into your course and does the work there: it saves the grade with its feedback, replies in the forum, creates the assignment with its rubric. It also remembers your course from one session to the next and asks your permission before your students see anything."],
  ["Does it work with my school's Moodle?", "It works with the Moodle you already use, through the moodle-teacher extension and your teacher session: you log in to Moodle once, in its window, and nothing has to be installed on the server. It's made for Moodle 4 and 5, and tested on Moodle 5.2. While setting it up, it can look (without changing anything) at which activity and question types your Moodle supports."],
  ["Do I need to know how to program?", "No. You install it by pasting one line into the terminal, and then you use it by talking to it. The guide walks you through it, and the example classroom shows it step by step with real screenshots."],
  ["Can it publish something without me noticing?", "In the chat, before saving a grade, replying in the forum or publishing content, it asks your permission with a summary of what it's about to publish. If it tries to publish without having asked, it's stopped and you're asked."],
  ["What if it gets something wrong?", "You see every grade, every reply and every resource before it reaches your students, and you can say no or ask it to change it. Anything new is tested hidden before it's shown. If you don't like something about how it works, correct its notes or write it in instructions.md."],
  ["What about my students' data?", "It reads what you would see in Moodle to do its work, but its notes keep no records of individual students, only how the class is doing. By default, students reach it under an alias (“A-7KQ2XM”), never by name. It never sees your Moodle password: you log in yourself, in the extension's window."],
  ["Can I give it my own instructions?", "Yes. Write in an instructions.md file in the course folder whatever you want it to always keep in mind: “grade out of 10”, “be brief in the forum”, “spelling counts 10 %”. And if you want to go further, you can teach it skills of your own."],
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return reduced;
}

// The terminal plays one example: the request is typed, then each line appears, and it stops at
// the approval. Without JS or with reduced motion, the example is shown whole.
function Terminal() {
  const reduced = useReducedMotion();
  const [scene, setScene] = useState(SCENES[0].id);
  const [typed, setTyped] = useState(null);
  const [shown, setShown] = useState(Infinity);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (reduced || !("IntersectionObserver" in window)) return setStarted(true);
    setShown(0);
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        seen.disconnect();
        setStarted(true);
      }
    });
    seen.observe(ref.current);
    return () => seen.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!started) return undefined;
    const current = SCENES.find((x) => x.id === scene);
    if (reduced) {
      setTyped(null);
      setShown(Infinity);
      return undefined;
    }
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    setTyped("");
    setShown(1);
    const perChar = 38;
    for (let i = 1; i <= current.you.length; i++) later(() => setTyped(current.you.slice(0, i)), 300 + i * perChar);
    const typedAt = 300 + current.you.length * perChar + 350;
    later(() => setTyped(null), typedAt);
    const lines = current.tools.length + 2;
    for (let i = 0; i < lines; i++) later(() => setShown(2 + i), typedAt + i * 650);
    return () => timers.forEach(clearTimeout);
  }, [scene, started, reduced]);

  const current = SCENES.find((x) => x.id === scene);
  const lineClass = (i, base) => `${base} ${i < shown ? s.shown : ""}`;
  return (
    <div className={s.demo}>
      <div className={s.terminal} ref={ref}>
        <div className={s.bar} aria-hidden="true"><Logo width={26} height={28} />miyagi</div>
        <ol className={`${s.scene} ${reduced ? "" : s.animated}`} aria-label={`Example: ${current.label.toLowerCase()}`}>
          <li className={lineClass(0, s.tYou)}>
            <b>you&gt;</b> <span className={typed !== null ? s.typing : ""}>{typed ?? current.you}</span>
          </li>
          {current.tools.map((tool, i) => <li key={tool} className={lineClass(i + 1, s.tTool)}>{tool}</li>)}
          <li className={lineClass(current.tools.length + 1, s.tAgent)}>{current.agent}</li>
          <li className={lineClass(current.tools.length + 2, s.tPanel)}>
            <strong>{current.ask}</strong>
            {current.what}
            <ul className={s.opts}><li className={s.on}>❯ 1. Yes</li><li>&nbsp; 2. No</li><li>&nbsp; 3. Stop</li></ul>
          </li>
        </ol>
      </div>
      <div className={s.scenes} role="group" aria-label="See another example">
        {SCENES.map((x) => (
          <button key={x.id} type="button" aria-pressed={x.id === scene} onClick={() => setScene(x.id)}>{x.label}</button>
        ))}
      </div>
    </div>
  );
}

// What it does: tabs named after the teacher's verbs (ARIA tabs pattern).
function Tabs() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const select = (i, focus) => {
    const next = (i + TABS.length) % TABS.length;
    setActive(next);
    if (focus) refs.current[next]?.focus();
  };
  const onKey = (event, i) => {
    const moves = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  };
  return (
    <div>
      <div className={s.tablist} role="tablist" aria-label="What it does">
        {TABS.map((tab, i) => (
          <button key={tab.id} ref={(el) => (refs.current[i] = el)} type="button" role="tab" id={`tab-${tab.id}`} aria-controls={`panel-${tab.id}`} aria-selected={i === active} tabIndex={i === active ? 0 : -1} onClick={() => select(i, false)} onKeyDown={(e) => onKey(e, i)}>{tab.label}</button>
        ))}
      </div>
      {TABS.map((tab, i) => (
        <div key={tab.id} className={s.panel} role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} tabIndex={0} hidden={i !== active}>
          <div>
            <h3>{tab.title}</h3>
            <p>{tab.text}</p>
            <span className={s.says}>{tab.says}</span>
          </div>
          <ul className={s.ticks}>{tab.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

function CopyCommand() {
  const [label, setLabel] = useState("Copy");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setLabel("Copied");
    } catch {
      setLabel("Select it and copy it");
    }
    setTimeout(() => setLabel("Copy"), 2000);
  };
  return (
    <div className={s.command}>
      <code>{INSTALL}</code>
      <button className={s.copy} type="button" onClick={copy}>{label}</button>
    </div>
  );
}

// The latest release, from GitHub; if it can't be fetched, nothing is shown.
function LatestRelease() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch("https://api.github.com/repos/falkenslab/miyagi/releases/latest")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((r) => {
        const date = new Date(r.published_at).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });
        setText(`Latest release: ${r.tag_name} (${date})`);
      })
      .catch(() => {});
  }, []);
  return text ? <span className={s.release}>{text}</span> : null;
}

export default function Home() {
  const shot = useBaseUrl("/img/casos/40-aprobacion-foro.webp");
  return (
    <Layout title="You teach, and miyagi takes care of the rest" description="miyagi works in your Moodle course with your teacher session: it grades with your rubric, looks after the forum, builds units, quizzes and games, writes your teaching plan and tells you how the class is doing. Nothing reaches your students without your permission.">
      <main className={s.landing}>
        <section className={s.hero} aria-labelledby="titulo">
          <div className={s.wrap}>
            <p className={s.heroBrand}><Logo />miyagi</p>
            <div>
              <p className={s.kicker}>AI assistant for teachers</p>
              <h1 id="titulo">You teach, and <span className={s.brandWord}>miyagi</span> takes care of the rest.</h1>
              <p className={s.lead}>It grades with your rubric, looks after the forum, builds units, quizzes and games, and tells you how the class is doing. You can teach it new skills to fit your subject.</p>
              <div className={s.actions}>
                <Link className={`${s.button} ${s.primary}`} to="/guia/instalar/">Install miyagi</Link>
                <Link className={s.button} to="/casos-de-uso/">See it in a real classroom</Link>
              </div>
              <p className={s.fine}>Free and open source (MIT license). It runs on your Claude subscription.</p>
            </div>
            <Terminal />
          </div>
        </section>

        <section aria-labelledby="problema-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="problema-t">The part of the course that isn't teaching</h2>
              <p>It's necessary work, it comes back every week and it eats your evenings.</p>
            </div>
            <ul className={s.chores}>
              <li><strong>Piles of submissions.</strong> Thirty assignments with the same rubric, and each one deserves feedback that helps.</li>
              <li><strong>The same question, again.</strong> The forum asks what was already answered, and the new question gets lost among the old ones.</li>
              <li><strong>Moodle, click by click.</strong> A unit with notes, an assignment, a rubric and a quiz is dozens of forms.</li>
              <li><strong>The teaching plan, in a drawer.</strong> There's hardly ever time to check that the classroom still matches what you promised.</li>
            </ul>
            <p className={s.answer}><span>miyagi takes care of that part.</span> You, of teaching.</p>
          </div>
        </section>

        <section id="que-hace" className={s.board} aria-labelledby="que-hace-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="que-hace-t">What it does for you</h2>
              <p>You ask in your own words, as you would a colleague. It does the work in your Moodle, with your teacher session.</p>
            </div>
            <Tabs />
          </div>
        </section>

        <section id="como" aria-labelledby="como-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="como-t">How it works</h2>
              <p>Nothing to install on your school's server: it works in your Moodle with the moodle-teacher extension and your teacher session.</p>
            </div>
            <ol className={s.how}>
              <li><h3>Install it</h3><p>One line in the terminal, on Windows, Mac or Linux.</p></li>
              <li><h3>Introduce your course</h3><p><code>miyagi init</code> asks about your subject (the name, the tone, the language) and, at the end, whether you connect your Moodle classroom: the course's address is enough. You log in to Moodle once, in the extension's window, and it explores your Moodle, touching nothing, to learn what it supports. If you leave it your teaching plan, your rubrics or your criteria, it takes them into account.</p></li>
              <li><h3>Ask, and approve</h3><p>Talk to it, or let it go through the whole course at once. When something is about to reach your students, it shows it to you and waits for your yes.</p></li>
            </ol>
          </div>
        </section>

        <section className={s.tinted} aria-labelledby="real-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="real-t">Watch it work in a real classroom</h2>
              <p>An “Introduction to SQL” classroom built from scratch with miyagi, step by step and with real screenshots: from the teaching plan to the grading. The tutorial is in Spanish, the language it was built in.</p>
            </div>
            <figure className={s.shot}>
              <div className={s.window}>
                <div className={s.windowBar} aria-hidden="true"><span className={s.windowDots}><i /><i /><i /></span><span className={s.windowTitle}>miyagi — Introducción a SQL</span></div>
                <a href={shot}>
                  <img src={shot} width="1400" height="1037" loading="lazy" alt="miyagi's chat asking permission to post two replies in the SQL classroom's forum: a hint for a foreign key ERROR 1452 and the correction of a classmate's wrong answer about WHERE and HAVING, with their full texts." />
                </a>
              </div>
              <figcaption>A real session of the SQL classroom: before replying in the forum, it shows both messages in full and waits for your yes.</figcaption>
            </figure>
            <div className={s.actions}>
              <Link className={`${s.button} ${s.primary}`} to="/casos-de-uso/">See the SQL classroom step by step</Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="metodo-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="metodo-t">Teach the way you want to teach</h2>
              <p>You tell it how you want to run the unit and it builds it with pieces Moodle really has: peer-assessment workshops, branching lessons, badges, groups, restrictions. Then a pedagogy reviewer goes over it.</p>
            </div>
            <ul className={s.chips}>{METHODS.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        </section>

        <section className={s.tinted} aria-labelledby="memoria-t">
          <div className={`${s.wrap} ${s.split}`}>
            <div>
              <h2 id="memoria-t">It remembers your course</h2>
              <p>It takes notes as it works: your grading criteria, the rubrics, the teaching plan, the questions that keep coming back, how the class is doing. In the next session it starts from there and only opens Moodle when it needs to.</p>
              <p>If you leave it documents (the subject's syllabus, rubrics, solutions), it reads them and adds them to its notes. They're text files in your course's folder: you can open and correct them with any editor. <Link to="/avanzado/base-de-conocimiento/">How it works inside</Link>.</p>
            </div>
            <figure className={s.tree} aria-label="A course's folder">
              <pre><code>{"my-course/\n├─ sources/         "}<span>your documents: teaching plan, rubrics</span>{"\n├─ knowledge/       "}<span>its notes on the course</span>{"\n│  ├─ teaching-plan.md\n│  ├─ progress.md\n│  └─ drafts.md\n├─ drafts/          "}<span>what it prepares before uploading</span>{"\n└─ instructions.md  "}<span>what it must always keep in mind</span></code></pre>
            </figure>
          </div>
        </section>

        <section aria-labelledby="ayudantes-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="ayudantes-t">It works with helpers</h2>
              <p>For some tasks it relies on specialists that hand it back a report. None of them can publish anything in Moodle.</p>
            </div>
            <div className={s.cards}>
              <div className={s.card}><h3>Researcher</h3><p>Searches the internet, reads the official sources first, checks them against each other and keeps what it finds with its links. So your notes are up to date.</p><span className={s.says}>“Find out what changed in MariaDB 11”</span></div>
              <div className={s.card}><h3>Pedagogy reviewer</h3><p>Reviews a teaching plan or an activity: coherence between objectives, activities and assessment, methodology, workload and attention to diversity.</p></div>
              <div className={s.card}><h3>Practice tester</h3><p>Optional, for computing courses: follows the practice step by step in Docker containers before it's published, because a practice that doesn't work costs the whole class an afternoon.</p></div>
            </div>
          </div>
        </section>

        <section className={s.tinted} aria-labelledby="manera-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}><h2 id="manera-t">Your way</h2></div>
            <div className={`${s.cards} ${s.four}`}>
              <div className={s.card}><h3>In your tone</h3><p>Formal, warm or motivating: you choose how it speaks to your students in the forum and in feedback.</p></div>
              <div className={s.card}><h3>In your language</h3><p>It talks to you in Spanish, English, French or German. What it publishes always follows your course's language.</p></div>
              <div className={s.card}><h3>Talk or delegate</h3><p>A chat you can pick up another day, or one pass through the whole course. Press Esc and it stops whatever it's doing.</p></div>
              <div className={s.card}><h3>Make it yours</h3><p>Instructions it always follows (“grade out of 10”), <Link to="/avanzado/habilidades-propias/">skills</Link> and shortcuts of your own. All in text files, without programming.</p></div>
            </div>
          </div>
        </section>

        <section id="control" aria-labelledby="control-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="control-t">With your go-ahead</h2>
              <p>It works with your session in your real course, so it checks with you before anything your students would see.</p>
            </div>
            <div className={s.cards}>
              <div className={s.card}><h3>It asks permission</h3><p>Before saving a grade, replying in the forum or publishing something, it shows you what it's going to do and waits for your yes. On top of that, the program watches every change it's about to make in Moodle and stops what you haven't approved.</p></div>
              <div className={s.card}><h3>Anything new, hidden first</h3><p>It prepares it in drafts, uploads it hidden, tests it as a student would see it and shows it when you say yes. Whatever is left half-done, it reminds you of when you close.</p></div>
              <div className={s.card}><h3>What it doesn't do</h3><p>It doesn't delete content without asking you, doesn't touch enrolments or the site's settings, doesn't leave your course, doesn't see your password and keeps no records of students.</p></div>
            </div>
          </div>
        </section>

        <section className={s.tinted} aria-labelledby="abierto-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}><h2 id="abierto-t">Free, open and tested on a real Moodle</h2></div>
            <div className={s.cards}>
              <div className={s.card}><h3>Free, MIT licensed</h3><p>No plans and no fees. What powers the assistant is your Claude subscription.</p></div>
              <div className={s.card}><h3>All the code, in the open</h3><p>You can read what it does and how, and propose improvements on <a href="https://github.com/falkenslab/miyagi">GitHub</a>. <LatestRelease /></p></div>
              <div className={s.card}><h3>Tested before release</h3><p>Every change to how it works is tested on a test Moodle with students, submissions and questions, and the report is published with its <a href="https://github.com/falkenslab/miyagi/blob/main/tests/README.md">screenshots</a>.</p></div>
            </div>
          </div>
        </section>

        <section id="instalar" aria-labelledby="instalar-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="instalar-t">Install it in three steps</h2>
              <p>On Windows, Mac or Linux. You don't need to know how to program.</p>
            </div>
            <ol className={s.steps}>
              <li><div><h3>Install Google Chrome</h3><p>If you don't have it yet, from <a href="https://www.google.com/chrome/">google.com/chrome</a>. miyagi uses it to turn materials into PDF and to read web pages.</p></div></li>
              <li><div><h3>Install Node.js</h3><p>The LTS version from <a href="https://nodejs.org/">nodejs.org</a>, with the default options.</p></div></li>
              <li>
                <div>
                  <h3>Install miyagi</h3>
                  <p>Open a terminal (PowerShell on Windows, Terminal on Mac), paste this line and press Enter:</p>
                  <CopyCommand />
                  <p>Then type <code>miyagi init</code> in the folder you want to use for your course and answer its questions.</p>
                </div>
              </li>
            </ol>
            <p className={s.needs}>You need a Moodle course where you have the teacher role and a Claude Pro or Max subscription. The <Link to="/guia/primeros-pasos/">first steps guide</Link> explains everything with examples.</p>
          </div>
        </section>

        <section id="preguntas" className={`${s.faq} ${s.tinted}`} aria-labelledby="preguntas-t">
          <div className={s.wrap}>
            <h2 id="preguntas-t">Frequently asked questions</h2>
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
            <p className={s.needs}>More answers in the guide's <Link to="/guia/preguntas-frecuentes/">FAQ</Link>.</p>
          </div>
        </section>

        <section className={s.closing} aria-labelledby="final-t">
          <div className={s.wrap}>
            <h2 id="final-t"><Motto />: that's for miyagi</h2>
            <p>You keep what matters, which is teaching.</p>
            <div className={s.actions}>
              <Link className={`${s.button} ${s.primary}`} to="/guia/instalar/">Install miyagi</Link>
              <a className={s.button} href="https://github.com/falkenslab/miyagi">See the code on GitHub</a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
