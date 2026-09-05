import { test, expect } from "@playwright/test";
import es from "../messages/es.json";
import en from "../messages/en.json";
import { PHOTOS } from "../lib/photos.generated";

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

test.describe("section 2 subtitle underline (tanda D D3, moved by E3c, marks inside since v5 T1)", () => {
  // One assertion per language, on the rendered element and not the JSON:
  // it catches a broken <u> tag in the message (t.rich silently drops
  // unbalanced markup), a lost .underline-thick class, and the wrong word
  // underlined — each language picks its own. The expected word is READ
  // from the JSON rather than pinned here: v5 T1 found the two literal pins
  // ("dónde", "where") failing on the very change the plan said they would
  // follow, and a pin that has to be edited alongside every copy change
  // guards nothing. What D-6 actually decided is asserted separately below.
  const underlined = (subtitulo: string) => {
    const m = subtitulo.match(/<u>([^<]+)<\/u>/);
    expect(m, `no single balanced <u> in "${subtitulo}"`).not.toBeNull();
    return m![1];
  };

  for (const [route, subtitulo] of [
    ["/es", es.home.aplicada.subtitulo],
    ["/en", en.home.aplicada.subtitulo],
  ] as const) {
    test(`${route}: the underlined word is exactly what the JSON underlines`, async ({
      page,
    }) => {
      await page.goto(route);
      const u = page.locator("u.underline-thick");
      await expect(u).toHaveCount(1);
      await expect(u).toHaveText(underlined(subtitulo));
    });
  }

  test("the question marks sit INSIDE the underline in both languages (v5 D-6)", () => {
    // D-6 is about the marks, not the word: the underline moved from the
    // bare word onto the question itself. If the marks drift outside the
    // <u> the sentence still reads and the render test above still passes;
    // only this notices.
    expect(underlined(es.home.aplicada.subtitulo)).toMatch(/^¿.+\?$/);
    expect(underlined(en.home.aplicada.subtitulo)).toMatch(/^[^¿].+\?$/);
  });
});

test.describe("section 2 operation panel (tanda D D4, moved by E3c)", () => {
  // The two tests that used to live here asserted the demonstration-data
  // chip, which decision D-2 removed in v5 T5. They are not replaced in
  // kind: the operator took output A knowingly, and a test cannot re-argue
  // a decision. What IS replaced is the guarantee they gave BY ACCIDENT.
  //
  // Waiting for the chip meant waiting for the repo's ONLY next/dynamic
  // boundary with `ssr: false` (Aplicada.tsx) to resolve, so those two tests
  // were also the only thing proving that boundary loads at all. Deleting
  // them without repaying that would have left the deferred panel able to
  // fail silently, with the skeleton standing in for it forever.
  //
  // The skeleton renders NO text — every box in PanelSkeleton is empty and
  // the whole thing is aria-hidden — so any panel string found in the DOM is
  // proof the deferred chunk arrived AND hydrated. Per language, because the
  // boundary is inside a client component that reads the locale.
  for (const [route, tree] of [
    ["/es", es],
    ["/en", en],
  ] as const) {
    test(`${route}: the deferred panel really loads, and it is what says so`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route);
      const panel = page.locator('[data-panel="invert"]');
      const copy = tree.home.aplicada.panel;
      // the title: the skeleton draws this as an empty grey box
      await expect(panel.getByText(copy.titulo, { exact: true })).toBeVisible();
      for (const k of ["k1", "k2", "k3", "k4"] as const) {
        await expect(panel.getByText(copy.kpis[k].label)).toBeVisible();
      }
    });
  }

  test("the demonstration label and the company name are gone from both trees (D-2)", () => {
    // D-2 removed the chip AND the company slot, and the slot is left EMPTY
    // rather than refilled with an invented trade name or with Osppy. Keys
    // nothing renders are dead copy that check:parity would keep alive in
    // both trees forever, so they are deleted, not blanked — the same move
    // T3 made with home.hero.scroll. The four `periodo` keys go with them:
    // they were never rendered by any version of the panel, and the basis
    // for the deltas is now said once, in `kpisNota`.
    for (const tree of [es, en]) {
      const panel = tree.home.aplicada.panel as Record<string, unknown>;
      expect(panel.etiqueta).toBeUndefined();
      expect(panel.empresa).toBeUndefined();
      expect(panel.kpisNota).toBeTruthy();
      for (const k of ["k1", "k2", "k3", "k4"] as const) {
        const kpi = (panel.kpis as Record<string, Record<string, unknown>>)[k];
        expect(kpi.periodo).toBeUndefined();
        // the unit never lives inside `valor`: Counter is handed Number(valor)
        expect(Number.isNaN(Number(kpi.valor))).toBe(false);
        expect(kpi.unidad).toBeDefined();
        expect(kpi.deltaUnidad).toBeDefined();
      }
    }
  });
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
  for (const path of [
    "/es/login",
    "/login",
    "/es/dashboard",
    "/dashboard/stats",
  ]) {
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
    test(`${route} renders its h1 and every CTA opens a conversation`, async ({
      page,
    }) => {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(
        page.getByRole("heading", { level: 1, name: headline }),
      ).toBeVisible();
      // Since E5c each page carries the SAME call twice, in block 1 and in
      // block 9, so this asserts EVERY one of them rather than the first: a
      // close whose button quietly stopped resolving would otherwise pass,
      // and asserting only the first is what strict mode was complaining
      // about the moment the second one landed.
      const ctas = page.locator("main").getByRole("link", {
        name: route.startsWith("/en")
          ? en.servicios.capacitacion.cta
          : es.servicios.capacitacion.cta,
      });
      const total = await ctas.count();
      expect(total, `${route} has no CTA`).toBeGreaterThan(0);
      for (let i = 0; i < total; i++) {
        await expect(ctas.nth(i)).toHaveAttribute(
          "href",
          /^(https:\/\/wa\.me\/|mailto:hello@osppy\.com)/,
        );
      }
    });
  }
});

