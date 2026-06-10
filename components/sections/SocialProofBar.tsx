import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function SocialProofBar() {
  const t = useTranslations();

  const stats = [t("proof.stat1"), t("proof.stat2"), t("proof.stat3")];

  return (
    <section className="bg-canvas border-y border-line py-9 px-4 sm:px-6">
      <AnimatedSection>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
          <p className="text-sm text-ink/70">{t("proof.bar")}</p>

          <div className="hidden sm:block w-px h-5 bg-line" />

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {i > 0 && <div className="hidden sm:block w-px h-4 bg-line" />}
                <span className="text-sm font-semibold tracking-tight text-ink">
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
