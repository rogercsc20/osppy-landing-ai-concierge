import { getTranslations } from "next-intl/server";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { Somos } from "@/components/home/Somos";
import { Hacemos } from "@/components/home/Hacemos";
import { Ayudamos } from "@/components/home/Ayudamos";
import { Como } from "@/components/home/Como";
import { Trayectoria } from "@/components/home/Trayectoria";
import { Casos } from "@/components/home/Casos";
import { Productos } from "@/components/home/Productos";
import { Testimonios } from "@/components/home/Testimonios";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";

const FAQ_COUNT = 6;

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
      <main>
        <Hero />
        <Somos />
        <Hacemos />
        <Ayudamos />
        <Como />
        <Trayectoria />
        <Casos />
        <Productos />
        <Testimonios />
        <Faq />
        <Cta />
      </main>
    </>
  );
}
