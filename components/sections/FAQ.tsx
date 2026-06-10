"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

function FAQRow({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group min-h-[48px]"
        aria-expanded={isOpen}
      >
        <span className="text-ink font-medium leading-snug group-hover:text-ink/70 transition-colors">
          {item.q}
        </span>
        <div className="flex-shrink-0 w-6 h-6 rounded-full border border-ink/20 flex items-center justify-center text-ink/50 group-hover:border-ink/50 group-hover:text-ink transition-colors">
          {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
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
            <p className="text-ink/70 leading-relaxed text-sm pb-6 pr-10">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const t = useTranslations();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items: FAQItem[] = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

  return (
    <section className="bg-sand py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="text-center mb-14 lg:mb-16">
          <p className="eyebrow mb-4">{t("faq.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em]">
            {t("faq.headline")}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="border-t border-line">
            {items.map((item, i) => (
              <FAQRow
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
