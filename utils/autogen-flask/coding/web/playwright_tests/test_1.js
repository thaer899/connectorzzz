
const playwright = require('/usr/local/bin/playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://thaersaidi.net/education');
  // Add more tests here
  await browser.close();
})();
