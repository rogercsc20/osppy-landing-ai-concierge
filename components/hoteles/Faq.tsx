"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Item {
  q: string;
  a: string;
}

function Row({ item, isOpen, onToggle }: { item: Item; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        className="group flex min-h-[48px] w-full items-center justify-between gap-4 py-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium leading-snug text-text transition-colors group-hover:text-text/70">{item.q}</span>
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-text/20 text-text/50 transition-colors group-hover:border-text/50 group-hover:text-text">
          {isOpen ? <Minus className="h-3 w-3" aria-hidden="true" /> : <Plus className="h-3 w-3" aria-hidden="true" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p className="pb-6 pr-10 text-sm leading-relaxed text-text-2">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Six questions from the source of truth's objections (§4.11) and its
   message bank (§10), answered honestly: no dates, no integrations, no
   replacing anyone. */
export function Faq() {
  const t = useTranslations("hoteles.faq");
  const [open, setOpen] = useState<number | null>(0);
  const items: Item[] = (["1", "2", "3", "4", "5", "6"] as const).map((i) => ({ q: t(`q${i}`), a: t(`a${i}`) }));

  return (
    <section className="bg-bg-alt px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-3xl">
        <AnimatedSection className="mb-14 text-center lg:mb-16">
          <p className="eyebrow mb-4">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.01em] text-text">
            {t("headline")}
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="border-t border-line">
            {items.map((item, i) => (
              <Row key={item.q} item={item} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
