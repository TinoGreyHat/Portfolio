import { test, expect } from '@playwright/test';

test('Verify frontend login works', async ({ page }) => {
  await page.goto('http://localhost:5173/admin/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Page loaded, filling login form...');

  // Fill login form
  await page.fill('input[placeholder*="username" i]', 'admin');
  await page.fill('input[placeholder*="password" i]', 'admin123');

  // Set up response listener
  const responsePromise = page.waitForResponse('http://localhost:8080/api/auth/login');

  await page.click('button[type="submit"]');

  const response = await responsePromise;
  const status = response.status();
  const body = await response.json();

  console.log('Login response status:', status);
  console.log('Login response body:', JSON.stringify(body, null, 2));

  // Wait for redirect to dashboard
  await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });

  console.log('✅ Frontend login successful!');

  // Check token is stored
  const token = await page.evaluate(() => localStorage.getItem('admin_token'));
  console.log('Token stored:', token ? 'YES' : 'NO');
  if (token) {
    console.log('Token preview:', token.substring(0, 50) + '...');
  }
});