import { test } from '@playwright/test';

test('Explore login page', async ({ page }) => {
  await page.goto('http://localhost:5173/admin/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Get all input elements
  const inputs = await page.locator('input').all();
  console.log('=== INPUTS ===');
  for (const input of inputs) {
    const name = await input.getAttribute('name');
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    const id = await input.getAttribute('id');
    const className = await input.getAttribute('class');
    console.log(`Input: name="${name}", type="${type}", placeholder="${placeholder}", id="${id}", class="${className}"`);
  }

  // Get all buttons
  const buttons = await page.locator('button').all();
  console.log('=== BUTTONS ===');
  for (const button of buttons) {
    const text = await button.textContent();
    const type = await button.getAttribute('type');
    const className = await button.getAttribute('class');
    console.log(`Button: text="${text}", type="${type}", class="${className}"`);
  }

  // Get all form elements
  const forms = await page.locator('form').all();
  console.log('=== FORMS ===');
  for (const form of forms) {
    const action = await form.getAttribute('action');
    const method = await form.getAttribute('method');
    console.log(`Form: action="${action}", method="${method}"`);
  }

  // Get page text content
  const bodyText = await page.locator('body').textContent();
  console.log('=== BODY TEXT (first 2000 chars) ===');
  console.log(bodyText.substring(0, 2000));

  // Get HTML of root div
  const rootHtml = await page.locator('#root').innerHTML();
  console.log('=== ROOT HTML (first 5000 chars) ===');
  console.log(rootHtml.substring(0, 5000));
});