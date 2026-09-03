import { test, expect } from "@playwright/test";
import es from "../messages/es.json";
import en from "../messages/en.json";

test("i18n: es and en message key trees are identical", () => {
  const keyTree = (obj: unknown, prefix = ""): string[] =>
    obj !== null && typeof obj === "object"
      ? Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
          keyTree(v, prefix ? `${prefix}.${k}` : k),
        )
      : [prefix];
  expect(keyTree(es).sort()).toEqual(keyTree(en).sort());
});

test.describe("locale negotiation", () => {
  test.describe("Spanish browser", () => {
    test.use({ locale: "es-MX" });
    test("root redirects to /es", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/es$/);
    });
  });

  test.describe("English browser", () => {
    test.use({ locale: "en-US" });
    test("root redirects to /en", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/en$/);
    });
  });
});

test("Spanish landing renders", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(
    page.getByRole("heading", { level: 1, name: es.home.hero.headline }),
  ).toBeVisible();
});

test("English landing renders", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", {
      level: 1,
      // Accessible names collapse non-breaking spaces used for line control.
      name: en.home.hero.headline.replace(/\u00A0/g, " "),
    }),
  ).toBeVisible();
});

test("nav Log in points at the cockpit login (cross-origin — assert, don't navigate)", async ({
  page,
}) => {
  await page.goto("/es");
  await expect(
    page.getByRole("banner").getByRole("link", { name: es.nav.login }),
  ).toHaveAttribute("href", "https://app.osppy.com/es/login");
});

test("legacy login/dashboard bookmarks redirect to the cockpit", async ({
  request,
}) => {
  for (const path of ["/es/login", "/login", "/es/dashboard", "/dashboard/stats"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(307);
    expect(response.headers()["location"], path).toBe(
      "https://app.osppy.com/es/login",
    );
  }
});

// HQA-D25: there is no lead form — the CTA is a pair of links. While
// WHATSAPP_NUMBER is empty the primary link opens a prefilled email (HQA-D29).
test("CTA offers contact links, no form", async ({ page }) => {
  await page.goto("/es#demo");

  // Scoped to #demo: the navbar CTA shares the button's accessible name.
  const demo = page.locator("#demo");
  await expect(
    demo.getByRole("link", { name: es.home.cta.button }),
  ).toHaveAttribute("href", /^(https:\/\/wa\.me\/|mailto:hello@osppy\.com)/);
  await expect(
    demo.getByRole("link", { name: "hello@osppy.com" }),
  ).toHaveAttribute("href", "mailto:hello@osppy.com");
  expect(await page.locator("#demo form").count()).toBe(0);
});

test("SEO files respond", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("/es");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("sitemap.xml");
});
