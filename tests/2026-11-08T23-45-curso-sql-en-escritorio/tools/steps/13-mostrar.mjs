/* global document -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { turn } from "../lib.mjs";
export default async ({ page, shot, log }) => {
  await page.waitForFunction(() => document.querySelector(".composer textarea") || document.querySelector(".nav"), null, { timeout: 60000 });
  const back = page.locator('button:has-text("Ir a la conversación")');
  if (await back.count()) await back.first().click(); else await page.locator(".conv").first().click();
  await page.waitForTimeout(4000);
  await page.waitForSelector(".composer textarea", { timeout: 60000 });
  await turn(page, log, shot, "h01-mostrar", "Lo he revisado y me vale. Muestra a los alumnos los temas 2, 3 y 4 con todas sus actividades, y también el Foro de dudas. Deja el filtro de tipos de archivo como está.", { maxMin: 45, keep: 2 });
};
