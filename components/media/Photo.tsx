import Image from "next/image";
import { PHOTOS, type PhotoSlug } from "@/lib/photos.generated";
import { cn } from "@/lib/utils";

/**
 * A site photo (landing v2 §8, built in tanda C / C7). Addressed by slug from
 * `lib/photos.generated.ts`, which `scripts/optimize-photos.mjs` writes.
 *
 * Three rules the design fixed and this component enforces:
 *  - `sizes` is REQUIRED. Without it next/image serves the widest candidate to
 *    a 320 px phone, which is how an image pipeline ends up slower than no
 *    pipeline at all.
 *  - `loading="lazy"` by default. Until v5 T3 the rule was "never `priority`",
 *    because no photo was ever in a hero (HQA-D31, HQA-D41, HQA-D90) and so no
 *    photo was ever the LCP element. The operator reopened all three on
 *    2026-09-04 (plan v5 D-1, salida A; ledger row of the same day): the
 *    house hero now carries the `hero` slug full-bleed, and that one photo is
 *    the page's LCP candidate, so it passes `priority` and skips `lazy`.
 *  - A veil over every photo. The site's ground is Obsidian in one mode and
 *    Marfil in the other, and a full-colour photograph dropped on either one
 *    reads as a sticker. `--veil` follows the theme, so one component serves
 *    both.
 */
export function Photo({
  slug,
  locale,
  sizes,
  className,
  imgClassName,
  veil = true,
  priority = false,
}: {
  slug: PhotoSlug;
  /** "es" | "en" — picks the alt text written in the manifest */
  locale: string;
  /** required: the rendered width at each breakpoint, e.g. "(min-width:1024px) 40vw, 100vw" */
  sizes: string;
  className?: string;
  imgClassName?: string;
  veil?: boolean;
  /**
   * For a photo that is genuinely above the fold: a `<link rel="preload">`
   * in the head and `fetchpriority="high"` on the <img> and on that link
   * (mapped onto next/image's `preload` + `fetchPriority`; its `priority`
   * prop is deprecated since Next 16 and never set fetchpriority). One
   * caller passes it today, the house hero (v5 T3, reopening HQA-D31/D41/
   * D90). Anything below the fold stays lazy: a second preloaded image
   * competes with the first for bandwidth and the LCP loses.
   */
  priority?: boolean;
}) {
  const photo = PHOTOS[slug];
  const alt = locale === "en" ? photo.altEn : photo.altEs;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={photo.src}
        alt={alt}
        fill
        sizes={sizes}
        quality={75}
        placeholder="blur"
        blurDataURL={photo.blurDataURL}
        loading={priority ? undefined : "lazy"}
        // Next 16 deprecated next/image's own `priority` in favour of
        // `preload`, and neither writes fetchpriority on the <img>: the
        // browser hint has to be passed explicitly, and next/image copies it
        // onto the <link rel="preload"> it inserts, which is where it counts.
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        className={cn("object-cover", imgClassName)}
      />
      {veil && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: "var(--veil)" }}
        />
      )}
    </div>
  );
}
