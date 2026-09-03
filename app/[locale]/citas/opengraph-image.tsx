import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Osppy Citas";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = {
  es: {
    title: "Osppy Citas",
    sub: "Asistente para negocios de citas · próximamente",
  },
  en: {
    title: "Osppy Appointments",
    sub: "Assistant for appointment-based businesses · coming soon",
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
