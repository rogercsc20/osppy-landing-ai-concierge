import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";

export function Problem() {
  const t = useTranslations();

  const items = [
    { title: t("problem.card1.title"), body: t("problem.card1.body") },
    { title: t("problem.card2.title"), body: t("problem.card2.body") },
    { title: t("problem.card3.title"), body: t("problem.card3.body") },
  ];

  return (
    <section className="bg-sand py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16 lg:mb-20 max-w-2xl">
          <p className="eyebrow mb-4">{t("problem.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em] mb-6">
            {t("problem.headline")}
          </h2>
          <p className="text-lg text-ink/70 leading-relaxed">
            {t("problem.body")}
          </p>
        </AnimatedSection>

        <AnimatedGroup className="border-y border-line divide-y divide-line">
          {items.map(({ title, body }, i) => (
            <div
              key={title}
              className="grid sm:grid-cols-12 gap-2 sm:gap-6 py-8 lg:py-10"
            >
              <span className="sm:col-span-1 font-display text-lg text-ink/35">
                0{i + 1}
              </span>
              <h3 className="sm:col-span-4 font-semibold text-ink text-lg leading-snug">
                {title}
              </h3>
              <p className="sm:col-span-7 text-ink/70 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
