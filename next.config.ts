import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
    ];
  },
};

export default withNextIntl(nextConfig);
