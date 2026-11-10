/* global document -- the callbacks of page.evaluate and waitForFunction run in the page. */
import { turn, finish } from "../lib.mjs";
const fresh = async (page) => {
  await page.waitForSelector('button.new-conv:not([disabled])', { timeout: 600000 });
  await page.click('button:has-text("Nueva conversación"), a:has-text("Nueva conversación")');
  await page.waitForTimeout(4000);
  await page.waitForFunction(() => !document.querySelector(".composer .send.stop"), null, { timeout: 300000 });
};
const views = async (page, shot, tag) => {
  for (const [name, file] of [["Temas y actividades", "temas"], ["Materiales", "materiales"], ["En el horno", "horno"]]) {
    await page.click(`.nav a:has-text("${name}")`);
    await page.waitForTimeout(3000);
    await shot(`${tag}-${file}`);
  }
};
export default async ({ page, shot, log }) => {
  await page.waitForSelector(".side .brand", { timeout: 90000 });
  await page.waitForFunction(() => !document.querySelector(".composer .send.stop"), null, { timeout: 300000 }).catch(() => {});
  log(JSON.stringify(await finish(page, log, shot, "e01-tema1-publicar", { maxMin: 170, keep: 4 })));
  await shot("e01-tema1-publicar-fin");
  log((await page.locator(".msg.agent").last().innerText()).slice(-1500));
  await views(page, shot, "e02");
  await fresh(page);
  await turn(page, log, shot, "f01-temas-2-3", "/miyagi:build-unit Temas 2 y 3, uno detrás de otro, siguiendo la programación: Tema 2 (DDL: CREATE TABLE con claves y restricciones, ALTER, DROP sobre la base de datos tienda) y Tema 3 (DML: INSERT, UPDATE, DELETE y los errores típicos). Cada uno con sus apuntes, ejercicio entregable con rúbrica, cuestionario y las prácticas probadas en Docker. El contenedor se llama siempre mariadb-tienda. Las fechas de la programación me valen. Publícalo oculto y pídeme permiso para mostrarlo.", { maxMin: 200, keep: 3 });
  await views(page, shot, "f02");
  await fresh(page);
  await turn(page, log, shot, "g01-tema-4", "/miyagi:build-unit Tema 4: Consultar con SELECT, siguiendo la programación (filtros, orden, agregados con GROUP BY y HAVING, INNER y LEFT JOIN), con el cuestionario y la Práctica final «Consultas sobre la tienda»: una tarea con un único archivo consultas.sql y la rúbrica que te dejé en sources, con un script de datos de la tienda para que todos consulten lo mismo. Pruébalo todo en Docker. Y crea en la sección General un «Foro de dudas» para todo el curso. Ajusta los pesos del libro de calificaciones: 20 % los cuatro cuestionarios, 15 % cada ejercicio (Tema 2 y Tema 3) y 50 % la práctica final; el entregable del Tema 1 no cuenta. Todo oculto hasta que lo revises y me pidas permiso para mostrarlo.", { maxMin: 200, keep: 3 });
  await views(page, shot, "g02");
  await page.click('a:has-text("Hoy")');
  await page.waitForTimeout(3000);
  await shot("g03-hoy");
};
