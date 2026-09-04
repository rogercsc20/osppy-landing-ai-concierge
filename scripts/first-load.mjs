// first-load.mjs — the first-load JavaScript budget of landing v2 §3
// ("JS de primera carga de la casa ≤ 200 kB gz"), measured instead of assumed.
//
// `npm run build` prints a route table with no size column in Next 16, so the
// budget had no instrument: the number in the plan was never checked against
// the build. This measures the thing the budget is actually about — the bytes
// a first-time reader downloads before the page is interactive — by loading
// the route in a cold context against `next start` and summing the ENCODED
// (over-the-wire, so gzip/brotli) size of every script, snapshotted TWICE:
// at the window load event (the budgeted first load) and again at network
// idle (the total, lazy chunks included). A next/dynamic chunk arrives after
// hydration, so it lands between the two snapshots — which is exactly how
// the D4 rule is verified: if the deferred panel still moves the FIRST
// number, the boundary is not doing its job and the chart leaves the hero.
//
//   node scripts/first-load.mjs [--base URL] [--routes /es,/en] [--budget 200]
//
// Exit 1 when a route is over budget. Prints one line per route so a slice
// can quote the before and after, which is what the D4 dynamic-import rule
// asks for.
import { chromium } from "@playwright/test";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const BASE = arg("base", "http://localhost:3000");
const ROUTES = arg("routes", "/es,/en,/es/hoteles,/es/citas").split(",");
const BUDGET_KB = Number(arg("budget", "200"));

const browser = await chromium.launch();
let over = 0;

for (const route of ROUTES) {
  // A fresh context per route: a warm HTTP cache would report zero bytes for
  // every shared chunk and quietly turn the budget into a no-op.
  const context = await browser.newContext();
  const page = await context.newPage();

  const snapshot = () =>
    page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .filter((r) => r.initiatorType === "script" || /\.js(\?|$)/.test(r.name))
        .reduce(
          (acc, r) => ({
            // encodedBodySize is the compressed payload; decodedBodySize
            // would report the unzipped source and triple every number.
            bytes: acc.bytes + (r.encodedBodySize || 0),
            count: acc.count + 1,
          }),
          { bytes: 0, count: 0 },
        ),
    );

  await page.goto(BASE + route, { waitUntil: "load" });
  const first = await snapshot();
  await page.waitForLoadState("networkidle");
  const total = await snapshot();

  const kb = first.bytes / 1024;
  const totalKb = total.bytes / 1024;
  const bad = kb > BUDGET_KB;
  if (bad) over++;
  console.log(
    `${bad ? "FALLA " : "  ok  "} ${route.padEnd(16)} primera carga ${kb.toFixed(1).padStart(7)} kB en ${String(first.count).padStart(3)} archivos · con diferidos ${totalKb.toFixed(1).padStart(7)} kB en ${String(total.count).padStart(3)}  (presupuesto ${BUDGET_KB} kB sobre la primera)`,
  );
  await context.close();
}

await browser.close();
console.log(over > 0 ? `${over} rutas sobre presupuesto` : "OK primera carga");
if (over > 0) process.exit(1);
