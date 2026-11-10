/* global document -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { turn } from "../lib.mjs";
// A session that stays on "Arrancando miyagi" must fail in minutes, not after the turn's limit.
const ready = (page) => page.waitForFunction(() => !document.body.innerText.includes("Arrancando miyagi") && !document.querySelector(".composer .send.stop"), null, { timeout: 300000, polling: 2000 });
const views = async (page, shot, tag) => {
  for (const [name, file] of [["Temas y actividades", "temas"], ["Materiales", "materiales"], ["En el horno", "horno"]]) {
    await page.click(`.nav a:has-text("${name}")`);
    await page.waitForTimeout(3000);
    await shot(`${tag}-${file}`);
  }
};
export default async ({ page, shot, log }) => {
  await page.waitForSelector(".side .brand", { timeout: 90000 });
  await page.waitForSelector("button.new-conv:not([disabled])", { timeout: 300000 });
  await page.click('button:has-text("Nueva conversación"), a:has-text("Nueva conversación")');
  await page.waitForTimeout(8000);
  await ready(page);
  await turn(page, log, shot, "g01-tema-4", "/miyagi:build-unit Tema 4: Consultar con SELECT, siguiendo la programación (filtros, orden, agregados con GROUP BY y HAVING, INNER y LEFT JOIN), con el cuestionario y la Práctica final «Consultas sobre la tienda»: una tarea con un único archivo consultas.sql y la rúbrica que te dejé en sources, con un script de datos de la tienda para que todos consulten lo mismo. Pruébalo todo en Docker. Y crea en la sección General un «Foro de dudas» para todo el curso. Ajusta los pesos del libro de calificaciones: 20 % los cuatro cuestionarios, 15 % cada ejercicio (Tema 2 y Tema 3) y 50 % la práctica final; el entregable del Tema 1 no cuenta. Todo oculto hasta que lo revises y me pidas permiso para mostrarlo.", { maxMin: 120, keep: 3 });
  await views(page, shot, "g02");
  await page.click('a:has-text("Hoy")');
  await page.waitForTimeout(3000);
  await shot("g03-hoy");
};
