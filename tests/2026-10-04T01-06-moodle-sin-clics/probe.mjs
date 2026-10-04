// Pruebas de la vía "sin clics" para moodle-mcp: login por formulario y después
// solo peticiones HTTP con la sesión (AJAX lib/ajax/service.php y formularios GET→POST).
// Uso (desde la raíz de miyagi, con la sandbox levantada): node tests/2026-10-04T01-06-moodle-sin-clics/probe.mjs --sandbox <dir moodle-sandbox> --course <id> [--only a,b] [--out file]
/* global window, document, M, DOMParser -- used inside page.evaluate(), in the browser (M is Moodle's own global) */
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const sandboxDir = arg("sandbox");
const courseId = Number(arg("course"));
const only = arg("only")?.split(",");
const out = arg("out", "results.json");

const infoRun = spawnSync("node", ["manage.mjs", "info", "--json"], { cwd: sandboxDir, encoding: "utf-8" });
const info = JSON.parse(infoRun.stdout.slice(infoRun.stdout.indexOf("{")));
const BASE = info.url;

// ---------- helpers que viven en la página (mismo origen, cookies de la sesión) ----------
const PAGE_HELPERS = `
window.__mcp = {
  async ajax(methodname, args) {
    const r = await fetch(M.cfg.wwwroot + '/lib/ajax/service.php?sesskey=' + M.cfg.sesskey + '&info=' + methodname, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify([{index: 0, methodname, args}]) });
    const j = await r.json();
    return Array.isArray(j) ? j[0] : j;
  },
  async getDoc(url) {
    const r = await fetch(url, {credentials: 'same-origin'});
    const html = await r.text();
    return {status: r.status, url: r.url, html, doc: new DOMParser().parseFromString(html, 'text/html')};
  },
  pickForm(doc, qf) {
    const forms = [...doc.querySelectorAll('form')];
    return forms.find(f => qf ? f.querySelector('input[name="_qf__' + qf + '"]') : f.querySelector('input[name^="_qf__"]'));
  },
  formEntries(form) {
    // FormData no funciona con formularios de un documento inerte en todos los navegadores: a mano.
    const e = [];
    for (const el of form.elements) {
      if (!el.name || el.disabled) continue;
      const t = (el.type || '').toLowerCase();
      if (['submit','button','image','reset','file'].includes(t)) continue;
      if ((t === 'checkbox' || t === 'radio') && !el.checked) continue;
      if (el.tagName === 'SELECT') {
        for (const o of el.options) if (o.selected) e.push([el.name, o.value]);
        if (!el.multiple && ![...el.options].some(o => o.selected) && el.options.length) e.push([el.name, el.options[0].value]);
        continue;
      }
      e.push([el.name, el.value]);
    }
    return e;
  },
  setField(entries, name, value) {
    const i = entries.findIndex(([n]) => n === name);
    if (value === undefined) { if (i >= 0) entries.splice(i, 1); return entries; }
    if (i >= 0) entries[i][1] = String(value); else entries.push([name, String(value)]);
    return entries;
  },
  errorsOf(doc) {
    const sel = '.invalid-feedback, [id^="id_error_"], .alert-danger, .errorbox, .errormessage';
    return [...doc.querySelectorAll(sel)].map(e => e.textContent.trim()).filter(Boolean).slice(0, 5);
  },
  async postForm(action, entries) {
    const fd = new FormData();
    for (const [n, v] of entries) fd.append(n, v);
    const r = await fetch(action, {method: 'POST', body: fd, credentials: 'same-origin'});
    const html = await r.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return {status: r.status, url: r.url, redirected: r.redirected, errors: this.errorsOf(doc), title: doc.title, html};
  },
  // GET del formulario, cambiar campos, POST. changes: {name: value|undefined}
  async submit(url, qf, changes, button) {
    const g = await this.getDoc(url);
    const form = this.pickForm(g.doc, qf);
    if (!form) return {error: 'form not found', status: g.status, url: g.url, title: g.doc.title};
    const entries = this.formEntries(form);
    for (const [k, v] of Object.entries(changes)) this.setField(entries, k, v);
    if (button) this.setField(entries, button[0], button[1]);
    const action = new URL(form.getAttribute('action') || url, g.url).href;
    const res = await this.postForm(action, entries);
    delete res.html;
    return {action, fieldNames: entries.map(([n]) => n), ...res};
  },
  // Subida al área de borrador (repository_ajax.php?action=upload) con los datos del filepicker de la página
  async uploadDraft(pageHtml, itemid, filename, content, mime) {
    const repo = [...pageHtml.matchAll(/"id":"?(\\d+)"?,[^{}]*?"type":"upload"/g)].map(m => m[1])[0]
      ?? [...pageHtml.matchAll(/"type":"upload"[^{}]*?"id":"?(\\d+)"?/g)].map(m => m[1])[0];
    const ctx = pageHtml.match(/"context":\\{"id":"?(\\d+)"?/)?.[1] ?? pageHtml.match(/"contextid":"?(\\d+)"?/)?.[1];
    const fd = new FormData();
    fd.append('repo_upload_file', new Blob([content], {type: mime}), filename);
    fd.append('title', filename); fd.append('author', 'miyagi'); fd.append('license', 'allrightsreserved');
    fd.append('itemid', itemid); fd.append('repo_id', repo); fd.append('p', ''); fd.append('page', '');
    fd.append('env', 'filemanager'); fd.append('sesskey', M.cfg.sesskey); fd.append('ctx_id', ctx); fd.append('savepath', '/');
    const r = await fetch(M.cfg.wwwroot + '/repository/repository_ajax.php?action=upload', {method: 'POST', body: fd});
    let body = await r.text(); try { body = JSON.parse(body); } catch {}
    return {repo, ctx, status: r.status, body};
  },
};
'ok'`;

