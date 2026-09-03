"use client";


import { useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Marquee } from "@/components/fx/Marquee";
import { useReducedMotion } from "@/components/fx/motion-hooks";

/* Illustrative voices (HQA-D28, kit §5): the three quotes of the house,
   anonymized — no name, no property, no stars — each visibly labeled. A
   marquee in motion, a calm grid under reduced motion. The track's edges are
   masked rather than covered by a gradient in the ground colour: over the
   atmosphere, a painted gradient would read as a bar. */
function QuoteCard({ quote, label }: { quote: string; label: string }) {
  return (
    <figure className="flex h-full w-[440px] max-w-[85vw] flex-shrink-0 flex-col gap-5 rounded-2xl glass p-7">
      <span className="w-fit rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-2">
        {label}
      </span>
      <blockquote className="flex-1 font-display text-lg italic leading-normal text-text/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
    </figure>
  );
}

export function Testimonios() {
  const t = useTranslations("hoteles.testimonios");
  // The calm grid replaces the marquee only after hydration — the hook is
  // false until then, so the server's tree and the first client tree agree.
  const stacked = useReducedMotion();
  const quotes = (["q1", "q2", "q3"] as const).map((k) => t(k));
  const label = t("etiqueta");

  return (
    <section className="relative border-y border-line py-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-16 text-center lg:mb-20">
          <p className="eyebrow mb-5">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-text-2">{t("nota")}</p>
        </Reveal>
      </div>

      {stacked ? (
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-3">
          {quotes.map((q) => (
            <QuoteCard key={q} quote={q} label={label} />
          ))}
        </div>
      ) : (
        <Reveal className="[mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
          <Marquee itemClassName="pr-4">
            {quotes.map((q) => (
              <QuoteCard key={q} quote={q} label={label} />
            ))}
          </Marquee>
        </Reveal>
      )}
    </section>
  );
}
