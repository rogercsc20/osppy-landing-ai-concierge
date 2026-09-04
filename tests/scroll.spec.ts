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
    // Wait until GSAP has WRITTEN the bar's transform (a matrix), not a fixed
    // delay: under suite contention the fromTo can land seconds after
    // networkidle, and reading before it exists yields NaN. No false pass
    // hides here — with registration broken the tween plays immediately and
    // the matrix reads 1, which the toBeLessThan(0.1) below still catches.
    await page.waitForFunction(
      () => {
        const bar = document.querySelector(".fixed.inset-x-0.top-0");
        return bar && getComputedStyle(bar).transform.startsWith("matrix");
      },
      undefined,
      { timeout: 15_000 },
    );

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
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await page.waitForTimeout(700);
    expect(await scaleX(), "full at the bottom").toBeGreaterThan(0.9);
  });

  test("the pinned chapter walks all five phases", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/es", { waitUntil: "networkidle" });
    // Wait for the spacer ELEMENT, not a fixed delay: hydration + useGSAP +
    // matchMedia + ScrollTrigger.create can take several seconds when the
    // whole suite shares the dev server, and a timer that guesses wrong
    // reads null and fails a working page.
    await page.waitForSelector(".pin-spacer", {
      state: "attached",
      timeout: 15_000,
    });

    // The trigger's range is NOT the spacer's box: ScrollTrigger sizes the
    // spacer as pinDistance + the pinned element's own height, so scrolling
    // by fractions of the spacer overshoots the range and can skip a phase
    // on a page that works — which is exactly how this test first failed.
    // The scrollable distance is spacer − pinned child.
    // Read the band FRESH every time it is needed, and settle it before the
    // first read. Computing it once at the top is what made this test flaky
    // in roughly half of full-suite runs while passing every time in
    // isolation: `.pin-spacer` attaches as soon as ScrollTrigger creates it,
    // but fonts, the deferred panel and the entrance tweens keep changing
    // layout for a while afterwards, so a band measured at that instant puts
    // the five sample points off the phase centres and one phase is never
    // read. The symptom was a page that works reporting four of five.
    const readBand = () =>
      page.evaluate(() => {
        const s = document.querySelector(".pin-spacer");
        if (!s) return null;
        const r = s.getBoundingClientRect();
        const pinned = s.firstElementChild as HTMLElement | null;
        const pinnedH = pinned ? pinned.getBoundingClientRect().height : 0;
        return {
          top: r.top + window.scrollY,
          height: r.height,
          distance: r.height - pinnedH,
        };
      });

    let band = await readBand();
    for (let tries = 0; tries < 20; tries++) {
      await page.waitForTimeout(150);
      const again = await readBand();
      if (
        band &&
        again &&
        Math.abs(again.top - band.top) < 2 &&
        Math.abs(again.distance - band.distance) < 2
      ) {
        band = again;
        break;
      }
      band = again;
    }
    expect(
      band,
      "ScrollTrigger pinned the chapter and inserted its spacer",
    ).not.toBeNull();

    // The defect this pins: `+=Nvh` read as N PIXELS, so the band was one
    // element tall and the chapter never left step one. Five phases at
    // stepVh=60 is 300% of a 900px viewport, so the band has to be well
    // over 2000px of scroll.
    expect(
      band!.height,
      "the pin band is percent-of-viewport, not pixels",
    ).toBeGreaterThan(2000);

    // Read the RAIL's lit label inside the PIN SPACER, for two reasons. The
    // first h3 of #como belongs to the lg:hidden stacked branch, whose first
    // heading never changes — reading that one passes on a broken chapter.
    // And the step BODY is managed by AnimatePresence mode="wait", which
    // unmounts the old heading before mounting the new one, so any read on a
    // timer can land in the gap; the rail is a pure class swap with no gap.
    // Wait for the scroll to LAND at each sample rather than sampling on a
    // timer — under full-suite parallelism Lenis needs longer than a guess.
    const litLabel = () =>
      page.evaluate(
        () =>
          document
            .querySelector('.pin-spacer [aria-current="step"]')
            ?.textContent?.trim() ?? "",
      );
    // Sample the CENTRE of each phase's band, which is the same arithmetic
    // goTo uses. An evenly spaced sweep lands on the boundaries between
    // phases, where a sub-pixel difference decides which side you read, and
    // a phase can be missed on a page that works.
    const titles = new Set<string>();
    for (let i = 0; i < 5; i++) {
      const f = (i + 0.5) / 5;
      // Re-read rather than reuse: scrolling itself can settle layout, so the
      // band that was right for phase 1 need not still be right for phase 4.
      const current = (await readBand()) ?? band!;
      const y = current.top + f * current.distance;
      await page.evaluate(
        (t) => window.scrollTo({ top: t, behavior: "instant" }),
        y,
      );
      // Land, then settle: Lenis keeps interpolating after window.scrollTo,
      // so a read taken the moment scrollY first matches can catch the page
      // still drifting into the NEXT phase. Poll until both the position
      // and the lit label hold still across two consecutive reads.
      await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 2, y, {
        timeout: 5_000,
      });
      let prev = "";
      let t = "";
      for (let tries = 0; tries < 20; tries++) {
        await page.waitForTimeout(150);
        t = await litLabel();
        if (t && t === prev) break;
        prev = t;
      }
      if (t) titles.add(t);
    }
    expect(titles.size, `every phase showed: ${[...titles].join(" · ")}`).toBe(
      5,
    );
  });

  test("clicking the third phase in the bar scrolls the chapter there", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/es", { waitUntil: "networkidle" });
    await page.waitForSelector(".pin-spacer", {
      state: "attached",
      timeout: 15_000,
    });

    // enter the chapter so the rail is on screen and the trigger is active
    const top = await page.evaluate(() => {
      const s = document.querySelector(".pin-spacer");
      return s!.getBoundingClientRect().top + window.scrollY;
    });
    await page.evaluate(
      (t) => window.scrollTo({ top: t, behavior: "instant" }),
      top,
    );
    await page.waitForTimeout(400);

    await page.locator(".pin-spacer ol button").nth(2).click();
    // the click SCROLLS (a plain setStep would be overwritten next frame),
    // so the assertion is on where aria-current lands once the page settles
    await page.waitForFunction(
      () => {
        const lit = document.querySelector('.pin-spacer [aria-current="step"]');
        const items = [...document.querySelectorAll(".pin-spacer ol button")];
        return lit !== null && items.indexOf(lit as HTMLButtonElement) === 2;
      },
      undefined,
      { timeout: 10_000 },
    );
  });

  test("below lg the five phases are pill anchors to real ids", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/es", { waitUntil: "networkidle" });

    const pills = page.locator('#como nav a[href^="#como-p"]');
    await expect(pills).toHaveCount(5);
    for (let i = 1; i <= 5; i++) {
      // every pill points at an id that EXISTS in the stacked branch — a
      // renamed id would leave a pill jumping nowhere, silently
      await expect(page.locator(`#como nav a[href="#como-p${i}"]`)).toHaveCount(
        1,
      );
      await expect(page.locator(`#como-p${i}`)).toHaveCount(1);
    }
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
            (e) =>
              (e.textContent ?? "").trim().length > 12 &&
              getComputedStyle(e).opacity === "0",
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
      await page.evaluate(
        () => document.querySelectorAll(".pin-spacer").length,
      ),
      "no chapter pins under reduced motion",
    ).toBe(0);

    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    for (let y = 0; y < height; y += 900) {
      await page.evaluate(
        (t) => window.scrollTo({ top: t, behavior: "instant" }),
        y,
      );
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(800);
    expect(await hidden(), "nothing hidden after a full walk").toBe(0);

    await context.close();
  });
});
