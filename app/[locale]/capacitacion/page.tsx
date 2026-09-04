import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PaginaServicio } from "@/components/servicios/PaginaServicio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicios.capacitacion" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}${locale === "es" ? "/capacitacion" : "/training"}`,
      languages: {
        es: "/es/capacitacion",
        en: "/en/training",
        "x-default": "/es/capacitacion",
      },
    },
  };
}

/* Tanda E2: the route exists so the nav never points at a 404 (HQA-D88).
   The page itself is a hero and a CTA; its body is built in E5c, behind the
   copy gate E5a. */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <PaginaServicio slug="capacitacion" locale={locale} />;
}
