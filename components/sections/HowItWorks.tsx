import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";
import { MessageSquare, Database, Sparkles } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations();

  const steps = [
    { number: "01", icon: MessageSquare, label: t("how.step1") },
    { number: "02", icon: Database, label: t("how.step2") },
    { number: "03", icon: Sparkles, label: t("how.step3") },
  ];

  return (
    <section id="how-it-works" className="bg-sand py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <p className="eyebrow mb-4">{t("how.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em]">
            {t("how.headline")}
          </h2>
        </AnimatedSection>

        {/* Steps: horizontal on desktop, vertical timeline on mobile */}
        <AnimatedGroup className="relative">
          {/* Connector hairline — desktop only */}
          <div className="hidden lg:block absolute top-[2.25rem] left-[16.5%] right-[16.5%] h-px bg-ink/15" />

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 relative">
            {steps.map(({ number, icon: Icon, label }, i) => (
              <div key={number} className="flex lg:flex-col items-start lg:items-center gap-5 lg:gap-4 lg:text-center relative">
                {/* Mobile: vertical connector */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden absolute left-[1.1rem] top-[4.5rem] bottom-[-1.5rem] w-px bg-ink/15" />
                )}

                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-full border border-ink/15 bg-canvas flex items-center justify-center">
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-ink" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-ink/60 bg-sand px-1">
                    {number}
                  </span>
                </div>

                <p className="text-ink/80 font-medium leading-snug lg:max-w-[180px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </AnimatedGroup>

        {/* Time callout — quiet, the pulse dot is the only signal */}
        <AnimatedSection delay={0.3} className="text-center mt-14">
          <span className="inline-flex items-center gap-2.5 text-sm font-medium text-ink/70">
            <span className="w-2 h-2 rounded-full bg-wa-green animate-pulse" />
            {t("how.callout")}
          </span>
        </AnimatedSection>
      </div>
    </section>
  );
}
