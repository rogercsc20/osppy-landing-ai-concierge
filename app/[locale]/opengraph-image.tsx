import { ImageResponse } from "next/og";

// The link preview (Open Graph and Twitter card) is the dark logo (operator, 2026-09-08, HQA-D166):
// the icon's own geometry from app/icon.svg, centred on the brand black, so the square crop the
// messaging apps make (WhatsApp, iMessage) still shows the whole mark. No text, no font to fetch,
// so the PNG stays small and the preview loads as a card. One image for every route and locale.
export const alt = "Osppy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const tile = 460;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0F0E",
        }}
      >
        <svg viewBox="0 0 64 64" width={tile} height={tile}>
          <rect width="64" height="64" rx="14" fill="#0a0f0e" />
          <circle cx="29" cy="27" r="16" stroke="#2fc4d9" strokeWidth="9" fill="none" />
          <circle cx="52" cy="52" r="7" fill="#2fc4d9" />
        </svg>
      </div>
    ),
    size,
  );
}
