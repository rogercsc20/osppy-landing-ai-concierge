import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // The qualities the code is allowed to ask the optimizer for. Next 16
    // requires them declared: an undeclared `quality` is ignored and the
    // request falls back to 75. 75 is the default for anything small; 90 is
    // what the photographs shown large ask for, because the source WebP is
    // already compressed at 82 and a second pass at 75 was what the operator
    // saw as softness on 2026-09-08 (HQA-D168).
    qualities: [75, 90],
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
      // v6 (2026-09-08, HQA-D132): one house per language, Spanish by default.
      // The switch in the navigation goes to the other one; no detection, no cookie.
      {
        source: "/",
        destination: "/es",
        permanent: false,
      },
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
