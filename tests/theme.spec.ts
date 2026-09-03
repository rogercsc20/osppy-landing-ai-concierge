import { test, expect } from "@playwright/test";
import es from "../messages/es.json" with { type: "json" };

// Landing v2 (slice V2): the theme toggle is one control for the whole site.
// It flips `data-theme` on <html>, persists in localStorage("theme") and
// survives a reload — on the product page too, which under the old
// `.theme-hotel` object was always dark (superseded, HQA-D38).
test("theme toggle flips data-theme, persists and survives a reload", async ({ page }) => {
  await page.goto("/es/hoteles");
  const html = page.locator("html");
  const before = (await html.getAttribute("data-theme")) ?? "light";
  const after = before === "dark" ? "light" : "dark";
  const label = before === "dark" ? es.theme.toLight : es.theme.toDark;

  await page.getByRole("button", { name: label }).first().click();

  await expect(html).toHaveAttribute("data-theme", after);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(after);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", after);
});
