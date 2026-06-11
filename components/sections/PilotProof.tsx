"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SplitWords } from "@/components/fx/SplitWords";

function Stars() {
  return (
    <div className="flex gap-1" role="img" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 text-turquoise-ink/70" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface Review {
  quote: string;
  author: string;
  hotel: string;
}

function QuoteCard({ quote, author, hotel }: Review) {
  return (
    <figure className="flex h-full w-[480px] flex-shrink-0 flex-col gap-5 rounded-2xl border border-line bg-white/[0.02] p-7">
      <Stars />
      <blockquote className="flex-1 font-display text-lg leading-normal text-ink/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption>
        <p className="text-sm font-medium leading-tight text-ink">{author}</p>
        <p className="mt-1 text-xs text-ink/70">{hotel}</p>
      </figcaption>
    </figure>
  );
}

export function PilotProof() {
  const t = useTranslations();
  const reduce = useReducedMotion();

  const reviews: Review[] = [
    { quote: t("pilot.r1.quote"), author: t("pilot.r1.author"), hotel: t("pilot.r1.hotel") },
    { quote: t("pilot.r2.quote"), author: t("pilot.r2.author"), hotel: t("pilot.r2.hotel") },
    { quote: t("pilot.r3.quote"), author: t("pilot.r3.author"), hotel: t("pilot.r3.hotel") },
  ];

  return (
    <section className="relative overflow-hidden border-y border-line bg-canvas py-32 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimatedSection className="mb-16 text-center lg:mb-20">
          <p className="eyebrow mb-5 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-wa-green" />
            {t("pilot.tag")}
          </p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-ink">
            <SplitWords text={t("pilot.headline")} />
          </h2>
          <p className="mt-5 text-lg text-ink/70">{t("pilot.body")}</p>
        </AnimatedSection>
      </div>

      {reduce ? (
        /* reduced motion: a calm static grid */
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-3">
          {reviews.map((r) => (
            <QuoteCard key={r.author} {...r} />
          ))}
        </div>
      ) : (
        /* infinite marquee: two copies of the list, faded at the edges */
        <AnimatedSection className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-canvas to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-canvas to-transparent"
          />
          <div className="marquee-track flex w-max items-stretch gap-4 pr-4">
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} aria-hidden={i >= reviews.length || undefined}>
                <QuoteCard {...r} />
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}
    </section>
  );
}
