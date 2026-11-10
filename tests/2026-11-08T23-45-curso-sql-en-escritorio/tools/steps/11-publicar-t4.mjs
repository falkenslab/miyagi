/* global document -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { turn } from "../lib.mjs";
const views = async (page, shot, tag) => {
  for (const [name, file] of [["Temas y actividades", "temas"], ["Materiales", "materiales"], ["En el horno", "horno"]]) {
    await page.click(`.nav a:has-text("${name}")`);
    await page.waitForTimeout(3000);
    await shot(`${tag}-${file}`);
  }
};
export default async ({ page, shot, log }) => {
  await page.waitForSelector(".side .brand", { timeout: 90000 });
  await page.locator(".conv").first().click();
  await page.waitForTimeout(6000);
  await page.waitForSelector(".composer textarea", { timeout: 60000 });
  await page.waitForFunction(() => !document.body.innerText.includes("Arrancando miyagi") && !document.querySelector(".composer .send.stop"), null, { timeout: 300000, polling: 2000 });
  await turn(page, log, shot, "g04-publicar", "Moodle ya responde y el navegador tiene la sesión abierta. Adelante: publica el Tema 4 como acordamos, todo oculto. Sin franjas en el centro por ahora, el foro sigue oculto hasta que yo lo diga y los errores frecuentes no los publiques. Cuando acabes, completa los cuestionarios de los temas 1 y 2 con todas sus preguntas, que se quedaron a medias por un fallo del navegador, deja los pesos del libro de calificaciones como te pedí y para los laboratorios de los temas 1, 2 y 3.", { maxMin: 150, keep: 3 });
  await views(page, shot, "g05");
  await page.click('a:has-text("Hoy")');
  await page.waitForTimeout(3000);
  await shot("g06-hoy");
};