test("the nav leads with the three services and links no product", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/es");
  const nav = page
    .getByRole("banner")
    .getByRole("navigation", { name: "principal" });

  for (const [name, href] of [
    [es.nav.capacitacion, "/es/capacitacion"],
    [es.nav.asesoria, "/es/asesoria"],
    [es.nav.implementacion, "/es/implementacion"],
  ] as const) {
    await expect(nav.getByRole("link", { name })).toHaveAttribute("href", href);
  }
  // The point of HQA-D88 is the absence, so the absence is what is asserted:
  // no link anywhere in the header or the footer walks to Diana.
  await expect(
    page.locator('header a[href*="/hoteles"], header a[href*="/citas"]'),
  ).toHaveCount(0);
  await expect(
    page.locator('footer a[href*="/hoteles"], footer a[href*="/citas"]'),
  ).toHaveCount(0);
});

test("the footer asks for products instead of linking them (gate E0-1)", async ({
  page,
}) => {
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
    expect(description, route).not.toMatch(
      /recepci|front desk|hu[ée]sped|guest/i,
    );
  }
});

// ── tanda E3c: the house is restructured ──────────────────────────────────

test("the house opens with one phrase and exactly one h1", async ({ page }) => {
  await page.goto("/es");
  // Exactly one: <Aplicada/> carries the old hero's headline and it had to
  // stop being an h1 when it came down a screen. If it stays an h1 the page
  // has two, the document outline breaks, and this is the only thing that
  // notices.
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(es.home.hero.headline);
  await expect(page.getByText(es.home.hero.apoyo)).toBeVisible();
});

test("the hero has no action at all: no CTA, no button, no scroll indicator (decision 2, v5 T3)", async ({
  page,
}) => {
  await page.goto("/es");
  const hero = page.locator("section").first();
  // The operator closed the first half on the E3a gate: "no boton en el
  // heroe". Asserting the ABSENCE of contact links is the half that guards
  // the dictation and it does not move. The second half INVERTED in v5 T3:
  // the scroll indicator ("Baja") was the one action left and the operator
  // removed it, so the honest assertion is now stronger than a count of one
  // anchor — nothing clickable at all on the first screen.
  await expect(
    hero.locator('a[href^="mailto:"], a[href^="https://wa.me/"]'),
  ).toHaveCount(0);
  await expect(hero.locator('a[href="#aplicada"]')).toHaveCount(0);
  await expect(hero.locator("a, button")).toHaveCount(0);
});

// ── v5 T3: the hero takes a photograph ─────────────────────────────────────