const results = [];
const record = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? "OK  " : ok === null ? "INFO" : "FAIL"} ${name}`, JSON.stringify(detail).slice(0, 600)); };
const short = (s, n = 300) => (typeof s === "string" ? s.slice(0, n) : s);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();

// ---------- login por formulario (determinista, sin SSO) ----------
page.setDefaultTimeout(120000); await page.goto(`${BASE}/login/index.php`);
await page.fill("#username", info.teacher.username);
await page.fill("#password", info.teacher.password);
await Promise.all([page.waitForURL((u) => !u.pathname.includes("/login/"), { timeout: 30000 }), page.click("#loginbtn")]);
await page.goto(`${BASE}/course/view.php?id=${courseId}`);
const inject = async () => page.evaluate(PAGE_HELPERS);
await inject();
const ev = (fn, a) => page.evaluate(fn, a);
const ajax = (m, a) => ev(([m, a]) => window.__mcp.ajax(m, a), [m, a]);
const state = async () => { const r = await ajax("core_courseformat_get_state", { courseid: courseId }); return r.error ? r : JSON.parse(r.data); };
const bodyInfo = await ev(() => ({ theme: M.cfg.theme, format: document.body.className.match(/format-(\S+)/)?.[1], ctx: document.body.className.match(/context-(\d+)/)?.[1] }));
record("session", true, { base: BASE, ...bodyInfo });

const ctxOfCm = async (cmid, mod) => ev(async ([cmid, mod]) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/mod/${mod}/view.php?id=${cmid}`); return g.doc.body.className.match(/context-(\d+)/)?.[1]; }, [cmid, mod]);
const newestCm = async (modname) => { const s = await state(); return s.cm.filter((c) => c.module === modname).sort((a, b) => Number(b.id) - Number(a.id))[0]; };

const T = {};
const ctx = {};

