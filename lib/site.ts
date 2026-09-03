/** Brand-level constants shared across components, metadata, and SEO files. */
export const SITE_URL = "https://osppy.com";
export const CONTACT_EMAIL = "hello@osppy.com";
/** The operator console (cockpit). Slice 8 retired the legacy dashboard here. */
export const APP_LOGIN_URL = "https://app.osppy.com/es/login";
/** Pendiente, dueño O; nunca el número de producción (kit §15 fila 5). */
export const WHATSAPP_NUMBER = "";
export const CITY = "Guadalajara, México";

/**
 * Primary-CTA href (HQA-D29): WhatsApp with a prefilled message when the
 * number exists; until then, a prefilled email to hello@osppy.com.
 */
export function whatsappHref(message: string): string {
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(message)}`;
}
