/**
 * miyagi's texts for a person, in English: the reference catalog. Every other catalog
 * is typed as `Messages`, so a missing key fails typecheck. Text for the model (prompts,
 * skills, tool descriptions, hook deny reasons) never goes here: it stays in English.
 */
/** How each kind of browser action counts in a folded group's summary: [one, many], "{n}" the count. */
import { inOven, type PhaseCounts } from "../activityRegister.js";

export type ToolPhraseKey = "approval" | "download" | "files" | "pdf";


export interface Messages {
  // cli.ts
  help: (globalConfigPath: string) => string;
  alreadyWorkspace: (dir: string) => string;
  exploreFailed: (reason: string) => string;
  catalogBuiltin: string;
  catalogCustom: string;
  catalogExtension: (name: string) => string;
  skillsTitle: (dir: string) => string;
  commandsTitle: (dir: string) => string;
  unknownCommand: (command: string) => string;

  // menu.ts: the setup wizard and the other questions
  initHeading: (dir: string) => string;
  initHeadingNew: string;
  whichWorkspace: string;
  newWorkspaceChoice: string;
  workspacesTitle: string;
  workspacesEmpty: string;
  missingTag: string;
  kindName: (kind: string) => string;
  workspaceForgotten: (name: string, dir: string) => string;
  workspaceNotFound: (query: string, ids: string) => string;
  workspaceFolderMissing: (name: string, dir: string, id: string) => string;
  noWorkspaceHere: (ids: string) => string;
  forgetUsage: string;
  required: string;
  moodleUrl: string;
  courseId: string;
  description: string;
  persona: string;
  personaNone: string;
  personaFormal: string;
  personaWarm: string;
  personaMotivating: string;
  conversationLanguage: string;
  createInstructions: string;
  workspaceCreated: (dir: string) => string;
  exploreNow: string;
  whatToDo: string;
  kindRun: string;
  kindChat: string;
  whichMode: string;
  modeInteractive: string;
  modeGuided: string;
  modeAutonomous: string;

  // workspace.ts
  studentRole: (dir: string) => string;
  draftsLimitsInvalid: (dir: string, key: string, valid: string) => string;

  // agent.ts: the session
  unknownMode: (value: string, valid: string) => string;
  notAWorkspace: (dir: string) => string;
  contextMoved: (count: number, sourcesDir: string) => string;
  knowledgeMoved: (legacyDir: string, sourcesDir: string) => string;
  setupSaved: (command: string) => string;
  headingIngest: string;
  headingExplore: string;
  headingMode: (mode: string, chat: boolean) => string;
  headingWorkspace: (label: string, dir: string) => string;
  headingSession: (dir: string) => string;
  headingCourse: (url: string, courseId: string) => string;
  headerWorkspace: string;
  headerCourse: string;
  /** The chat header's field for the classroom, when there's none. */
  headerClassroom: string;
  noClassroom: string;
  connectMoodleNow: string;
  connectingMoodleTeacher: string;
  moodleTeacherConnected: string;
  moodleTeacherRetry: string;
  /** `miyagi web` (gui-host). */
  webListening: (label: string) => string;
  webKeepPrivate: string;
  /** The course couldn't be added to moodle-teacher's `courses` (#54): the session goes on. */
  moodleCourseNotAdded: (reason: string) => string;
  moodleTeacherInstallFailed: string;
  migrateClassroomIntro: string;
  migrateClassroomQuestion: string;
  migratedClassroom: string;

  // materials/ (ADR-015): a paper exam's labels, and what an export leaves out
  examName: string;
  examVersion: string;
  examKey: string;
  examPoints: (n: number) => string;
  examTrueFalse: [string, string];
  exportLosses: string;
  lossPoints: (questions: string) => string;
  rubricCriterion: string;
  rubricLevels: string;
  sheetStudent: string;
  sheetFinal: string;
  /** The labels a style's templates ask for ({{label:copy}}…), in the teacher's language. */
  styleLabels: Record<"copy" | "statement" | "question" | "feedback" | "code", string>;
  moodleTeacherMissing: string;
  classroomNeedsMoving: string;
  exploreNeedsClassroom: (dir: string) => string;
  classroomIncomplete: (dir: string) => string;
  workspaceName: string;
  welcomePlain: string;
  welcomeInk: string;
  promptLabel: string;
  exitingNow: string;
  interrupting: string;
  sessionInterrupted: string;
  sessionClosed: string;
  nothingPending: string;
  endTranscript: (path: string) => string;
  endConversation: (path: string) => string;
  endKnowledge: (path: string) => string;
  /** The activities in progress by phase (`course/drafts`, activity-lifecycle). */
  endInProgress: (counts: PhaseCounts, path: string) => string;
  endInterruptedNote: string;



