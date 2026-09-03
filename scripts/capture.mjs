// capture.mjs — the responsive capture matrix of landing v2 (slice V2).
//
// Against a running server (default http://localhost:3000; `next start` for
// honest numbers, `next dev` for quick looks) it renders every route × width
// × theme, walks the page so `whileInView` reveals fire (Lenis smooths jumps,
// so the walk pauses per step), then saves a full-page PNG per combination in
// captures/ (gitignored) and captures/report.json with, per combination:
//   overflow   — document.scrollWidth <= window.innerWidth
//   errors     — console errors + page errors (count and first three), minus
//                the Vercel insights script, which 404s off Vercel by design
//   invisible  — with --reduced (prefers-reduced-motion emulated) the number
//                of text-bearing elements still at computed opacity 0 two
//                seconds after load: under reduced motion nothing may hide
// Exit 1 when any combination overflows, logs an error, or hides content.
//
//   node scripts/capture.mjs [--base URL] [--routes /es,/en,…] [--widths 360,768]
//                            [--themes light,dark] [--out captures] [--reduced]
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const BASE = arg("base", "http://localhost:3000");
const ROUTES = arg("routes", "/es,/en,/es/hoteles,/en/hotels,/es/citas,/en/appointments").split(",");
const WIDTHS = arg("widths", "360,390,768,1024,1280,1440,1920").split(",").map(Number);
const THEMES = arg("themes", "light,dark").split(",");
const OUT = arg("out", "captures");
const REDUCED = process.argv.includes("--reduced");
const HEIGHT = 900;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];

for (const theme of THEMES) {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width, height: HEIGHT },
        deviceScaleFactor: 1,
        reducedMotion: REDUCED ? "reduce" : "no-preference",
      });
      await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
      const page = await ctx.newPage();
      const errors = [];
      // @vercel/analytics fetches /_vercel/insights/script.js, which only
      // exists on Vercel: on a local `next start` it 404s on every page. It is
      // the one console error that says nothing about the page, so it is
      // served as an empty script here (aborting logs the same error).
      await ctx.route("**/_vercel/insights/**", (r) =>
        r.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
      );
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(String(e)));

      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(REDUCED ? 2000 : 1200);

      // walk the page so in-view reveals fire, then return to the top
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      if (!REDUCED) {
        for (let y = 0; y <= total; y += Math.round(HEIGHT * 0.55)) {
          await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
          await page.waitForTimeout(380);
        }
        await page.waitForTimeout(1200);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await page.waitForTimeout(600);
      }

      const metrics = await page.evaluate(() => {
        const sw = document.documentElement.scrollWidth;
        const iw = window.innerWidth;
        let invisible = 0;
        for (const el of document.querySelectorAll("main *")) {
          if (!(el instanceof HTMLElement)) continue;
          if (!el.innerText || !el.innerText.trim()) continue;
          if (getComputedStyle(el).opacity === "0") invisible++;
        }
        return { sw, iw, invisible };
      });

      const slug = `${route.replace(/^\//, "").replace(/\//g, "-") || "root"}-${theme}-${width}`;
      await page.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true });

      const row = {
        route,
        theme,
        width,
        height: total,
        overflow: metrics.sw <= metrics.iw,
        scrollWidth: metrics.sw,
        errors: errors.length,
        firstErrors: errors.slice(0, 3),
        invisible: REDUCED ? metrics.invisible : null,
      };
      report.push(row);
      const flag = !row.overflow || row.errors || (REDUCED && row.invisible) ? "✗" : "✓";
      console.log(
        `${flag} ${route} · ${theme} · ${width}px · ${row.overflow ? "sin desborde" : `DESBORDE ${metrics.sw}>${metrics.iw}`} · errores ${row.errors}` +
          (REDUCED ? ` · ocultos ${row.invisible}` : ""),
      );
      await ctx.close();
    }
  }
}

await browser.close();
writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2) + "\n");
const bad = report.filter((r) => !r.overflow || r.errors || (REDUCED && r.invisible));
console.log(`${report.length} capturas · ${bad.length} con problemas · ${OUT}/report.json`);
if (bad.length) process.exit(1);
