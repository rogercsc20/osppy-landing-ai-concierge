import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { Photo } from "./photo";

export function Hablemos({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <section id="hablemos" aria-labelledby="hablemos-title" className="py-24 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Photo
              slug="hablemos"
              locale={locale}
              sizes="(min-width: 768px) 48vw, 100vw"
              className="h-auto w-full rounded-[1.25rem] object-cover"
            />
          </div>
          <div className="flex flex-col justify-center lg:col-span-6">
            <h2
              id="hablemos-title"
              className="max-w-[16ch] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-negro"
            >
              {m.hablemos.encabezado}
            </h2>
            <p className="mt-8 max-w-[44ch] text-xl leading-relaxed text-niebla">{m.hablemos.texto}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href={`mailto:${m.hablemos.correo}`}
                className="inline-flex items-center rounded-full bg-azul px-7 py-4 text-lg font-medium text-blanco transition-colors hover:bg-espuma"
              >
                {m.hablemos.cta}
              </a>
              <a href={`mailto:${m.hablemos.correo}`} className="text-lg text-azul-texto underline-offset-4 hover:underline">
                {m.hablemos.correo}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-20 rounded-[1.25rem] bg-espuma p-8 md:mt-28 md:p-12">
          <h3 className="font-display text-2xl text-negro md:text-[1.75rem]">{m.precio.titulo}</h3>
          <ul className="mt-6 grid gap-4 text-lg leading-relaxed text-niebla md:grid-cols-3 md:gap-10">
            {m.precio.lineas.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-8 font-display text-2xl text-negro">{m.precio.cierre}</p>
        </div>
      </Container>
    </section>
  );
}
