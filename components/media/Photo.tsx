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
 *  - `loading="lazy"` always, and never `priority`. **No photo is ever in a
 *    hero** (HQA-D31), so no photo is ever the LCP element.
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
   * Escape hatch for a photo that is genuinely above the fold. It is NOT for
   * heroes (HQA-D31) and nothing in the house passes it today.
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
        priority={priority}
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
