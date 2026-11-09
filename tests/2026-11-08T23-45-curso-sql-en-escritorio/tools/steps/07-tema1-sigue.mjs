import { finish } from "../lib.mjs";
export default async ({ page, shot, log }) => {
  log(JSON.stringify(await finish(page, log, shot, "d01-tema1", { maxMin: 170, keep: 5 })));
  await shot("d03-tema1-fin");
  log((await page.locator(".msg.agent").last().innerText()).slice(-2200));
  for (const [name, file] of [["Temas y actividades", "temas"], ["Materiales", "materiales"], ["En el horno", "horno"]]) {
    await page.click(`.nav a:has-text("${name}")`);
    await page.waitForTimeout(3000);
    await shot(`d04-${file}`);
  }
};
