import type { Locale, Messages } from "@/lib/i18n";
import { Photo } from "./photo";

/**
 * The welcome (HQA-D130, D148): the photograph fills the first screen, the phrase and the
 * single call to action sit over a Tinta scrim. The scrim is at least 70% where the text
 * is, so white text keeps 5.9:1 even over a bright pixel (docs/v6-02 §3.1). `min-h` lives
 * on the inner div, not the section (check-sections.mjs).
 */
export function Hero({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <section id="inicio" aria-labelledby="hero-title">
      <div className="relative min-h-[100svh] w-full">
        <Photo
          slug="recibimiento"
          locale={locale}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[26%_22%] lg:object-[50%_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(28_43_51/0.84)_0%,rgb(28_43_51/0.72)_38%,rgb(28_43_51/0.12)_70%,rgb(28_43_51/0.40)_100%)]"
        />
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-24">
          <h1
            id="hero-title"
            className="max-w-[10ch] text-balance font-display text-[clamp(3.25rem,9vw,7.5rem)] leading-[0.96] tracking-[-0.02em] text-blanco"
          >
            {m.hero.frase}
          </h1>
          <a
            href="#hablemos"
            className="mt-10 inline-flex w-fit items-center rounded-full bg-blanco px-7 py-4 text-lg font-medium text-tinta transition-colors hover:bg-lino"
          >
            {m.hero.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
