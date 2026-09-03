// check-contrast.mjs — WCAG contrast of the role tokens, both modes and the
// hotel accent override (landing v2, slices V2 and V3).
//
// Reads app/globals.css and builds four palettes: `:root` (light), the first
// `[data-theme="dark"]` block (dark) and, when they exist, the two halves of
// the hotel accent override — `[data-accent="hotel"]` (its light values) and
// `[data-theme="dark"][data-accent="hotel"]` (the values it re-points in dark
// mode, teal and coral). The override is layered on top of each mode, which
// is exactly how the cascade applies it, and then checks these pairs:
//   text / bg · text-2 / bg · text / surface · text-2 / surface
//   accent-text / bg (links) · warm-text / bg (small warm text)      ≥ 4.5:1
//   warm / bg (decorative warm, ≥ 24 px only)                        ≥ 3:1
//   accent foreground / accent (button label; --primary-foreground)  ≥ 4.5:1
// rgba() values are composited over the background first. Exit 1 on any
// failure.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "app", "globals.css"), "utf8");

function block(selector) {
  const i = css.indexOf(selector + " {");
  if (i === -1) return null;
  const start = css.indexOf("{", i);
  let depth = 0;
  for (let j = start; j < css.length; j++) {
    if (css[j] === "{") depth++;
    else if (css[j] === "}" && --depth === 0) return css.slice(start + 1, j);
  }
  return null;
}

function vars(text) {
  const out = {};
  if (!text) return out;
  for (const m of text.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

function parse(value) {
  const v = value.replace(/\/\*.*?\*\//g, "").trim();
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return { r: n >> 16, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  return null;
}

const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const ratio = (fg, bg) => {
  const f = over(fg, bg);
  const [hi, lo] = [lum(f), lum(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

const light = vars(block(":root"));
const dark = vars(block('[data-theme="dark"]'));
// `[data-accent="hotel"]` is a substring of the dark compound selector, so the
// light half is matched at the start of its own line (the leading newline) —
// otherwise a file that declared the compound first would hand back its block.
const hotelDark = vars(block('[data-theme="dark"][data-accent="hotel"]'));
const hotelLight = vars(block('\n[data-accent="hotel"]'));

const modes = { light, dark };
if (Object.keys(hotelLight).length) {
  modes["light+hotel"] = { ...light, ...hotelLight };
  modes["dark+hotel"] = { ...dark, ...hotelLight, ...hotelDark };
}

const PAIRS = [
  ["text", "bg", 4.5],
  ["text-2", "bg", 4.5],
  ["text", "surface", 4.5],
  ["text-2", "surface", 4.5],
  ["accent-text", "bg", 4.5],
  ["warm-text", "bg", 4.5],
  ["warm", "bg", 3],
  ["primary-foreground", "accent", 4.5],
];

let fails = 0;
for (const [name, t] of Object.entries(modes)) {
  console.log(`— ${name}`);
  for (const [fgName, bgName, min] of PAIRS) {
    const fg = parse(t[fgName] ?? "");
    const bg = parse(t[bgName] ?? "");
    if (!fg || !bg) {
      console.log(`   ?  ${fgName} / ${bgName}: token ausente o no parseable (${t[fgName] ?? "—"} / ${t[bgName] ?? "—"})`);
      continue;
    }
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) fails++;
    console.log(`   ${ok ? "✓" : "✗"} ${fgName} / ${bgName}: ${r.toFixed(2)}:1 (mín ${min})`);
  }
}
console.log(fails === 0 ? "OK contraste" : `${fails} pares por debajo del mínimo`);
if (fails > 0) process.exit(1);
