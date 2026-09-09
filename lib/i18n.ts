import es from "@/messages/es.json";
import en from "@/messages/en.json";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export type Messages = typeof es;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return locale === "en" ? (en as Messages) : es;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

export const SITE_URL = "https://www.osppy.com";

// The contact route and the privacy notice (2026-09-08, HQA-D175/D176). The slug is
// localized, so each one is a static folder per language and the twin URL in the other
// language does not exist: `/en/contacto` and `/es/contact` are 404 by construction
// (`generateStaticParams` of one locale each, with `dynamicParams = false`).
export const RUTA_CONTACTO: Record<Locale, string> = { es: "/es/contacto", en: "/en/contact" };
export const RUTA_PRIVACIDAD: Record<Locale, string> = { es: "/es/privacidad", en: "/en/privacy" };
