import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

// The three content routes × two locales = six URLs, each with its
// localized slug (HQA-D26) and both language alternates.
const PATHS = ["/", "/hoteles", "/citas"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}${getPathname({ locale, href })}`,
      lastModified: new Date(),
      changeFrequency: href === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: href === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}${getPathname({ locale: l, href })}`]),
        ),
      },
    })),
  );
}
