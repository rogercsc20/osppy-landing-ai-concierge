import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PaginaAsesoria } from "@/components/servicios/PaginaAsesoria";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicios.asesoria" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}${locale === "es" ? "/asesoria" : "/advisory"}`,
      languages: {
        es: "/es/asesoria",
        en: "/en/advisory",
        "x-default": "/es/asesoria",
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
  return <PaginaAsesoria locale={locale} />;
}
