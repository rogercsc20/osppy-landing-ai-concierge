import { test, expect } from "@playwright/test";

/* The scroll engine (HQA-D80): every scroll-driven effect on the site runs on
 * GSAP ScrollTrigger. These tests exist because the two defects that shipped
 * during the port were BOTH invisible to `tsc`, `npm run lint`, `npm run
 * build` and the thirty tests that already existed — an unregistered
 * ScrollTrigger makes `gsap.to({ scrollTrigger })` silently drop the key and
 * play the tween at once, and `end: "+=288vh"` parses as 288 pixels. Neither
 * throws. Only a browser looking at the result can tell.
 *
 * So each test here asserts an observable that DIFFERS between the working
 * and the broken version, not merely that the page rendered. */

test.describe("scroll engine", () => {
  test("the progress bar starts empty and fills — it is scrubbed, not played", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/es", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    // scaleX lives in the computed transform matrix's first component.
    const scaleX = () =>
      page.evaluate(() => {
        const bar = document.querySelector(".fixed.inset-x-0.top-0");
        const m = getComputedStyle(bar!).transform.match(/matrix\(([-\d.]+)/);
        return m ? Number(m[1]) : NaN;
      });

    // The defect: with the plugin unregistered the tween ran on mount and the
    // bar sat at 1 from the first paint. `toBeLessThan(0.1)` is the assertion
    // that would have caught it; a truthiness check would not have.
    expect(await scaleX(), "empty at the top of the page").toBeLessThan(0.1);

    await page.evaluate(() =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
    );
    await page.waitForTimeout(700);
    expect(await scaleX(), "full at the bottom").toBeGreaterThan(0.9);
  });

  test("the pinned chapter walks all four steps", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/es", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    const band = await page.evaluate(() => {
      const s = document.querySelector(".pin-spacer");
      if (!s) return null;
      const r = s.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    });
    expect(band, "ScrollTrigger pinned the chapter and inserted its spacer").not.toBeNull();

    // The defect: `+=288vh` read as 288px, so the band was one element tall
    // and the chapter never left step one. Four steps at stepVh=72 is 288% of
    // a 900px viewport, so the band has to be well over 2000px of scroll.
    expect(band!.height, "the pin band is percent-of-viewport, not pixels").toBeGreaterThan(2000);

    // The step title inside the PIN SPACER, not the first h3 of #como: the
    // lg:hidden stacked branch renders every step in order and its first
    // heading never changes, so reading that one passes on a broken chapter.
    // Wait for the scroll to LAND at each sample instead of sampling on a
    // timer: under full-suite parallelism Lenis and React need longer than a
    // fixed wait, and a sample taken mid-flight reads the previous step —
    // the test flaked exactly that way against the dev server.
    const titles = new Set<string>();
    for (let f = 0; f <= 1.0001; f += 0.1) {
      const y = band!.top + f * band!.height;
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
      await page.waitForFunction(
        (t) => Math.abs(window.scrollY - t) < 2,
        y,
        { timeout: 5_000 },
      );
      await page.waitForTimeout(350); // one React commit for the step state
      const t = await page.evaluate(
        () => document.querySelector(".pin-spacer h3")?.textContent?.trim() ?? "",
      );
      if (t) titles.add(t);
    }
    expect(titles.size, `every step showed: ${[...titles].join(" · ")}`).toBe(4);
  });

  test("under reduced motion nothing is ever left hidden, and nothing pins", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto("/es", { waitUntil: "networkidle" });

    const hidden = () =>
      page.evaluate(
        () =>
          [...document.querySelectorAll("main *")].filter(
            (e) => (e.textContent ?? "").trim().length > 12 && getComputedStyle(e).opacity === "0",
          ).length,
      );

    // At REST, before any scrolling: gsap.matchMedia never runs the setup for
    // a reader who asked for less motion, so no `from` state is ever written.
    // This is the property the whole reduced-motion design rests on, and it
    // is stronger than "visible by the end" — that one passes even if the
    // element was hidden for two seconds first.
    await page.waitForTimeout(2000);
    expect(await hidden(), "nothing hidden at rest").toBe(0);

    expect(
      await page.evaluate(() => document.querySelectorAll(".pin-spacer").length),
      "no chapter pins under reduced motion",
    ).toBe(0);

    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 900) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(800);
    expect(await hidden(), "nothing hidden after a full walk").toBe(0);

    await context.close();
  });
});
