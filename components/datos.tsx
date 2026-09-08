import type { Messages } from "@/lib/i18n";
import { Container } from "./container";
import { LogoRing } from "./logo";

/** Lo que dicen los datos: the brand black with the numerals in the brand teal, as the logo does (HQA-D149). */
export function Datos({ m }: { m: Messages }) {
  return (
    <section id="datos" aria-labelledby="datos-title" className="bg-negro text-sobre-negro">
      {/* Watermarks of the logo's O (operator, 2026-09-08, 16:06): the band's language on black, behind the numerals at an opacity that keeps them above 7:1. */}
      <div className="relative overflow-hidden">
        <LogoRing className="pointer-events-none absolute -right-[16%] -top-[30%] h-[150%] w-auto opacity-[0.14]" />
        <LogoRing className="pointer-events-none absolute -bottom-[45%] -left-[10%] h-[95%] w-auto opacity-[0.09]" />
        <Container className="relative py-24 md:py-36">
        <h2
          id="datos-title"
          className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em]"
        >
          {m.datos.encabezado}
        </h2>
        <ul className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10">
          {m.datos.items.map((d) => (
            <li key={d.fuente} className="border-t border-sobre-negro/20 pt-6">
              <p className="font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-azul">
                {d.cifra}
              </p>
              <p className="mt-4 max-w-[36ch] text-lg leading-relaxed">{d.texto}</p>
              <p className="mt-5 text-sm text-sobre-negro-2">
                <span className="sr-only">{m.datos.fuenteLabel}: </span>
                {d.fuente}
              </p>
            </li>
          ))}
        </ul>
        </Container>
      </div>
    </section>
  );
}
