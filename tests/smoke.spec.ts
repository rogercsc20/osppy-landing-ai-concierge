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

test.describe("hero subtitle underline (tanda D, D3)", () => {
  // One assertion per language, on the rendered element and not the JSON:
  // it catches a broken <u> tag in the message (t.rich silently drops
  // unbalanced markup), a lost .underline-thick class, and the wrong word
  // underlined — each language picks its own.
  for (const [route, word] of [
    ["/es", "dónde"],
    ["/en", "where"],
  ] as const) {
    test(`${route}: the underlined word is exactly «${word}»`, async ({ page }) => {
      await page.goto(route);
      const u = page.locator("u.underline-thick");
      await expect(u).toHaveCount(1);
      await expect(u).toHaveText(word);
    });
  }
});

test.describe("hero operation panel (tanda D, D4)", () => {
  // The demonstration-data chip is the truth label of the hero's one moving
  // object (source of truth §9/§10): a mock never presents itself as a
  // client screenshot. The panel body is behind the repo's first
  // next/dynamic boundary with ssr:false, so the assertion waits for the
  // chunk — and thereby also proves the boundary actually loads.
  for (const [route, label] of [
    ["/es", "Datos de demostración"],
    ["/en", "Demonstration data"],
  ] as const) {
    test(`${route}: the demo-data chip is present and says «${label}»`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route);
      const chip = page.getByTestId("panel-demo-chip");
      await expect(chip).toBeVisible();
      await expect(chip).toHaveText(label);
    });
  }
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

// L5: the hotel product's page — the Obsidian object with its own CTA.
test("Spanish hotels page renders with its demo CTA", async ({ page }) => {
  await page.goto("/es/hoteles");
  await expect(
    page.getByRole("heading", { level: 1, name: es.hoteles.hero.headline }),
  ).toBeVisible();
  const demo = page.locator("#demo");
  await expect(
    demo.getByRole("link", { name: es.hoteles.cta.button }),
  ).toHaveAttribute("href", /^(https:\/\/wa\.me\/|mailto:hello@osppy\.com)/);
  expect(await page.locator("form").count()).toBe(0);
});

test("English hotels page renders on its localized slug", async ({ page }) => {
  await page.goto("/en/hotels");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { level: 1, name: en.hoteles.hero.headline }),
  ).toBeVisible();
});

// ── tanda E2: three service routes, products out of the nav (HQA-D88) ──────

test.describe("service routes render on their localized slug", () => {
  // Both locales, because the English slug is a routing.ts rewrite and a typo
  // there 404s only in English — the half a Spanish-only check never sees.
  for (const [route, headline] of [
    ["/es/capacitacion", es.servicios.capacitacion.headline],
    ["/en/training", en.servicios.capacitacion.headline],
    ["/es/asesoria", es.servicios.asesoria.headline],
    ["/en/advisory", en.servicios.asesoria.headline],
    ["/es/implementacion", es.servicios.implementacion.headline],
    ["/en/implementation", en.servicios.implementacion.headline],
  ] as const) {
    test(`${route} renders its h1 and one CTA`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: headline })).toBeVisible();
      await expect(
        page.locator("main").getByRole("link", {
          name: route.startsWith("/en") ? en.servicios.capacitacion.cta : es.servicios.capacitacion.cta,
        }),
      ).toHaveAttribute("href", /^(https:\/\/wa\.me\/|mailto:hello@osppy\.com)/);
    });
  }
});

test("the nav leads with the three services and links no product", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/es");
  const nav = page.getByRole("banner").getByRole("navigation", { name: "principal" });

  for (const [name, href] of [
    [es.nav.capacitacion, "/es/capacitacion"],
    [es.nav.asesoria, "/es/asesoria"],
    [es.nav.implementacion, "/es/implementacion"],
  ] as const) {
    await expect(nav.getByRole("link", { name })).toHaveAttribute("href", href);
  }
  // The point of HQA-D88 is the absence, so the absence is what is asserted:
  // no link anywhere in the header or the footer walks to Diana.
  await expect(page.locator('header a[href*="/hoteles"], header a[href*="/citas"]')).toHaveCount(0);
  await expect(
    page.locator('footer a[href*="/hoteles"], footer a[href*="/citas"]'),
  ).toHaveCount(0);
});

test("the footer asks for products instead of linking them (gate E0-1)", async ({ page }) => {
  await page.goto("/es");
  await expect(
    page.locator("footer").getByRole("link", { name: es.footer.productosCta }),
  ).toHaveAttribute("href", /^(https:\/\/wa\.me\/|mailto:hello@osppy\.com)/);
});

test("Diana's routes stay alive, unindexed and out of the sitemap (gate E0-7)", async ({
  page,
  request,
}) => {
  // Both halves in one test on purpose: a noindex page still listed in the
  // sitemap is a site contradicting itself, and each half alone passes while
  // the pair is broken.
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/es/capacitacion");
  expect(sitemap).not.toContain("/hoteles");
  expect(sitemap).not.toContain("/citas");

  for (const route of ["/es/hoteles", "/es/citas"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
});

test("the title and description stopped selling hotels (HQA-D96, closing D85)", async ({
  page,
}) => {
  for (const [route, title] of [
    ["/es", "Osppy · IA Corporativa"],
    ["/en", "Osppy · Corporate AI"],
  ] as const) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description, route).not.toMatch(/recepci|front desk|hu[ée]sped|guest/i);
  }
});
