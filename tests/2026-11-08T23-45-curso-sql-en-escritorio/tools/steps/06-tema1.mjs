import { turn } from "../lib.mjs";
const views = async (page, shot, tag) => {
  for (const [name, file] of [["Temas y actividades", "temas"], ["Materiales", "materiales"], ["En el horno", "horno"]]) {
    await page.click(`.nav a:has-text("${name}")`);
    await page.waitForTimeout(3000);
    await shot(`${tag}-${file}`);
  }
};
export default async ({ page, shot, log }) => {
  await page.click('a.conv, .conv').catch(() => {});
  await page.waitForTimeout(3000);
  await turn(page, log, shot, "c04-decisiones", "Es para otra edición: empezamos el lunes 1 de febrero de 2027, recalcula el calendario con esa fecha y da por buenos los festivos nacionales. Un ejercicio por tema, 15 % cada uno, en los temas 2 y 3. El retraso no vale para cuestionarios. Los criterios me valen como están. Un no apto se corrige y se vuelve a comprobar, sin efecto en la nota. Sin nota mínima por ahora. Lo demás, como propones.", { maxMin: 30 });
  await page.click('button:has-text("Nueva conversación"), a:has-text("Nueva conversación")');
  await page.waitForTimeout(4000);
  await page.waitForFunction(() => !document.querySelector(".composer .send.stop"), null, { timeout: 300000 });
  await turn(page, log, shot, "d01-tema1", "/miyagi:build-unit Tema 1: MariaDB en Docker, siguiendo la programación. Con unos apuntes que expliquen paso a paso cómo levantar el contenedor, conectarse con el cliente, crear la base de datos tienda y un usuario con permisos solo sobre ella; la práctica guiada, con los comandos en bloques de código, probada en Docker antes de publicarla; el entregable apto/no apto y el cuestionario del tema. Las fechas que propongas me valen. El contenedor se llama siempre mariadb-tienda.", { maxMin: 150, keep: 4 });
  await views(page, shot, "d02");
};
