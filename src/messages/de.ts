import type { Messages } from "./en.js";

export const de: Messages = {
  help: (globalConfigPath) => `miyagi [<Befehl>] [Optionen]

Befehle:
  init [--dir <Pfad>]
      Legt ein neues Fach im Ordner von miyagi an (~/.miyagi/workspaces/<Name>/) oder, mit
      --dir, in diesem Verzeichnis, und bietet an, sein Moodle zu erkunden, falls es eines verbindet.
  run [--dir <Pfad>] [--mode interactive|guided|autonomous] [--headless] [--plain] [--task "<Text>"]
      Betreut den Kurs in einem Durchgang: bewertet offene Abgaben, antwortet im Forum,
      prüft oder ergänzt Inhalte und fasst den Fortschritt der Klasse zusammen. Ohne
      --mode fragt es nach dem Modus. Mit --task erledigt es nur diese Aufgabe (z. B.
      --task "erstelle einen Docker-Einführungskurs mit 3 Themen" oder --task "bewerte
      Aufgabe 2").
  chat [--dir <Pfad>] [--headless] [--inline] [--plain] [--continue]
      Gespräch im Vollbild. Beginnt im Modus guided; Umschalt+Tab wechselt zu
      interactive. --inline lässt das Gespräch im Verlauf des Terminals und --plain
      nutzt den reinen Text-Chat. --continue setzt das letzte Gespräch dieses Kurses
      fort, und /resume lässt im Chat ein anderes wählen.
  explore [--dir <Pfad>] [--headless] [--plain]
      Schaut (ohne etwas anzulegen), welche Aktivitäts- und Fragetypen dieses Moodle
      unterstützt, und notiert sie in knowledge/moodle-capabilities.md.
  ingest [--dir <Pfad>] [--plain] [Dateien...]
      Nimmt die angegebenen Dateien in die Wissensbasis (knowledge/) auf oder, ohne
      Dateien, alles aus sources/, was noch nicht darin ist. Ohne Browser und ohne Moodle.
  skills [--dir <Pfad>]
      Listet die verfügbaren Fähigkeiten auf: die eingebauten und die eigenen des
      Arbeitsbereichs (<workspace>/.claude/skills/).
  commands [--dir <Pfad>]
      Listet die Slash-Befehle auf, die im "chat" nutzbar sind.
  extension <list|info|add|remove|enable|disable|config|update|search|marketplace> [--dir <Pfad>] [--project]
      Installiert und verwaltet Erweiterungen aus dem offiziellen Repository von Falken's Lab
      oder einem eigenen: für alle Fächer (~/.miyagi/extensions) oder, mit --project, nur für dieses.
      "miyagi extension" allein erklärt jeden Unterbefehl.
  workspaces [forget <Name>]
      Listet Ihre Fächer mit ihrem Ordner; forget entfernt eines aus der Liste (sein
      Ordner bleibt).

Optionen:
  -h, --help         Zeigt diese Hilfe.
  -v, --version      Zeigt die installierte Version.
  -w, --workspace <Name>  Öffnet dieses Fach über seinen Namen, aus jedem Ordner.
  --language=<Code>  Sprache der Texte von miyagi und des Chats: es, en, fr oder
                     de (standardmäßig die aus "agent.language" des Arbeitsbereichs,
                     sonst die des Systems).

Jedes Fach (ein Arbeitsbereich) ist ein Ordner mit eigener config.json. Neue landen in
~/.miyagi/workspaces/<Name>/, und alle stehen in ~/.miyagi/workspaces.json: -w <Name>
öffnet es von überall; --dir <Pfad> funktioniert weiter, und im Ordner eines Fachs nutzt
miyagi dieses. Ohne Argumente fragt miyagi, ob Sie "run" oder "chat" wollen und welches
Fach (oder ein neues). --headless (braucht gespeicherte Zugangsdaten) und die bevorzugte
Sprache lassen sich auch dauerhaft festlegen: in der config.json des Fachs
("agent.headless", "agent.language") oder, für alle, in ${globalConfigPath}
("defaultHeadless", "defaultLanguage"). Mehr in README.md.`,
  alreadyWorkspace: (dir) => `${dir} ist bereits ein miyagi-Fach (config.json existiert). Wählen Sie ein anderes Verzeichnis.`,
  exploreFailed: (reason) => `Das Moodle konnte nicht erkundet werden (${reason}). Das Fach ist angelegt; Sie können es mit "miyagi explore" erneut versuchen.`,
  catalogBuiltin: "[eingebaut]",
  catalogCustom: "[eigene]",
  catalogExtension: (name) => `[${name}]`,
  skillsTitle: (dir) => `Verfügbare Fähigkeiten in ${dir}`,
  commandsTitle: (dir) => `Verfügbare Befehle in ${dir} (im "chat")`,
  unknownCommand: (command) => `Unbekannter Befehl "${command}". Nutzen Sie miyagi --help.`,
  renamedCommand: "teacher-agent heißt jetzt miyagi: Nutzen Sie den Befehl miyagi (teacher-agent funktioniert noch eine Weile).",
  globalConfigMigrated: (file) => `Ihre Einstellungen aus ~/.teacher-agent wurden nach ${file} kopiert.`,

  initHeading: (dir) => `\n=== Fach wird eingerichtet in ${dir} ===`,
  initHeadingNew: "\n=== Neues Fach ===",
  whichWorkspace: "Welches Fach?",
  newWorkspaceChoice: "Neues Fach…",
  workspacesTitle: "Ihre Fächer",
  workspacesEmpty: "Noch keine Fächer. \"miyagi init\" legt eines an.",
  missingTag: "[Ordner nicht gefunden]",
  kindName: () => "Fach",
  workspaceForgotten: (name, dir) => `"${name}" steht nicht mehr in der Liste. Sein Ordner bleibt unverändert: ${dir}`,
  workspaceNotFound: (query, ids) => `Es gibt kein Fach "${query}". ${ids ? `Ihre: ${ids}` : "Sie haben noch keines"} ("miyagi workspaces" listet sie).`,
  workspaceFolderMissing: (name, dir, id) => `Der Ordner von "${name}" ist weg (${dir}). Legen Sie ihn zurück, oder entfernen Sie ihn mit "miyagi workspaces forget ${id}" aus der Liste.`,
  noWorkspaceHere: (ids) => (ids ? `Hier ist kein Fach. Öffnen Sie eines mit -w <Name> (${ids}) oder legen Sie eines mit "miyagi init" an.` : 'Noch kein Fach: legen Sie eines mit "miyagi init" an.'),
  forgetUsage: "Welches? miyagi workspaces forget <Name>",
  required: "Pflichtfeld",
  moodleUrl: "Moodle-URL (oder fügen Sie die vollständige Kurs-URL ein, z. B. https://moodle.meineuni.de/course/view.php?id=4):",
  courseId: "Kurs-ID:",
  username: "Benutzer mit Lehrendenrolle (leer lassen, um sich von Hand anzumelden):",
  password: "Passwort:",
  label: "Bezeichnung:",
  description: "Beschreibung (optional):",
  persona: "Tonfall des Agenten (Foren, Feedback, Ankündigungen):",
  personaNone: "Keine Vorliebe (neutraler Ton)",
  personaFormal: "Förmlich",
  personaWarm: "Herzlich",
  personaMotivating: "Herzlich und motivierend",
  conversationLanguage: "Sprache, in der Sie lieber mit dem Agenten sprechen (leer, keine Vorliebe: er antwortet in Ihrer Sprache):",
  practiceRunnerQuestion:
    "Dem Agenten erlauben, praktische Aktivitäten in Docker-Containern zu testen (z. B. prüfen, ob eine " +
    "Aufgabenstellung funktioniert, bevor sie veröffentlicht wird, oder eine Abgabe beim Bewerten ausführen)? Er " +
    "arbeitet nur im Ordner practice/ des Fachs und nur mit Docker; er installiert nie etwas: ist Docker nicht installiert, sagt er es Ihnen.",
  practiceRunnerNote:
    "Hinweis: Dieser Arbeitsbereich hat eine optionale Fähigkeit noch nicht eingerichtet — praktische Aktivitäten " +
    "(ein Dockerfile, ein Skript, den Code einer Abgabe) in Docker-Containern testen, vor dem Veröffentlichen oder " +
    'beim Bewerten. Standardmäßig aus; ändern Sie es von Hand in config.json ("agent.allowPracticeRunner": true/false) oder beantworten Sie die Frage unten.',
  createInstructions: "instructions.md anlegen, um dem Agenten eigene Anweisungen zu geben? (optional, geht später auch von Hand)",
  workspaceCreated: (dir) => `Fach angelegt in ${dir}\n`,
  exploreNow:
    "Jetzt erkunden, welche Aktivitäts- und Fragetypen dieses Moodle unterstützt? (er meldet sich an und schaut nur, " +
    'ohne etwas anzulegen; geht später auch mit "miyagi explore")',
  whatToDo: "Was möchten Sie tun?",
  kindRun: "Den Kurs in einem Durchgang betreuen (run)",
  kindChat: "Mit dem Agenten sprechen (chat)",
  whichMode: "In welchem Modus soll er laufen?",
  modeInteractive: "interactive — hält vor jeder Aktion an",
  modeGuided: "guided — hält nur an, bevor etwas für die Lernenden Sichtbares veröffentlicht wird",
  modeAutonomous: "autonomous — ohne Pausen",

  studentRole: (dir) => `${dir} ist ein Kursraum mit der Rolle "student": miyagi handelt nur als Lehrkraft.`,
  draftsLimitsInvalid: (dir, key, valid) => `${dir}/config.json: agent.draftsLimits.${key} muss eine positive Zahl sein, und eines von: ${valid}.`,
  defaultLabel: (host, courseId) => `${host} · Kurs ${courseId}`,

  unknownMode: (value, valid) => `Unbekannter Modus "${value}". Nutzen Sie einen von: ${valid}.`,
  notAWorkspace: (dir) => `${dir} ist kein miyagi-Fach (keine config.json). Führen Sie "miyagi init" aus oder öffnen Sie eines mit -w <Name>.`,
  contextMoved: (count, sourcesDir) => `context/ wird nicht mehr genutzt: seine ${count} Dateien wurden nach ${sourcesDir} verschoben.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ hatte die alte Struktur: es wurde nach ${legacyDir} verschoben (seine heruntergeladenen Dateien nach ${sourcesDir}), und der Agent baut die Wissensbasis daraus neu auf.\n`,
  setupSaved: (command) => `Einstellungen gespeichert. Wenn Sie beginnen möchten: ${command}`,
  autonomousNeedsCredentials:
    "Der Modus autonomous erlaubt keine Anmeldung von Hand (es gibt keinen Weg, einen Menschen um Hilfe zu bitten): speichern Sie Benutzer und Passwort in config.json oder nutzen Sie --mode guided/interactive.",
  headlessNeedsCredentials:
    "--headless braucht gespeicherte Zugangsdaten (kein sichtbares Fenster zum Anmelden von Hand): speichern Sie Benutzer und Passwort in config.json oder lassen Sie --headless weg.",
  headingIngest: "Aufnahme in die Wissensbasis (ohne Browser)",
  headingExplore: "Erkunden, was dieses Moodle unterstützt",
  headingMode: (mode, chat) => `Modus: ${mode}${chat ? " (chat)" : ""}`,
  headingWorkspace: (label, dir) => `Fach: ${label} (${dir})`,
  headingSession: (dir) => `Sitzung: ${dir}`,
  headingCourse: (url, courseId) => `Kurs: ${url} (id ${courseId})\n`,
  headerWorkspace: "Fach",
  headerCourse: "Kurs",
  headerClassroom: "Kursraum",
  noClassroom: "kein Kursraum",
  connectMoodleNow: "Jetzt einen Moodle-Kurs verbinden? miyagi installiert die Erweiterung moodle-teacher, und Sie melden sich in deren Fenster bei Moodle an; ohne Kurs hilft es bei Planung und Materialien, und Sie können ihn später mit \"miyagi init -w <Name>\" verbinden",
  connectingMoodleTeacher: "Kurs wird über moodle-teacher verbunden…",
  moodleTeacherRetry: "Das Fach ist gespeichert: versuchen Sie es erneut mit \"miyagi init -w <Name>\" oder \"miyagi extension add moodle-teacher\".",
  moodleTeacherInstallFailed: "moodle-teacher konnte nicht installiert oder eingerichtet werden.",
  migrateClassroomIntro: "miyagi arbeitet in Moodle jetzt mit der Erweiterung moodle-teacher: feste Werkzeuge statt Herumklicken, und Sie melden sich in deren eigenem Fenster an statt mit einem gespeicherten Passwort. Der Kurs dieses Fachs nutzt noch den Browser.",
  migrateClassroomQuestion: "Diesen Kurs auf moodle-teacher umstellen? (gespeicherter Benutzername und Passwort werden aus der config.json entfernt)",
  keptBrowser: "Der Kurs bleibt beim Browser. Um ihn später umzustellen, entfernen Sie \"connector\" aus seiner config.json.",
  migratedClassroom: "Kurs auf moodle-teacher umgestellt.",
  moodleTeacherMissing: "Der Kurs dieses Fachs läuft über moodle-teacher, das nicht installiert oder ausgeschaltet ist: diese Sitzung arbeitet ohne den Kurs. \"miyagi extension add moodle-teacher\" (oder \"enable\") behebt es.",
  exploreNeedsClassroom: (dir) => `${dir} hat keinen verbundenen Kursraum: Es gibt kein Moodle zu erkunden. Verbinden Sie einen mit "miyagi init --dir ${dir}".`,
  classroomIncomplete: (dir) => `Der Kursraum in ${dir}/config.json braucht "url" und "courseId".`,
  workspaceName: "Name des Fachs:",
  welcomePlain: "miyagi ist bereit. Esc unterbricht die laufende Antwort; /resume setzt ein früheres Gespräch fort; /exit oder Strg+C (ohne laufende Antwort) beenden die Sitzung.",
  welcomeInk: "miyagi ist bereit. Umschalt+Tab wechselt zwischen guided und interactive, /resume setzt ein früheres Gespräch fort, ? zeigt die Tastenkürzel und /exit beendet die Sitzung.",
  promptLabel: "du>",
  exitingNow: "Beenden ohne zu warten. Was bisher aufgezeichnet wurde, ist bereits gespeichert.",
  interrupting: "Unterbreche und beende die Sitzung… (Strg+C noch einmal, um ohne Warten zu beenden)",
  sessionInterrupted: "Sitzung unterbrochen.",
  sessionClosed: "Sitzung beendet.",
  nothingPending: "Nichts mehr zu speichern: alles wird laufend auf die Festplatte geschrieben.",
  endTranscript: (path) => `  - Die Aktionen des Agenten und ihre Ergebnisse: ${path}`,
  endConversation: (path) => `  - Das Gespräch als reiner Text: ${path}`,
  endKnowledge: (path) => `  - Was der Agent gelernt hat: ${path}`,
  endDrafts: (path) => `Es gibt verborgen in Moodle hochgeladene Materialien, die die Lernenden noch nicht sehen: ${path}`,
  endInterruptedNote:
    "Was er beim Unterbrechen tat, kann halb fertig sein (eine nicht gespeicherte Note, eine nicht veröffentlichte Antwort); in der nächsten Sitzung können Sie ihn bitten, es fortzusetzen.",

  gateTitle: "Veröffentlichung ohne vorherige Zustimmung",
  gateLine: "Der Agent will in Moodle etwas für die Lernenden Sichtbares veröffentlichen oder ändern, ohne Sie vorher gefragt zu haben.",

  manualLoginTitle: "Anmeldung von Hand nötig",
  manualLoginLines: ["Für dieses Fach sind keine Zugangsdaten gespeichert.", "Melden Sie sich im bereits geöffneten Browserfenster von Hand an."],
  manualLoginQuestion: "Drücken Sie Enter, sobald Sie angemeldet sind (oder 'q' zum Abbrechen): ",

  toolPhrases: {
    navigate: ["hat {n} Seite geöffnet", "hat {n} Seiten geöffnet"],
    back: ["ist zurückgegangen", "ist {n}-mal zurückgegangen"],
    click: ["hat {n}-mal geklickt", "hat {n}-mal geklickt"],
    type: ["hat in {n} Feld geschrieben", "hat in {n} Felder geschrieben"],
    fillForm: ["hat {n} Formular ausgefüllt", "hat {n} Formulare ausgefüllt"],
    select: ["hat {n} Option gewählt", "hat {n} Optionen gewählt"],
    pressKey: ["hat {n} Taste gedrückt", "hat {n} Tasten gedrückt"],
    snapshot: ["hat die Seite gelesen", "hat die Seite {n}-mal gelesen"],
    evaluate: ["hat die Seite untersucht", "hat die Seite {n}-mal untersucht"],
    find: ["hat die Seite durchsucht", "hat die Seite {n}-mal durchsucht"],
    wait: ["hat gewartet", "hat {n}-mal gewartet"],
    upload: ["hat Dateien hochgeladen", "hat {n}-mal Dateien hochgeladen"],
    screenshot: ["hat {n} Screenshot erstellt", "hat {n} Screenshots erstellt"],
    approval: ["hat um Freigabe gebeten", "hat {n}-mal um Freigabe gebeten"],
    download: ["hat {n} Datei heruntergeladen", "hat {n} Dateien heruntergeladen"],
    files: ["hat mit Dateien gearbeitet", "hat {n}-mal mit Dateien gearbeitet"],
    pdf: ["hat {n} PDF erstellt", "hat {n} PDFs erstellt"],
  },

  tool: {
    navigate: (url) => `Öffne ${url}`,
    aPage: "eine Seite",
    back: "Zurück zur vorigen Seite",
    forward: "Weiter zur nächsten Seite",
    snapshot: "Lese die Struktur der Seite",
    click: (element) => `Klicke auf „${element}“`,
    hover: (element) => `Fahre über „${element}“`,
    drag: (from, to) => `Ziehe „${from}“ nach „${to}“`,
    select: (values, element) => `Wähle „${values}“ in „${element}“`,
    type: (text, element) => `Tippe „${text}“ in „${element}“`,
    anElement: "ein Element",
    anotherElement: "ein anderes Element",
    aDropdown: "eine Auswahlliste",
    aField: "ein Feld",
    pressKey: (key) => `Drücke die Taste „${key}“`,
    waitFor: (text) => `Warte, bis „${text}“ erscheint`,
    waitGone: (text) => `Warte, bis „${text}“ verschwindet`,
    waitSeconds: (seconds) => `Warte ${seconds} s`,
    wait: "Warte",
    findText: (text) => `Suche „${text}“ auf der Seite`,
    findPattern: (pattern) => `Suche das Muster „${pattern}“ auf der Seite`,
    find: "Durchsuche die Seite",
    fillForm: (fields) => `Fülle ein Formular aus (${fields} Feld${fields === 1 ? "" : "er"})`,
    upload: "Lade Dateien hoch",
    evaluate: {
      editor: "Schreibe in den Texteditor",
      form: "Fülle das Formular aus",
      act: "Klicke auf der Seite",
      otherPages: "Sehe mir andere Seiten des Kurses an",
      formFields: "Prüfe die Formularfelder",
      table: "Lese eine Tabelle der Seite",
      dialog: "Lese einen Dialog der Seite",
      links: "Sehe mir die Links der Seite an",
      location: "Prüfe, auf welcher Seite ich bin",
      content: "Lese den Inhalt der Seite",
      generic: "Untersuche die Seite",
    },
    screenshot: "Mache ein Bildschirmfoto",
    tabs: "Verwalte die Tabs",
    resize: "Ändere die Fenstergröße",
    close: "Schließe den Browser",
    console: "Prüfe die Browser-Konsole",
    networkRequests: "Prüfe die Netzwerkanfragen",
    saveResponse: "Speichere die Antwort einer Anfrage auf der Festplatte",
    requestDetails: "Lese die Details einer Anfrage",
    runCodeUnsafe: "Versuche, uneingeschränkten Code auszuführen (blockiert)",
    drafts: {
      list: (p) => `Sehe mir ${p} in drafts/ an`,
      mkdir: (p) => `Lege den Ordner ${p} an`,
      copy: (from, to) => `Kopiere ${from} nach ${to}`,
      move: (from, to) => `Verschiebe ${from} nach ${to}`,
      del: (p) => `Lösche ${p}`,
      download: (url) => `Lade ${url} herunter`,
      fetchSite: (url) => `Speichere die Website ${url}`,
      unzip: (archive) => `Entpacke ${archive}`,
      zip: (to) => `Packe ${to}`,
      pdf: (to) => `Drucke ${to}`,
      info: (p) => `Prüfe die Datei ${p}`,
    },
    acceptDialog: "Bestätige einen Browser-Dialog",
    dismissDialog: "Schließe einen Browser-Dialog",
  },
};
