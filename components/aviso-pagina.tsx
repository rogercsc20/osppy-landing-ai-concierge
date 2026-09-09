import type { Metadata } from "next";
import { Container } from "./container";
import { Header } from "./header";
import { RUTA_PRIVACIDAD, SITE_URL, getMessages, otherLocale, type Locale } from "@/lib/i18n";

/**
 * The privacy notice (HQA-D176). The TEXT is the landing's own notice, recovered from
 * commit f28d696 (it was deleted on 2026-09-05 with the blank canvas) and adjusted to what
 * this site actually does: eight form fields instead of the assistant's data, two
 * processors instead of Meta and the model provider, no tracking cookies, and no brackets
 * anywhere (the operator, 2026-09-08: no placeholders, the identity enters when the company
 * exists). What is NOT recovered is the old site's design: this renderer is the v6 system.
 */
export function metadatosAviso(locale: Locale): Metadata {
  const m = getMessages(locale);
  const otro = otherLocale(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: m.privacidad.meta.title,
    description: m.privacidad.meta.description,
    alternates: {
      canonical: RUTA_PRIVACIDAD[locale],
      languages: { [locale]: RUTA_PRIVACIDAD[locale], [otro]: RUTA_PRIVACIDAD[otro] },
    },
    openGraph: {
      title: m.privacidad.meta.title,
      description: m.privacidad.meta.description,
      url: RUTA_PRIVACIDAD[locale],
      siteName: "Osppy",
      type: "website",
    },
  };
}

export function PaginaAviso({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const p = m.privacidad;
  return (
    <>
      <Header locale={locale} m={m} sobre="fondo" />
      <main>
        <section aria-labelledby="aviso-title" className="pt-32 pb-24 md:pt-40 md:pb-32">
          <Container>
            <h1
              id="aviso-title"
              className="max-w-[16ch] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-texto"
            >
              {p.titulo}
            </h1>
            <p className="mt-6 text-sm text-texto-2">{p.actualizado}</p>
            <div className="mt-10 max-w-[56ch]">
              {p.intro.map((t) => (
                <p key={t} className="mt-4 text-lg leading-relaxed text-texto-2">
                  {t}
                </p>
              ))}
              {p.secciones.map((s) => (
                <div key={s.titulo} className="mt-12 border-t border-linea pt-8">
                  <h2 className="font-display text-2xl text-texto md:text-[1.75rem]">{s.titulo}</h2>
                  {s.parrafos.map((t) => (
                    <p key={t} className="mt-4 text-[1.05rem] leading-relaxed text-texto-2">
                      {t}
                    </p>
                  ))}
                </div>
              ))}
              <a
                href={`/${locale}`}
                className="mt-14 inline-block text-lg text-texto-2 underline-offset-4 hover:text-azul hover:underline"
              >
                {p.volver}
              </a>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