test.describe("the hero carries the photograph from the channel (v5 T3)", () => {
  for (const [route, alt] of [
    ["/es", PHOTOS.hero.altEs],
    ["/en", PHOTOS.hero.altEn],
  ] as const) {
    test(`${route}: one priority next/image of the hero slug, decorative, with the manifest alt`, async ({
      page,
    }) => {
      await page.goto(route);
      const hero = page.locator("section").first();
      // By DOM, not by role: the photo is decoration and lives inside FxLayer
      // (aria-hidden), so no reader hears it before the h1. getByRole("img")
      // would not find it, and that is the point.
      const img = hero.locator('[aria-hidden="true"] img');
      await expect(img).toHaveCount(1);
      // The URL next/image writes is /_next/image?url=%2Fphotos%2Fhero.webp&w=…
      await expect(img).toHaveAttribute("src", /photos%2Fhero/);
      await expect(img).toHaveAttribute("srcset", /photos%2Fhero/);
      await expect(img).toHaveAttribute("alt", alt);
      // What Photo's `priority` produces (next/image `preload` + explicit
      // `fetchPriority`, because Next 16 deprecated `priority` and never wrote
      // the attribute), and what the LCP depends on: the hint on the <img>,
      // no lazy loading, and the preload link in the head.
      await expect(img).toHaveAttribute("fetchpriority", "high");
      await expect(img).not.toHaveAttribute("loading", "lazy");
      await expect(
        page.locator('head link[rel="preload"][as="image"][imagesrcset*="photos%2Fhero"]'),
      ).toHaveCount(1);
    });
  }

  test("home.hero.scroll no longer exists in either JSON", () => {
    // The indicator is gone, not hidden: a key nothing renders is dead copy
    // that check:parity would keep alive in both trees forever.
    expect((es.home.hero as Record<string, unknown>).scroll).toBeUndefined();
    expect((en.home.hero as Record<string, unknown>).scroll).toBeUndefined();
  });
});

test("the three cards are the links, and the whole card is the target", async ({
  page,
}) => {
  await page.goto("/es");
  const cards = page.locator("#hacemos a");
  await expect(cards).toHaveCount(3);
  for (const [i, href] of [
    "/es/capacitacion",
    "/es/asesoria",
    "/es/implementacion",
  ].entries()) {
    await expect(cards.nth(i)).toHaveAttribute("href", href);
    // the title lives INSIDE the anchor: that is what "the whole card is
    // clickable" means, and a card with a small link at the bottom would
    // pass a href check while failing the instruction
    await expect(cards.nth(i).locator("h3")).toBeVisible();
  }
});

test("the five method phases navigate to their service (HQA-D92)", async ({
  page,
}) => {
  // Below lg the chapter is STACKED and all five steps are mounted, which is
  // the only viewport where the whole map can be asserted at once. At lg+ it
  // pins and AnimatePresence mounts one step at a time, so a five-link
  // assertion there would be asserting the animation, not the map.
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/es");

  // `:visible` is load-bearing, not decoration. <Pinned/> renders BOTH
  // branches into the DOM and hides one with lg:hidden / hidden lg:block, so
  // an unfiltered count sees the stacked five PLUS the pinned current step
  // and reads 2 for phase 1. Filtering to what a reader can actually reach
  // is both the correct count and the thing worth asserting.
  const link = (href: string) =>
    page.locator(`#como a[href="${href}"]:visible`);

  // Three of the five share a destination, so the counts are the assertion:
  // a bug that sent every phase to the same page would pass "five links
  // exist", and one that sent none would pass "there is a link".
  await expect(link("/es/capacitacion")).toHaveCount(1);
  await expect(link("/es/asesoria")).toHaveCount(1);
  await expect(link("/es/implementacion")).toHaveCount(3);

  // And the label names the service rather than saying "ver más" five times.
  await expect(link("/es/capacitacion")).toHaveText(
    new RegExp(es.home.como.p1Cta),
  );
});

test("the sections that died are gone from the house", async ({ page }) => {
  await page.goto("/es");
  const body = page.locator("body");
  // One string each from Cuanto, Productos and Creemos. They are asserted by
  // their COPY and not by a component name, because a section that survives
  // under a new file name is still on the page.
  await expect(body).not.toContainText("Sin paquetes");
  await expect(body).not.toContainText("Diana Hoteles");
  await expect(body).not.toContainText("Lo que creemos");
});

