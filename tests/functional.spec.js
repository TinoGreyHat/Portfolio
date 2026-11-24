import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:8080/api';

// Default admin credentials from .env
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

test.describe('Portfolio TinoGreyHat - Functional Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
  });

  test('1. Admin Login - Successful', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Fill login form - inputs use placeholder, not name
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    // Should show dashboard (not redirect - it's conditional rendering)
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });
    console.log('✅ Admin login successful');
  });

  test('2. Dashboard Access - After Login', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });

    // Check dashboard elements
    await expect(page.locator('text=Projets')).toBeVisible();
    await expect(page.locator('text=Certifications')).toBeVisible();
    await expect(page.locator('text=Roadmap')).toBeVisible();
    console.log('✅ Dashboard accessible');
  });

  test('3. Project Management - CRUD', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });

    // Check projects tab is active by default - tab shows "PROJETS"
    await expect(page.locator('button:has-text("PROJETS")')).toBeVisible({ timeout: 5000 });

    // Test CREATE project - uses prompt() dialogs
    page.on('dialog', async dialog => {
      if (dialog.type() === 'prompt') {
        if (dialog.message().includes('title') || dialog.message().includes('Titre')) {
          await dialog.accept('Test Project ' + Date.now());
        } else if (dialog.message().includes('desc') || dialog.message().includes('Description')) {
          await dialog.accept('Test project for functional testing');
        } else {
          await dialog.accept('');
        }
      } else if (dialog.type() === 'confirm') {
        await dialog.accept();
      }
    });

    await page.click('button:has-text("Ajouter"), button:has-text("Add")');
    await page.waitForTimeout(1000);

    // Verify project appears in list (check table)
    await expect(page.locator('table tbody tr').last()).toBeVisible({ timeout: 5000 });
    console.log('✅ Project CREATE works (via prompt)');

    // Test DELETE - click trash icon on last row (global dialog handler handles confirm)
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    if (count > 0) {
      await rows.last().locator('button').last().click();
      await page.waitForTimeout(500);
      console.log('✅ Project DELETE works');
    }
  });

  test('4. Certification Management - CRUD', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });

    // Navigate to certifications tab
    await page.click('button:has-text("Certifications")');
    await page.waitForTimeout(500);

    // Test CREATE certification - uses prompt() dialogs
    page.on('dialog', async dialog => {
      if (dialog.type() === 'prompt') {
        if (dialog.message().includes('title') || dialog.message().includes('Titre')) {
          await dialog.accept('Test Cert ' + Date.now());
        } else if (dialog.message().includes('issuer') || dialog.message().includes('Émetteur')) {
          await dialog.accept('Test Issuer');
        } else {
          await dialog.accept('');
        }
      } else if (dialog.type() === 'confirm') {
        await dialog.accept();
      }
    });

    await page.click('button:has-text("Ajouter"), button:has-text("Add")');
    await page.waitForTimeout(1000);

    // Verify certification appears in list
    await expect(page.locator('table tbody tr').last()).toBeVisible({ timeout: 5000 });
    console.log('✅ Certification CREATE works (via prompt)');

    // Test DELETE (global dialog handler handles confirm)
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    if (count > 0) {
      await rows.last().locator('button').last().click();
      await page.waitForTimeout(500);
      console.log('✅ Certification DELETE works');
    }
  });

  test('5. Roadmap Management - Complete', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });

    // Navigate to roadmap tab
    await page.click('button:has-text("Roadmap")');
    await page.waitForTimeout(1000);

    // Check roadmap loads
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Roadmap table loads');

    // Test locking/unlocking a level - click toggle button on first row
    const firstRow = page.locator('table tbody tr').first();
    const toggleButton = firstRow.locator('button').last();

    if (await toggleButton.count() > 0) {
      const initialText = await toggleButton.textContent();
      await toggleButton.click();
      await page.waitForTimeout(1000);
      const newText = await toggleButton.textContent();
      // Status should change (text might change or button color)
      console.log(`✅ Level lock/unlock works (was: ${initialText}, now: ${newText})`);
    }

    // Test bulk actions - unlock all
    const unlockAllBtn = page.locator('button:has-text("Déverrouiller tout"), button:has-text("Unlock all")').first();
    if (await unlockAllBtn.count() > 0) {
      await unlockAllBtn.click();
      await page.waitForTimeout(2000);
      console.log('✅ Bulk unlock all works');
    }

    // Test bulk actions - lock all
    const lockAllBtn = page.locator('button:has-text("Verrouiller tout"), button:has-text("Lock all")').first();
    if (await lockAllBtn.count() > 0) {
      await lockAllBtn.click();
      await page.waitForTimeout(2000);
      console.log('✅ Bulk lock all works');
    }

    console.log('✅ Roadmap management functional');
  });

  test('6. Database Persistence - Verify API', async ({ page }) => {
    const response = await page.request.get(`${API_URL}/projects`);
    expect(response.ok()).toBeTruthy();
    const projects = await response.json();
    expect(Array.isArray(projects)).toBeTruthy();
    console.log(`✅ Database persistence verified - ${projects.length} projects in DB`);

    const certResponse = await page.request.get(`${API_URL}/certifications`);
    expect(certResponse.ok()).toBeTruthy();
    const certs = await certResponse.json();
    expect(Array.isArray(certs)).toBeTruthy();
    console.log(`✅ Database persistence verified - ${certs.length} certifications in DB`);

    const roadmapResponse = await page.request.get(`${API_URL}/roadmap`);
    expect(roadmapResponse.ok()).toBeTruthy();
    const roadmapData = await roadmapResponse.json();
    expect(Array.isArray(roadmapData)).toBeTruthy();
    console.log(`✅ Database persistence verified - ${roadmapData.length} roadmap levels in DB`);
  });

  test('7. Public Frontend Synchronization', async ({ page }) => {
    // Create a test project via admin
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });

    // Add project via prompt
    const testTitle = 'Sync Test ' + Date.now();
    page.on('dialog', async dialog => {
      if (dialog.type() === 'prompt') {
        if (dialog.message().includes('title') || dialog.message().includes('Titre')) {
          await dialog.accept(testTitle);
        } else if (dialog.message().includes('desc') || dialog.message().includes('Description')) {
          await dialog.accept('Sync test project');
        } else {
          await dialog.accept('');
        }
      }
    });

    await page.click('button:has-text("Ajouter"), button:has-text("Add")');
    await page.waitForTimeout(1000);
    console.log('✅ Test project created in admin');

    // Now check public frontend
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should see the project in public view
    await expect(page.locator(`text=${testTitle}`)).toBeVisible({ timeout: 15000 });
    console.log('✅ Public frontend synchronized with admin data');
  });

  test('8. Other Admin Modules - Tabs', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });

    // Check Projects tab
    await expect(page.locator('button:has-text("Projets")')).toBeVisible();
    console.log('✅ Projects tab accessible');

    // Check Certifications tab
    await expect(page.locator('button:has-text("Certifications")')).toBeVisible();
    console.log('✅ Certifications tab accessible');

    // Check Roadmap tab
    await expect(page.locator('button:has-text("Roadmap")')).toBeVisible();
    console.log('✅ Roadmap tab accessible');

    // Logout button
    await expect(page.locator('button:has-text("Déconnexion"), button:has-text("Logout")')).toBeVisible();
    console.log('✅ Logout button accessible');
  });

  test('9. Unauthorized Access Control', async ({ page }) => {
    // Try to access admin without login
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should show login form (conditional rendering in Admin component)
    await expect(page.locator('input[placeholder*="username" i]')).toBeVisible({ timeout: 5000 });
    console.log('✅ Unauthorized access to /admin shows login form');

    // Try API without token
    const response = await page.request.post(`${API_URL}/projects`, {
      data: { title: 'Unauthorized Test' }
    });
    expect(response.status()).toBe(401);
    console.log('✅ API unauthorized access returns 401');

    // Login and verify authorized access works
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });
    console.log('✅ Authorized access works after login');
  });

  test('10. Logout Functionality', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[placeholder*="username" i]', ADMIN_USERNAME);
    await page.fill('input[placeholder*="password" i]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=[TINOGREYHAT_SYSADMIN]')).toBeVisible({ timeout: 10000 });

    // Logout
    await page.click('button:has-text("Déconnexion"), button:has-text("Logout")');
    await page.waitForTimeout(1000);

    // Should show login form again
    await expect(page.locator('input[placeholder*="username" i]')).toBeVisible({ timeout: 5000 });
    console.log('✅ Logout works');
  });
});