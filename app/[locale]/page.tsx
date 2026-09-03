import { getTranslations } from "next-intl/server";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { Porque } from "@/components/home/Porque";
import { Creemos } from "@/components/home/Creemos";
import { Como } from "@/components/home/Como";
import { SeVe } from "@/components/home/SeVe";
import { Areas } from "@/components/home/Areas";
import { Hacemos } from "@/components/home/Hacemos";
import { Cuanto } from "@/components/home/Cuanto";
import { Trayectoria } from "@/components/home/Trayectoria";
import { Productos } from "@/components/home/Productos";
import { Voces } from "@/components/home/Voces";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";

const FAQ_COUNT = 7;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.faq" });

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Osppy",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    email: CONTACT_EMAIL,
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* WHY → HOW → WHAT (HQA-D39). The order is the argument: first the
          feeling the reader already has, then the method, and only then the
          catalogue.

          No `.cv-auto` wrapper here. content-visibility applies layout and
          style containment, which breaks the sticky chapter inside <Como/>
          and makes every section below it guess its own height — the capture
          gate showed the pinned chapter rendering empty. Skipping paint
          below the fold comes back in V9, per section and measured with
          Lighthouse, never around a scroll-linked one. */}
      <main>
        <Hero />

        <Porque />
        <Creemos />

        <Como />
        <SeVe />

        <Areas />
        <Hacemos />
        <Cuanto />
        <Trayectoria />
        <Productos />

        <Voces />
        <Faq />
        <Cta />
      </main>
    </>
  );
}
