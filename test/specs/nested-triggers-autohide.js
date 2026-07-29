const { test, expect } = require('@playwright/test');
const { fixture } = require('../support/helpers');

// While a menu is open the transparent modal layer covers the whole viewport,
// so Playwright's actionability checks would refuse to click a page element.
// Drive the raw mouse instead, exactly like a user would.
async function clickAt(page, x, y, button) {
  await page.mouse.move(x, y);
  await page.mouse.down({ button: button || 'left' });
  await page.mouse.up({ button: button || 'left' });
}

// Move the pointer well away from both triggers and from the menu itself, in
// a couple of steps so the plugin's document-level mousemove handler runs.
async function moveAway(page) {
  await page.mouse.move(1150, 650);
  await page.mouse.move(1160, 660);
}

// The inner trigger sits in the top left of the outer one. Clicking the outer
// near its bottom left keeps both the click and the resulting menu clear of
// the inner trigger and of any menu opened from it.
async function points(page) {
  const outer = await page.locator('.context-menu-two').boundingBox();
  const inner = await page.locator('.context-menu-one').boundingBox();

  return {
    inner: [inner.x + inner.width / 2, inner.y + inner.height / 2],
    outer: [outer.x + 20, outer.y + outer.height - 20],
  };
}

test.describe('Test autoHide with nested triggers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixture('nested-triggers-autohide.html'));
  });

  test('Ensure the inner (left-click) menu auto hides', async ({ page }) => {
    const at = await points(page);

    await clickAt(page, at.inner[0], at.inner[1]);
    await expect(page.locator('.menu-one')).toBeVisible();

    await moveAway(page);

    await expect(page.locator('.menu-one')).toBeHidden();
  });

  test('Ensure the outer (right-click) menu auto hides', async ({ page }) => {
    const at = await points(page);

    await clickAt(page, at.outer[0], at.outer[1], 'right');
    await expect(page.locator('.menu-two')).toBeVisible();

    await moveAway(page);

    await expect(page.locator('.menu-two')).toBeHidden();
  });

  test('Ensure the inner menu opens and auto hides while the outer menu is open', async ({ page }) => {
    const at = await points(page);

    await clickAt(page, at.outer[0], at.outer[1], 'right');
    await expect(page.locator('.menu-two')).toBeVisible();

    await clickAt(page, at.inner[0], at.inner[1]);
    await expect(page.locator('.menu-one')).toBeVisible();
    await expect(page.locator('.menu-two')).toBeHidden();

    await moveAway(page);

    await expect(page.locator('.menu-one')).toBeHidden();
    await expect(page.locator('#context-menu-layer')).toHaveCount(0);
  });

  test('Ensure the outer menu opens and auto hides while the inner menu is open', async ({ page }) => {
    const at = await points(page);

    await clickAt(page, at.inner[0], at.inner[1]);
    await expect(page.locator('.menu-one')).toBeVisible();

    await clickAt(page, at.outer[0], at.outer[1], 'right');
    await expect(page.locator('.menu-two')).toBeVisible();
    await expect(page.locator('.menu-one')).toBeHidden();

    await moveAway(page);

    await expect(page.locator('.menu-two')).toBeHidden();
    await expect(page.locator('#context-menu-layer')).toHaveCount(0);
  });
});
