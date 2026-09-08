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
          background: "#0A0F0E",
          color: "#FFFFFF",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 44, letterSpacing: "-0.01em" }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "#0A0F0E", border: "2px solid #2FC4D9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, border: "7px solid #2FC4D9" }} />
          </div>
          <div>Osppy</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 60, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 1000 }}>
            {m.quienes.frase}
          </div>
          <div style={{ fontSize: 26, color: "#2FC4D9" }}>www.osppy.com</div>
        </div>
      </div>
    ),
    size,
  );
}