T.version = async () => {
  const d = await ev(async () => {
    const probe = async (p) => { const r = await fetch(M.cfg.wwwroot + p); const t = r.ok ? await r.text() : ''; return {p, status: r.status, head: t.match(/^## [0-9.]+|^=== [0-9.]+[^\n]*/m)?.[0] ?? null}; };
    const site = await window.__mcp.ajax('core_webservice_get_site_info', {});
    const cfgKeys = Object.keys(M.cfg);
    const docs = [...document.querySelectorAll('a[href*="docs.moodle.org"]')].map(a => a.href.match(/docs\.moodle\.org\/(\d+)/)?.[1]);
    return {
      siteInfo: site.error ? site.exception?.errorcode : {release: JSON.parse(JSON.stringify(site.data)).release, version: site.data.version},
      files: await Promise.all(['/UPGRADING.md', '/lib/upgrade.txt', '/question/banks.php', '/course/format/update.php', '/admin/environment.xml'].map(probe)),
      docsLinks: [...new Set(docs)], cfgKeys,
    };
  });
  record("version: detección sin admin", null, d);
};

T.getState = async () => {
  const s = await state();
  if (s.error) return record("get_state", false, s);
  ctx.state0 = s;
  record("get_state", true, { courseKeys: Object.keys(s.course), sectionKeys: Object.keys(s.section[0] ?? {}), cmKeys: Object.keys(s.cm[0] ?? {}), sections: s.section.length, cms: s.cm.length, format: s.course.format ?? null });
};

T.sectionAdd = async () => {
  const before = (await state()).section.map((x) => x.id);
  const r = await ajax("core_courseformat_update_course", { action: "section_add", courseid: courseId, ids: [] });
  const after = (await state()).section;
  const added = after.find((x) => !before.includes(x.id));
  ctx.sectionId = added?.id; ctx.sectionNum = added?.number ?? added?.section;
  record("update_course section_add", !r.error && !!added, { error: r.exception?.message, added: added && { id: added.id, number: added.number, title: added.title } });
};

T.renameSection = async () => {
  const fmt = bodyInfo.format;
  const r = await ajax("core_update_inplace_editable", { component: `format_${fmt}`, itemtype: "sectionname", itemid: String(ctx.sectionId), value: "Tema 1: pruebas MCP" });
  const s = await state();
  const sec = s.section.find((x) => x.id === ctx.sectionId);
  record("inplace_editable renombrar sección", !r.error && sec?.title === "Tema 1: pruebas MCP", { component: `format_${fmt}`, error: r.exception?.message, title: sec?.title });
};

T.editSection = async () => {
  const html = "<p>Resumen con <strong>formato</strong></p>";
  const r = await ev(([id, html]) => window.__mcp.submit(`${M.cfg.wwwroot}/course/editsection.php?id=${id}`, null, { "summary_editor[text]": html, "summary_editor[format]": "1" }, ["submitbutton", "Save changes"]), [ctx.sectionId, html]);
  const back = await ev(async (id) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/course/editsection.php?id=${id}`); return g.doc.querySelector('textarea[name="summary_editor[text]"]')?.value; }, ctx.sectionId);
  record("editsection.php GET→POST resumen", !r.error && back === html, { status: r.status, finalUrl: r.url, errors: r.errors, savedSummary: back, qf: r.fieldNames?.filter((n) => n.startsWith("_qf__")) });
};

T.createPage = async () => {
  const content = "<p>Ejemplo:</p><pre><code>for i in range(3):\n    if i % 2:\n        print(i)</code></pre>";
  const url = `${BASE}/course/modedit.php?add=page&course=${courseId}&section=${ctx.sectionNum}&return=0`;
  const r = await ev(([url, content]) => window.__mcp.submit(url, "mod_page_mod_form", { name: "Página MCP", "introeditor[text]": "<p>Intro</p>", "page[text]": content, "page[format]": "1", visible: "0" }, ["submitbutton2", "Save and return to course"]), [url, content]);
  const cm = await newestCm("page");
  ctx.pageCm = cm?.id;
  const back = cm && await ev(async (id) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/course/modedit.php?update=${id}`); return g.doc.querySelector('textarea[name="page[text]"]')?.value; }, cm.id);
  record("modedit add=page GET→POST (oculta, con código)", !r.error && !!cm && back === content && cm.visible === false,
    { status: r.status, finalUrl: r.url, errors: r.errors, cm: cm && { id: cm.id, name: cm.name, visible: cm.visible }, indentKept: back === content, saved: short(back), fields: r.fieldNames?.length });
};

T.validationError = async () => {
  const url = `${BASE}/course/modedit.php?add=page&course=${courseId}&section=${ctx.sectionNum}&return=0`;
  const r = await ev((url) => window.__mcp.submit(url, "mod_page_mod_form", { name: "", "page[text]": "" }, ["submitbutton2", "x"]), url);
  record("detección de error de validación", r.status === 200 && r.errors.length > 0 && /modedit\.php/.test(r.url), { status: r.status, url: r.url, redirected: r.redirected, errors: r.errors });
};

T.newModule = async () => {
  const tried = {};
  for (const m of ["label", "page", "subsection", "qbank"]) {
    const x = await ajax("core_courseformat_new_module", { courseid: courseId, modname: m, targetsectionid: ctx.sectionId });
    tried[m] = x.error ? (x.exception?.message ?? x.exception?.errorcode) : "ok";
  }
  record("new_module: qué tipos admite", null, tried);
  // la etiqueta para las pruebas siguientes, por formulario
  await ev((url) => window.__mcp.submit(url, "mod_label_mod_form", { "introeditor[text]": "<p>Etiqueta</p>", visible: "0" }, ["submitbutton2", "x"]), `${BASE}/course/modedit.php?add=label&course=${courseId}&section=${ctx.sectionNum}&return=0`);
  const r = {};
  const cm = await newestCm("label");
  ctx.labelCm = cm?.id;
  record("core_courseformat_new_module (label)", !r.error && !!cm, { error: r.exception?.message ?? r.exception?.errorcode, cm: cm && { id: cm.id, name: cm.name, visible: cm.visible } });
  if (cm) {
    const u = await ev((id) => window.__mcp.submit(`${M.cfg.wwwroot}/course/modedit.php?update=${id}`, "mod_label_mod_form", { "introeditor[text]": "<p>Texto del área</p>", visible: "0" }, ["submitbutton2", "x"]), cm.id);
    const cm2 = (await state()).cm.find((c) => c.id == cm.id);
    record("new_module + modedit update", !u.error && u.errors.length === 0, { status: u.status, url: u.url, errors: u.errors, visibleAfter: cm2?.visible });
  }
};

T.renameActivity = async () => {
  const r = await ajax("core_update_inplace_editable", { component: "core_course", itemtype: "activityname", itemid: String(ctx.pageCm), value: "Página MCP renombrada" });
  const cm = (await state()).cm.find((c) => c.id == ctx.pageCm);
  record("inplace_editable renombrar actividad", !r.error && cm?.name === "Página MCP renombrada", { error: r.exception?.message, name: cm?.name });
};

T.visibility = async () => {
  const show = await ajax("core_courseformat_update_course", { action: "cm_show", courseid: courseId, ids: [ctx.pageCm] });
  const v1 = (await state()).cm.find((c) => c.id == ctx.pageCm)?.visible;
  const hide = await ajax("core_courseformat_update_course", { action: "cm_hide", courseid: courseId, ids: [ctx.pageCm] });
  const v2 = (await state()).cm.find((c) => c.id == ctx.pageCm)?.visible;
  const sh = await ajax("core_courseformat_update_course", { action: "section_hide", courseid: courseId, ids: [ctx.sectionId] });
  const sv = (await state()).section.find((s) => s.id === ctx.sectionId)?.visible;
  record("update_course cm_show/cm_hide/section_hide", !show.error && !hide.error && !sh.error && v1 === true && v2 === false && sv === false, { v1, v2, sectionVisible: sv, errors: [show, hide, sh].map((x) => x.exception?.message).filter(Boolean) });
};

T.move = async () => {
  const s0 = await state();
  const sec0 = s0.section.find((s) => s.number === 0 || s.section === 0);
  const a = await ajax("core_courseformat_update_course", { action: "section_add", courseid: courseId, ids: [] });
  const s1 = await state();
  const sec2 = s1.section.find((s) => !s0.section.some((o) => o.id === s.id));
  const mv = await ajax("core_courseformat_update_course", { action: "section_move_after", courseid: courseId, ids: [sec2.id], targetsectionid: sec0.id });
  const s2 = await state();
  const order = s2.course.sectionlist;
  const cmMove = await ajax("core_courseformat_update_course", { action: "cm_move", courseid: courseId, ids: [ctx.labelCm], targetsectionid: sec2.id });
  const s3 = await state();
  record("section_move_after y cm_move", !a.error && !mv.error && !cmMove.error && order.indexOf(sec2.id) === 1 && s3.cm.find((c) => c.id == ctx.labelCm)?.sectionid === String(sec2.id) || s3.cm.find((c) => c.id == ctx.labelCm)?.sectionid == sec2.id,
    { errors: [a, mv, cmMove].map((x) => x.exception?.message).filter(Boolean), sectionlist: order, movedSection: sec2.id, labelSection: s3.cm.find((c) => c.id == ctx.labelCm)?.sectionid });
  ctx.section2 = sec2.id;
};

T.uploadResource = async () => {
  const url = `${BASE}/course/modedit.php?add=resource&course=${courseId}&section=${ctx.sectionNum}&return=0`;
  const r = await ev(async (url) => {
    const g = await window.__mcp.getDoc(url);
    const form = window.__mcp.pickForm(g.doc, 'mod_resource_mod_form');
    const entries = window.__mcp.formEntries(form);
    const itemid = entries.find(([n]) => n === 'files')?.[1];
    const up = await window.__mcp.uploadDraft(g.html, itemid, 'apuntes.html', '<!doctype html><html lang="es"><meta name="viewport" content="width=device-width"><h1>Apuntes</h1></html>', 'text/html');
    window.__mcp.setField(entries, 'name', 'Archivo MCP'); window.__mcp.setField(entries, 'visible', '0');
    window.__mcp.setField(entries, 'introeditor[text]', '<p>Archivo</p>'); window.__mcp.setField(entries, 'submitbutton2', 'x');
    const res = await window.__mcp.postForm(new URL(form.getAttribute('action'), g.url).href, entries);
    delete res.html;
    return {itemid, up, res};
  }, url);
  const cm = await newestCm("resource");
  record("subida a borrador + modedit add=resource", !!cm && !r.up.body?.error && r.res.errors.length === 0, { itemid: r.itemid, repo: r.up.repo, ctx: r.up.ctx, uploadStatus: r.up.status, uploadBody: short(JSON.stringify(r.up.body), 250), status: r.res.status, url: r.res.url, errors: r.res.errors, cm: cm && { id: cm.id, name: cm.name, visible: cm.visible } });
};

T.forum = async () => {
  const url = `${BASE}/course/modedit.php?add=forum&course=${courseId}&section=${ctx.sectionNum}&return=0`;
  const c = await ev((url) => window.__mcp.submit(url, "mod_forum_mod_form", { name: "Foro MCP", "introeditor[text]": "<p>Dudas</p>", visible: "1" }, ["submitbutton2", "x"]), url);
  const cm = await newestCm("forum");
  if (!cm) return record("foro: crear", false, c);
  const forumId = await ev(async (id) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/course/modedit.php?update=${id}`); return g.doc.querySelector('input[name="instance"]')?.value; }, cm.id);
  const d = await ev((f) => window.__mcp.submit(`${M.cfg.wwwroot}/mod/forum/post.php?forum=${f}`, null, { subject: "Bienvenida", "message[text]": "<p>Hola a todos</p>", "message[format]": "1" }, ["submitbutton", "Post to forum"]), forumId);
  const postId = await ev(async (id) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/mod/forum/view.php?id=${id}`); const dd = g.html.match(/discuss\.php\?d=(\d+)/)?.[1]; const g2 = await window.__mcp.getDoc(`${M.cfg.wwwroot}/mod/forum/discuss.php?d=${dd}`); return {d: dd, post: g2.html.match(/data-post-id="(\d+)"/)?.[1]}; }, cm.id);
  const reply = await ajax("mod_forum_add_discussion_post", { postid: Number(postId.post), subject: "Re: Bienvenida", message: "<p>Respuesta <code>x = 1</code></p>", messageformat: 1, options: [] });
  record("foro: crear + debate por post.php + respuesta AJAX", !c.errors.length && !d.errors?.length && !reply.error, { forumId, createErrors: c.errors, discussionErrors: d.errors, discussionUrl: d.url, ids: postId, reply: reply.error ? reply.exception?.message : Object.keys(reply.data ?? {}) });
};

