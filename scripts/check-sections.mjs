// check-sections.mjs — the "no hard-cut glows" rule of landing v2 (slice V2;
// wired into `npm run check` in slice V3, once the sections comply).
//
// The page's atmosphere is one fixed layer under every section; a <section>
// therefore never paints its own band or clips its decoration. This script
// walks app/**/*.tsx and components/**/*.tsx, finds every `<section` opening
// tag and fails on any of these classes in its className:
//   overflow-hidden · bg-bg · bg-bg-alt · min-h-screen
// Clipping belongs to framed objects (phones, windows, cards, buttons, text
// masks), never to a section. Exit 1 when a violation exists.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOTS = ["app", "components"];
const FORBIDDEN = ["overflow-hidden", "bg-bg", "bg-bg-alt", "min-h-screen"];

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

let violations = 0;
for (const dir of ROOTS) {
  // Blank-canvas guard (2026-09-05): the site was cleared to nothing, and this
// gate has no input until the new one has components/. Exiting 0 with a word rather
// than a stack trace — the gate is wired and starts biting the moment the
// content exists.
if (!existsSync(join(root, "components"))) {
  console.log("— secciones: no hay components/ todavía, nada que revisar");
  process.exit(0);
}

for (const file of tsxFiles(join(root, dir))) {
    const src = readFileSync(file, "utf8");
    const re = /<section\b/g;
    let m;
    while ((m = re.exec(src))) {
      const tag = openingTag(src, m.index);
      const line = src.slice(0, m.index).split("\n").length;
      // every string literal inside the tag counts as class text
      const literals = [...tag.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)].map((x) => x[1] ?? x[2] ?? x[3] ?? "");
      const classes = literals.join(" ").split(/\s+/);
      const bad = FORBIDDEN.filter((f) => classes.includes(f));
      if (bad.length) {
        console.log(`FALLA  ${relative(root, file)}:${line}: <section> con ${bad.map((b) => `«${b}»`).join(", ")}`);
        violations++;
      }
    }
  }
}

console.log(violations === 0 ? "OK secciones sin banda ni recorte" : `${violations} secciones con banda o recorte`);
if (violations > 0) process.exit(1);
