import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";

function Stars() {
  return (
    <div className="flex gap-1" role="img" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-ink/30" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function PilotProof() {
  const t = useTranslations();

  const reviews = [
    { quote: t("pilot.r1.quote"), author: t("pilot.r1.author"), hotel: t("pilot.r1.hotel") },
    { quote: t("pilot.r2.quote"), author: t("pilot.r2.author"), hotel: t("pilot.r2.hotel") },
    { quote: t("pilot.r3.quote"), author: t("pilot.r3.author"), hotel: t("pilot.r3.hotel") },
  ];

  return (
    <section className="bg-canvas border-y border-line py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <p className="eyebrow mb-4 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-wa-green animate-pulse" />
            {t("pilot.tag")}
          </p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em] mb-4">
            {t("pilot.headline")}
          </h2>
          <p className="text-lg text-ink/70">{t("pilot.body")}</p>
        </AnimatedSection>

        <AnimatedGroup
          stagger={0.12}
          className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-line border-y border-line"
        >
          {reviews.map(({ quote, author, hotel }) => (
            <figure
              key={author}
              className="flex h-full flex-col gap-6 px-2 py-10 lg:px-10 lg:py-12"
            >
              <Stars />

              <blockquote className="flex-1 font-display text-xl leading-normal text-ink/85">
                &ldquo;{quote}&rdquo;
              </blockquote>

              <figcaption>
                <p className="text-sm font-medium text-ink leading-tight">{author}</p>
                <p className="text-xs text-ink/70 mt-1">{hotel}</p>
              </figcaption>
            </figure>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
