import type { Locale, Messages } from "@/lib/i18n";
import { Photo } from "./photo";

export function Hero({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <section id="inicio" aria-labelledby="hero-title">
      <div className="grid lg:min-h-[82svh] lg:grid-cols-12">
        <div className="order-2 flex flex-col justify-center px-6 py-14 md:px-10 md:py-20 lg:order-1 lg:col-span-5 lg:py-24 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-16">
          <h1
            id="hero-title"
            className="font-display text-balance text-[clamp(3rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-tinta"
          >
            {m.hero.frase}
          </h1>
          <a
            href="#hablemos"
            className="mt-10 inline-flex w-fit items-center rounded-full bg-petroleo px-7 py-4 text-lg font-medium text-blanco transition-colors hover:bg-petroleo-texto"
          >
            {m.hero.cta}
          </a>
        </div>
        <div className="relative order-1 aspect-[4/5] md:aspect-[16/10] lg:order-2 lg:col-span-7 lg:aspect-auto">
          <Photo
            slug="recibimiento"
            locale={locale}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover object-[50%_30%]"
          />
        </div>
      </div>
    </section>
  );
}
