import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { Photo } from "./photo";

export function Real({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <section id="real" aria-labelledby="real-title" className="py-24 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2
              id="real-title"
              className="max-w-[18ch] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-tinta"
            >
              {m.real.encabezado}
            </h2>
            <dl className="mt-12 grid gap-10 sm:grid-cols-2 md:mt-16">
              {m.real.cifras.map((c) => (
                <div key={c.texto} className="border-t border-linea pt-6">
                  <dt className="font-display text-[clamp(2.5rem,4.5vw,3.5rem)] leading-none tracking-[-0.02em] text-petroleo-texto">
                    {c.numero}
                  </dt>
                  <dd className="mt-3 text-lg text-humo">{c.texto}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-12 max-w-[52ch] text-lg leading-relaxed text-tinta">{m.real.giros}</p>
          </div>
          <div className="lg:col-span-5">
            <Photo
              slug="mantenimiento"
              locale={locale}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-auto w-full rounded-[1.25rem] object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
