import { test, expect } from "@playwright/test";
import es from "../messages/es.json";

test.describe("dashboard auth guard", () => {
  test("unauthenticated /es/dashboard redirects to /es/login", async ({ page }) => {
    await page.goto("/es/dashboard");
    // Proxy guard: no session → bounce to the locale login (with ?next).
    await expect(page).toHaveURL(/\/es\/login(\?|$)/);
  });

  test("login page renders the magic-link form", async ({ page }) => {
    await page.goto("/es/login");
    await expect(
      page.getByRole("heading", { level: 1, name: es.dashboardApp.login.title }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: es.dashboardApp.login.submit }),
    ).toBeVisible();
  });
});
