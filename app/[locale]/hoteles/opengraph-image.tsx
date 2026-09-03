import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Osppy Hoteles";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = {
  es: { title: "Osppy Hoteles", sub: "Asistente y panel para hoteles" },
  en: { title: "Osppy Hotels", sub: "Assistant and panel for hotels" },
} as const;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = COPY[locale === "en" ? "en" : "es"];
  // The hotel product keeps its Obsidian world (HQA-D27).
  return brandOgImage({ title: copy.title, sub: copy.sub, dark: true });
}
