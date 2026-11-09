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
  await page.waitForFunction(() => !document.body.innerText.includes("Arrancando miyagi"), null, { timeout: 300000, polling: 2000 });
  await page.waitForFunction(() => !document.querySelector(".composer .send.stop"), null, { timeout: 120000 });
  await turn(page, log, shot, "g01-tema-4", "Se ha cortado la conexión mientras el revisor terminaba. Sigue con la construcción del Tema 4 donde lo dejaste, con el mismo encargo: apuntes, cuestionario, Práctica final, Foro de dudas y pesos del libro de calificaciones, todo oculto.", { maxMin: 150, keep: 3 });
  await views(page, shot, "g02");
  await page.click('a:has-text("Hoy")');
  await page.waitForTimeout(3000);
  await shot("g03-hoy");
};
