import { test, expect } from "@playwright/test";

// Landing v2 (slice V2): the responsive floor that CI keeps. The full matrix
// (seven widths, both themes, screenshots) is scripts/capture.mjs; here the
// three widths that break most often, on every localized route, must render
// without horizontal overflow and without a console error.
const ROUTES = [
  "/es",
  "/en",
  "/es/capacitacion",
  "/en/training",
  "/es/asesoria",
  "/en/advisory",
  "/es/implementacion",
  "/en/implementation",
  "/es/hoteles",
  "/en/hotels",
  "/es/citas",
  "/en/appointments",
];
const WIDTHS = [360, 768, 1280];

for (const width of WIDTHS) {
  for (const route of ROUTES) {
    test(`${route} at ${width}px renders without overflow or console errors`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(String(e)));

      await page.goto(route, { waitUntil: "networkidle" });
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      expect(scrollWidth, "horizontal overflow").toBeLessThanOrEqual(innerWidth);
      expect(errors, "console errors").toEqual([]);
    });
  }
}
