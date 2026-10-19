/**
 * miyagi's texts for a person, in English: the reference catalog. Every other catalog
 * is typed as `Messages`, so a missing key fails typecheck. Text for the model (prompts,
 * skills, tool descriptions, hook deny reasons) never goes here: it stays in English.
 */
/** How each kind of browser action counts in a folded group's summary: [one, many], "{n}" the count. */
export type ToolPhraseKey =
  | "navigate" | "back" | "click" | "type" | "fillForm" | "select" | "pressKey" | "snapshot"
  | "evaluate" | "find" | "wait" | "upload" | "screenshot" | "approval" | "download" | "files" | "pdf";

/** What a browser_evaluate call does, read from its code (no model involved). */
export type EvaluateKind =
  | "editor" | "form" | "act" | "otherPages" | "formFields" | "table" | "dialog" | "links"
  | "location" | "content" | "generic";

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
  renamedCommand: string;
  globalConfigMigrated: (file: string) => string;

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
  username: string;
  password: string;
  label: string;
  description: string;
  persona: string;
  personaNone: string;
  personaFormal: string;
  personaWarm: string;
  personaMotivating: string;
  conversationLanguage: string;
  practiceRunnerQuestion: string;
  practiceRunnerNote: string;
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
  defaultLabel: (host: string, courseId: string) => string;

  // agent.ts: the session
  unknownMode: (value: string, valid: string) => string;
  notAWorkspace: (dir: string) => string;
  contextMoved: (count: number, sourcesDir: string) => string;
  knowledgeMoved: (legacyDir: string, sourcesDir: string) => string;
  setupSaved: (command: string) => string;
  autonomousNeedsCredentials: string;
  headlessNeedsCredentials: string;
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
  moodleTeacherRetry: string;
  moodleTeacherInstallFailed: string;
  migrateClassroomIntro: string;
  migrateClassroomQuestion: string;
  keptBrowser: string;
  migratedClassroom: string;
  moodleTeacherMissing: string;
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
  endDrafts: (path: string) => string;
  endInterruptedNote: string;

  // publishGate.ts
  gateTitle: string;
  gateLine: string;

  // agent.ts: the manual-login checkpoint (no saved credentials)
  manualLoginTitle: string;
  manualLoginLines: string[];
  manualLoginQuestion: string;

  // toolLabels.ts: one line per browser tool call
  toolPhrases: Record<ToolPhraseKey, [one: string, many: string]>;

  tool: {
    navigate: (url: string) => string;
    aPage: string;
    back: string;
    forward: string;
    snapshot: string;
    click: (element: string) => string;
    hover: (element: string) => string;
    drag: (from: string, to: string) => string;
    select: (values: string, element: string) => string;
    type: (text: string, element: string) => string;
    anElement: string;
    anotherElement: string;
    aDropdown: string;
    aField: string;
    pressKey: (key: string) => string;
    waitFor: (text: string) => string;
    waitGone: (text: string) => string;
    waitSeconds: (seconds: number) => string;
    wait: string;
    findText: (text: string) => string;
    findPattern: (pattern: string) => string;
    find: string;
    fillForm: (fields: number) => string;
    upload: string;
    /** browser_evaluate, by what its code does (see classifyEvaluate() in toolLabels.ts). */
    evaluate: Record<EvaluateKind, string>;
    screenshot: string;
    tabs: string;
    resize: string;
    close: string;
    console: string;
    networkRequests: string;
    saveResponse: string;
    requestDetails: string;
    runCodeUnsafe: string;
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
    acceptDialog: string;
    dismissDialog: string;
  };
}

