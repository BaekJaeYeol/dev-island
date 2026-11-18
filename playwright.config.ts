import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir: './e2e', timeout: 45000, expect: { timeout: 15000 },
 use: {
  baseURL: 'http://127.0.0.1:4173', viewport: { width: 1280, height: 900 },
  trace: 'retain-on-failure',
  launchOptions: {
   executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
   args: process.env.PLAYWRIGHT_LAUNCH_ARGS ? JSON.parse(process.env.PLAYWRIGHT_LAUNCH_ARGS) : [],
  },
 },
 webServer: {
  command: 'npm run build && npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
  url: 'http://127.0.0.1:4173', timeout: 60000, reuseExistingServer: false,
 },
 reporter: 'list',
});
