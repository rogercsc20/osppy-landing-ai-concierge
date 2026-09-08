import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { Photo } from "@/components/photo";
import { Ribbon } from "@/components/ribbon";
import { LOCALES, SITE_URL, getMessages, isLocale, type Locale, type Messages } from "@/lib/i18n";
import type { PhotoSlug } from "@/lib/photos.generated";

type Params = Promise<{ locale: string; area: string }>;
type Area = Messages["ayudamos"]["areas"][keyof Messages["ayudamos"]["areas"]];

function areaBySlug(m: Messages, slug: string): { key: string; area: Area } | null {
  for (const [key, area] of Object.entries(m.ayudamos.areas)) if (area.slug === slug) return { key, area };
  return null;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => Object.values(getMessages(locale).ayudamos.areas).map((a) => ({ locale, area: a.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, area } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  const found = areaBySlug(m, area);
  if (!found) return {};
  const other: Locale = locale === "es" ? "en" : "es";
  const otherSlug = getMessages(other).ayudamos.areas[found.key as keyof Messages["ayudamos"]["areas"]].slug;
  const title = `${found.area.nombre} · Osppy`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: found.area.texto,
    alternates: { canonical: `/${locale}/${area}`, languages: { [locale]: `/${locale}/${area}`, [other]: `/${other}/${otherSlug}` } },
    openGraph: { title, description: found.area.texto, url: `/${locale}/${area}`, siteName: "Osppy", type: "website" },
  };
}

/** One page per area (HQA-D152): capability, never a catalogue entry (HQA-D112). Only sourced content: the area's line, its sub-areas (foundation §4), the four stages, the call to action. */
export default async function AreaPage({ params }: { params: Params }) {
  const { locale, area } = await params;
  const l = isLocale(locale) ? locale : "es";
  const m = getMessages(l);
  const found = areaBySlug(m, area);
  if (!found) notFound();
  const a = found.area;
  return (
    <>
      <Header locale={l} m={m} sobre="fondo" />
      <main>
        <section aria-labelledby="area-title" className="pt-32 md:pt-40">
          <Container>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-azul-texto">{m.area.eyebrow}</p>
            <h1 id="area-title" className="mt-4 max-w-[14ch] font-display text-[clamp(3rem,7vw,6rem)] leading-[0.98] tracking-[-0.02em] text-texto">
              {a.nombre}
            </h1>
            <p className="mt-8 max-w-[40ch] text-[1.4rem] leading-[1.45] text-texto md:text-[1.7rem]">{a.texto}</p>
          </Container>
          <div className="relative mt-14 h-[55svh] min-h-[380px] md:mt-20 md:h-[72svh]">
            <Photo slug={a.foto as PhotoSlug} locale={l} fill priority sizes="100vw" className="object-cover" />
          </div>
        </section>
        <section aria-labelledby="area-subareas" className="py-20 md:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <h2 id="area-subareas" className="font-display text-[1.75rem] text-texto md:text-[2.25rem]">{m.area.subareasTitulo}</h2>
                <ul className="mt-6 grid gap-3 text-lg leading-relaxed text-texto-2">
                  {a.subareas.map((s) => (
                    <li key={s} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.85em] h-1.5 w-1.5 shrink-0 rounded-full bg-azul" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-7">
                <h2 className="font-display text-[1.75rem] text-texto md:text-[2.25rem]">{m.area.metodoTitulo}</h2>
                <ol className="mt-6 grid gap-8 sm:grid-cols-2">
                  {m.metodo.etapas.map((e, i) => (
                    <li key={e.titulo} className="border-t border-linea pt-5">
                      <span aria-hidden="true" className="font-display text-sm tracking-[0.12em] text-azul-texto">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-2 font-display text-xl text-texto md:text-2xl">{e.titulo}</h3>
                      <p className="mt-2 text-[1.05rem] leading-relaxed text-texto-2">{e.texto}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Container>
        </section>
        <section aria-labelledby="area-cta" className="bg-profundo text-sobre-profundo">
          <div className="relative overflow-hidden">
          <Ribbon variant="c" opacity={0.7} width={32} />
          <Container className="relative py-20 text-center md:py-28">
            <h2 id="area-cta" className="mx-auto max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
              {m.hablemos.encabezado}
            </h2>
            <p className="mx-auto mt-6 max-w-[44ch] text-lg leading-relaxed text-sobre-profundo-2 md:text-xl">{m.area.ctaTexto}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <a href={`mailto:${m.hablemos.correo}`} className="inline-flex items-center rounded-full bg-azul px-7 py-4 text-lg font-medium text-negro transition-colors hover:bg-blanco">
                {m.hablemos.cta}
              </a>
              <a href={`/${l}#ayudamos`} className="text-lg text-sobre-profundo underline-offset-4 hover:underline">{m.area.volver}</a>
            </div>
          </Container>
          </div>
        </section>
      </main>
    </>
  );
}
