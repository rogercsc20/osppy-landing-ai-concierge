import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { Photo } from "./photo";

export function Quienes({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <section id="quienes" aria-labelledby="quienes-title" className="py-24 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-cobre-texto">{m.nav.quienes}</p>
            <h2
              id="quienes-title"
              className="mt-5 font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-tinta"
            >
              {m.quienes.encabezado}
            </h2>
            <p className="mt-8 max-w-[34ch] text-[1.4rem] leading-[1.45] text-tinta md:text-[1.7rem]">{m.quienes.frase}</p>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-humo">{m.quienes.origen}</p>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <Photo
              slug="quienes"
              locale={locale}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-auto w-full rounded-[1.25rem] object-cover"
            />
          </div>
        </div>
        <div className="mt-16 grid gap-10 border-t border-linea pt-12 md:mt-24 md:grid-cols-2 md:gap-16">
          {[m.quienes.proposito, m.quienes.creemos].map((b) => (
            <div key={b.titulo}>
              <h3 className="font-display text-2xl text-tinta md:text-[1.75rem]">{b.titulo}</h3>
              <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-humo">{b.texto}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
