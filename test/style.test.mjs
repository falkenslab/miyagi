// Unit tests of the styles for exported materials (#21), on the built code in dist/: a template
// made accessible when it's read (headings, emojis, fonts, backgrounds, contrast), filled, and
// a styled GIFT that still validates and keeps its code's indentation.
import assert from "node:assert/strict";
import { test } from "node:test";

const load = (module) => import(new URL(`../dist/materials/${module}.js`, import.meta.url).href);
const { accessibleTemplate, fill, contrast } = await load("style");
const { parseQuestions } = await load("questions");
const { exportGift } = await load("gift");
const { accessibleHtml } = await load("notes");
const { validateGift } = await import(new URL("../dist/validators/gift.js", import.meta.url).href);

test("a broken template is fixed when read: bold titles, emojis, font, background, contrast", () => {
  const broken = [
    '<div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 8px">',
    '  <p style="font-weight: bold; color: #4174c0">🧠 {{title}}</p>',
    '  <p><strong>📋 Enunciado</strong></p>',
    "  <div>{{body}}</div>",
    '  <p style="color: #cccccc">Pie</p>',
    "</div>",
  ].join("\n");
  const { template, warnings } = accessibleTemplate(broken, 2);
  assert.match(template.html, /<h2 style="font-weight: bold; color: #4174c0"><span aria-hidden="true">🧠<\/span> \{\{title\}\}<\/h2>/);
  assert.match(template.html, /<h3><span aria-hidden="true">📋<\/span> Enunciado<\/h3>/);
  assert.match(template.html, /<div style="padding: 8px">/);
  assert.match(template.html, /<p>Pie<\/p>/);
  assert.equal(template.bodyTop, 4);
  const all = warnings.join("\n");
  for (const what of [/bold paragraph/, /emoji/, /font-family/, /background/, /contrast/]) assert.match(all, what);
});

test("an accessible template stays as it is; headings start where the kind says", () => {
  const good = '<section><h3 style="color: #ffffff; background-color: #0c7c59">{{label:feedback}}</h3><div>{{body}}</div></section>';
  const asFeedback = accessibleTemplate(good, 4);
  assert.deepEqual(asFeedback.warnings, ["headings renumbered to start at h4, in order"]);
  assert.match(asFeedback.template.html, /<h4 style="color: #ffffff; background-color: #0c7c59">/);
  assert.equal(asFeedback.template.bodyTop, 5);
  const asPage = accessibleTemplate(good, 3);
  assert.deepEqual(asPage.warnings, []);
  assert.equal(fill(asPage.template, { "label:feedback": "Retroalimentación", body: "<p>Bien</p>" }), '<section><h3 style="color: #ffffff; background-color: #0c7c59">Retroalimentación</h3><div><p>Bien</p></div></section>');
  assert.ok(contrast([255, 255, 255], [12, 124, 89]) >= 4.5);
});

test("a styled page: the body's headings go below the template's, code in its own template", () => {
  const page = accessibleTemplate('<article><h2>{{title}}</h2>{{body}}</article>', 2).template;
  const code = accessibleTemplate('<div><span>{{label:copy}}</span><pre style="background-color: #f6f8fa"><code>{{code}}</code></pre></div>', 2).template;
  const body = accessibleHtml("## Uno\n\n```python\nif x:\n    y()\n```\n", page.bodyTop, (escaped, language) => fill(code, { code: escaped, language, "label:copy": "Copia" }));
  const html = fill(page, { title: "Apuntes", body });
  assert.match(html, /<article><h2>Apuntes<\/h2><h3>Uno<\/h3>/);
  assert.match(html, /<pre style="background-color: #f6f8fa"><code>if x:\n {4}y\(\)<\/code><\/pre>/);
});

test("a styled GIFT question validates and keeps its code's indentation", () => {
  const { material } = parseQuestions("---\ntitle: Bucles\ncategory: Bucles\n---\n## T1\n¿Qué muestra?\n\n```python\nfor i in range(2):\n    print(i)\n```\n\n- [x] 0 y 1\n- [ ] 1 y 2\n  > range empieza en 0\n\n> Recorre 0 y 1.\n");
  const question = accessibleTemplate('<div style="border: 1px solid #DCDFE5; padding: 12px">{{body}}</div>', 4).template;
  const feedback = accessibleTemplate('<div><p style="font-weight: bold">✅ {{label:feedback}}</p>{{body}}</div>', 4).template;
  const { gift, errors } = exportGift(material, undefined, {
    question: (html) => fill(question, { body: html }),
    feedback: (html) => fill(feedback, { body: html, "label:feedback": "Retroalimentación" }),
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(validateGift(gift).errors, []);
  assert.match(gift, /::T1::\[html\]<div style\\="border\\: 1px solid \\#DCDFE5; padding\\: 12px">/);
  assert.match(gift, /&nbsp;&nbsp;&nbsp;&nbsp;print\(i\)/);
  assert.match(gift, /####<div><h4 style\\="font-weight\\: bold"><span aria-hidden\\="true">✅<\/span> Retroalimentación<\/h4><p>Recorre 0 y 1.<\/p>/);
});
