// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/specs',
  testMatch: '*.js',
  fullyParallel: true,
  // Retry on CI only. The specs themselves are deterministic, but the runner is
  // shared and oversubscribed, and a loaded one occasionally takes longer than
  // the 30s default timeout just to load a fixture page - the failure is a
  // `page.goto` timeout rather than a failed assertion. Without retries a single
  // slow page load fails a whole matrix row. Locally, retries would only hide
  // a genuinely flaky spec, so leave them off there.
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
