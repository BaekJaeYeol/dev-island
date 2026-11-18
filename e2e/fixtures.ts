import { test as base, expect } from '@playwright/test';
// A fresh browser per case also isolates GPU/context teardown between cases.
export const test = base.extend({
 context: async ({ playwright, contextOptions, baseURL, viewport, hasTouch }, use) => {
  const browser = await playwright.chromium.launch({
   executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
   args: process.env.PLAYWRIGHT_LAUNCH_ARGS ? JSON.parse(process.env.PLAYWRIGHT_LAUNCH_ARGS) : [],
  });
  const context = await browser.newContext({ ...contextOptions, baseURL, viewport, hasTouch });
  await use(context);
  await context.close();
  await browser.close();
 },
});
export { expect };
