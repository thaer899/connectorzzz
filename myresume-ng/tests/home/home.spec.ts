import { test, expect } from '@playwright/test';
import { environment } from 'src/environments/environment';


const host = environment.host;



test('has title', async ({ page }) => {
  await page.goto(host);
  await expect(page).toHaveTitle(/Log Book - Home/);
});

test('has resume', async ({ page }) => {
  await page.goto(host);
  await page.waitForSelector('.name-text', { state: 'visible' });
  const hasNameText = await page.isVisible('.name-text');
  expect(hasNameText).toBe(true);
});

test('has quote', async ({ page }) => {
  await page.goto(host);
  await page.waitForSelector('.quote', { state: 'visible' });
  const hasNameText = await page.isVisible('.quote');
  expect(hasNameText).toBe(true);
});

test('go to employment page', async ({ page }) => {
  await page.goto(host);
  await page.click('text=Employment');
  await expect(page).toHaveURL(host + '/employment');
});

test('input birthday and get result', async ({ page }) => {
  await page.goto(host);
  await page.waitForSelector('section#ask textarea#recipientMessage', { state: 'visible' });
  await page.fill('section#ask textarea#recipientMessage', 'birthday');
  const button = await page.locator('section#ask button.skill-set[type="submit"]');
  await button.scrollIntoViewIfNeeded();
  await Promise.all([
    page.waitForResponse(response => response.url().includes('ai.thaersaidi.net') && response.status() === 200),
    button.click()
  ]);
  await page.waitForSelector('#messageResponse');
  const messages = await page.$$eval('#messageResponse',
    elements => elements.map(e => (e.textContent?.trim() || '')));
  console.log(messages);
  expect(messages.length).toBeGreaterThan(0);
  expect(messages[0]).toContain('March 5th');
});




