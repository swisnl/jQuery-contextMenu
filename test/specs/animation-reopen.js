const { test, expect } = require('@playwright/test');
const { fixture } = require('../support/helpers');

// https://github.com/swisnl/jQuery-contextMenu/issues/739
// The animation demo uses fadeIn/fadeOut with animation.animateOnReopen: false,
// so right clicking the second trigger while the menu is open should move the
// menu instead of fading it out and back in.
test.describe('Test animation.animateOnReopen (#739)', () => {
  test('re-opening the same menu on another trigger does not replay the animation', async ({ page }) => {
    await page.goto(fixture('animation.html'));

    const triggers = page.locator('.context-menu-one');
    await triggers.nth(0).click({ button: 'right' });
    await expect(page.locator('.context-menu-root')).toBeVisible();

    // wait for the (400ms) fade in of the first open to finish
    await expect
      .poll(() => page.evaluate(() => window.getComputedStyle(document.querySelector('.context-menu-root')).opacity))
      .toBe('1');

    const firstPosition = await page.locator('.context-menu-root').boundingBox();

    // sample the menu while the second right click is handled
    await page.evaluate(() => {
      window.__menuSamples = [];
      window.__sampler = setInterval(() => {
        const menu = document.querySelector('.context-menu-root');
        if (!menu) {
          window.__menuSamples.push({ display: 'removed', opacity: '0' });
          return;
        }
        const style = window.getComputedStyle(menu);
        window.__menuSamples.push({ display: style.display, opacity: style.opacity });
      }, 5);
    });

    // the transparent modal layer covers the second trigger, so click through it
    // with raw mouse coordinates, exactly like a user would
    const second = await triggers.nth(1).boundingBox();
    await page.mouse.click(second.x + second.width / 2, second.y + second.height / 2, { button: 'right' });
    await page.waitForTimeout(500);

    const samples = await page.evaluate(() => {
      clearInterval(window.__sampler);
      return window.__menuSamples;
    });

    expect(samples.length).toBeGreaterThan(10);
    const faded = samples.filter((s) => s.display === 'none' || s.display === 'removed' || Number(s.opacity) < 1);
    expect(faded, 'menu should never fade out or disappear while being re-opened').toEqual([]);

    // ... and it really did move to the second trigger
    await expect(page.locator('.context-menu-root')).toBeVisible();
    const secondPosition = await page.locator('.context-menu-root').boundingBox();
    expect(secondPosition.x).not.toBe(firstPosition.x);
  });
});
