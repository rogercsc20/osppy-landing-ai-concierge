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
