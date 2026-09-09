// lighthouse.mjs — mobile Lighthouse for the key routes (landing v2, V2/V9).
//
// Runs `npx lighthouse` (downloaded on demand; needs network the first time)
// against a running production server (`npm run build && npm run start`),
// performance + accessibility only, mobile emulation (Lighthouse's default),
// and writes captures/lh/<slug>.json. Prints the two scores per route and
// exits 1 when any is below the target (90) unless --no-fail is passed.
//
//   node scripts/lighthouse.mjs [--base http://localhost:3000] [--routes /es,/es/hoteles] [--target 90] [--no-fail]
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const BASE = arg("base", "http://localhost:3000");
// v6 routes (2026-09-08, FASE 4): the v5 defaults pointed at deleted pages.
const ROUTES = arg("routes", "/es,/en,/es/estrategia,/es/industrias/manufactura").split(",");
const TARGET = Number(arg("target", "90"));
const NO_FAIL = process.argv.includes("--no-fail");
const OUT = join("captures", "lh");
mkdirSync(OUT, { recursive: true });

let below = 0;
for (const route of ROUTES) {
  const slug = route.replace(/^\//, "").replace(/\//g, "-") || "root";
  const out = join(OUT, `${slug}.json`);
  const r = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse",
      `${BASE}${route}`,
      "--only-categories=performance,accessibility",
      "--output=json",
      `--output-path=${out}`,
      "--quiet",
      '--chrome-flags=--headless=new --no-sandbox',
    ],
    { stdio: ["ignore", "inherit", "inherit"] },
  );
  if (r.status !== 0) {
    console.log(`✗ ${route}: lighthouse salió con ${r.status}`);
    below++;
    continue;
  }
  const json = JSON.parse(readFileSync(out, "utf8"));
  const perf = Math.round(json.categories.performance.score * 100);
  const a11y = Math.round(json.categories.accessibility.score * 100);
  const ok = perf >= TARGET && a11y >= TARGET;
  if (!ok) below++;
  console.log(`${ok ? "✓" : "✗"} ${route}: rendimiento ${perf} · accesibilidad ${a11y} (meta ${TARGET}) → ${out}`);
}
if (below && !NO_FAIL) process.exit(1);
