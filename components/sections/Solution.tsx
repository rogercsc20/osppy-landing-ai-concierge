"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";
import { WhatsAppMockup } from "@/components/ui/WhatsAppMockup";
import { SplitWords } from "@/components/fx/SplitWords";
import { Zap, Mic, ArrowUpRight } from "lucide-react";

export function Solution() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);

  // The conversation plays itself as the section travels the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.75"],
  });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  const items = [
    { icon: Zap, title: t("solution.card1.title"), body: t("solution.card1.body") },
    { icon: Mic, title: t("solution.card2.title"), body: t("solution.card2.body") },
    { icon: ArrowUpRight, title: t("solution.card3.title"), body: t("solution.card3.body") },
  ];

  return (
    <section className="relative overflow-hidden bg-canvas px-4 py-32 sm:px-6 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: the conversation, typed by your scroll */}
          <div className="relative order-2 flex justify-center lg:order-1">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,211,102,0.13),transparent)] blur-2xl"
            />
            <WhatsAppMockup variant="static" progress={progress} />
          </div>

          {/* Right: copy + hairline list */}
          <div className="order-1 lg:order-2">
            <AnimatedSection className="mb-12">
              <p className="eyebrow mb-5">{t("solution.eyebrow")}</p>
              <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-ink">
                <SplitWords text={t("solution.headline")} />
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink/70">
                {t("solution.body")}
              </p>
            </AnimatedSection>

            <AnimatedGroup className="border-y border-line divide-y divide-line">
              {items.map(({ icon: Icon, title, body }) => (
                <div key={title} className="group flex gap-5 py-6">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-line bg-white/[0.03] transition-colors group-hover:border-turquoise-ink/40">
                    <Icon className="h-4 w-4 text-turquoise-ink" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="mb-1 font-semibold text-ink">{title}</h3>
                    <p className="text-[15px] leading-relaxed text-ink/70">
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
