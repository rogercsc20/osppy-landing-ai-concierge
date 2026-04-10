import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";
import { Moon, TrendingDown, Clock } from "lucide-react";

export function Problem() {
  const t = useTranslations();

  const cards = [
    {
      icon: Moon,
      title: t("problem.card1.title"),
      body: t("problem.card1.body"),
    },
    {
      icon: TrendingDown,
      title: t("problem.card2.title"),
      body: t("problem.card2.body"),
    },
    {
      icon: Clock,
      title: t("problem.card3.title"),
      body: t("problem.card3.body"),
    },
  ];

  return (
    <section className="bg-[#f8f6f1] py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-14 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] leading-tight mb-6">
            {t("problem.headline")}
          </h2>
          <p className="text-lg text-[#1a1a2e]/60 leading-relaxed">
            {t("problem.body")}
          </p>
        </AnimatedSection>

        <AnimatedGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 border border-[#1a1a2e]/5 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1a1a2e]/5 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#1a1a2e]" />
              </div>
              <h3 className="font-semibold text-[#1a1a2e] text-lg mb-2">{title}</h3>
              <p className="text-[#1a1a2e]/60 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
