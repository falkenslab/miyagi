/* global document -- the callbacks of page.evaluate and waitForFunction run in the page. */
export default async ({ page, shot, log }) => {
  const t = Date.now();
  await page.locator('[role="dialog"] button.primary').last().click();
  await page.waitForFunction(() => /✅|Error|No se|falló/.test(document.querySelector('[role="dialog"]')?.textContent ?? "") || !document.querySelector('[role="dialog"]'), null, { timeout: 300000 });
  log("s", ((Date.now() - t) / 1000).toFixed(0));
  await shot("a08-vincular-hecho");
  log(await page.locator('[role="dialog"]').innerText().catch(() => "no dialog"));
};
