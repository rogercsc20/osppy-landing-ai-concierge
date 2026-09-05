import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // NOT design: three URL contracts with live systems, kept deliberately when
  // the landing was cleared to a blank canvas.
  //
  // `/aviso` is the guest-facing LFPDPPP notice that the WhatsApp bot links in
  // its first-contact footer. It is a legal URL and it is distinct from any
  // client-facing privacy page this site may grow later. Temporary (307): the
  // destination moves to each tenant's own notice when that ships.
  //
  // `/login` and `/dashboard/*` are old bookmarks for the operator console,
  // which moved to app.osppy.com. 307 on purpose, in case marketing re-uses
  // the paths.
  async redirects() {
    return [
      {
        source: "/aviso",
        destination:
          "https://osppy-ai-concierge-production.up.railway.app/privacy",
        permanent: false,
      },
      {
        source: "/login",
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

export default nextConfig;
