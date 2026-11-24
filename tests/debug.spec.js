import { test } from '@playwright/test';

test('Debug login page', async ({ page }) => {
  await page.goto('http://localhost:5173/admin/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Get page content
  const html = await page.content();
  console.log('=== FULL PAGE HTML ===');
  console.log(html);

  // Check for specific elements
  console.log('=== Looking for login elements ===');
  const usernameInput = await page.locator('input[placeholder*="username" i]').count();
  console.log(`Username inputs: ${usernameInput}`);

  const passwordInput = await page.locator('input[placeholder*="password" i]').count();
  console.log(`Password inputs: ${passwordInput}`);

  const submitBtn = await page.locator('button[type="submit"]').count();
  console.log(`Submit buttons: ${submitBtn}`);

  const allInputs = await page.locator('input').count();
  console.log(`Total inputs: ${allInputs}`);

  const allButtons = await page.locator('button').count();
  console.log(`Total buttons: ${allButtons}`);

  const rootHtml = await page.locator('#root').innerHTML();
  console.log('=== ROOT HTML ===');
  console.log(rootHtml.substring(0, 5000));

  // Take screenshot
  await page.screenshot({ path: 'debug-login.png', fullPage: true });
  console.log('Screenshot saved');
});