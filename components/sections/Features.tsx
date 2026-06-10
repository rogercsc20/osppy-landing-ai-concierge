import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";
import {
  MessageSquare,
  Clock,
  Globe,
  Settings,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";

export function Features() {
  const t = useTranslations();

  const features = [
    { icon: MessageSquare, title: t("features.f1.title"), body: t("features.f1.body") },
    { icon: Clock, title: t("features.f2.title"), body: t("features.f2.body") },
    { icon: Globe, title: t("features.f3.title"), body: t("features.f3.body") },
    { icon: Settings, title: t("features.f4.title"), body: t("features.f4.body") },
    { icon: ArrowUpRight, title: t("features.f5.title"), body: t("features.f5.body") },
    { icon: DollarSign, title: t("features.f6.title"), body: t("features.f6.body") },
  ];

  return (
    <section className="bg-canvas py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <p className="eyebrow mb-4">{t("features.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em]">
            {t("features.headline")}
          </h2>
        </AnimatedSection>

        {/* Hairline lattice: container draws top/left, cells draw bottom/right */}
        <AnimatedGroup
          stagger={0.06}
          className="grid grid-cols-2 lg:grid-cols-3 border-t border-l border-line"
        >
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="h-full p-6 lg:p-9 border-b border-r border-line hover:bg-ink/[0.02] transition-colors"
            >
              <Icon className="w-5 h-5 text-ink mb-5" strokeWidth={1.5} />
              <h3 className="font-semibold text-ink mb-1.5 text-sm lg:text-base">
                {title}
              </h3>
              <p className="text-ink/70 text-xs lg:text-sm leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
