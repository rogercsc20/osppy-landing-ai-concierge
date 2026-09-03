import { defineRouting } from "next-intl/routing";

// Localized slugs (HQA-D26): the KEY is the internal app-folder path
// (app/[locale]/hoteles, app/[locale]/citas); the middleware rewrites the
// localized URL (/en/hotels) onto it.
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/hoteles": { es: "/hoteles", en: "/hotels" },
    "/citas": { es: "/citas", en: "/appointments" },
    "/privacidad": { es: "/privacidad", en: "/privacy" },
    "/terminos": { es: "/terminos", en: "/terms" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
