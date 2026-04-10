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
    <section className="bg-[#f8f6f1] py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-4">
            {t("features.headline")}
          </h2>
        </AnimatedSection>

        <AnimatedGroup
          stagger={0.08}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-5 lg:p-6 border border-[#1a1a2e]/5 group hover:border-[#4a90e2]/30 hover:shadow-md transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0a1628]/5 flex items-center justify-center mb-4 group-hover:bg-[#4a90e2]/10 transition-colors">
                <Icon className="w-4 h-4 text-[#0a1628] group-hover:text-[#4a90e2] transition-colors" />
              </div>
              <h3 className="font-semibold text-[#1a1a2e] mb-1.5 text-sm lg:text-base">{title}</h3>
              <p className="text-[#1a1a2e]/50 text-xs lg:text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
