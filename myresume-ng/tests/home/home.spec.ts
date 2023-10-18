import { test, expect } from '@playwright/test';
import { environment } from 'src/environments/environment';


const host = environment.host;



// test('has title', async ({ page }) => {
//   await page.goto(host);
//   await expect(page).toHaveTitle(/Log Book - Home/);
// });

// test('has resume', async ({ page }) => {
//   await page.goto(host);
//   await page.waitForSelector('.name-text', { state: 'visible' });
//   const hasNameText = await page.isVisible('.name-text');
//   expect(hasNameText).toBe(true);
// });

// test('has quote', async ({ page }) => {
//   await page.goto(host);
//   await page.waitForSelector('.quote', { state: 'visible' });
//   const hasNameText = await page.isVisible('.quote');
//   expect(hasNameText).toBe(true);
// });

// test('go to employment page', async ({ page }) => {
//   await page.goto(host);
//   await page.click('text=Employment');
//   await expect(page).toHaveURL(host + '/employment');
// });



test('input birthday and get result', async ({ page }) => {
  await page.goto(host);

  // Wait for the textarea to be visible
  await page.waitForSelector('section#ask textarea#recipientMessage', { state: 'visible' });

  // Type "birthday" into the textarea
  await page.fill('section#ask textarea#recipientMessage', 'birthday');

  // Refine the selector to be more specific to the "ask" section
  const button = await page.locator('section#ask button.skill-set[type="submit"]');

  // Scroll the button into view (if needed) and click
  await button.scrollIntoViewIfNeeded();
  await button.click();

  // Wait for the message response to appear
  await page.waitForSelector('#messageResponse');

  // Get the content of the response
  const messages = await page.$$eval('#messageResponse .card-text', elements => elements.map(e => e.textContent.trim()));

  // Print the content of the responses
  console.log(messages);
});




