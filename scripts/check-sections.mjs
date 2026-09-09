// check-sections.mjs — the construction rule of the v6 visual system §3.3:
// a <section> never clips and never sets its own height.
//
// DECISION OF 2026-09-08 (FASE 4, prompt de cierre §3 B). What this script
// checked until today was the v2 rule: "the page's atmosphere is one fixed
// layer under every section, so a <section> never paints its own band or
// clips its decoration", forbidding `overflow-hidden`, `bg-bg`, `bg-bg-alt`
// and `min-h-screen`. That rule stopped describing this site when the
// operator decided the bands (HQA-D149, D153, D154): three sections of the
// home and the closing band of the area and industry pages paint their own
// background on purpose, and the `bg-bg` / `bg-bg-alt` tokens no longer
// exist. The gate was not obeyed blindly and was not deleted in silence: it
// is rewritten to the rule that DOES describe this site and that a real
// defect proved (HQA-D159, commit 5236ff3 — the hover photograph panel of
// "Cómo ayudamos" stopped sticking because an `overflow-hidden` ancestor
// turns `position: sticky` off; the fix was to move the crop into its own
// inner layer, which is exactly what this rule forces).
//
// THE RULE. Clipping and height belong to a `div` inside the section, never
// to the `<section>` itself:
//   · no `overflow-hidden` (nor the utilities that clip the same way:
//     overflow-clip, overflow-x/y-hidden) — it kills `position: sticky` for
//     every descendant and crops the watermarks against the wrong box;
//   · no `min-h-*` — the first screen sizes its inner div (components/hero.tsx),
//     so a section keeps the height of what it holds.
// Painting a band on the section is now allowed and is not checked here.
//
// Walks app/**/*.tsx and components/**/*.tsx, reads every `<section` opening
// tag and fails on any of the above in its class text. Exit 1 on a violation.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOTS = ["app", "components"];
const RECORTE = ["overflow-hidden", "overflow-clip", "overflow-x-hidden", "overflow-y-hidden"];

function* tsxFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* tsxFiles(p);
    else if (entry.name.endsWith(".tsx")) yield p;
  }
}

/** The opening tag starting at `from` (`<section…>`), honoring JSX braces. */
function openingTag(src, from) {
  let depth = 0;
  for (let i = from; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === ">" && depth === 0) return src.slice(from, i + 1);
  }
  return src.slice(from);
}

// Blank-canvas guard (2026-09-05): this gate has no input until the site has
// components/. Exiting 0 with a word rather than a stack trace.
if (!existsSync(join(root, "components"))) {
  console.log("— secciones: no hay components/ todavía, nada que revisar");
  process.exit(0);
}

let violations = 0;
for (const dir of ROOTS) {
  for (const file of tsxFiles(join(root, dir))) {
    const src = readFileSync(file, "utf8");
    const re = /<section\b/g;
    let m;
    while ((m = re.exec(src))) {
      const tag = openingTag(src, m.index);
      const line = src.slice(0, m.index).split("\n").length;
      // every string literal inside the tag counts as class text
      const literals = [...tag.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)].map((x) => x[1] ?? x[2] ?? x[3] ?? "");
      const classes = literals.join(" ").split(/\s+/).filter(Boolean);
      const bad = [
        ...classes.filter((c) => RECORTE.includes(c)),
        ...classes.filter((c) => /^min-h-/.test(c)),
      ];
      if (bad.length) {
        console.log(
          `FALLA  ${relative(root, file)}:${line}: <section> con "${bad.join('", "')}" (van en un div adentro, §3.3)`,
        );
        violations++;
      }
    }
  }
}

console.log(
  violations === 0
    ? "OK secciones: ninguna recorta ni fija su altura"
    : `${violations} secciones recortan o fijan su altura`,
);
if (violations > 0) process.exit(1);
