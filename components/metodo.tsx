import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { Photo } from "./photo";

export function Metodo({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <section id="metodo" aria-labelledby="metodo-title" className="py-24 md:py-36">
      <Container>
        <h2
          id="metodo-title"
          className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-tinta"
        >
          {m.metodo.encabezado}
        </h2>
        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Photo
              slug="asesoria"
              locale={locale}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-auto w-full rounded-[1.25rem] object-cover"
            />
          </div>
          <ol className="lg:col-span-7 grid gap-10 sm:grid-cols-2 md:gap-x-12 md:gap-y-14">
            {m.metodo.etapas.map((e, i) => (
              <li key={e.titulo} className="max-w-[40ch]">
                <span aria-hidden="true" className="font-display text-sm tracking-[0.12em] text-cobre-texto">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-2xl text-tinta md:text-[1.75rem]">{e.titulo}</h3>
                <p className="mt-3 text-lg leading-relaxed text-humo">{e.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
