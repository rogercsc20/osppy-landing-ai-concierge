import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Shared Open Graph card on the Taller system (L3): Marfil ground, Tinta
 * text, the teal glyph as the only graphic accent, one copper detail.
 * /hoteles passes dark=true and keeps its Obsidian world (HQA-D27).
 */
export function brandOgImage({
  title,
  sub,
  dark = false,
}: {
  title: string;
  sub: string;
  dark?: boolean;
}) {
  const bg = dark
    ? "radial-gradient(110% 90% at 75% -10%, rgba(13,127,149,0.55), rgba(10,15,14,0) 60%), #0a0f0e"
    : "#f7f5f0";
  const text = dark ? "#eef2f0" : "#1c2b33";
  const sub2 = dark ? "rgba(238,242,240,0.65)" : "#54646b";
  const rule = dark ? "rgba(255,255,255,0.12)" : "#e6e1d6";
  const tile = dark ? "#101615" : "#1c2b33";

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
          background: bg,
          color: text,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={tile} />
            <circle cx="29" cy="27" r="16" stroke="#2fc4d9" strokeWidth="9" fill="none" />
            <circle cx="52" cy="52" r="7" fill="#2fc4d9" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 600 }}>Osppy</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 34, color: sub2 }}>{sub}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${rule}`,
            paddingTop: 28,
            fontSize: 26,
            color: sub2,
          }}
        >
          <div>osppy.com</div>
          <div style={{ color: dark ? "#2fc4d9" : "#8c4b2c", fontWeight: 600 }}>
            Guadalajara, México
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
