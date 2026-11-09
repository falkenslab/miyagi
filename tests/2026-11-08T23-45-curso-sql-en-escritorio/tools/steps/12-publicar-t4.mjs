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
  await turn(page, log, shot, "g07-publicar", "La extensión de Moodle ya vuelve a estar activa y el navegador tiene la sesión abierta. Sigue en el orden que dijiste: publica el Tema 4, todo oculto; completa los cuestionarios de los temas 1 y 2 con todas sus preguntas; y deja los pesos del libro de calificaciones como te pedí. Si una herramienta falla porque se ha cerrado el navegador, reinténtalo. Para también el laboratorio del Tema 4.", { maxMin: 170, keep: 3 });
  await views(page, shot, "g08");
  await page.click('a:has-text("Hoy")');
  await page.waitForTimeout(3000);
  await shot("g09-hoy");
};
