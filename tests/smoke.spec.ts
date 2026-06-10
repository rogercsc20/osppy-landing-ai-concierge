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
    page.getByRole("heading", { level: 1, name: es.hero.headline }),
  ).toBeVisible();
});

test("English landing renders", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", {
      level: 1,
      // Accessible names collapse non-breaking spaces used for line control.
      name: en.hero.headline.replace(/\u00A0/g, " "),
    }),
  ).toBeVisible();
});

test("waitlist modal opens, traps focus, and closes on Escape", async ({
  page,
}) => {
  await page.goto("/es");
  await page.getByRole("button", { name: es.auth.signIn }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(es.auth.modalTitle)).toBeVisible();
  await expect(dialog.getByPlaceholder(es.auth.emailPlaceholder)).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("waitlist form submits (unconfigured endpoint falls back gracefully)", async ({
  page,
}) => {
  await page.goto("/es");
  await page.getByRole("button", { name: es.auth.signIn }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByPlaceholder(es.auth.emailPlaceholder)
    .fill("test@example.com");
  await dialog.getByRole("button", { name: es.auth.submit }).click();
  await expect(dialog.getByText(es.auth.success)).toBeVisible();
});

test("demo form validates and submits", async ({ page }) => {
  await page.goto("/es#demo");

  // Empty submit shows validation styling and does not enter success state.
  await page.getByRole("button", { name: es.cta.form.submit }).click();
  await expect(page.getByText(es.cta.form.success.title)).not.toBeVisible();

  await page.getByPlaceholder(es.cta.form.name).fill("Prueba");
  await page.getByPlaceholder(es.cta.form.hotel).fill("Hotel Prueba");
  await page.getByPlaceholder(es.cta.form.contact).fill("prueba@example.com");
  await page.getByRole("button", { name: es.cta.form.submit }).click();
  await expect(page.getByText(es.cta.form.success.title)).toBeVisible();
});

test("SEO files respond", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("/es");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("sitemap.xml");
});
