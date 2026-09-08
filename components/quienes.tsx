import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { LogoRing } from "./logo";
import { Photo } from "./photo";

/** Quiénes somos (HQA-D149): a centred band on the brand teal with the headline and the phrase; the two story blocks below, on the light ground. */
export function Quienes({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <>
      <section id="quienes" aria-labelledby="quienes-title" className="bg-azul text-negro">
        {/* The watermark (HQA-D150): the logo's O, large and translucent, cropped by this wrapper and never by the section. */}
        <div className="relative overflow-hidden">
          <LogoRing className="pointer-events-none absolute -right-[18%] top-1/2 h-[130%] w-auto -translate-y-1/2 opacity-[0.14] md:-right-[8%] md:h-[175%]" />
          <Container className="relative py-24 text-center md:py-36">
          <h2
            id="quienes-title"
            className="mx-auto font-display text-[clamp(2.75rem,6.5vw,5.25rem)] leading-[1.0] tracking-[-0.02em]"
          >
            {m.quienes.encabezado}
          </h2>
          <p className="mx-auto mt-10 max-w-[34ch] text-balance text-[1.45rem] leading-[1.4] md:text-[1.9rem]">{m.quienes.frase}</p>
          <p className="mx-auto mt-8 max-w-[52ch] text-lg leading-relaxed text-negro/80 md:text-xl">{m.quienes.origen}</p>
          </Container>
        </div>
      </section>
      <section aria-label={m.nav.quienes} className="py-24 md:py-36">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Photo
                slug="quienes"
                locale={locale}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full rounded-[1.25rem] object-cover"
              />
            </div>
            <div className="grid gap-10 lg:col-span-7 lg:grid-cols-2 lg:gap-12 lg:pt-6">
              {[m.quienes.proposito, m.quienes.creemos].map((b) => (
                <div key={b.titulo}>
                  <h3 className="font-display text-2xl text-negro md:text-[1.75rem]">{b.titulo}</h3>
                  <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-niebla">{b.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
