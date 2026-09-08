import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { LogoRing } from "./logo";
import { Ribbon, Shapes } from "./ribbon";
import { Photo } from "./photo";

/** Quiénes somos (HQA-D149): a centred band on the brand teal with the headline and the phrase; the two story blocks below, on the light ground. */
export function Quienes({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <>
      <section id="quienes" aria-labelledby="quienes-title" className="bg-profundo text-sobre-profundo">
        {/* The watermark (HQA-D150): the logo's O, large and translucent, cropped by this wrapper and never by the section. */}
        <div className="relative overflow-hidden">
          <Ribbon variant="a" opacity={0.7} width={30} />
          <LogoRing className="pointer-events-none absolute -right-[18%] top-1/2 h-[130%] w-auto -translate-y-1/2 opacity-[0.28] md:-right-[8%] md:h-[175%]" />
          <Container className="relative py-24 text-center md:py-36">
          <h2
            id="quienes-title"
            className="mx-auto font-display text-[clamp(2.75rem,6.5vw,5.25rem)] leading-[1.0] tracking-[-0.02em]"
          >
            {m.quienes.encabezado}
          </h2>
          <p className="mx-auto mt-10 max-w-[34ch] text-balance text-[1.45rem] leading-[1.4] md:text-[1.9rem]">{m.quienes.frase}</p>
          <p className="mx-auto mt-8 max-w-[52ch] text-lg leading-relaxed text-sobre-profundo-2 md:text-xl">{m.quienes.origen}</p>
          </Container>
        </div>
      </section>
      <section aria-label={m.nav.quienes}>
        <div className="relative h-[60svh] min-h-[420px] md:h-[78svh]">
          <Photo slug="quienes" locale={locale} fill sizes="100vw" className="object-cover" />
        </div>
        <div className="relative overflow-hidden">
          <Shapes />
          <Container className="relative py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {[m.quienes.proposito, m.quienes.creemos].map((b) => (
              <div key={b.titulo}>
                <h3 className="font-display text-[1.75rem] text-texto md:text-[2.25rem]">{b.titulo}</h3>
                <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-texto-2 md:text-xl">{b.texto}</p>
              </div>
            ))}
          </div>
          </Container>
        </div>
      </section>
    </>
  );
}
