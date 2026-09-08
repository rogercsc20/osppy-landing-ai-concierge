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
};

/** A licensed bank photograph from the manifest, by slug, with its alt text in the page's language. */
export function Photo({ slug, locale, sizes, className, priority, fill }: Props) {
  const p = PHOTOS[slug];
  const alt = locale === "en" ? p.altEn : p.altEs;
  if (fill) {
    return (
      <Image
        src={p.src}
        alt={alt}
        fill
        sizes={sizes}
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
      priority={priority}
      placeholder="blur"
      blurDataURL={p.blurDataURL}
      className={className}
    />
  );
}
