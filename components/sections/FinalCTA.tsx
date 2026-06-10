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
      "w-full bg-transparent px-1 py-3.5 border-0 border-b rounded-none text-ink placeholder:text-ink/40 text-base outline-none transition-colors",
      hasError ? "border-red-500/70" : "border-ink/20 focus:border-ink"
    );

  return (
    <section id="demo" className="bg-canvas py-32 lg:py-40 px-4 sm:px-6 bg-grid-pattern">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedSection className="mb-12">
          <p className="eyebrow mb-4">{t("cta.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em] mb-5">
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-turquoise-deep text-white font-semibold text-base hover:bg-turquoise transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              >
                {t("cta.form.submit")}
                <ArrowRight className="w-4 h-4" />
              </button>
              {failed && (
                <p className="text-sm text-red-500/90 mt-1">{t("cta.form.error")}</p>
              )}
            </form>
          )}

          <p className="text-xs text-ink/70 mt-5">{t("cta.microcopy")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
