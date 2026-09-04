import { defineRouting } from "next-intl/routing";

// Localized slugs (HQA-D26): the KEY is the internal app-folder path
// (app/[locale]/hoteles, app/[locale]/citas); the middleware rewrites the
// localized URL (/en/hotels) onto it.
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    // The three service lines (HQA-D88, tanda E2). The English slugs are
    // chosen once, on purpose: routing.ts rewrites them and changing one
    // later breaks every link that already points at it.
    "/capacitacion": { es: "/capacitacion", en: "/training" },
    "/asesoria": { es: "/asesoria", en: "/advisory" },
    "/implementacion": { es: "/implementacion", en: "/implementation" },
    // Diana stays reachable and stops being advertised (HQA-D88, gate E0-7):
    // out of the nav, the footer and the sitemap, `noindex` on the page, and
    // still a working link to hand a prospect privately.
    "/hoteles": { es: "/hoteles", en: "/hotels" },
    "/citas": { es: "/citas", en: "/appointments" },
    "/privacidad": { es: "/privacidad", en: "/privacy" },
    "/terminos": { es: "/terminos", en: "/terms" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
