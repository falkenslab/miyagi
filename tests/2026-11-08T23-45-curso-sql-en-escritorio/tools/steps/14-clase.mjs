import { turn } from "../lib.mjs";
const ready = (page) => page.waitForFunction(() => !document.body.innerText.includes("Arrancando miyagi") && !document.querySelector(".composer .send.stop"), null, { timeout: 300000, polling: 2000 });
const fresh = async (page) => {
  await page.waitForSelector("button.new-conv:not([disabled])", { timeout: 600000 });
  await page.click('button:has-text("Nueva conversación"), a:has-text("Nueva conversación")');
  await page.waitForTimeout(8000);
  await ready(page);
};
export default async ({ page, shot, log }) => {
  await page.waitForSelector(".side .brand", { timeout: 90000 });
  await fresh(page);
  await turn(page, log, shot, "i01-corregir", "/miyagi:grade Corrige la Práctica final «Consultas sobre la tienda» con la rúbrica que te dejé en sources. Ejecuta las entregas en Docker contra los datos de la tienda para comprobar los resultados. El plazo lo he adelantado para esta prueba y ya ha vencido.", { maxMin: 60, keep: 3 });
  await turn(page, log, shot, "i02-foro", "Ahora mira el Foro de dudas.", { maxMin: 20, keep: 2 });
  await fresh(page);
  await turn(page, log, shot, "i03-progreso", "/miyagi:progress", { maxMin: 20, keep: 1 });
  await fresh(page);
  await turn(page, log, shot, "i04-auditoria", "/miyagi:audit", { maxMin: 40, keep: 1 });
  await turn(page, log, shot, "i05-guia", "Haz una página «Guía del curso» en General con los pesos, el calendario, la política de entregas tardías para todas las tareas y qué hacer si Docker no funciona, y muéstrala. Devuelve la práctica final a sus fechas de la programación, sin tocar las notas. Lo demás lo vemos otro día.", { maxMin: 30, keep: 2 });
  await fresh(page);
  await turn(page, log, shot, "i06-skill", "Para la clase del martes, escribe en drafts tres ejemplos de JOIN sobre la tienda, de menos a más, con su explicación, para proyectar en clase. No publiques nada.", { maxMin: 25, keep: 1 });
  await page.click('.nav a:has-text("Materiales")');
  await page.waitForTimeout(3000);
  await shot("i07-materiales");
  await page.click('a:has-text("Hoy")');
  await page.waitForTimeout(3000);
  await shot("i08-hoy");
};
