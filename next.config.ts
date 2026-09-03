import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Landing v2 §8 (tanda C). `qualities` is an allow list in Next 16: a
    // request for a quality outside it 400s, so Photo.tsx's 75 has to be
    // listed. deviceSizes matches the capture matrix's widths plus the two
    // retina steps; imageSizes covers the areas frame and the card photos,
    // which are the only places a photo is rendered narrower than the page.
    qualities: [60, 75, 82],
    deviceSizes: [360, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [320, 480, 640],
  },
  // Guest-facing aviso de privacidad (LFPDPPP encargado notice) — a branded
  // short URL for the WhatsApp first-contact footer. Distinct from
  // /{locale}/privacidad, which is the CLIENT-facing Osppy privacy policy.
  // next.config redirects run before the i18n proxy, so /aviso never gets
  // locale-rewritten. Temporary (307): the destination moves to each hotel's
  // own aviso when the responsable notice ships.
  async redirects() {
    return [
      {
        source: "/aviso",
        destination:
          "https://osppy-ai-concierge-production.up.railway.app/privacy",
        permanent: false,
      },
      // Slice 8: the operator console moved to the cockpit. Old bookmarks
      // (login + any dashboard screen, with or without a locale prefix) land
      // on the cockpit login instead of a 404. 307 on purpose — these URLs
      // may be re-used by marketing someday.
      {
        source: "/:locale(es|en)/login",
        destination: "https://app.osppy.com/es/login",
        permanent: false,
      },
      {
        source: "/login",
        destination: "https://app.osppy.com/es/login",
        permanent: false,
      },
      {
        source: "/:locale(es|en)/dashboard/:path*",
        destination: "https://app.osppy.com/es/login",
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: "https://app.osppy.com/es/login",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