test("the track record shows three figures and no 24/7", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByText(es.home.trayectoria.c3Label)).toBeVisible();
  await expect(page.locator("body")).not.toContainText("24/7");
});

test("the +20 figure says the same thing in both locales", async () => {
  // scripts/copy-allow.json is keyed by MESSAGE KEY, not by locale, so one
  // entry authorises the figure in both files. If the two ever disagree,
  // check-copy passes and the site lies in one language.
  expect(es.home.trayectoria.c3Valor).toBe("+20");
  expect(en.home.trayectoria.c3Valor).toBe(es.home.trayectoria.c3Valor);
});

// ── tanda E4: the panel becomes a board, and it inverts ───────────────────

test.describe("the operation panel inverts against the page (HQA-D91)", () => {
  for (const [theme, expectDarkPanel] of [
    ["dark", false],
    ["light", true],
  ] as const) {
    test(`page ${theme}: the panel wears the opposite surface`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("theme", t);
        } catch {}
      }, theme);
      await page.goto("/es");
      const panel = page.locator('[data-panel="invert"]');
      await expect(panel).toHaveCount(1);

      // Read the RESOLVED variable inside the subtree and compare it with the
      // page's own. Asserting a literal colour would pin the palette; what
      // this guards is the RELATIONSHIP the operator asked for — panel and
      // page on opposite sides — which survives a repaint of either.
      const [panelSurface, pageSurface] = await Promise.all([
        panel.evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--surface").trim(),
        ),
        page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--surface")
            .trim(),
        ),
      ]);
      expect(panelSurface).not.toBe(pageSurface);

      // getComputedStyle hands back the SHORTHAND the stylesheet used, so
      // #ffffff comes out as "#fff". Expanding it is not a nicety: parsed as
      // six digits, "fff" is 0x000fff, whose channels average 90 and which
      // therefore reads as DARK — the helper called the ivory panel dark and
      // failed a passing implementation.
      const isDark = (hex: string) => {
        const h = hex.replace("#", "");
        const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
        const n = parseInt(full, 16);
        return ((n >> 16) + ((n >> 8) & 255) + (n & 255)) / 3 < 128;
      };
      expect(isDark(panelSurface)).toBe(expectDarkPanel);

      // And data-theme is untouched: the inversion must never reach for the
      // toggle, or the theme button and the pre-paint script both break.
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    });
  }
});

test("the board shows four KPI tiles and no benefit metric", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/es");
  const panel = page.locator('[data-panel="invert"]');
  for (const k of ["k1", "k2", "k3", "k4"] as const) {
    await expect(
      panel.getByText(es.home.aplicada.panel.kpis[k].label),
    ).toBeVisible();
  }
  // Rule 1 of the board, asserted on the copy and not on the component: the
  // KPIs describe volume and state, never benefit. check-copy.mjs catches
  // these stems across the whole file; this catches them where they would be
  // most tempting to add.
  const words = Object.values(es.home.aplicada.panel.kpis)
    .map((k) => k.label)
    .join(" ")
    .toLowerCase();
  for (const banned of ["ahorr", "reemplaz", "hora", "costo"]) {
    expect(words, `KPI label contains "${banned}"`).not.toContain(banned);
  }
});

// ── tanda E5c: the three service pages have bodies, and they differ ────────

