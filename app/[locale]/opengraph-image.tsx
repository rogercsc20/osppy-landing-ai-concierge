import { ImageResponse } from "next/og";

export const alt = "Osppy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  es: {
    title: "Tu recepción nunca duerme",
    sub: "El asistente de WhatsApp para hoteles boutique",
  },
  en: {
    title: "Your front desk never sleeps",
    sub: "The WhatsApp assistant for boutique hotels",
  },
} as const;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = COPY[locale === "en" ? "en" : "es"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(110% 90% at 75% -10%, rgba(13,127,149,0.55), rgba(10,15,14,0) 60%), #0a0f0e",
          color: "#eef2f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#101615" />
            <circle
              cx="29"
              cy="27"
              r="16"
              stroke="#2fc4d9"
              strokeWidth="9"
              fill="none"
            />
            <circle cx="52" cy="52" r="7" fill="#2fc4d9" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 600 }}>Osppy</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 600, lineHeight: 1.05 }}>
            {copy.title}
          </div>
          <div style={{ fontSize: 34, color: "rgba(238,242,240,0.65)" }}>
            {copy.sub}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            fontSize: 26,
            color: "rgba(238,242,240,0.65)",
          }}
        >
          <div>osppy.com</div>
          <div style={{ color: "#2fc4d9", fontWeight: 600 }}>
            WhatsApp · 24/7
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
