// Classifies real browser_evaluate calls (taken from sandbox transcripts) with
// classifyEvaluate() and checks the chat labels them by what they do, never with their code.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-tool-labels.mjs
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { classifyEvaluate, friendlyToolLabel } = await import(pathToFileURL(path.join(root, "dist/toolLabels.js")).href);

// [code, expected kind]: the start of real calls, long enough to hold what decides.
const CASES = [
  ["() => { const ed = tinymce.get('id_assignfeedbackcomments_editor'); const html = `<p><strong>Nota: 10/10</strong></p>`; ed.setContent(html); }", "editor"],
  ["() => { const ed=tinymce.get('id_message'); if(!ed) return 'not ready'; ed.setContent(`<p>Gracias por echar una mano, Diego</p>`); }", "editor"],
  ["() => { const ed = tinymce.get('id_assignfeedbackcomments_editor'); ed.setContent(ed.getContent().replace(' No se pedía', ' No se pedía, así que')); }", "editor"],
  ["() => { const f=document.querySelector('form.mform'); const set=(n,v)=>{const e=f.querySelector(`[name=\"${n}\"]`); e.value=v; e.dispatchEvent(new Event('change',{bubbles:true}));}; set('name','Repaso: bucles while y for') }", "form"],
  ["() => { const m=document.querySelector('.modal.show'); const cbs=[...m.querySelectorAll('input[type=checkbox][name^=\"q\"]')]; cbs.forEach(c=>{ if(!c.checked) c.click(); }); }", "act"],
  ["async () => { const out={}; for (const d of [7,6,5,4]) { const r=await fetch(`/mod/forum/discuss.php?d=${d}&mode=1`); out[d]=await r.text(); } return out; }", "otherPages"],
  ["async () => { const r = await fetch('/course/index.php'); const t = await r.text(); return t.length; }", "otherPages"],
  ["() => { const c=document.querySelector('.modal-dialog, [role=dialog]'); return c ? c.innerText.slice(0,4000) : document.body.innerText.slice(0,1500); }", "dialog"],
  ["() => { const m=document.querySelector('.modal.show'); return m ? m.innerText.slice(0,1500) : 'no modal'; }", "dialog"],
  ["() => [...document.querySelectorAll('table.generaltable tbody tr')].map(r => ({text: r.innerText, links: [...r.querySelectorAll('a')].map(a=>a.href)}))", "table"],
  ["() => [...document.querySelectorAll('table tr')].map(r=>r.innerText.replace(/\\s+/g,' ')).filter(t=>/Participants|Submitted/.test(t))", "table"],
  ["() => [...document.querySelectorAll('li.slot')].map(s=>s.innerText.replace(/\\s+/g,' ').slice(0,120)).join('\\n')", "table"],
  ["() => [...document.querySelectorAll('form input:not([type=hidden]), form textarea, form select, [contenteditable=true]')].map(e=>e.name+':'+e.type)", "formFields"],
  ["() => document.getElementById('id_assignfeedback_comments_enabled').checked", "formFields"],
  ["() => ({ta: document.getElementById('id_assignfeedbackcomments_editor')?.value, mce: window.tinymce?.get('id_assignfeedbackcomments_editor')?.getContent()})", "formFields"],
  ["() => { const s=document.querySelector('select[name=\"aggregation\"]'); return s ? [...s.options].map(o=>o.textContent.trim()).join('\\n') : 'no select'; }", "formFields"],
  ["() => location.href", "location"],
  ["() => location.href + '\\n' + document.title + '\\n' + document.querySelector('#region-main')?.innerText.slice(0,800)", "location"],
  ["() => [...document.querySelectorAll('a')].filter(a => /reply=/.test(a.href)).map(a => a.href)", "links"],
  ["() => [...document.querySelectorAll('article')].map(a=>a.innerText.replace(/\\s+/g,' ').slice(0,160))", "content"],
  ["() => document.body.innerText.slice(0,5000)", "content"],
  ["() => document.querySelector('#p13')?.innerText.replace(/\\s+/g,' ').slice(0,400)", "content"],
  ["() => 1 + 1", "generic"],
];

let failures = 0;
for (const [code, expected] of CASES) {
  const kind = classifyEvaluate(code);
  const label = friendlyToolLabel("mcp__playwright__browser_evaluate", { function: code });
  const problems = [];
  if (kind !== expected) problems.push(`classified as ${kind}, expected ${expected}`);
  if (/=>|document\.|querySelector/.test(label)) problems.push(`label shows code: ${label}`);
  if (problems.length > 0) {
    failures++;
    console.log(`FAIL ${code.slice(0, 70)}…: ${problems.join("; ")}`);
  }
}
if (failures > 0) {
  console.log(`\n${failures} of ${CASES.length} browser_evaluate calls labelled wrong`);
  process.exit(1);
}
console.log(`ok   ${CASES.length} browser_evaluate calls labelled by what they do, no code shown`);
