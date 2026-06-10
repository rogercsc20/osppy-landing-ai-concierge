"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/lead";
import { CONTACT_EMAIL } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2),
  hotel: z.string().min(2),
  contact: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

export function FinalCTA() {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setFailed(false);
    const result = await submitLead({
      type: "demo",
      name: data.name,
      hotel: data.hotel,
      contact: data.contact,
      _subject: `Osppy demo request — ${data.hotel}`,
    });

    if (result.unconfigured) {
      // No endpoint set yet (e.g. local dev): fall back to a prefilled email.
      const body = encodeURIComponent(
        `Nombre: ${data.name}\nHotel: ${data.hotel}\nContacto: ${data.contact}`
      );
      window.open(`mailto:${CONTACT_EMAIL}?subject=Demo request - ${data.hotel}&body=${body}`);
      setSubmitted(true);
    } else if (result.ok) {
      setSubmitted(true);
    } else {
      setFailed(true);
    }
  };

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full px-5 py-3.5 rounded-xl bg-white border text-ink placeholder:text-ink/35 text-sm outline-none focus:ring-1 transition-all",
      hasError
        ? "border-red-500/60 focus:ring-red-500/40"
        : "border-ink/15 focus:border-turquoise focus:ring-turquoise/30"
    );

  return (
    <section id="demo" className="bg-warm-white py-24 lg:py-32 px-4 sm:px-6 bg-grid-pattern">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedSection className="mb-10">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-[1.1] mb-5">
            {t("cta.headline")}
          </h2>
          <p className="text-lg text-ink/70 leading-relaxed">{t("cta.body")}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <CheckCircle className="w-12 h-12 text-wa-green" />
              <h3 className="text-xl font-semibold text-ink">{t("cta.form.success.title")}</h3>
              <p className="text-ink/65 text-sm max-w-sm">{t("cta.form.success.body")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <input
                {...register("name")}
                placeholder={t("cta.form.name")}
                className={inputClass(!!errors.name)}
              />
              <input
                {...register("hotel")}
                placeholder={t("cta.form.hotel")}
                className={inputClass(!!errors.hotel)}
              />
              <input
                {...register("contact")}
                placeholder={t("cta.form.contact")}
                className={inputClass(!!errors.contact)}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-turquoise-deep text-white font-semibold text-base hover:bg-turquoise hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {t("cta.form.submit")}
                <ArrowRight className="w-4 h-4" />
              </button>
              {failed && (
                <p className="text-sm text-red-500/90 mt-1">{t("cta.form.error")}</p>
              )}
            </form>
          )}

          <p className="text-xs text-ink/45 mt-4">{t("cta.microcopy")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
