import type { Metadata } from "next";
import { ContactoForm } from "./contacto-form";
import { Container } from "./container";
import { Header } from "./header";
import { RUTA_CONTACTO, RUTA_PRIVACIDAD, SITE_URL, getMessages, otherLocale, type Locale } from "@/lib/i18n";

/**
 * The contact route (HQA-D175). One page, two localized slugs: `/es/contacto` and
 * `/en/contact`, each a static folder of a single locale, so the crossed URLs do not
 * exist. It carries no photograph: the reference the operator sent has none in this half,
 * and a photograph here would be decoration nobody asked for.
 */
export function metadatosContacto(locale: Locale): Metadata {
  const m = getMessages(locale);
  const otro = otherLocale(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: m.contacto.meta.title,
    description: m.contacto.meta.description,
    alternates: {
      canonical: RUTA_CONTACTO[locale],
      languages: { [locale]: RUTA_CONTACTO[locale], [otro]: RUTA_CONTACTO[otro] },
    },
    openGraph: {
      title: m.contacto.meta.title,
      description: m.contacto.meta.description,
      url: RUTA_CONTACTO[locale],
      siteName: "Osppy",
      type: "website",
    },
  };
}

export function PaginaContacto({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const c = m.contacto;
  return (
    <>
      <Header locale={locale} m={m} sobre="fondo" />
      <main>
        <section aria-labelledby="contacto-title" className="pt-32 pb-24 md:pt-40 md:pb-32">
          <Container>
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <h1
                  id="contacto-title"
                  className="max-w-[14ch] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-texto"
                >
                  {c.encabezado}
                </h1>
                <p className="mt-8 max-w-[42ch] text-xl leading-relaxed text-texto-2">{c.linea}</p>
                <p className="mt-10 text-lg text-texto-2">
                  {c.correoPregunta}{" "}
                  <a href={`mailto:${c.correo}`} className="text-azul-texto underline-offset-4 hover:underline">
                    {c.correo}
                  </a>
                </p>
              </div>
              <div className="lg:col-span-7">
                <ContactoForm m={m} avisoHref={RUTA_PRIVACIDAD[locale]} />
              </div>
            </div>
            {/* Below the grid, not inside the left column: stacked on a phone, a link back
                to the home in the middle of the page interrupts the form. */}
            <a
              href={`/${locale}`}
              className="mt-16 inline-block text-lg text-texto-2 underline-offset-4 hover:text-azul hover:underline"
            >
              {c.volver}
            </a>
          </Container>
        </section>
      </main>
    </>
  );
}
