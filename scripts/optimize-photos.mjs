// optimize-photos.mjs — the photo pipeline of landing v2 §8, built in tanda C.
//
// Reads scripts/photos.manifest.json and, for every row, takes the ORIGINAL
// from --src (default ~/Desktop/osppy-fotos, outside the repo — the 26 files
// weigh 91 MB and none of them belongs in git) and writes:
//
//   public/photos/<slug>.webp      long edge 3200, quality 82
//   lib/photos.generated.ts        slug -> { src, width, height, blurDataURL, altEs, altEn }
//
// One size per photo on purpose: next/image derives the rest, and AVIF on
// Vercel. 1600 was sized as twice the widest box a photo was rendered in
// (the areas frame is ~600 CSS px), so a 2400 master would be bytes nobody
// downloads and megabytes everybody clones. That reasoning died on
// 2026-09-08, when the v6 began showing most photographs full-bleed
// (HQA-D151, D152, D155): a full-bleed photo at 1440 CSS px on a
// double-density screen needs 2880 REAL pixels, so 1600 handed the screen
// half the resolution it asked for, and five area photos were still at that
// ceiling. What the operator saw as softness was that, plus a second
// compression: this file wrote WebP at 78 and Vercel re-encoded it to AVIF
// at the quality the page asks for, which was the default 75.
//
// Since HQA-D168 (2026-09-08) the ceiling is 3200 and the quality 82, and
// the pages that show a photo large ask the optimizer for 90 (the
// `qualities` list in next.config.ts, and `quality={90}` in `Photo`,
// `areas-hover` and `industrias-carrusel`). Measured on the welcome photo:
// 141 kB at 2400/78, 242 kB at 2400/88, 276 kB at 3200/82, 417 kB at
// 3200/88. The per-row `ladoLargo` stays as the mechanism for an exception,
// but no row carries it any more: the fourteen that held 2400 would now be
// capped BELOW the ceiling instead of above it. Three originals do not
// reach 3200 and `withoutEnlargement` leaves them at their native size.
//
// FASE 4 pruning: `hero`, the v5 mountaineer generated with a model, left
// the manifest and public/photos; no model-generated image enters this
// pipeline (foundation §9, HQA-D137).
//
// The blur placeholder is a 16 px WebP inlined as a data URI — the same
// trick next/image's static import does, done by hand because these images
// are addressed by slug at runtime, not imported.
//
// NO CREDITS FILE. The Unsplash and Pexels licenses both ASK for attribution
// and neither REQUIRES it; the operator ruled on 2026-09-03 that the site
// carries none (HQA-D78). Author and photo id stay in the manifest's `file`,
// which is where traceability belongs.
//
//   node scripts/optimize-photos.mjs [--src <dir>] [--only <slug,slug>]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const SRC = resolve(arg("src", join(homedir(), "Desktop", "osppy-fotos")));
const ONLY = arg("only", null)?.split(",");
const OUT = join(root, "public", "photos");
const LONG_EDGE = 3200;
const QUALITY = 82;

const manifest = JSON.parse(readFileSync(join(here, "photos.manifest.json"), "utf8"));
const rows = manifest.photos.filter((r) => !ONLY || ONLY.includes(r.slug));

if (!existsSync(SRC)) {
  console.error(
    `no encuentro los originales en\n  ${SRC}\n` +
      "pásame la carpeta con --src. Los originales viven FUERA del repo a propósito.",
  );
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const generated = [];
let total = 0;

for (const row of rows) {
  const from = join(SRC, row.file);
  if (!existsSync(from)) {
    console.error(`✗ ${row.slug}: falta el original ${row.file}`);
    process.exit(1);
  }

  // A row may still ask for its own long edge (`ladoLargo`). No row does since
  // HQA-D168 raised the default to 3200: a row asking for less would now cap
  // the photograph from below. The field stays for the exception to come.
  const longEdge = row.ladoLargo ?? LONG_EDGE;
  const pipeline = sharp(from).rotate().resize({
    width: longEdge,
    height: longEdge,
    fit: "inside",
    withoutEnlargement: true,
  });
  const { data, info } = await pipeline
    .webp({ quality: QUALITY })
    .toBuffer({ resolveWithObject: true });
  writeFileSync(join(OUT, `${row.slug}.webp`), data);

  const blur = await sharp(from)
    .rotate()
    .resize({ width: 16 })
    .webp({ quality: 40 })
    .toBuffer();

  generated.push({
    slug: row.slug,
    src: `/photos/${row.slug}.webp`,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    altEs: row.altEs,
    altEn: row.altEn,
  });

  total += data.length;
  console.log(
    `✓ ${row.slug.padEnd(20)} ${info.width}x${info.height}  ${(data.length / 1024).toFixed(0)} kB`,
  );
}

const ts = `// GENERATED by scripts/optimize-photos.mjs — do not edit by hand.
// Source rows: scripts/photos.manifest.json. Originals live outside the repo.
export type SitePhoto = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  altEs: string;
  altEn: string;
};

export const PHOTOS = {
${generated
  .map(
    (p) => `  "${p.slug}": {
    src: "${p.src}",
    width: ${p.width},
    height: ${p.height},
    blurDataURL:
      "${p.blurDataURL}",
    altEs: ${JSON.stringify(p.altEs)},
    altEn: ${JSON.stringify(p.altEn)},
  },`,
  )
  .join("\n")}
} as const satisfies Record<string, SitePhoto>;

export type PhotoSlug = keyof typeof PHOTOS;
`;

writeFileSync(join(root, "lib", "photos.generated.ts"), ts);
console.log(
  `\n${generated.length} fotos · ${(total / 1024 / 1024).toFixed(1)} MB en public/photos · lib/photos.generated.ts reescrito`,
);
