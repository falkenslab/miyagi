/* global document -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { turn } from "../lib.mjs";
export default async ({ page, shot, log }) => {
  await page.click('.nav a:has-text("Extensiones")');
  await page.waitForTimeout(2500);
  await shot("b01-extensiones-instaladas");
  const tabs = await page.locator('.tabs [role="tab"]').allInnerTexts();
  log("tabs", tabs);
  await page.locator('.tabs [role="tab"]', { hasText: 'Catálogo' }).click();
  await page.waitForTimeout(5000);
  await shot("b02-extensiones-catalogo");
  const btns = page.locator('main button.btn.small.primary');
  const n = await btns.count();
  let done = false;
  for (let i = 0; i < n && !done; i++) {
    const row = await btns.nth(i).evaluate((e) => (e.closest('li,article,tr') ?? e.parentElement.parentElement).innerText);
    log(i, row.replace(/\s+/g, ' ').slice(0, 120));
    if (/docker/i.test(row)) { await btns.nth(i).click(); done = true; }
  }
  if (!done) throw new Error('no docker-lab in the catalog');
  await page.waitForTimeout(1500);
  await shot("b03-extension-instalar");
  log((await page.locator('[role="dialog"]').innerText().catch(() => "")).slice(0, 600));
  await page.locator('[role="dialog"] button.btn.primary, [role="dialog"] button.btn.danger').last().click();
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), null, { timeout: 180000 });
  await page.waitForTimeout(6000);
  await page.waitForFunction(() => !document.querySelector(".composer .send.stop"), null, { timeout: 300000 }).catch(() => {});
  await shot("b04-extension-instalada");
  await page.click('.nav a:has-text("Hoy")');
  await page.waitForTimeout(2500);
  await shot("b05-hoy-con-memoria");
  await page.click('button:has-text("Nueva conversación"), a:has-text("Nueva conversación")');
  await page.waitForTimeout(4000);
  await page.waitForFunction(() => !document.querySelector(".composer .send.stop"), null, { timeout: 300000 });
  await turn(page, log, shot, "c01-programacion", "/miyagi:teaching-plan Revisa la programación que sacaste de mi temario y complétala con lo que falte: criterios de evaluación, calendario de las 6 semanas (empezamos el lunes 5 de octubre) y atención a la diversidad. La penalización por retraso la aplico yo a mano al calificar. Las sesiones son los martes y jueves, de 1,5 horas cada una. En «Resultados correctos» un 2 o un 4 son estados intermedios, a tu criterio. Las entregas tardías se admiten hasta una semana después. Los cuestionarios pesan igual entre sí, y los ejercicios también. Para O1, añade al Tema 1 un entregable ligero, apto o no apto, sin entrar en el 100 %: una captura de su contenedor funcionando con la base de datos tienda creada.", { maxMin: 40 });
  await page.click('.nav a:has-text("Programación")');
  await page.waitForTimeout(3000);
  await shot("c02-programacion-vista");
  await page.click('.nav a:has-text("Temas y actividades")');
  await page.waitForTimeout(3000);
  await shot("c03-temas-vista");
};
