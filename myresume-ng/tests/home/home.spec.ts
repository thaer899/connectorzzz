import { test, expect } from '@playwright/test';


test('has title', async ({ page }) => {
  console.log('Before navigating to the page');

  await page.goto('http://localhost:4200');
  console.log('After navigating to the page');

  // await page.waitForSelector('app-home');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Thaer Saidi/);
});

test('go to employment page', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.click('text=Employment');
  // await page.getByRole('link', { name: 'Employment' }).click();

  await expect(page).toHaveURL('http://localhost:4200/#/resume/employment');
}
);
