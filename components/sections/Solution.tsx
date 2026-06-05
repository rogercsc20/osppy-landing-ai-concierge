import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";
import { WhatsAppMockup } from "@/components/ui/WhatsAppMockup";
import { Zap, Mic, ArrowUpRight } from "lucide-react";

export function Solution() {
  const t = useTranslations();

  const cards = [
    { icon: Zap, title: t("solution.card1.title"), body: t("solution.card1.body") },
    { icon: Mic, title: t("solution.card2.title"), body: t("solution.card2.body") },
    { icon: ArrowUpRight, title: t("solution.card3.title"), body: t("solution.card3.body") },
  ];

  return (
    <section className="bg-warm-white py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: WhatsApp mockup */}
          <div className="order-2 lg:order-1 flex justify-center">
            <WhatsAppMockup variant="static" />
          </div>

          {/* Right: copy + cards */}
          <div className="order-1 lg:order-2">
            <AnimatedSection className="mb-10">
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-[1.1] mb-5">
                {t("solution.headline")}
              </h2>
              <p className="text-lg text-ink/70 leading-relaxed">
                {t("solution.body")}
              </p>
            </AnimatedSection>

            <AnimatedGroup className="flex flex-col gap-4">
              {cards.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 rounded-2xl border border-ink/8 bg-white shadow-sm shadow-ink/5"
                >
                  <div className="w-10 h-10 rounded-xl bg-turquoise-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-turquoise-deep" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">{title}</h3>
                    <p className="text-ink/65 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </AnimatedGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
