import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";
import { WhatsAppMockup } from "@/components/ui/WhatsAppMockup";
import { Zap, Mic, ArrowUpRight } from "lucide-react";

export function Solution() {
  const t = useTranslations();

  const items = [
    { icon: Zap, title: t("solution.card1.title"), body: t("solution.card1.body") },
    { icon: Mic, title: t("solution.card2.title"), body: t("solution.card2.body") },
    { icon: ArrowUpRight, title: t("solution.card3.title"), body: t("solution.card3.body") },
  ];

  return (
    <section className="bg-canvas py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: WhatsApp mockup */}
          <div className="order-2 lg:order-1 flex justify-center">
            <WhatsAppMockup variant="static" />
          </div>

          {/* Right: copy + hairline list */}
          <div className="order-1 lg:order-2">
            <AnimatedSection className="mb-12">
              <p className="eyebrow mb-4">{t("solution.eyebrow")}</p>
              <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em] mb-5">
                {t("solution.headline")}
              </h2>
              <p className="text-lg text-ink/70 leading-relaxed">
                {t("solution.body")}
              </p>
            </AnimatedSection>

            <AnimatedGroup className="border-y border-line divide-y divide-line">
              {items.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-5 py-6">
                  <Icon
                    className="w-5 h-5 text-ink flex-shrink-0 mt-1"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-semibold text-ink mb-1">{title}</h3>
                    <p className="text-ink/70 text-[15px] leading-relaxed">
                      {body}
                    </p>
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
