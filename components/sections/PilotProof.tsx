import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[#4a90e2]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function PilotProof() {
  const t = useTranslations();

  const reviews = [
    {
      quote: t("pilot.r1.quote"),
      author: t("pilot.r1.author"),
      hotel: t("pilot.r1.hotel"),
      initial: "M",
    },
    {
      quote: t("pilot.r2.quote"),
      author: t("pilot.r2.author"),
      hotel: t("pilot.r2.hotel"),
      initial: "C",
    },
    {
      quote: t("pilot.r3.quote"),
      author: t("pilot.r3.author"),
      hotel: t("pilot.r3.hotel"),
      initial: "S",
    },
  ];

  return (
    <section className="bg-[#0a1628] py-24 lg:py-32 px-4 sm:px-6 border-y border-[#4a90e2]/10">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-pulse" />
            {t("pilot.tag")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t("pilot.headline")}
          </h2>
          <p className="text-lg text-white/50">
            {t("pilot.body")}
          </p>
        </AnimatedSection>

        <AnimatedGroup stagger={0.12} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map(({ quote, author, hotel, initial }) => (
            <div
              key={author}
              className="flex flex-col gap-5 bg-[#080e1a] rounded-2xl p-6 lg:p-7 border border-white/8"
            >
              <Stars />

              <blockquote className="text-white/75 leading-relaxed text-sm flex-1">
                "{quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-[#4a90e2]/20 flex items-center justify-center text-sm font-semibold text-[#4a90e2] flex-shrink-0">
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-white leading-tight">{author}</p>
                  <p className="text-xs text-white/35 mt-0.5">{hotel}</p>
                </div>
              </div>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
