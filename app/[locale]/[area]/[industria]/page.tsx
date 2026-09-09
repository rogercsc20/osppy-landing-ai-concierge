import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cifra } from "@/components/cifra";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { GRUPO_INDUSTRIAS } from "@/components/industrias";
import { LogoRing } from "@/components/logo";
import { Photo } from "@/components/photo";
import { LOCALES, SITE_URL, getMessages, isLocale, type Locale } from "@/lib/i18n";
import type { PhotoSlug } from "@/lib/photos.generated";

// The route is /es/industrias/<giro> and /en/industries/<industry>. The middle segment reuses the
// `[area]` name of the sibling route because Next requires one name per position; here it only
// ever takes the value of GRUPO_INDUSTRIAS for the locale.
type Params = Promise<{ locale: string; area: string; industria: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getMessages(locale).industrias.items.map((it) => ({ locale, area: GRUPO_INDUSTRIAS[locale], industria: it.slug })));
}

function find(locale: Locale, grupo: string, slug: string) {
  if (grupo !== GRUPO_INDUSTRIAS[locale]) return null;
  const items = getMessages(locale).industrias.items;
  const idx = items.findIndex((it) => it.slug === slug);
  return idx === -1 ? null : { idx, it: items[idx] };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, area, industria } = await params;
  if (!isLocale(locale)) return {};
  const found = find(locale, area, industria);
  if (!found) return {};
  const other: Locale = locale === "es" ? "en" : "es";
  const otherSlug = getMessages(other).industrias.items[found.idx].slug;
  const here = `/${locale}/${area}/${industria}`;
  const there = `/${other}/${GRUPO_INDUSTRIAS[other]}/${otherSlug}`;
  const title = `${found.it.titulo} · Osppy`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: found.it.ayudamos,
    alternates: { canonical: here, languages: { [locale]: here, [other]: there } },
    openGraph: { title, description: found.it.ayudamos, url: here, siteName: "Osppy", type: "website" },
  };
}

/**
 * One page per attested industry (HQA-D155, D162): "Cómo ayudamos a <industria>", never "hemos
 * trabajado en" and no client; the photograph; three trends from third parties with their source at
 * the foot (HQA-D145, D146; every figure in scripts/copy-allow.json); the four stages; the one call
 * to action on the band.
 */
export default async function IndustriaPage({ params }: { params: Params }) {
  const { locale, area, industria } = await params;
  const l = isLocale(locale) ? locale : "es";
  const m = getMessages(l);
  const found = find(l, area, industria);
  if (!found) notFound();
  const it = found.it;
  return (
    <>
      <Header locale={l} m={m} sobre="fondo" />
      <main>
        <section aria-labelledby="industria-title" className="pt-32 md:pt-40">
          <Container>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-azul-texto">{m.industria.eyebrow}</p>
            <h1 id="industria-title" className="mt-4 max-w-[16ch] font-display text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-texto">
              {it.titulo}
            </h1>
            <p className="mt-8 max-w-[44ch] text-[1.3rem] leading-[1.45] text-texto md:text-[1.6rem]">{it.ayudamos}</p>
          </Container>
          <div className="relative mt-14 h-[55svh] min-h-[380px] md:mt-20 md:h-[72svh]">
            <Photo slug={it.foto as PhotoSlug} locale={l} fill priority sizes="100vw" className="object-cover" />
          </div>
        </section>
        <section aria-labelledby="industria-tendencias" className="py-20 md:py-28">
          <Container>
            <h2 id="industria-tendencias" className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-texto">
              {m.industria.tendenciasTitulo}
            </h2>
            <ul className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10">
              {it.tendencias.map((t) => (
                <li key={t.texto} className="border-t border-linea pt-6">
                  <Cifra texto={t.cifra} className="font-display text-[clamp(1.9rem,3.2vw,2.5rem)] leading-[1.05] tracking-[-0.015em] text-azul-texto" />
                  <p className="mt-4 max-w-[36ch] text-lg leading-relaxed text-texto">{t.texto}</p>
                  <p className="mt-5 text-sm text-texto-2">
                    <span className="sr-only">{m.industria.fuenteLabel}: </span>
                    {t.fuente}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
        <section aria-labelledby="industria-metodo" className="pb-20 md:pb-28">
          <Container>
            <h2 id="industria-metodo" className="font-display text-[1.75rem] text-texto md:text-[2.25rem]">{m.industria.metodoTitulo}</h2>
            <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {m.metodo.etapas.map((e, i) => (
                <li key={e.titulo} className="border-t border-linea pt-5">
                  <span aria-hidden="true" className="font-display text-sm tracking-[0.12em] text-azul-texto">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-display text-xl text-texto md:text-2xl">{e.titulo}</h3>
                  <p className="mt-2 text-[1.05rem] leading-relaxed text-texto-2">{e.texto}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
        <section aria-labelledby="industria-cta" className="bg-profundo text-sobre-profundo">
          <div className="relative overflow-hidden">
            <LogoRing className="pointer-events-none absolute -right-[14%] top-1/2 h-[170%] w-auto -translate-y-1/2 opacity-[0.3]" />
            <Container className="relative py-20 text-center md:py-28">
              <h2 id="industria-cta" className="mx-auto max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                {m.hablemos.encabezado}
              </h2>
              <p className="mx-auto mt-6 max-w-[44ch] text-lg leading-relaxed text-sobre-profundo-2 md:text-xl">{m.industria.ctaTexto}</p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                <a href={`mailto:${m.hablemos.correo}`} className="inline-flex items-center rounded-full bg-azul px-7 py-4 text-lg font-medium text-negro transition-colors hover:bg-blanco">
                  {m.hablemos.cta}
                </a>
                <a href={`/${l}#industrias`} className="text-lg text-sobre-profundo underline-offset-4 hover:underline">{m.industria.volver}</a>
              </div>
            </Container>
          </div>
        </section>
      </main>
    </>
  );
}