test.describe("each service page carries its own heavy block", () => {
  // The rule these three tests exist for is the one the v3 plan named and the
  // v4 plan repeated: three pages with the same skeleton and different words.
  // Asserting each page's h1 (which the E2 tests already do) cannot see that
  // failure — it passes just as well when all three render an identical body.
  // So each test pins the block that ONLY that page has.

  test("/capacitacion walks down the four routes, and marks no workshop as ready", async ({
    page,
  }) => {
    await page.goto("/es/capacitacion");
    const main = page.locator("main");

    for (const k of ["r1", "r2", "r3", "r4"] as const) {
      await expect(
        main.getByRole("heading", {
          name: es.servicios.capacitacion.rutas[`${k}Titulo`],
          exact: true,
        }),
      ).toBeVisible();
    }

    // No route claims to be finished. The catalog marks FICHAS and never
    // ROUTES (catalog §1.2), and no ficha may be marked ✅ until the operator
    // says which — so the two status lines are derived, and neither of them
    // may drift into the house's "Disponible hoy" pill.
    const estados = ["r1", "r2", "r3", "r4"].map(
      (k) => es.servicios.capacitacion.rutas[`${k}Estado` as "r1Estado"],
    );
    for (const estado of estados) {
      expect(estado).not.toContain(es.home.hacemos.capacitacion.estado);
    }
    await expect(
      main.getByText(es.home.hacemos.capacitacion.estado),
    ).toHaveCount(0);
  });

  test("/asesoria argues three convictions and then three outcomes", async ({
    page,
  }) => {
    await page.goto("/es/asesoria");
    const main = page.locator("main");

    for (const k of ["c1", "c2", "c3"] as const) {
      await expect(
        main.getByRole("heading", {
          name: es.servicios.asesoria.creemos[`${k}Titulo`],
          exact: true,
        }),
      ).toBeVisible();
    }
    // "Todavía no" is one of the three outcomes and is the sentence that used
    // to be buried at the end of a five-paragraph block in the house. If it
    // ever gets softened away, this fails.
    await expect(
      main.getByText(es.servicios.asesoria.salidas.s3Body),
    ).toBeVisible();

    // Process structuring lives HERE by E5a's decision 4, and the argument for
    // it is that the convictions above already promise the deliverable. The
    // two must therefore stay on the same page.
    await expect(
      main.getByRole("heading", {
        name: es.servicios.asesoria.estructuracion.titulo,
        exact: true,
      }),
    ).toBeVisible();
  });

  test("/implementacion groups its inventory in three families and draws the diagram", async ({
    page,
  }) => {
    await page.goto("/es/implementacion");
    const main = page.locator("main");

    for (const k of ["f1", "f2", "f3"] as const) {
      await expect(
        main.getByRole("heading", {
          name: es.servicios.implementacion.construido[`${k}Titulo`],
          exact: true,
        }),
      ).toBeVisible();
    }
    // The diagram that came down from the house's hero (E0-2). It is an img
    // role with the moved alt text, so this fails if the move is undone.
    await expect(
      main.getByRole("img", {
        name: es.servicios.implementacion.agentes.diagrama.alt,
      }),
    ).toBeVisible();

    // Process structuring is NOT here, by the same decision. Asserted as an
    // absence because that is what the decision actually bought.
    await expect(
      main.getByRole("heading", {
        name: es.servicios.asesoria.estructuracion.titulo,
        exact: true,
      }),
    ).toHaveCount(0);
  });
});

test("the service pages do not segment the audience by company size", async ({
  page,
}) => {
  // E5a decision 2. Asserted on the rendered <meta>, not on the JSON, because
  // the string travels through generateMetadata and a page that stopped
  // reading the key would pass a JSON-only check.
  for (const [route, forbidden] of [
    ["/es/capacitacion", "medianas y grandes"],
    ["/en/training", "medium and large"],
  ] as const) {
    await page.goto(route);
    const description = await page
      .locator('head meta[name="description"]')
      .getAttribute("content");
    expect(description, route).not.toContain(forbidden);
    expect(description, route).toBeTruthy();
  }
});

test("every service block sits inside the main landmark", async ({ page }) => {
  // PaginaServicio renders a bare <section> and each page owns the <main>.
  // If that ever inverts, the hero keeps working and blocks 2 onward fall
  // outside the landmark, which no other gate can see.
  for (const route of [
    "/es/capacitacion",
    "/es/asesoria",
    "/es/implementacion",
  ] as const) {
    await page.goto(route);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("main h1")).toHaveCount(1);
    // The close is the last block of all three, so its button being inside
    // main means everything between the hero and it is too.
    await expect(
      page
        .locator("main")
        .getByRole("link", { name: es.servicios.capacitacion.cierre.cta }),
    ).not.toHaveCount(0);
  }
});

// ── v5 T1: the house drops its section kickers (D-5), and the underline takes
// the question (D-6) ───────────────────────────────────────────────────────

test("the house carries no section kicker, and no home key still names one (D-5)", async ({
  page,
}) => {
  // Nine eyebrows died in one decision. Asserted twice on purpose: on the
  // JSON, so a `kicker` key quietly re-added under home.* fails before any
  // component reads it, and on the rendered page, so a kicker rendered from
  // some other key fails too. Scoped to the house: the three service pages
  // keep theirs, because there the kicker is the one thing that places the
  // page inside the line.
  const homeKickers = Object.entries(es.home)
    .filter(([, section]) => "kicker" in section)
    .map(([name]) => `home.${name}.kicker`);
  expect(homeKickers).toEqual([]);

  await page.goto("/es");
  await expect(page.locator("main .eyebrow")).toHaveCount(0);
});

