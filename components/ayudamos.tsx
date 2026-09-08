import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { Photo } from "./photo";

export function Ayudamos({ locale, m }: { locale: Locale; m: Messages }) {
  const areas = Object.values(m.ayudamos.areas);
  return (
    <section id="ayudamos" aria-labelledby="ayudamos-title" className="py-24 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <h2
              id="ayudamos-title"
              className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-negro"
            >
              {m.ayudamos.encabezado}
            </h2>
            <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 md:mt-16">
              {areas.map((a) => (
                <li key={a.nombre} className="max-w-[38ch] border-t border-linea pt-5">
                  <h3 className="font-display text-2xl text-negro">{a.nombre}</h3>
                  <p className="mt-2 text-[1.05rem] leading-relaxed text-niebla">{a.texto}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4">
            <Photo
              slug="calidad"
              locale={locale}
              sizes="(min-width: 768px) 30vw, 100vw"
              className="h-auto w-full rounded-[1.25rem] object-cover lg:sticky lg:top-10"
            />
          </div>
        </div>
        <div className="mt-20 md:mt-28">
          <h3 className="font-display text-2xl text-negro md:text-[1.75rem]">{m.construido.encabezado}</h3>
          <ul className="mt-6 grid gap-x-12 gap-y-3 text-lg leading-relaxed text-niebla md:grid-cols-2">
            {m.construido.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.85em] h-1.5 w-1.5 shrink-0 rounded-full bg-azul" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
