const path = require('path');
const { test, expect } = require('@playwright/test');

const fixture = (name) => 'file://' + path.join(process.cwd(), 'test/integration/html', name);

test.describe('Test async create', () => {
  test('should render async created context menu', async ({ page }) => {
    await page.goto(fixture('async-create.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await page.waitForSelector('#context-menu-layer');
    await expect(page.locator('.context-menu-root li')).toHaveCount(3);
  });
});
