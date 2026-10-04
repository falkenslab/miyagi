---
name: scorm-packaging
description: Package a web activity (an HTML game, a simulation, an interactive exercise - your own or one online the teacher points to) as a SCORM 1.2 package that Moodle tracks - completion and a score in the gradebook - using the drafts toolbox (drafts_fetch_site, drafts_zip), never a shell. Use when the teacher wants an HTML activity graded or tracked in Moodle, or asks for SCORM.
---

# Packaging an activity as SCORM

Needs a connected Moodle classroom; without one, build what you can in `drafts/` and say so.

A SCORM package is a ZIP with the activity's files and an `imsmanifest.xml` at its root. In
Moodle it becomes a "SCORM package" activity that opens the activity and records what it
reports: whether the student completed it, and a score that goes to the gradebook. Without a
bridge that talks to Moodle, the package only opens: nothing is recorded.

Everything happens in `drafts/<slug>/` with the drafts toolbox (`drafts_*` tools): no shell,
no other way. Follow `publish-check`: it goes up hidden and is tested before students see it.

## 1. Get the activity's files into `drafts/<slug>/package/`

- **An activity online**: `drafts_fetch_site` with its URL and `to: "<slug>/package"`. It
  saves the page and everything it loaded, mirroring the URL paths from their common root, so
  `../shared/...` links keep working (the page may end up in a subfolder, e.g.
  `package/terminal-implacable/index.html`). Read its report: files from other sites are only
  listed, and whatever the page loads later (a level, a sound on click) isn't saved; get those
  with `drafts_download`. Check the license or ask the teacher before packaging someone
  else's work.
- **Your own activity**: write it in `drafts/<slug>/package/` (`resource-authoring` for the
  content).
- Open it locally isn't possible for you: check it after uploading, hidden (step 5).

## 2. Write the bridge: `package/scorm-bridge.js`

SCORM 1.2, the version every Moodle plays. Copy it as is:

```js
// scorm-bridge.js: reports this activity's progress to Moodle (SCORM 1.2).
(function () {
  "use strict";
  function find(win) {
    for (var i = 0; win && i < 10; i++) {
      if (win.API) return win.API;
      if (win.parent === win) break;
      win = win.parent;
    }
    return null;
  }
  var api = find(window) || (window.opener ? find(window.opener) : null);
  var open = false;
  function start() {
    if (!api || open) return;
    open = api.LMSInitialize("") === "true";
    if (api.LMSGetValue("cmi.core.lesson_status") === "not attempted") api.LMSSetValue("cmi.core.lesson_status", "incomplete");
  }
  window.SCORM = {
    available: !!api,
    // Progress as a percentage (0-100), saved at once: a student who leaves halfway keeps it.
    score: function (percent) {
      if (!api) return;
      start();
      api.LMSSetValue("cmi.core.score.min", "0");
      api.LMSSetValue("cmi.core.score.max", "100");
      api.LMSSetValue("cmi.core.score.raw", String(Math.max(0, Math.min(100, Math.round(percent)))));
      api.LMSCommit("");
    },
    // The end of the activity: "completed", or "passed"/"failed" when it has a pass mark.
    finish: function (status) {
      if (!api) return;
      start();
      api.LMSSetValue("cmi.core.lesson_status", status || "completed");
      api.LMSCommit("");
    },
  };
  start();
  window.addEventListener("pagehide", function () {
    if (api && open) { api.LMSCommit(""); api.LMSFinish(""); open = false; }
  });
})();
```

## 3. Hook it to the activity, without changing how it plays

Read the activity's scripts (`Read`, `Grep` on `drafts/<slug>/package/`) and find where it
records progress and where it ends: functions or callbacks named like `complete`, `finish`,
`win`, `gameOver`, `score`, `onComplete`; an end screen; a custom event. Then:

- add `<script src="…/scorm-bridge.js"></script>` **before** the activity's own scripts in
  its HTML (the path relative to that HTML file), and a small `scorm-hook.js` **after** them;
- in `scorm-hook.js`, wrap what you found instead of rewriting it: call the original, then
  `SCORM.score(done / total * 100)` on each step and `SCORM.finish("completed")` at the end.
  Keep it short and commented; if the activity already has a hook for this (an `on.complete`
  option, an event), use it.

Example, for an activity whose engine takes `on.complete` / `on.finish` callbacks:

```js
// scorm-hook.js: reports progress to Moodle through scorm-bridge.js.
(function () {
  var game = window.MyGame; // the engine object the activity creates
  var total = game.tasks.length;
  var onComplete = game.on.complete, onFinish = game.on.finish;
  game.on.complete = function () {
    if (onComplete) onComplete.apply(this, arguments);
    var done = game.tasks.filter(function (t) { return t.done; }).length;
    SCORM.score(done / total * 100);
  };
  game.on.finish = function () {
    if (onFinish) onFinish.apply(this, arguments);
    SCORM.finish("completed");
  };
})();
```

The activity must still work opened outside Moodle: the bridge does nothing without the API.

## 4. The manifest and the ZIP

`package/imsmanifest.xml`, with the launch page's path relative to `package/`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="<slug>" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="org">
    <organization identifier="org">
      <title>Activity title</title>
      <item identifier="item" identifierref="res"><title>Activity title</title></item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res" type="webcontent" adlcp:scormtype="sco" href="path/to/index.html">
      <file href="path/to/index.html"/>
    </resource>
  </resources>
</manifest>
```

Then `drafts_zip` with `folder: "<slug>/package"` and `to: "<slug>/<slug>.zip"`: the
package's files go at the archive's root, `imsmanifest.xml` among them (the tool says so).
`drafts_info` on the ZIP confirms its type and size.

## 5. Upload it hidden and test it in Moodle

- "Add an activity or resource" → "SCORM package", in the section the teacher chose; the ZIP
  in "Package file". Settings that make the score count:
  - Grade: "Grading method" "Highest grade", "Maximum grade" as the teacher grades (100, or
    10);
  - Attempts: unlimited unless the teacher says otherwise; "Attempts grading" "Highest
    attempt";
  - Appearance: "Display package" "Current window" (or "New window" if it needs the whole
    screen);
  - Completion (if the course uses it): "Require status" completed, or a minimum score.
  - "Hide on course page", as `publish-check` says. Ask for approval with these settings.
- Test it as the teacher: open it (normal mode, not only "Preview", which records nothing),
  play a step, leave, and check "Reports" → "Attempts": the attempt has a status and a score.
  Fix in `drafts/`, re-zip and replace the package if not.
- Note it in `course/drafts` and ask before showing it.

Never try to get around the toolbox (a shell, a subagent, another site to host it): if a step
can't be done with it, say which and why.
