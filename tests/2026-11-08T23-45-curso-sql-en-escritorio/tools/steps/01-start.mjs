/* global innerWidth, innerHeight -- the callbacks of page.evaluate and waitForFunction run in the page. */
export default async ({ page, shot, log }) => {
  await page.waitForTimeout(6000);
  await shot("a01-arranque");
  log(page.url().replace(/token=[^&]+/, "token=***"));
  log((await page.locator("body").innerText()).slice(0, 900));
  log(await page.evaluate(() => [innerWidth, innerHeight]));
};
