import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/hoteles/Hero";
import { Problema } from "@/components/hoteles/Problema";
import { Hace } from "@/components/hoteles/Hace";
import { Circuito } from "@/components/hoteles/Circuito";
import { Funciones } from "@/components/hoteles/Funciones";
import { Arranque } from "@/components/hoteles/Arranque";
import { Precio } from "@/components/hoteles/Precio";
import { Testimonios } from "@/components/hoteles/Testimonios";
import { Faq } from "@/components/hoteles/Faq";
import { Cta } from "@/components/hoteles/Cta";

const FAQ_COUNT = 6;

/* Diana Hoteles (L5, HQA-D27): the product's Obsidian world as an object.
   Everything inside .theme-hotel is dark in both site modes — hero and demo
   included; the navbar and footer outside follow the site theme. */
export default async function HotelesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hoteles.faq" });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: FAQ_COUNT }, (_, i) => ({
      "@type": "Question",
      name: t(`q${i + 1}`),
      acceptedAnswer: { "@type": "Answer", text: t(`a${i + 1}`) },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="theme-hotel bg-bg text-text">
        <main>
          <Hero />
          <Problema />
          <Hace />
          <Circuito />
          <Funciones />
          <Arranque />
          <Precio />
          <Testimonios />
          <Faq />
          <Cta />
        </main>
      </div>
    </>
  );
}
