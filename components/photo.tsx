import Image from "next/image";
import { PHOTOS, type PhotoSlug } from "@/lib/photos.generated";
import type { Locale } from "@/lib/i18n";

type Props = {
  slug: PhotoSlug;
  locale: Locale;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
};

/**
 * A licensed bank photograph from the manifest, by slug, with its alt text in the page's language.
 *
 * `quality` defaults to 90 and not to Next's 75 because every photograph this
 * wrapper serves is shown large (the welcome, quiénes somos, cómo trabajamos,
 * the hero of an area or industry page, lo que ya opera and hablemos), and the
 * file it re-encodes is already a WebP at 82: two compressions at 75 was what
 * the operator saw as softness (HQA-D168). The value has to be in the
 * `qualities` list of next.config.ts or Next ignores it.
 */
export function Photo({ slug, locale, sizes, className, priority, fill, quality = 90 }: Props) {
  const p = PHOTOS[slug];
  const alt = locale === "en" ? p.altEn : p.altEs;
  if (fill) {
    return (
      <Image
        src={p.src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder="blur"
        blurDataURL={p.blurDataURL}
        className={className}
      />
    );
  }
  return (
    <Image
      src={p.src}
      alt={alt}
      width={p.width}
      height={p.height}
      sizes={sizes}
      quality={quality}
      priority={priority}
      placeholder="blur"
      blurDataURL={p.blurDataURL}
      className={className}
    />
  );
}