export const en: Messages = {
  help: (globalConfigPath) => `miyagi [<command>] [options]

Commands:
  init [--dir <path>]
      Creates a new subject in miyagi's folder (~/.miyagi/workspaces/<name>/) or, with
      --dir, in that directory, and offers to explore its Moodle if it connects one.
  run [--dir <path>] [--mode interactive|guided|autonomous] [--headless] [--plain] [--task "<text>"]
      Manages the course in one go: grades pending submissions, answers the forum,
      reviews or adds content and summarizes the class's progress. Without --mode, asks
      for the mode. With --task it does only that task (e.g. --task "build a 3-unit
      intro to Docker course" or --task "grade Assignment 2").
  chat [--dir <path>] [--headless] [--inline] [--plain] [--continue]
      Conversational session in full screen. Starts in guided mode; Shift+Tab switches
      it to interactive. --inline keeps the conversation in the terminal's scrollback
      and --plain uses the plain-text chat. --continue resumes this course's latest
      conversation, and /resume, inside the chat, lets you pick another.
  explore [--dir <path>] [--headless] [--plain]
      Looks (without creating anything) at the activity and question types this Moodle
      supports and notes them in knowledge/moodle-capabilities.md.
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
subject (or a new one). --headless (needs saved credentials) and the preferred language can
also be set for good: in the subject's config.json ("agent.headless", "agent.language") or,
for all of them, in ${globalConfigPath} ("defaultHeadless", "defaultLanguage"). See
README.md for details.`,
  alreadyWorkspace: (dir) => `${dir} is already a miyagi subject (config.json exists). Choose another directory.`,
  exploreFailed: (reason) => `Couldn't explore the Moodle (${reason}). The subject is created; you can try again with "miyagi explore".`,
  catalogBuiltin: "[built-in]",
  catalogCustom: "[own]",
  catalogExtension: (name) => `[${name}]`,
  skillsTitle: (dir) => `Skills available in ${dir}`,
  commandsTitle: (dir) => `Commands available in ${dir} (inside "chat")`,
  unknownCommand: (command) => `Unknown command "${command}". Use miyagi --help.`,
  renamedCommand: "teacher-agent is now called miyagi: use the miyagi command (teacher-agent still works for a while).",
  globalConfigMigrated: (file) => `Your settings from ~/.teacher-agent were copied to ${file}.`,

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
  username: "User with the teacher role (leave it blank to log in by hand):",
  password: "Password:",
  label: "Label:",
  description: "Description (optional):",
  persona: "Agent's tone of voice (forums, feedback, announcements):",
  personaNone: "No preference (neutral tone)",
  personaFormal: "Formal",
  personaWarm: "Warm",
  personaMotivating: "Warm and motivating",
  conversationLanguage: "Language you'd rather talk to the agent in (blank, no preference: it answers in the language you use):",
  practiceRunnerQuestion:
    "Let the agent test practical activities in Docker containers (e.g. check that a statement works before " +
    "publishing it, or run a submission while grading it)? It only works in the subject's practice/ folder and " +
    "only with Docker; it never installs anything: if Docker isn't installed, it tells you.",
  practiceRunnerNote:
    "Note: this subject hasn't set up an optional capability yet — testing practical activities (a Dockerfile, a " +
    "script, a submission's code) in Docker containers, before publishing them or while grading them. Off by " +
    'default; change it by hand in config.json ("agent.allowPracticeRunner": true/false) or answer the question below.',
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
  defaultLabel: (host, courseId) => `${host} · course ${courseId}`,

  unknownMode: (value, valid) => `Unknown mode "${value}". Use one of: ${valid}.`,
  notAWorkspace: (dir) => `${dir} isn't a miyagi subject (no config.json). Run "miyagi init", or open one with -w <name>.`,
  contextMoved: (count, sourcesDir) => `context/ isn't used anymore: its ${count} files were moved to ${sourcesDir}.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ had the old layout: it was moved to ${legacyDir} (its downloaded files, to ${sourcesDir}) and the agent will rebuild the knowledge base from there.\n`,
  setupSaved: (command) => `Settings saved. When you want to start: ${command}`,
  autonomousNeedsCredentials:
    "autonomous mode can't log in by hand (there's no way to ask a human for help): save the user and password in config.json, or use --mode guided/interactive.",
  headlessNeedsCredentials:
    "--headless needs saved credentials (there's no visible window to log in by hand): save the user and password in config.json, or drop --headless.",
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
  moodleTeacherRetry: "The subject is saved: try again with \"miyagi init -w <name>\", or \"miyagi extension add moodle-teacher\".",
  moodleTeacherInstallFailed: "Couldn't install or set up moodle-teacher.",
  migrateClassroomIntro: "miyagi now works in Moodle through the moodle-teacher extension: fixed tools instead of clicking around, and you sign in in its own window instead of a saved password. This subject's classroom still uses the browser.",
  migrateClassroomQuestion: "Move this classroom to moodle-teacher? (its saved username and password are removed from config.json)",
  keptBrowser: "The classroom keeps using the browser. To move it later, remove \"connector\" from its config.json.",
  migratedClassroom: "Classroom moved to moodle-teacher.",
  moodleTeacherMissing: "This subject's classroom works through moodle-teacher, which isn't installed or is off: this session works without the classroom. \"miyagi extension add moodle-teacher\" (or \"enable\") fixes it.",
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
  endDrafts: (path) => `There are resources uploaded hidden to Moodle, not shown to students yet: ${path}`,
  endInterruptedNote:
    "What it was doing when interrupted may be half done (a grade not saved, a reply not posted); in the next session you can ask it to pick it up.",

  gateTitle: "Publishing without prior approval",
  gateLine: "The agent is about to publish or change something students can see in Moodle, without having asked you first.",

  manualLoginTitle: "Manual login required",
  manualLoginLines: ["No saved credentials for this subject.", "Log in manually in the already-open browser window."],
  manualLoginQuestion: "Press Enter once you've finished logging in (or 'q' to cancel): ",

  toolPhrases: {
    navigate: ["opened {n} page", "opened {n} pages"],
    back: ["went back", "went back {n} times"],
    click: ["clicked once", "clicked {n} times"],
    type: ["typed in {n} field", "typed in {n} fields"],
    fillForm: ["filled in {n} form", "filled in {n} forms"],
    select: ["chose {n} option", "chose {n} options"],
    pressKey: ["pressed {n} key", "pressed {n} keys"],
    snapshot: ["read the page", "read the page {n} times"],
    evaluate: ["inspected the page", "inspected the page {n} times"],
    find: ["searched the page", "searched the page {n} times"],
    wait: ["waited", "waited {n} times"],
    upload: ["uploaded files", "uploaded files {n} times"],
    screenshot: ["took {n} screenshot", "took {n} screenshots"],
    approval: ["asked for approval", "asked for approval {n} times"],
    download: ["downloaded {n} file", "downloaded {n} files"],
    files: ["worked on files", "worked on files {n} times"],
    pdf: ["made {n} PDF", "made {n} PDFs"],
  },

  tool: {
    navigate: (url) => `Navigating to ${url}`,
    aPage: "a page",
    back: "Going back to the previous page",
    forward: "Going forward to the next page",
    snapshot: "Reading the page structure",
    click: (element) => `Clicking "${element}"`,
    hover: (element) => `Hovering over "${element}"`,
    drag: (from, to) => `Dragging "${from}" to "${to}"`,
    select: (values, element) => `Selecting "${values}" in "${element}"`,
    type: (text, element) => `Typing "${text}" into "${element}"`,
    anElement: "an element",
    anotherElement: "another element",
    aDropdown: "a dropdown",
    aField: "a field",
    pressKey: (key) => `Pressing the "${key}" key`,
    waitFor: (text) => `Waiting for "${text}" to appear`,
    waitGone: (text) => `Waiting for "${text}" to disappear`,
    waitSeconds: (seconds) => `Waiting ${seconds}s`,
    wait: "Waiting",
    findText: (text) => `Looking for "${text}" on the page`,
    findPattern: (pattern) => `Looking for the pattern "${pattern}" on the page`,
    find: "Searching the page",
    fillForm: (fields) => `Filling in a form (${fields} field${fields === 1 ? "" : "s"})`,
    upload: "Uploading file(s)",
    evaluate: {
      editor: "Writing in the text editor",
      form: "Filling in the form",
      act: "Clicking on the page",
      otherPages: "Looking at other pages of the course",
      formFields: "Checking the form's fields",
      table: "Reading a table on the page",
      dialog: "Reading a dialog on the page",
      links: "Looking at the page's links",
      location: "Checking which page it's on",
      content: "Reading the page's content",
      generic: "Inspecting the page",
    },
    screenshot: "Taking a screenshot",
    tabs: "Managing browser tabs",
    resize: "Resizing the window",
    close: "Closing the browser",
    console: "Checking the browser console",
    networkRequests: "Checking network requests",
    saveResponse: "Saving a network response's body to disk",
    requestDetails: "Reading network request details",
    runCodeUnsafe: "Trying to run unrestricted code (blocked)",
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
    acceptDialog: "Accepting a browser dialog",
    dismissDialog: "Dismissing a browser dialog",
  },
};
