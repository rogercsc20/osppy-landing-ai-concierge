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

/* Diana Hoteles (HQA-D38, superseding D27): the product is no longer a dark
   object bolted onto the site. data-accent="hotel" re-points the accent, the
   warm and two of the four auras — teal and coral — and nothing else, so the
   ground, the text and the theme toggle stay the site's. Navbar wears the
   same accent while this route is open (it sets the attribute on <html>). */
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
      <main data-accent="hotel">
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
    </>
  );
}
