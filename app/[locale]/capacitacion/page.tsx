import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PaginaCapacitacion } from "@/components/servicios/PaginaCapacitacion";

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

/* Tanda E5c: the full page. E2 shipped the route as a hero and a CTA so the
   nav would never point at a 404; the body landed here once the copy passed
   its operator gate (E5a) and its English mirror was written (E5b). */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <PaginaCapacitacion locale={locale} />;
}