  // toolLabels.ts: one line per browser tool call
  toolPhrases: Record<ToolPhraseKey, [one: string, many: string]>;

  tool: {
    /** The drafts toolbox (src/drafts/). */
    drafts: {
      list: (path: string) => string;
      mkdir: (path: string) => string;
      copy: (from: string, to: string) => string;
      move: (from: string, to: string) => string;
      del: (path: string) => string;
      download: (url: string) => string;
      fetchSite: (url: string) => string;
      unzip: (archive: string) => string;
      zip: (to: string) => string;
      pdf: (to: string) => string;
      info: (path: string) => string;
    };
    materials: {
      list: string;
      validate: (path: string) => string;
      export: (path: string) => string;
      import: (from: string, to: string) => string;
      exam: (path: string) => string;
      record: (path: string) => string;
      status: string;
      resolve: (path: string) => string;
      style: string;
      coverage: string;
      aggregate: string;
    };
  };
}

export const en: Messages = {
  help: (globalConfigPath) => `miyagi [<command>] [options]

Commands:
  init [--dir <path>]
      Creates a new subject in miyagi's folder (~/.miyagi/workspaces/<name>/) or, with
      --dir, in that directory, and offers to explore its Moodle if it connects one.
  run [--dir <path>] [--mode interactive|guided|autonomous] [--plain] [--task "<text>"]
      Manages the course in one go: grades pending submissions, answers the forum,
      reviews or adds content and summarizes the class's progress. Without --mode, asks
      for the mode. With --task it does only that task (e.g. --task "build a 3-unit
      intro to Docker course" or --task "grade Assignment 2").
  chat [--dir <path>] [--inline] [--plain] [--continue]
      Conversational session in full screen. Starts in guided mode; Shift+Tab switches
      it to interactive. --inline keeps the conversation in the terminal's scrollback
      and --plain uses the plain-text chat. --continue resumes this course's latest
      conversation, and /resume, inside the chat, lets you pick another.
  explore [--dir <path>] [--plain]
      Looks (without creating anything) at the activity and question types this Moodle
      supports and notes them in the page course/moodle-capabilities.
  ingest [--dir <path>] [--plain] [files...]
      Adds the given files to the knowledge base (knowledge/) or, with none, everything
      in sources/ not in it yet. No browser, no Moodle.
  skills [--dir <path>]
      Lists the available skills: the built-in ones and the workspace's own
      (<workspace>/.claude/skills/).
  commands [--dir <path>]
      Lists the slash commands you can use inside "chat".
  extension <list|info|add|remove|enable|disable|config|update|search|marketplace> [--dir <path>] [--project]
      Installs and manages extensions, from Falken's Lab's official repository or one you
      add: for every subject (~/.miyagi/extensions) or, with --project, only this one.
      "miyagi extension" alone explains each subcommand.
  web [--dir <path>] [--port <n>]
      The chat of a subject in your browser, on this computer only. Prints the address,
      with its key: open it in your browser, and don't share it. Ctrl+C closes it.
  workspaces [forget <name>]
      Lists your subjects with their folder; forget drops one from the list (its folder
      stays).

Options:
  -h, --help         Shows this help.
  -v, --version      Shows the installed version.
  -w, --workspace <name>  Opens that subject by its name, from any folder.
  --language=<code>  Language of miyagi's and the chat's texts: es, en, fr or de
                     (by default, the workspace's "agent.language", or the system's).

A subject (a workspace) is a folder with its own config.json. New ones go to
~/.miyagi/workspaces/<name>/ and every one is listed in ~/.miyagi/workspaces.json, so
-w <name> opens it from anywhere; --dir <path> still works, and inside a subject's folder
miyagi uses it. Without arguments, miyagi asks whether you want "run" or "chat" and which
subject (or a new one). The preferred language can also be set for good: in the subject's config.json
("agent.language") or, for all of them, in ${globalConfigPath} ("defaultLanguage").
See README.md for details.`,
  alreadyWorkspace: (dir) => `${dir} is already a miyagi subject (config.json exists). Choose another directory.`,
  exploreFailed: (reason) => `Couldn't explore the Moodle (${reason}). The subject is created; you can try again with "miyagi explore".`,
  catalogBuiltin: "[built-in]",
  catalogCustom: "[own]",
  catalogExtension: (name) => `[${name}]`,
  skillsTitle: (dir) => `Skills available in ${dir}`,
  commandsTitle: (dir) => `Commands available in ${dir} (inside "chat")`,
  unknownCommand: (command) => `Unknown command "${command}". Use miyagi --help.`,

  initHeading: (dir) => `\n=== Setting up a subject in ${dir} ===`,
  initHeadingNew: "\n=== New subject ===",
  whichWorkspace: "Which subject?",
  newWorkspaceChoice: "New subject…",
  workspacesTitle: "Your subjects",
  workspacesEmpty: "No subjects yet. \"miyagi init\" creates one.",
  missingTag: "[folder not found]",
  kindName: () => "subject",
  workspaceForgotten: (name, dir) => `"${name}" is no longer in the list. Its folder is untouched: ${dir}`,
  workspaceNotFound: (query, ids) => `There's no subject "${query}". ${ids ? `Yours: ${ids}` : "You have none yet"} ("miyagi workspaces" lists them).`,
  workspaceFolderMissing: (name, dir, id) => `The folder of "${name}" is gone (${dir}). Put it back, or remove it from the list with "miyagi workspaces forget ${id}".`,
  noWorkspaceHere: (ids) => (ids ? `No subject here. Open one with -w <name> (${ids}), or create one with "miyagi init".` : 'No subject yet: create one with "miyagi init".'),
  forgetUsage: "Which one? miyagi workspaces forget <name>",
  required: "Required",
  moodleUrl: "Moodle URL (or paste the course's full URL, e.g. https://moodle.myuniversity.edu/course/view.php?id=4):",
  courseId: "Course ID:",
  description: "Description (optional):",
  persona: "Agent's tone of voice (forums, feedback, announcements):",
  personaNone: "No preference (neutral tone)",
  personaFormal: "Formal",
  personaWarm: "Warm",
  personaMotivating: "Warm and motivating",
  conversationLanguage: "Language you'd rather talk to the agent in (blank, no preference: it answers in the language you use):",
  createInstructions: "Create instructions.md to add your own instructions for the agent? (optional, you can do it by hand later)",
  workspaceCreated: (dir) => `Subject created in ${dir}\n`,
  exploreNow:
    'Explore now which activity and question types this Moodle supports? (it logs in and only looks, creating ' +
    'nothing; you can also do it later with "miyagi explore")',
  whatToDo: "What do you want to do?",
  kindRun: "Manage the course in one go (run)",
  kindChat: "Talk to the agent (chat)",
  whichMode: "Which mode do you want to run it in?",
  modeInteractive: "interactive — pauses before every action",
  modeGuided: "guided — only pauses before publishing something students can see",
  modeAutonomous: "autonomous — no pauses",

  studentRole: (dir) => `${dir} is a classroom with the "student" role: miyagi only acts as a teacher.`,
  draftsLimitsInvalid: (dir, key, valid) => `${dir}/config.json: agent.draftsLimits.${key} must be a positive number, and one of: ${valid}.`,

  unknownMode: (value, valid) => `Unknown mode "${value}". Use one of: ${valid}.`,
  notAWorkspace: (dir) => `${dir} isn't a miyagi subject (no config.json). Run "miyagi init", or open one with -w <name>.`,
  contextMoved: (count, sourcesDir) => `context/ isn't used anymore: its ${count} files were moved to ${sourcesDir}.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ had the old layout: it was moved to ${legacyDir} (its downloaded files, to ${sourcesDir}) and the agent will rebuild the knowledge base from there.\n`,
  setupSaved: (command) => `Settings saved. When you want to start: ${command}`,
  headingIngest: "Ingesting into the knowledge base (no browser)",
  headingExplore: "Exploring what this Moodle supports",
  headingMode: (mode, chat) => `Mode: ${mode}${chat ? " (chat)" : ""}`,
  headingWorkspace: (label, dir) => `Subject: ${label} (${dir})`,
  headingSession: (dir) => `Session: ${dir}`,
  headingCourse: (url, courseId) => `Course: ${url} (id ${courseId})\n`,
  headerWorkspace: "subject",
  headerCourse: "course",
  headerClassroom: "classroom",
  noClassroom: "no classroom",
  connectMoodleNow: "Connect a Moodle classroom now? miyagi installs the moodle-teacher extension and you sign in to Moodle in its window; without one, it helps with your plan and materials, and you can connect it later with \"miyagi init -w <name>\"",
  connectingMoodleTeacher: "Connecting the classroom through moodle-teacher…",
  moodleTeacherConnected: "Classroom connected: moodle-teacher is installed with your site. The first time it needs Moodle, a window opens for you to sign in.",
  moodleTeacherRetry: "The subject is saved: try again with \"miyagi init -w <name>\", or \"miyagi extension add moodle-teacher\".",
  webListening: (label) => `miyagi is open in the browser for ${label}. Open this address:`,
  webKeepPrivate: "Whoever has this address can use miyagi with your account: don't share it. Ctrl+C closes it.",
  moodleCourseNotAdded: (reason) => `Couldn't limit moodle-teacher to this subject's course (${reason}); the session goes on, and miyagi still stays inside it.`,
  moodleTeacherInstallFailed: "Couldn't install or set up moodle-teacher.",
  migrateClassroomIntro: "miyagi now works in Moodle only through the moodle-teacher extension: fixed tools instead of clicking around, and you sign in in its own window instead of a saved password. This subject's classroom still uses the old way, which is gone.",
  migrateClassroomQuestion: "Move this classroom to moodle-teacher now? (its saved username and password are removed from config.json; if not, this session works without the classroom)",
  migratedClassroom: "Classroom moved to moodle-teacher.",
  examName: "Name",
  examVersion: "Version",
  examKey: "Answer key",
  examPoints: (n) => (n === 1 ? "1 point" : `${n} points`),
  examTrueFalse: ["True", "False"],
  exportLosses: "What the classroom's format leaves out (decide before approving):",
  lossPoints: (questions) => `the import gives every question 1 point: the quiz must set the marks of ${questions}`,
  rubricCriterion: "Criterion",
  rubricLevels: "Levels",
  sheetStudent: "Student",
  sheetFinal: "Final grade",
  styleLabels: { copy: "Select and copy", statement: "Statement", question: "Question", feedback: "Feedback", code: "Code" },
  moodleTeacherMissing: "This subject's classroom works through moodle-teacher, which isn't installed or is off: this session works without the classroom. \"miyagi extension add moodle-teacher\" (or \"enable\") fixes it.",
  classroomNeedsMoving: "This subject's classroom is from before moodle-teacher, and miyagi no longer has a browser of its own: this session works without the classroom. Open it in a chat to move it, or run \"miyagi init -w <name>\".",
  exploreNeedsClassroom: (dir) => `${dir} has no classroom connected: there's no Moodle to explore. Connect one with "miyagi init --dir ${dir}".`,
  classroomIncomplete: (dir) => `The classroom in ${dir}/config.json needs both "url" and "courseId".`,
  workspaceName: "Name of the subject:",
  welcomePlain: "miyagi is ready. Esc interrupts the reply in progress; /resume picks up an earlier conversation; /exit or Ctrl+C (with no reply in progress) close the session.",
  welcomeInk: "miyagi is ready. Shift+Tab switches between guided and interactive, /resume picks up an earlier conversation, ? shows the shortcuts and /exit closes the session.",
  promptLabel: "you>",
  exitingNow: "Exiting without waiting. What was recorded so far is already saved on disk.",
  interrupting: "Interrupting and closing the session… (Ctrl+C again to exit without waiting)",
  sessionInterrupted: "Session interrupted.",
  sessionClosed: "Session closed.",
  nothingPending: "Nothing left to save: everything is written to disk as it happens.",
  endTranscript: (path) => `  - The agent's actions and their results: ${path}`,
  endConversation: (path) => `  - The conversation, as plain text: ${path}`,
  endKnowledge: (path) => `  - What the agent has learned: ${path}`,
  endInProgress: (counts, path) => `In the oven: ${inOven(counts, { planning: "planning", building: "being built", hidden: "being tested hidden", served: "just served" })} (${path})`,
  endInterruptedNote:
    "What it was doing when interrupted may be half done (a grade not saved, a reply not posted); in the next session you can ask it to pick it up.",



  toolPhrases: {
    approval: ["asked for approval", "asked for approval {n} times"],
    download: ["downloaded {n} file", "downloaded {n} files"],
    files: ["worked on files", "worked on files {n} times"],
    pdf: ["made {n} PDF", "made {n} PDFs"],
  },

  tool: {
    drafts: {
      list: (p) => `Listing ${p} in drafts/`,
      mkdir: (p) => `Creating the folder ${p}`,
      copy: (from, to) => `Copying ${from} to ${to}`,
      move: (from, to) => `Moving ${from} to ${to}`,
      del: (p) => `Deleting ${p}`,
      download: (url) => `Downloading ${url}`,
      fetchSite: (url) => `Saving the site ${url}`,
      unzip: (archive) => `Unzipping ${archive}`,
      zip: (to) => `Building the archive ${to}`,
      pdf: (to) => `Printing ${to}`,
      info: (p) => `Checking the file ${p}`,
    },
    materials: {
      list: "Looking at the materials",
      validate: (p) => `Checking ${p}`,
      export: (p) => `Exporting ${p} to the classroom's format`,
      import: (from, to) => `Importing ${from} as ${to}`,
      exam: (p) => `Printing the exam of ${p}`,
      record: (p) => `Noting that ${p} is published`,
      status: "Looking at what's published",
      resolve: (p) => `Working out the dates of ${p}`,
      style: "Looking at the materials' style",
      coverage: "Counting the bank's questions by criterion and level",
      aggregate: "Keeping only the survey's totals",
    },
  },
};
