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
  skillsTitle: (dir: string) => string;
  commandsTitle: (dir: string) => string;
  unknownCommand: (command: string) => string;
  renamedCommand: string;
  globalConfigMigrated: (file: string) => string;

  // menu.ts: the setup wizard and the other questions
  initHeading: (dir: string) => string;
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
  setupSaved: (kind: string, dir: string) => string;
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
      Creates a new workspace in the given directory (or the current one) and offers
      to explore what that Moodle supports next.
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

Options:
  -h, --help         Shows this help.
  -v, --version      Shows the installed version.
  --language=<code>  Language of miyagi's and the chat's texts: es, en, fr or de
                     (by default, the workspace's "agent.language", or the system's).

Each workspace is a directory (the current one, or the one given with --dir) with its
own config.json, like a git repository. Without arguments, miyagi asks whether
you want "run" or "chat" and uses the current directory; if it isn't a workspace yet, it
sets it up and exits (run it again to start). --headless (needs saved credentials) and
the preferred language can also be set for good: in the workspace's config.json
("agent.headless", "agent.language") or, for all of them, in
${globalConfigPath} ("defaultHeadless", "defaultLanguage"). See README.md for
details.`,
  alreadyWorkspace: (dir) => `${dir} is already a miyagi workspace (config.json exists). Choose another directory.`,
  exploreFailed: (reason) => `Couldn't explore the Moodle (${reason}). The workspace is created; you can try again with "miyagi explore".`,
  catalogBuiltin: "[built-in]",
  catalogCustom: "[own]",
  skillsTitle: (dir) => `Skills available in ${dir}`,
  commandsTitle: (dir) => `Commands available in ${dir} (inside "chat")`,
  unknownCommand: (command) => `Unknown command "${command}". Use miyagi --help.`,
  renamedCommand: "teacher-agent is now called miyagi: use the miyagi command (teacher-agent still works for a while).",
  globalConfigMigrated: (file) => `Your settings from ~/.teacher-agent were copied to ${file}.`,

  initHeading: (dir) => `\n=== Setting up a workspace in ${dir} ===`,
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
    "publishing it, or run a submission while grading it)? It only works in the workspace's practice/ folder and " +
    "only with Docker; it never installs anything: if Docker isn't installed, it tells you.",
  practiceRunnerNote:
    "Note: this workspace hasn't set up an optional capability yet — testing practical activities (a Dockerfile, a " +
    "script, a submission's code) in Docker containers, before publishing them or while grading them. Off by " +
    'default; change it by hand in config.json ("agent.allowPracticeRunner": true/false) or answer the question below.',
  createInstructions: "Create instructions.md to add your own instructions for the agent? (optional, you can do it by hand later)",
  workspaceCreated: (dir) => `Workspace created in ${dir}\n`,
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
  notAWorkspace: (dir) => `${dir} isn't a miyagi workspace (no config.json). Run "miyagi init" there, or pass --dir with an existing workspace.`,
  contextMoved: (count, sourcesDir) => `context/ isn't used anymore: its ${count} files were moved to ${sourcesDir}.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ had the old layout: it was moved to ${legacyDir} (its downloaded files, to ${sourcesDir}) and the agent will rebuild the knowledge base from there.\n`,
  setupSaved: (kind, dir) => `Settings saved. When you want to start: miyagi ${kind} --dir "${dir}"`,
  autonomousNeedsCredentials:
    "autonomous mode can't log in by hand (there's no way to ask a human for help): save the user and password in config.json, or use --mode guided/interactive.",
  headlessNeedsCredentials:
    "--headless needs saved credentials (there's no visible window to log in by hand): save the user and password in config.json, or drop --headless.",
  headingIngest: "Ingesting into the knowledge base (no browser)",
  headingExplore: "Exploring what this Moodle supports",
  headingMode: (mode, chat) => `Mode: ${mode}${chat ? " (chat)" : ""}`,
  headingWorkspace: (label, dir) => `Workspace: ${label} (${dir})`,
  headingSession: (dir) => `Session: ${dir}`,
  headingCourse: (url, courseId) => `Course: ${url} (id ${courseId})\n`,
  headerWorkspace: "workspace",
  headerCourse: "course",
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
  manualLoginLines: ["No saved credentials for this workspace.", "Log in manually in the already-open browser window."],
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
