import type { Locale, Messages } from "@/lib/i18n";
import { otherLocale } from "@/lib/i18n";
import { Container } from "./container";

export function Header({ locale, m }: { locale: Locale; m: Messages }) {
  const other = otherLocale(locale);
  const links = [
    ["#quienes", m.nav.quienes],
    ["#metodo", m.nav.metodo],
    ["#ayudamos", m.nav.ayudamos],
    ["#hablemos", m.nav.hablemos],
  ] as const;
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <Container>
        <nav aria-label={m.nav.etiqueta} className="flex items-center justify-between py-6 md:py-8">
          <a href={`/${locale}`} className="font-display text-[1.75rem] leading-none tracking-[-0.01em] text-blanco">
            {m.nav.marca}
          </a>
          <ul className="hidden items-center gap-9 text-[0.95rem] text-blanco/85 md:flex">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-blanco">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`/${other}`}
            hrefLang={other}
            lang={other}
            aria-label={m.nav.idiomaLabel}
            className="rounded-full border border-blanco/60 px-3.5 py-1.5 text-sm font-medium text-blanco transition-colors hover:border-blanco"
          >
            {m.nav.idioma}
          </a>
        </nav>
      </Container>
    </header>
  );
}