test.describe("the mobile phase strip is a named landmark (v5 T1, plan C7)", () => {
  // Como.tsx used to name its <nav> of pills after the section kicker. When
  // the nine kickers died the landmark would have been left without a name,
  // and nothing in the suite was looking: `below lg the five phases are pill
  // anchors to real ids` counts the pills and never asks what the <nav> is
  // called. So the name is asserted through the accessibility tree, by ROLE
  // and NAME rather than by attribute, in each language, at a width where
  // the strip is the reader's only way into the chapter.
  for (const [route, name] of [
    ["/es", es.home.como.navLabel],
    ["/en", en.home.como.navLabel],
  ] as const) {
    test(`${route}: the strip is a navigation landmark named "${name}"`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 780 });
      await page.goto(route);
      const strip = page
        .locator("#como")
        .getByRole("navigation", { name, exact: true });
      await expect(strip).toBeVisible();
      await expect(strip.getByRole("link")).toHaveCount(5);
    });
  }

  // The desktop twin (v5 T7, found by T8's code review). When the rail died
  // and PhaseNav lost `aria-hidden`, it became the chapter's ONLY control
  // above lg — and the anonymous one: five buttons a screen reader can reach
  // and cannot place, while its mobile twin had been given a name in this
  // very plan. It now carries the SAME key, because they are the same
  // navigation at two widths, and this test is what keeps the two from
  // drifting onto two keys.
  test(`above lg the phase nodes are a navigation landmark named "${es.home.como.navLabel}"`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/es");
    const control = page
      .locator("#como")
      .getByRole("navigation", { name: es.home.como.navLabel, exact: true });
    // exactly ONE: below lg the pill strip carries the same name, and if both
    // branches were ever exposed at once a reader would meet the chapter's
    // navigation twice
    await expect(control).toHaveCount(1);
    await expect(control.getByRole("button")).toHaveCount(5);
  });
});

// ── v5 T2: the silence halves its height and its sentence breaks in two ────

test.describe("the silence speaks in two lines under one heading (v5 T2)", () => {
  // The operator asked for two lines, not two headings: the client's words
  // and then the silence. So the assertion is on ONE level-2 heading whose
  // accessible name is both lines joined by a space, in each language. Two
  // SplitText copies inside one <h2> read "…IA.”Y después…" without the
  // literal space between their blocks, and this is the test that hears it.
  // The AI's greeting over the caret lives INSIDE the decorative answer line,
  // which is aria-hidden on purpose, so it is asserted on the DOM text and
  // the JSON key, never by role: a screen reader is not meant to hear it.
  for (const [route, m] of [
    ["/es", es],
    ["/en", en],
  ] as const) {
    test(`${route}: one h2 named by both lines, and the greeting inside the drawn silence`, async ({
      page,
    }) => {
      await page.goto(route);
      const { linea1, linea2, cursor } = m.home.silencio;
      const heading = page.getByRole("heading", {
        level: 2,
        name: `${linea1} ${linea2}`,
        exact: true,
      });
      await expect(heading).toBeVisible();
      await expect(heading.locator("h2, [role=heading]")).toHaveCount(0);

      const greeting = page
        .locator('main [aria-hidden="true"]')
        .getByText(cursor, { exact: true });
      await expect(greeting).toBeVisible();
    });
  }
});

test.describe("the silence stands half a screen tall (v5 T2)", () => {
  // E3c built the section as one full screen under the fixed nav and nothing
  // ever measured that height; the operator halved it. Pinned as a band, not
  // a pixel: between 40% and 60% of the viewport at a desktop and a phone
  // size, so a later change of padding does not fail it but a return to full
  // height (or a collapse to content height) does.
  for (const [width, height] of [
    [1280, 900],
    [360, 780],
  ] as const) {
    test(`${width}x${height}: the section is between 40% and 60% of the viewport`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/es");
      const heading = page.getByRole("heading", {
        level: 2,
        name: `${es.home.silencio.linea1} ${es.home.silencio.linea2}`,
        exact: true,
      });
      const section = page.locator("main > section", { has: heading });
      const box = await section.boundingBox();
      expect(box).not.toBeNull();
      const ratio = box!.height / height;
      expect(ratio, `section height ${box!.height}px of ${height}px`).toBeGreaterThan(0.4);
      expect(ratio, `section height ${box!.height}px of ${height}px`).toBeLessThan(0.6);
    });
  }
});

