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
  // The demonstration-data chip is the truth label of section 2's one moving
  // object (source of truth §9/§10): a mock never presents itself as a
  // client screenshot. The panel body is behind the repo's first
  // next/dynamic boundary with ssr:false, so the assertion waits for the
  // chunk — and thereby also proves the boundary actually loads.
  for (const [route, label] of [
    ["/es", "Datos de demostración"],
    ["/en", "Demonstration data"],
  ] as const) {
    test(`${route}: the demo-data chip is present and says «${label}»`, async ({
      page,
    }) => {
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

test("the hero has no button, only the scroll indicator (decision 2)", async ({
  page,
}) => {
  await page.goto("/es");
  const hero = page.locator("section").first();
  // The operator closed this one: "no boton en el heroe". Asserting the
  // ABSENCE of contact links rather than a link count, because the scroll
  // indicator is itself a link and a count would pass with a CTA swapped in
  // for it.
  await expect(
    hero.locator('a[href^="mailto:"], a[href^="https://wa.me/"]'),
  ).toHaveCount(0);
  await expect(hero.locator('a[href="#aplicada"]')).toHaveCount(1);
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
});
