import type { MetadataRoute } from "next";
import { GRUPO_INDUSTRIAS } from "@/components/industrias";
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
  const n = getMessages("es").industrias.items.length;
  const industrias = LOCALES.flatMap((l) =>
    Array.from({ length: n }, (_, i) => ({
      url: `${SITE_URL}/${l}/${GRUPO_INDUSTRIAS[l]}/${getMessages(l).industrias.items[i].slug}`,
      lastModified: new Date("2026-09-08"),
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE_URL}/${x}/${GRUPO_INDUSTRIAS[x]}/${getMessages(x).industrias.items[i].slug}`])) },
    })),
  );
  return [...home, ...areas, ...industrias];
}
