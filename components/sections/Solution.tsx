import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";
import { WhatsAppMockup } from "@/components/ui/WhatsAppMockup";
import { Zap, Mic, ArrowUpRight } from "lucide-react";

export function Solution() {
  const t = useTranslations();

  const cards = [
    {
      icon: Zap,
      title: t("solution.card1.title"),
      body: t("solution.card1.body"),
    },
    {
      icon: Mic,
      title: t("solution.card2.title"),
      body: t("solution.card2.body"),
    },
    {
      icon: ArrowUpRight,
      title: t("solution.card3.title"),
      body: t("solution.card3.body"),
    },
  ];

  return (
    <section className="bg-[#0a1628] py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: WhatsApp mockup */}
          <div className="order-2 lg:order-1 flex justify-center">
            <WhatsAppMockup variant="static" />
          </div>

          {/* Right: copy + cards */}
          <div className="order-1 lg:order-2">
            <AnimatedSection className="mb-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
                {t("solution.headline")}
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                {t("solution.body")}
              </p>
            </AnimatedSection>

            <AnimatedGroup className="flex flex-col gap-4">
              {cards.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#4a90e2]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-[#4a90e2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{body}</p>
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
