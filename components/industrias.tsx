import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { IndustriasCarrusel } from "./industrias-carrusel";
import { LogoRing } from "./logo";

export const GRUPO_INDUSTRIAS: Record<Locale, string> = { es: "industrias", en: "industries" };

/**
 * Industrias con las que trabajamos (HQA-D155, D158): on the brand black, as the operator's
 * reference, with the logo's O as watermarks; replaces "Lo que ya se ha construido" on the home.
 * Only attested industries (FDV §11.10; data/industries.json), eight since HQA-D160 and D161;
 * the title never says "entregado" and no client is named.
 */
export function Industrias({ locale, m }: { locale: Locale; m: Messages }) {
  const { encabezado, ver, anterior, siguiente, etiqueta, items } = m.industrias;
  return (
    <section id="industrias" aria-labelledby="industrias-title" className="bg-negro text-sobre-negro">
      <div className="relative overflow-hidden py-24 md:py-36">
        <LogoRing className="pointer-events-none absolute -left-[12%] -top-[20%] h-[120%] w-auto opacity-[0.12]" />
        <LogoRing className="pointer-events-none absolute -bottom-[40%] right-[8%] h-[90%] w-auto opacity-[0.09]" />
        <Container className="relative">
          <IndustriasCarrusel locale={locale} items={items} labels={{ encabezado, ver, anterior, siguiente, etiqueta }} grupo={GRUPO_INDUSTRIAS[locale]} />
        </Container>
      </div>
    </section>
  );
}