test.describe("the long rectangles grow without moving the page (v5 T4)", () => {
  // The whole T4 design rests on one invariant: the thing that grows is a
  // surface layer, so the anchor's box in flow never changes and nothing
  // below the section moves when a pointer crosses a card. A growth built
  // with `height` — or with `grid-template-rows`, which is the same layout
  // change wearing a different name — passes every other test in this file
  // while reflowing the document from here down on every hover.
  //
  // Measured, not asserted loosely: the surface must actually GROW (or this
  // would pass against a card that stopped growing at all), the anchor must
  // NOT, and the document height must be the same number before and after.
  //
  // HARNESS, paid twice. Written first with `scrollIntoViewIfNeeded()` and a
  // fixed wait, this pair failed about one run in three under a loaded dev
  // server, two different ways and neither of them the page's fault:
  //
  //   1. `Element is not attached to the DOM` — hydration replaces the card's
  //      subtree while the action holds a handle to it. So the scroll is done
  //      by evaluating `window.scrollTo`, which holds no handle at all.
  //   2. `surface 228.50 -> 228.80px` — a 0.3 px jitter, which is a hover
  //      that never landed: Lenis is still animating the scroll and the card
  //      slides out from under the pointer. So the scroll is waited out until
  //      the card STOPS MOVING, rather than for a guessed number of
  //      milliseconds, and the growth is polled for rather than slept on.
  //
  // Neither fix loosens an assertion. A hover that genuinely fails still
  // times out and still fails.
  /** Put the pointer on the card and PROVE it landed.
   *
   * `card.hover()` is not enough here and the reason is Lenis. Playwright's
   * hover scrolls the element into view and then dispatches the move at the
   * coordinates it read before that scroll; Lenis animates the page with a
   * transform over the following frames, so the point it aims at is not the
   * point the card ends up under. Measured against `npm run dev` at 1280:
   * after `hover()` the anchor reported `matches(":hover") === false` and the
   * surface had not moved, while the SAME test under `reducedMotion: "reduce"`
   * — where the Lenis provider does not exist — landed every time. The
   * failure looks exactly like a broken component and is not one.
   *
   * So: read the box, move the mouse to its centre, ask the DOM whether the
   * anchor is hovered, and repeat until it says yes. Nothing is assumed and
   * nothing is slept on; if the pointer genuinely cannot land, this throws. */
  async function hoverCard(
    page: import("@playwright/test").Page,
    card: import("@playwright/test").Locator,
  ) {
    await expect
      .poll(
        async () => {
          const box = await card.boundingBox();
          if (!box) return false;
          // Leave and re-enter, in steps. Chromium ignores a move to the
          // coordinates the pointer is already at, so a poll that keeps
          // re-aiming at the same centre never re-evaluates `:hover` and
          // spins until it times out — which is how this helper failed
          // before, under reduced motion too, where Lenis is not even
          // running. The corner move guarantees a real transition and the
          // steps generate the intermediate moves a hover needs.
          await page.mouse.move(1, 1);
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
            steps: 6,
          });
          await page.waitForTimeout(80);
          return card.evaluate((el) => el.matches(":hover"));
        },
        { timeout: 10_000, message: "the pointer must actually land on the card" },
      )
      .toBe(true);
  }

  async function settleOnCard(page: import("@playwright/test").Page) {
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const s = document.getElementById("hacemos");
      if (s) {
        window.scrollTo({
          top: s.getBoundingClientRect().top + window.scrollY - 120,
          behavior: "instant",
        });
      }
    });
    // stop when two consecutive samples agree: Lenis has finished
    await page.waitForFunction(
      () => {
        const el = document.querySelector("#hacemos a");
        if (!el) return false;
        const y = el.getBoundingClientRect().top;
        const w = window as unknown as { __lastY?: number };
        const prev = w.__lastY;
        w.__lastY = y;
        return prev !== undefined && Math.abs(prev - y) < 0.5;
      },
      undefined,
      { timeout: 15_000, polling: 120 },
    );
  }

  for (const width of [1280, 360] as const) {
    test(`${width}px: the surface grows, the box and the page do not`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/es");
      await settleOnCard(page);

      const card = page.locator("#hacemos a").first();
      const surface = card.locator("span[aria-hidden]").first();
      const section = page.locator("#hacemos");
      const sectionBefore = (await section.boundingBox())!.height;
      const boxBefore = (await card.boundingBox())!.height;
      const surfaceBefore = (await surface.boundingBox())!.height;

      await hoverCard(page, card);
      // wait for the growth itself, not for a guessed duration
      await expect
        .poll(async () => (await surface.boundingBox())!.height, {
          timeout: 8_000,
          message: `the rectangle must visibly grow from ${surfaceBefore}px`,
        })
        .toBeGreaterThan(surfaceBefore + 8);

      const boxAfter = (await card.boundingBox())!.height;
      const sectionAfter = (await section.boundingBox())!.height;
      // toBeCloseTo, not toBe: two reads of the same unchanged box differ in
      // the eighth decimal (131.98440551757812 vs 131.984375 was one real
      // failure), and the defect this guards against is a growth of TENS of
      // pixels. Half a pixel is the right side of that line by a wide margin.
      expect(
        boxAfter,
        "the anchor's box in flow must not change",
      ).toBeCloseTo(boxBefore, 0);
      // The SECTION, not the document. Written first against
      // documentElement.scrollHeight, this failed about one run in three
      // with the page 110 px taller than a moment earlier — and not because
      // of the hover: ScrollTrigger re-measures the pinned chapter's spacer
      // after fonts and images settle, and that number moves on its own,
      // whatever the pointer is doing. `#hacemos` is where the invariant
      // actually lives: a card that grew by layout grows its section, and
      // anything resizing further down the page cannot touch it.
      expect(
        sectionAfter,
        "the section must not reflow on hover",
      ).toBeCloseTo(sectionBefore, 0);
    });
  }

  test.describe("under reduced motion", () => {
    test("the rectangle does not grow at all", async ({ page }) => {
      // Honoured by NOT RUNNING: the growth lives behind `motion-safe:`, so
      // under `reduce` the rule does not exist and the rectangle keeps the
      // geometry the server sent. There is no second, still code path to
      // keep in sync — which is the whole reason the house spells it this
      // way rather than with a `motion-reduce:` override.
      //
      // The hover is FORCED through CDP rather than driven with the mouse,
      // and that is a deliberate split. The two tests above use a real
      // pointer because what they check is the real thing a reader does; the
      // claim HERE is about a CSS media query, and driving it with a pointer
      // made it the only flaky test in the suite — it failed five runs in
      // eighteen on nothing but pointer delivery, while the two real-pointer
      // tests beside it passed twelve of twelve. `CSS.forcePseudoState` puts
      // the element in `:hover` with no mouse, no Lenis and no event
      // coalescing, so what is left to fail is the assertion.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/es");
      await settleOnCard(page);

      const card = page.locator("#hacemos a").first();
      const surface = card.locator("span[aria-hidden]").first();
      const read = () =>
        surface.evaluate((el) => ({
          border: getComputedStyle(el).borderTopColor,
          height: el.getBoundingClientRect().height,
        }));

      const before = await read();

      const client = await page.context().newCDPSession(page);
      await client.send("DOM.enable");
      await client.send("CSS.enable");
      const { root } = await client.send("DOM.getDocument");
      const { nodeId } = await client.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector: "#hacemos a",
      });
      await client.send("CSS.forcePseudoState", {
        nodeId,
        forcedPseudoClasses: ["hover"],
      });

      // The border is what keeps this from being vacuous: if the hover never
      // took, nothing would grow either and the test would pass for the wrong
      // reason forever. Under `reduce` the border is the card's ONLY answer
      // to a pointer, so it has to move before the unchanged height means
      // anything.
      await expect
        .poll(async () => (await read()).border, {
          timeout: 8_000,
          message: "the hover must take, and the border must answer it",
        })
        .not.toBe(before.border);

      const after = await read();
      expect(
        after.height,
        `surface ${before.height} -> ${after.height}px under reduce`,
      ).toBeCloseTo(before.height, 0);
    });
  });
});
