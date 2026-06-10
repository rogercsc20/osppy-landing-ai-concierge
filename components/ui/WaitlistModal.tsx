"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { submitLead } from "@/lib/lead";
import { CONTACT_EMAIL } from "@/lib/site";
import { Logomark } from "@/components/ui/Logo";

export function WaitlistModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape closes; Tab is trapped inside the dialog; focus returns to the
  // trigger when the modal closes.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFailed(false);
    setSubmitting(true);
    const result = await submitLead({
      type: "waitlist",
      email,
      _subject: "Osppy waitlist signup",
    });
    setSubmitting(false);
    if (result.unconfigured) {
      // No endpoint set yet (e.g. local dev): fall back to a prefilled email
      // so the signup is never silently dropped.
      window.open(
        `mailto:${CONTACT_EMAIL}?subject=Osppy waitlist signup&body=${encodeURIComponent(email)}`,
      );
      setSubmitted(true);
    } else if (result.ok) {
      setSubmitted(true);
    } else {
      setFailed(true);
    }
  };

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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-modal-title"
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

            <Logomark className="mb-5 h-11 w-11 rounded-xl" />

            {!submitted ? (
              <>
                <h3
                  id="waitlist-modal-title"
                  className="font-display text-2xl font-semibold leading-tight text-ink"
                >
                  {t("auth.modalTitle")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {t("auth.modalBody")}
                </p>
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("auth.emailPlaceholder")}
                    className="flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-turquoise"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-turquoise-deep px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-turquoise disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {t("auth.submit")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                {failed && (
                  <p className="mt-2 text-sm text-red-500/90">{t("auth.error")}</p>
                )}
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
