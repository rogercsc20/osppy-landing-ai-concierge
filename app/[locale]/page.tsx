import { getTranslations } from "next-intl/server";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/site";
import { HeroCorporativo } from "@/components/home/HeroCorporativo";
import { Aplicada } from "@/components/home/Aplicada";
import { Silencio } from "@/components/home/Silencio";
import { Porque } from "@/components/home/Porque";
import { Como } from "@/components/home/Como";
import { Areas } from "@/components/home/Areas";
import { Hacemos } from "@/components/home/Hacemos";
import { Trayectoria } from "@/components/home/Trayectoria";
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
      {/* WHY → HOW → WHAT (HQA-D39, whose ORDER survives v4). What v4
          changed is the shape of the first ring: the page opens with a
          feeling and one phrase (HQA-D90) instead of an argument, and the
          argument is the second screen. The WHAT ring lost its products
          (HQA-D88) and its price section (HQA-D94), and the method became
          navigation (HQA-D92).

          No `.cv-auto` wrapper here. content-visibility applies layout and
          style containment, which breaks the sticky chapter inside <Como/>
          and makes every section below it guess its own height — the capture
          gate showed the pinned chapter rendering empty. Skipping paint
          below the fold comes back in E6, per section and measured with
          Lighthouse, never around a scroll-linked one. */}
      <main>
        <HeroCorporativo />
        <Aplicada />

        <Silencio />
        <Porque />

        <Como />

        <Areas />
        <Hacemos />
        <Trayectoria />

        <Voces />
        <Faq />
        <Cta />
      </main>
    </>
  );
}
