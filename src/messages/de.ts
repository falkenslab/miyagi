import type { Messages } from "./en.js";

export const de: Messages = {
  help: (globalConfigPath) => `teacher-agent [<Befehl>] [Optionen]

Befehle:
  init [--dir <Pfad>]
      Legt im angegebenen (oder aktuellen) Verzeichnis einen neuen Arbeitsbereich an
      und bietet danach an zu erkunden, was dieses Moodle unterstützt.
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

Optionen:
  -h, --help         Zeigt diese Hilfe.
  -v, --version      Zeigt die installierte Version.
  --language=<Code>  Sprache der Texte von teacher-agent und des Chats: es, en, fr oder
                     de (standardmäßig die aus "agent.language" des Arbeitsbereichs,
                     sonst die des Systems).

Jeder Arbeitsbereich ist ein Verzeichnis (das aktuelle oder das mit --dir angegebene)
mit eigener config.json, wie ein Git-Repository. Ohne Argumente fragt teacher-agent, ob
Sie "run" oder "chat" wollen, und nutzt das aktuelle Verzeichnis; ist es noch kein
Arbeitsbereich, richtet es ihn ein und beendet sich (starten Sie es erneut). --headless
(braucht gespeicherte Zugangsdaten) und die bevorzugte Sprache lassen sich auch dauerhaft
festlegen: in der config.json des Arbeitsbereichs ("agent.headless", "agent.language")
oder, für alle, in ${globalConfigPath} ("defaultHeadless", "defaultLanguage").
Mehr in README.md.`,
  alreadyWorkspace: (dir) => `${dir} ist bereits ein teacher-agent-Arbeitsbereich (config.json existiert). Wählen Sie ein anderes Verzeichnis.`,
  exploreFailed: (reason) => `Das Moodle konnte nicht erkundet werden (${reason}). Der Arbeitsbereich ist angelegt; Sie können es mit "teacher-agent explore" erneut versuchen.`,
  catalogBuiltin: "[eingebaut]",
  catalogCustom: "[eigene]",
  skillsTitle: (dir) => `Verfügbare Fähigkeiten in ${dir}`,
  commandsTitle: (dir) => `Verfügbare Befehle in ${dir} (im "chat")`,
  unknownCommand: (command) => `Unbekannter Befehl "${command}". Nutzen Sie teacher-agent --help.`,

  initHeading: (dir) => `\n=== Arbeitsbereich wird eingerichtet in ${dir} ===`,
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
    "arbeitet nur im Ordner practice/ des Arbeitsbereichs und nur mit Docker; er installiert nie etwas: ist Docker nicht installiert, sagt er es Ihnen.",
  practiceRunnerNote:
    "Hinweis: Dieser Arbeitsbereich hat eine optionale Fähigkeit noch nicht eingerichtet — praktische Aktivitäten " +
    "(ein Dockerfile, ein Skript, den Code einer Abgabe) in Docker-Containern testen, vor dem Veröffentlichen oder " +
    'beim Bewerten. Standardmäßig aus; ändern Sie es von Hand in config.json ("agent.allowPracticeRunner": true/false) oder beantworten Sie die Frage unten.',
  createInstructions: "instructions.md anlegen, um dem Agenten eigene Anweisungen zu geben? (optional, geht später auch von Hand)",
  workspaceCreated: (dir) => `Arbeitsbereich angelegt in ${dir}\n`,
  exploreNow:
    "Jetzt erkunden, welche Aktivitäts- und Fragetypen dieses Moodle unterstützt? (er meldet sich an und schaut nur, " +
    'ohne etwas anzulegen; geht später auch mit "teacher-agent explore")',
  whatToDo: "Was möchten Sie tun?",
  kindRun: "Den Kurs in einem Durchgang betreuen (run)",
  kindChat: "Mit dem Agenten sprechen (chat)",
  whichMode: "In welchem Modus soll er laufen?",
  modeInteractive: "interactive — hält vor jeder Aktion an",
  modeGuided: "guided — hält nur an, bevor etwas für die Lernenden Sichtbares veröffentlicht wird",
  modeAutonomous: "autonomous — ohne Pausen",

  studentRole: (dir) => `${dir} ist ein Kursraum mit der Rolle "student": teacher-agent handelt nur als Lehrkraft.`,
  defaultLabel: (host, courseId) => `${host} · Kurs ${courseId}`,

  unknownMode: (value, valid) => `Unbekannter Modus "${value}". Nutzen Sie einen von: ${valid}.`,
  notAWorkspace: (dir) => `${dir} ist kein teacher-agent-Arbeitsbereich (keine config.json). Führen Sie dort "teacher-agent init" aus oder geben Sie mit --dir einen vorhandenen Arbeitsbereich an.`,
  contextMoved: (count, sourcesDir) => `context/ wird nicht mehr genutzt: seine ${count} Dateien wurden nach ${sourcesDir} verschoben.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ hatte die alte Struktur: es wurde nach ${legacyDir} verschoben (seine heruntergeladenen Dateien nach ${sourcesDir}), und der Agent baut die Wissensbasis daraus neu auf.\n`,
  setupSaved: (kind, dir) => `Einstellungen gespeichert. Wenn Sie beginnen möchten: teacher-agent ${kind} --dir "${dir}"`,
  autonomousNeedsCredentials:
    "Der Modus autonomous erlaubt keine Anmeldung von Hand (es gibt keinen Weg, einen Menschen um Hilfe zu bitten): speichern Sie Benutzer und Passwort in config.json oder nutzen Sie --mode guided/interactive.",
  headlessNeedsCredentials:
    "--headless braucht gespeicherte Zugangsdaten (kein sichtbares Fenster zum Anmelden von Hand): speichern Sie Benutzer und Passwort in config.json oder lassen Sie --headless weg.",
  headingIngest: "Aufnahme in die Wissensbasis (ohne Browser)",
  headingExplore: "Erkunden, was dieses Moodle unterstützt",
  headingMode: (mode, chat) => `Modus: ${mode}${chat ? " (chat)" : ""}`,
  headingWorkspace: (label, dir) => `Arbeitsbereich: ${label} (${dir})`,
  headingSession: (dir) => `Sitzung: ${dir}`,
  headingCourse: (url, courseId) => `Kurs: ${url} (id ${courseId})\n`,
  headerWorkspace: "Bereich",
  headerCourse: "Kurs",
  welcomePlain: "teacher-agent verbindet sich mit Moodle. Esc unterbricht die laufende Antwort; /resume setzt ein früheres Gespräch fort; /exit oder Strg+C (ohne laufende Antwort) beenden die Sitzung.",
  welcomeInk: "teacher-agent verbindet sich mit Moodle. Umschalt+Tab wechselt zwischen guided und interactive, /resume setzt ein früheres Gespräch fort, ? zeigt die Tastenkürzel und /exit beendet die Sitzung.",
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
  manualLoginLines: ["Für diesen Arbeitsbereich sind keine Zugangsdaten gespeichert.", "Melden Sie sich im bereits geöffneten Browserfenster von Hand an."],
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
    acceptDialog: "Bestätige einen Browser-Dialog",
    dismissDialog: "Schließe einen Browser-Dialog",
  },
};