T.grading = async () => {
  const url = `${BASE}/course/modedit.php?add=assign&course=${courseId}&section=${ctx.sectionNum}&return=0`;
  const c = await ev((url) => window.__mcp.submit(url, "mod_assign_mod_form", { name: "Tarea MCP", "introeditor[text]": "<p>Entrega</p>", "assignfeedback_comments_enabled": "1", "grade[modgrade_type]": "point", "grade[modgrade_point]": "10", visible: "1" }, ["submitbutton2", "x"]), url);
  const cm = await newestCm("assign");
  if (!cm) return record("tarea: crear", false, c);
  ctx.assignCm = cm.id;
  const cctx = await ctxOfCm(cm.id, "assign");
  const assignId = await ev(async (id) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/course/modedit.php?update=${id}`); return g.doc.querySelector('input[name="instance"]')?.value; }, cm.id);
  const parts = await ajax("mod_assign_list_participants", { assignid: Number(assignId), groupid: 0, filter: "", skip: 0, limit: 0, onlyids: false, includeenrolments: false, tablesort: false });
  const student = (parts.data ?? []).find((p) => p.fullname && !/profesor|teacher/i.test(p.fullname)) ?? (parts.data ?? [])[0];
  const frag = await ajax("core_get_fragment", { component: "mod_assign", callback: "gradingpanel", contextid: Number(cctx), args: [{ name: "userid", value: String(student.id) }, { name: "attemptnumber", value: "-1" }, { name: "jsonformdata", value: '""' }] });
  if (frag.error) return record("tarea: panel de calificación (fragment)", false, { error: frag.exception?.message });
  const res = await ev(async ([html, assignId, uid]) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const form = doc.querySelector('form');
    const entries = window.__mcp.formEntries(form);
    window.__mcp.setField(entries, 'grade', '8');
    window.__mcp.setField(entries, 'assignfeedbackcomments_editor[text]', '<p>Buen trabajo, revisa el <code>if</code>.</p>');
    window.__mcp.setField(entries, 'assignfeedbackcomments_editor[format]', '1');
    window.__mcp.setField(entries, 'sendstudentnotifications', '0');
    const qs = new URLSearchParams(entries).toString();
    const r = await window.__mcp.ajax('mod_assign_submit_grading_form', {assignmentid: Number(assignId), userid: Number(uid), jsonformdata: JSON.stringify(qs)});
    return {fields: entries.map(([n]) => n), r};
  }, [frag.data.html, assignId, student.id]);
  const frag2 = await ajax("core_get_fragment", { component: "mod_assign", callback: "gradingpanel", contextid: Number(cctx), args: [{ name: "userid", value: String(student.id) }, { name: "attemptnumber", value: "-1" }, { name: "jsonformdata", value: '""' }] });
  const back = await ev((html) => { const d = new DOMParser().parseFromString(html, 'text/html'); return {grade: d.querySelector('[name="grade"]')?.value, fb: d.querySelector('[name="assignfeedbackcomments_editor[text]"]')?.value}; }, frag2.data.html);
  record("calificar por AJAX (nota + comentario)", !res.r.error && back.grade?.startsWith("8") && /revisa/.test(back.fb ?? ""), { assignId, student: "alumno (sandbox)", warnings: res.r.data ?? res.r.exception?.message, back, fields: res.fields });
};

T.rubric = async () => {
  // Activar rúbrica en la tarea y definirla por el formulario sin JS
  const set = await ev((id) => window.__mcp.submit(`${M.cfg.wwwroot}/course/modedit.php?update=${id}`, "mod_assign_mod_form", { advancedgradingmethod_submissions: "rubric" }, ["submitbutton2", "x"]), ctx.assignCm);
  const cctx = await ctxOfCm(ctx.assignCm, "assign");
  const editUrl = await ev(async (c) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/grade/grading/manage.php?contextid=${c}&component=mod_assign&area=submissions`); const a = g.html.match(/grade\/grading\/form\/rubric\/edit\.php\?areaid=(\d+)/); return a ? `${M.cfg.wwwroot}/grade/grading/form/rubric/edit.php?areaid=${a[1]}` : null; }, cctx);
  if (!editUrl) return record("rúbrica: activar", false, { set: set.errors });
  const crit = [["Corrección", [[0, "Incorrecto"], [3, "Parcial"], [5, "Correcto"]]], ["Estilo", [[0, "Ilegible"], [5, "Claro"]]]];
  const r = await ev(([url, crit]) => {
    const ch = { name: "Rúbrica MCP", "description_editor[text]": "", "rubric[options][sortlevelsasc]": "1" };
    crit.forEach(([desc, levels], i) => {
      const c = `rubric[criteria][NEWID${i + 1}]`;
      ch[`${c}[sortorder]`] = String(i + 1); ch[`${c}[description]`] = desc;
      levels.forEach(([score, def], j) => { ch[`${c}[levels][NEWID${j}][score]`] = String(score); ch[`${c}[levels][NEWID${j}][definition]`] = def; });
    });
    return window.__mcp.submit(url, "gradingform_rubric_editrubric", ch, ["saverubric", "Save rubric and make it ready"]);
  }, [editUrl, crit]);
  const check = await ev(async (c) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/grade/grading/manage.php?contextid=${c}&component=mod_assign&area=submissions`); return {ready: /Ready for use|ready for use/i.test(g.html), crits: [...g.doc.querySelectorAll('.criterion .description')].map(e => e.textContent.trim())}; }, cctx);
  record("rúbrica: activar y definir por formulario", !r.errors?.length && check.crits.length === 2, { setErrors: set.errors, status: r.status, url: r.url, errors: r.errors, check });
};

T.gradeRubric = async () => {
  const cctx = await ctxOfCm(ctx.assignCm, "assign");
  const assignId = await ev(async (id) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/course/modedit.php?update=${id}`); return g.doc.querySelector('input[name="instance"]')?.value; }, ctx.assignCm);
  const parts = await ajax("mod_assign_list_participants", { assignid: Number(assignId), groupid: 0, filter: "", skip: 0, limit: 0, onlyids: false, includeenrolments: false, tablesort: false });
  const student = parts.data[0];
  const args = [{ name: "userid", value: String(student.id) }, { name: "attemptnumber", value: "-1" }, { name: "jsonformdata", value: '""' }];
  const frag = await ajax("core_get_fragment", { component: "mod_assign", callback: "gradingpanel", contextid: Number(cctx), args });
  const res = await ev(async ([html, assignId, uid]) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const entries = window.__mcp.formEntries(doc.querySelector('form'));
    // elegir el nivel de mayor puntuación de cada criterio
    const crits = {};
    for (const r of doc.querySelectorAll('input[type=radio][name^="advancedgrading[criteria]"]')) {
      const cid = r.name.match(/criteria\]\[(\d+)\]/)[1];
      (crits[cid] ??= []).push(r.value);
    }
    for (const [cid, levels] of Object.entries(crits)) {
      window.__mcp.setField(entries, `advancedgrading[criteria][${cid}][levelid]`, levels.at(-1));
      window.__mcp.setField(entries, `advancedgrading[criteria][${cid}][remark]`, 'Bien');
    }
    window.__mcp.setField(entries, 'sendstudentnotifications', '0');
    const r = await window.__mcp.ajax('mod_assign_submit_grading_form', {assignmentid: Number(assignId), userid: Number(uid), jsonformdata: JSON.stringify(new URLSearchParams(entries).toString())});
    return {crits, rubricFields: entries.map(([n]) => n).filter(n => n.startsWith('advancedgrading')), r};
  }, [frag.data.html, assignId, student.id]);
  const grades = await ev(async (id) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/mod/assign/view.php?id=${id}&action=grading`); return [...g.doc.querySelectorAll('td.c5, td.grade, .gradeform, [data-region="grade"]')].map(e => e.textContent.trim()).filter(Boolean).slice(0, 6); }, ctx.assignCm);
  record("calificar con rúbrica por AJAX", !res.r.error && Object.keys(res.crits).length === 2, { criteria: Object.keys(res.crits).length, result: res.r.data ?? res.r.exception?.message, rubricFields: res.rubricFields, gradingTable: grades });
};

T.giftQuiz = async () => {
  const gift = [
    "::P1 orden:: Primera pregunta: ¿cuánto es 1+1? {=2 ~3 ~4}",
    "::P2 escapes:: ¿Qué delimita un bloque en C? {=Las llaves \\{ \\} ~Los dos puntos \\: ~La sangría}",
    "::P3 código:: ¿Qué imprime este código?[html]<pre><code>for i in range(2)\\:\n    print(i)</code></pre> {=0 y 1 ~1 y 2}",
    "::P4 vf:: Python distingue mayúsculas y minúsculas. {TRUE}",
    "::P5 código bien::[html]<p>¿Qué imprime este código?</p><pre><code>for i in range(2)\\:\n&nbsp;&nbsp;&nbsp;&nbsp;print(i)</code></pre>{=0 y 1 ~1 y 2}",
  ].join("\n\n");
  // 1) banco: 4.5 por courseid; 5.x por cmid de un mod_qbank
  const banks = await ev(async (cid) => {
    const ids = (h) => [...new Set([...h.matchAll(/(?:question\/edit\.php\?cmid=|mod\/qbank\/view\.php\?id=)(\d+)/g)].map(m => m[1]))];
    let g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/question/banks.php?courseid=${cid}`);
    if (g.status !== 200) return {status: g.status, url: g.url, title: g.doc.title};
    let created = false;
    if (!ids(g.html).length) { g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/question/banks.php?courseid=${cid}&createdefault=1&sesskey=${M.cfg.sesskey}`); created = true; }
    return {status: g.status, url: g.url, created, cmids: ids(g.html)};
  }, courseId);
  const hasBanks = banks.status === 200;
  let importUrl, bankCmid;
  if (hasBanks) {
    bankCmid = banks.cmids[0];
    importUrl = `${BASE}/question/bank/importquestions/import.php?cmid=${bankCmid}`;
  } else importUrl = `${BASE}/question/bank/importquestions/import.php?courseid=${courseId}`;
  const r = await ev(async ([url, gift]) => {
    const g = await window.__mcp.getDoc(url);
    const form = [...g.doc.querySelectorAll('form')].find(f => f.querySelector('input[name="newfile"]'));
    if (!form) return {error: 'no form', url: g.url, title: g.doc.title, errors: window.__mcp.errorsOf(g.doc)};
    const qf = form.querySelector('input[name^="_qf__"]')?.name;
    const entries = window.__mcp.formEntries(form);
    const itemid = entries.find(([n]) => n === 'newfile')?.[1];
    const up = await window.__mcp.uploadDraft(g.html, itemid, 'preguntas.gift.txt', gift, 'text/plain');
    window.__mcp.setField(entries, 'format', 'gift');
    window.__mcp.setField(entries, 'submitbutton', 'Import');
    const res = await window.__mcp.postForm(new URL(form.getAttribute('action'), g.url).href, entries);
    const doc = new DOMParser().parseFromString(res.html, 'text/html');
    const imported = [...doc.querySelectorAll('ol li, .importquestions li')].map(e => e.textContent.trim().slice(0, 60));
    const cont = doc.querySelector('form[action*="edit.php"], a[href*="question/edit.php"], .continuebutton form');
    delete res.html;
    return {qf, itemid, upload: up.status, uploadErr: up.body?.error, res, imported, continueTo: cont?.getAttribute('action') ?? cont?.getAttribute('href')};
  }, [importUrl, gift]);
  ctx.bankCmid = bankCmid;
  record("importar GIFT al banco", !r.error && !r.res?.errors?.length && true, { importUrl: importUrl.replace(BASE, ""), hasBanks, banks, ...r });
};

T.quizOrder = async () => {
  if (!ctx.bankCmid) ctx.bankCmid = await ev(async (cid) => { const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/question/banks.php?courseid=${cid}`); return g.status === 200 ? g.html.match(/(?:question\/edit\.php\?cmid=|mod\/qbank\/view\.php\?id=)(\d+)/)?.[1] : undefined; }, courseId);
  if (ctx.sectionNum === undefined) ctx.sectionNum = 1;
  const url = `${BASE}/course/modedit.php?add=quiz&course=${courseId}&section=${ctx.sectionNum}&return=0`;
  const c = await ev((url) => window.__mcp.submit(url, "mod_quiz_mod_form", { name: "Cuestionario MCP", "introeditor[text]": "<p>Repaso</p>", visible: "0" }, ["submitbutton2", "x"]), url);
  const cm = await newestCm("quiz");
  if (!cm) return record("cuestionario: crear", false, c);
  // ids de preguntas del banco en orden de importación
  const bankUrl = ctx.bankCmid ? `${BASE}/question/edit.php?cmid=${ctx.bankCmid}` : `${BASE}/question/edit.php?courseid=${courseId}`;
  const qs = await ev(async (u) => { const g = await window.__mcp.getDoc(u); return [...g.doc.querySelectorAll('input[type=checkbox][name^="q"]')].map(i => ({id: i.name.slice(1), label: (i.closest('tr')?.textContent ?? '').replace(/s+/g, ' ').replace(/^Select /, '').trim().slice(0, 40)})).filter(x => /^\d+$/.test(x.id)); }, bankUrl);
  const order = ["P1", "P2", "P3", "P4", "P5"].map((p) => qs.find((q) => q.label.replace(/s+/g, " ").includes(p + " "))?.id).filter(Boolean);
  const p5 = await ev(async ([id, bank, cid]) => { const u = bank ? `${M.cfg.wwwroot}/question/bank/editquestion/question.php?id=${id}&cmid=${bank}` : `${M.cfg.wwwroot}/question/bank/editquestion/question.php?id=${id}&courseid=${cid}`; const g = await window.__mcp.getDoc(u); return g.doc.querySelector('textarea[name="questiontext[text]"]')?.value; }, [order[4], ctx.bankCmid, courseId]);
  const p3 = await ev(async ([id, bank, cid]) => { const u = bank ? `${M.cfg.wwwroot}/question/bank/editquestion/question.php?id=${id}&cmid=${bank}` : `${M.cfg.wwwroot}/question/bank/editquestion/question.php?id=${id}&courseid=${cid}`; const g = await window.__mcp.getDoc(u); return g.doc.querySelector('textarea[name="questiontext[text]"]')?.value; }, [order[2], ctx.bankCmid, courseId]);
  record("GIFT: sangría y [html]", null, { p3_html_a_mitad: p3, p5_html_al_inicio_nbsp: p5 });
  const add = await ev(async ([cmid, ids]) => {
    const out = [];
    for (const id of ids) { // una a una, en orden, al final
      const fd = new URLSearchParams({add: '1', addonpage: '0', sesskey: M.cfg.sesskey, ['q' + id]: '1', cmid: String(cmid)});
      const r = await fetch(`${M.cfg.wwwroot}/mod/quiz/edit.php?cmid=${cmid}`, {method: 'POST', body: fd});
      out.push(r.status);
    }
    const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/mod/quiz/edit.php?cmid=${cmid}`);
    return {statuses: out, slots: [...g.doc.querySelectorAll('li.slot')].map(li => (li.querySelector('.questionname, .questiontext, .activityinstance')?.textContent ?? '').trim().slice(0, 30))};
  }, [cm.id, order]);
  record("cuestionario: añadir preguntas en orden por edit.php", add.slots.length === order.length && order.length === 5, { bankQuestions: qs.length, order, ...add });
};

T.editMode = async () => {
  const r = await ev(async ([cid, ctxid]) => {
    const fd = new URLSearchParams({setmode: '1', context: ctxid, pageurl: `${M.cfg.wwwroot}/course/view.php?id=${cid}`, sesskey: M.cfg.sesskey});
    const res = await fetch(`${M.cfg.wwwroot}/editmode.php`, {method: 'POST', body: fd});
    const g = await window.__mcp.getDoc(`${M.cfg.wwwroot}/course/view.php?id=${cid}`);
    const on = g.doc.body.classList.contains('editing');
    const fd2 = new URLSearchParams({setmode: '0', context: ctxid, pageurl: `${M.cfg.wwwroot}/course/view.php?id=${cid}`, sesskey: M.cfg.sesskey});
    await fetch(`${M.cfg.wwwroot}/editmode.php`, {method: 'POST', body: fd2});
    return {status: res.status, editingOn: on};
  }, [courseId, bodyInfo.ctx]);
  record("editmode.php activar/desactivar", r.editingOn === true, r);
};

T.deleteCreated = async () => {
  const r = await ajax("core_courseformat_update_course", { action: "cm_delete", courseid: courseId, ids: [ctx.labelCm] });
  // cm_delete puede ser asíncrono (papelera / tarea ad hoc)
  const still = (await state()).cm.find((c) => c.id == ctx.labelCm);
  record("update_course cm_delete (lo creado y oculto)", !r.error, { error: r.exception?.message, stillListed: !!still, deletioninprogress: still?.deletioninprogress ?? null });
};

const order = ["version", "getState", "sectionAdd", "renameSection", "editSection", "createPage", "validationError", "newModule", "renameActivity", "visibility", "move", "uploadResource", "forum", "grading", "rubric", "gradeRubric", "giftQuiz", "quizOrder", "editMode", "deleteCreated"];
for (const name of order) {
  if (only && !only.includes(name)) continue;
  try { await inject(); await T[name](); } catch (e) { record(name, false, { exception: String(e?.message ?? e).slice(0, 400) }); }
}
writeFileSync(out, JSON.stringify({ base: BASE, courseId, at: new Date().toISOString(), results }, null, 2));
await browser.close();
