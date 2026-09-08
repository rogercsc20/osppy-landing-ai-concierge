import { ImageResponse } from "next/og";
import { getMessages, isLocale } from "@/lib/i18n";

export const alt = "Osppy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = getMessages(isLocale(locale) ? locale : "es");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FAF7F1",
          color: "#1C2B33",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 44, letterSpacing: "-0.01em" }}>Osppy</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 60, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 1000 }}>
            {m.quienes.frase}
          </div>
          <div style={{ fontSize: 26, color: "#4B5A62" }}>www.osppy.com</div>
        </div>
      </div>
    ),
    size,
  );
}
