"use client";


import { useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Marquee } from "@/components/fx/Marquee";
import { useReducedMotion } from "@/components/fx/motion-hooks";

/* Illustrative voices (HQA-D28, HQA-D75): the three quotes, anonymized — no
   name, no property, no stars. The per-card «Ilustrativo» chip is GONE as of
   2026-09-03: the operator's complaint was that it labelled every card like
   evidence in a trial, and one caption-sized line under the headline says the
   same thing once instead of three times. The quotes are italic between curly
   quotation marks; guillemets read as decoration.

   A marquee in motion, a calm grid under reduced motion. The track's edges are
   masked rather than covered by a gradient in the ground colour: over the
   atmosphere, a painted gradient would read as a bar. */
function QuoteCard({ quote }: { quote: string }) {
  return (
    <figure className="flex h-full w-[400px] max-w-[85vw] flex-shrink-0 flex-col justify-center rounded-2xl glass p-7">
      <blockquote className="font-display text-lg italic leading-normal text-text/90">
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

  return (
    <section className="relative border-y border-line py-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-16 text-center lg:mb-20">
          <p className="eyebrow mb-5">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-text-2/80">{t("nota")}</p>
        </Reveal>
      </div>

      {stacked ? (
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-3">
          {quotes.map((q) => (
            <QuoteCard key={q} quote={q} />
          ))}
        </div>
      ) : (
        <Reveal className="[mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
          <Marquee itemClassName="pr-4">
            {quotes.map((q) => (
              <QuoteCard key={q} quote={q} />
            ))}
          </Marquee>
        </Reveal>
      )}
    </section>
  );
}
