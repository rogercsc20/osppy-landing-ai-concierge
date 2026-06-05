"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, CheckCircle2, ArrowRight } from "lucide-react";

export function WaitlistModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-warm-white p-7 shadow-2xl shadow-ink/20"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <button
              onClick={onClose}
              aria-label={t("auth.close")}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-turquoise-deep text-lg font-bold text-white">
              O
            </div>

            {!submitted ? (
              <>
                <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
                  {t("auth.modalTitle")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {t("auth.modalBody")}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="mt-6 flex flex-col gap-2 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    placeholder={t("auth.emailPlaceholder")}
                    className="flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-turquoise"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-turquoise-deep px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-turquoise"
                  >
                    {t("auth.submit")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-start gap-3 py-2">
                <CheckCircle2 className="h-10 w-10 text-turquoise" />
                <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
                  {t("auth.success")}
                </h3>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
