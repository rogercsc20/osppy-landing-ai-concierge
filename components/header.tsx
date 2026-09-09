import type { Locale, Messages } from "@/lib/i18n";
import { otherLocale } from "@/lib/i18n";
import { Container } from "./container";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Header({ locale, m, sobre = "foto" }: { locale: Locale; m: Messages; sobre?: "foto" | "fondo" }) {
  const tono = sobre === "foto" ? "text-blanco" : "text-texto";
  const tono2 = sobre === "foto" ? "text-blanco/85" : "text-texto-2";
  const borde = sobre === "foto" ? "border-blanco/60" : "border-linea";
  const other = otherLocale(locale);
  const links = [
    [`/${locale}#quienes`, m.nav.quienes],
    [`/${locale}#metodo`, m.nav.metodo],
    [`/${locale}#areas`, m.nav.ayudamos],
    [`/${locale}#hablemos`, m.nav.hablemos],
  ] as const;
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <Container>
        <nav aria-label={m.nav.etiqueta} className="flex items-center justify-between py-6 md:py-8">
          <a href={`/${locale}`} className="flex items-center gap-3">
            <Logo variant="glyph" className="h-9 w-9 md:h-10 md:w-10" />
            <span className={`font-display text-[1.75rem] leading-none tracking-[-0.01em] ${tono}`}>{m.nav.marca}</span>
          </a>
          <ul className={`hidden items-center gap-9 text-[0.95rem] md:flex ${tono2}`}>
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-azul">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle oscuro={m.nav.tema.oscuro} claro={m.nav.tema.claro} tono={`${borde} ${tono}`} />
            <a
              href={`/${other}`}
              hrefLang={other}
              lang={other}
              aria-label={m.nav.idiomaLabel}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-azul hover:text-azul ${borde} ${tono}`}
            >
              {m.nav.idioma}
            </a>
          </div>
        </nav>
      </Container>
    </header>
  );
}
