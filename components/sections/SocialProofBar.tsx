import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function SocialProofBar() {
  const t = useTranslations();

  const stats = [
    t("proof.stat1"),
    t("proof.stat2"),
    t("proof.stat3"),
  ];

  return (
    <section className="bg-[#0a1628] border-y border-[#4a90e2]/10 py-8 px-4 sm:px-6">
      <AnimatedSection>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
          <p className="text-sm text-white/50 font-medium">
            {t("proof.bar")}
          </p>

          <div className="hidden sm:block w-px h-5 bg-white/10" />

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {i > 0 && <div className="hidden sm:block w-px h-4 bg-white/10" />}
                <span className="text-sm font-semibold text-[#4a90e2]">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
