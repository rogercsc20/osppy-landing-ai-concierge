import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // CI builds first (see .github/workflows/ci.yml) and serves the prod build.
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000/es",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
