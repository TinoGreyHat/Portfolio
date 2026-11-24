import { test } from '@playwright/test';

test('Debug login page with console', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  await page.goto('http://localhost:5173/admin/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  console.log('=== CONSOLE ERRORS ===');
  errors.forEach(e => console.log(e));

  // Check if React is loaded
  const reactLoaded = await page.evaluate(() => {
    return typeof window.React !== 'undefined' || document.querySelector('#root').children.length > 0;
  });
  console.log('React loaded:', reactLoaded);

  // Get full page content after waiting
  const html = await page.content();
  console.log('=== FULL PAGE HTML (last 2000 chars) ===');
  console.log(html.slice(-2000));
});