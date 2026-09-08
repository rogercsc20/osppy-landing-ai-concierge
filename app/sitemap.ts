import type { MetadataRoute } from "next";
import { LOCALES, SITE_URL, getMessages } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}`,
    lastModified: new Date("2026-09-08"),
    alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE_URL}/${x}`])) },
  }));
  const keys = Object.keys(getMessages("es").ayudamos.areas) as (keyof ReturnType<typeof getMessages>["ayudamos"]["areas"])[];
  const areas = LOCALES.flatMap((l) =>
    keys.map((k) => ({
      url: `${SITE_URL}/${l}/${getMessages(l).ayudamos.areas[k].slug}`,
      lastModified: new Date("2026-09-08"),
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE_URL}/${x}/${getMessages(x).ayudamos.areas[k].slug}`])) },
    })),
  );
  return [...home, ...areas];
}
