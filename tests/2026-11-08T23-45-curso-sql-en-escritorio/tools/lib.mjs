// Shared helpers: a turn of the chat that answers approvals and questions and logs each one.
// Approving unattended is acceptable only against moodle-sandbox.
import { appendFileSync, cpSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
// miyagi can't write in docker-lab's labs/ and asks the teacher to copy the folder: done here.
const DATA = "<data>/.miyagi";
function copyLabs(log) {
  const drafts = path.join(DATA, "workspaces/introduccion-a-sql/drafts");
  for (const d of readdirSync(drafts)) {
    if (!d.startsWith("lab-")) continue;
    for (const lab of readdirSync(path.join(drafts, d))) {
      if (existsSync(path.join(drafts, d, lab, "compose.yaml"))) { cpSync(path.join(drafts, d, lab), path.join(DATA, "extensions/.data/docker-lab/labs", lab), { recursive: true }); log("copied lab", lab); }
    }
  }
}
const LOG = "<run>/approvals.jsonl";

export async function send(page, line) {
  await page.fill(".composer textarea", line);
  await page.keyboard.press("Enter");
  await page.waitForSelector(".composer .send.stop, .dock .checkpoint", { timeout: 120000 });
}

// Waits for the turn to end. Screenshots the first `keep` approvals and the first question.
export async function finish(page, log, shot, tag, { maxMin = 90, keep = 2, answer, files: opts_files } = {}) {
  const t0 = Date.now();
  let asks = 0, shots = 0;
  for (;;) {
    const state = await page.waitForFunction(() => {
      if (document.querySelector(".dock .checkpoint, .dock .options, .dock form")) return "ask";
      if (!document.querySelector(".composer textarea")) return "away";
      return document.querySelector(".composer .send.stop") ? false : "idle";
    }, null, { timeout: maxMin * 60000, polling: 2000 }).then((h) => h.jsonValue());
    if (state === "away") {
      const back = page.locator('button:has-text("Ir a la conversación")');
      if (await back.count()) await back.first().click(); else await page.locator(".conv").first().click().catch(() => {});
      await page.waitForTimeout(3000);
      continue;
    }
    if (state === "idle") {
      await page.waitForTimeout(3000);
      if (await page.locator(".composer .send.stop, .dock .checkpoint, .dock .options").count()) continue;
      break;
    }
    asks++;
    const text = (await page.locator(".dock").innerText()).slice(0, 2500);
    appendFileSync(LOG, JSON.stringify({ ts: new Date().toISOString(), tag, n: asks, text }) + "\n");
    log(`ASK ${asks}:`, text.replace(/\s+/g, " ").slice(0, 260));
    if (shots < keep) { shots++; await shot(`${tag}-pide-${shots}`); }
    if (/carpeta labs|labs/.test(text)) copyLabs(log);
    const approve = page.locator('.dock button:has-text("Aprobar")');
    if (await approve.count()) { await approve.first().click(); await page.waitForTimeout(2500); continue; }
    const opts = page.locator(".dock label.option");
    const texts = await opts.allInnerTexts();
    if (texts.length) {
      let i = Math.max(0, texts.findIndex((x) => /propuest|recomendad|(^|\s)sí([\s,.]|$)|continu/i.test(x)));
      if (answer) i = Math.max(0, texts.findIndex((x) => answer.test(x)));
      log("PICK", texts[i].slice(0, 120));
      const multiple = (await page.locator(".dock input[type=checkbox]").count()) > 0;
      await opts.nth(i).click();
      if (multiple || await page.locator('.dock button:has-text("Responder")').count()) await page.click('.dock button:has-text("Responder")').catch(() => {});
      await page.waitForTimeout(3000);
      continue;
    }
    const send = page.locator('.dock form button:has-text("Enviar"), .dock button:has-text("Enviar")');
    if (await send.count()) {
      const boxes = page.locator(".dock input[type=checkbox]");
      for (let i = 0; i < await boxes.count(); i++) await boxes.nth(i).check();
      log("FORM sent");
      await send.first().click();
      await page.waitForTimeout(3000);
      continue;
    }
    const field = page.locator(".dock textarea");
    if (opts_files && await field.count()) {
      const alias = Object.keys(opts_files).find((a) => text.includes(a));
      if (alias) { log("FILE", alias); await field.first().fill(opts_files[alias]); await page.click('.dock button:has-text("Responder")'); await page.waitForTimeout(3000); continue; }
    }
    log("UNKNOWN DOCK, stopping"); await shot(`${tag}-desconocido`); return { asks, stuck: true };
  }
  return { asks, min: ((Date.now() - t0) / 60000).toFixed(1) };
}

export async function turn(page, log, shot, tag, line, opts) {
  await send(page, line);
  await page.waitForTimeout(25000);
  if (!(await page.locator(".dock .checkpoint, .dock .options, .dock form").count())) await shot(`${tag}-trabajando`);
  const r = await finish(page, log, shot, tag, opts);
  log(tag, JSON.stringify(r));
  await shot(`${tag}-fin`);
  log((await page.locator(".msg.agent").last().innerText()).slice(-1800));
  return r;
}
