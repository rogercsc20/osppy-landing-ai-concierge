import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Osppy";
export const size = OG_SIZE;
export const contentType = "image/png";

// The social card carries the positioning phrase, so HQA-D89 reaches it too:
// leaving "IA aplicada" here while the <title> says "IA Corporativa" would
// make the shared link contradict the page it opens.
const COPY = {
  es: {
    title: "IA Corporativa",
    sub: "Inteligencia artificial haciendo trabajo dentro de tu operación",
  },
  en: {
    title: "Corporate AI",
    sub: "Artificial intelligence doing work inside your operation",
  },
} as const;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = COPY[locale === "en" ? "en" : "es"];
  return brandOgImage({ title: copy.title, sub: copy.sub });
}
