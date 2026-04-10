"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  hotel: z.string().min(2),
  contact: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

export function FinalCTA() {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // In production, replace with your Tally form ID or API call.
    // For now, opens a mailto with the lead data pre-filled.
    const body = encodeURIComponent(
      `Nombre: ${data.name}\nHotel: ${data.hotel}\nContacto: ${data.contact}`
    );
    window.open(`mailto:hello@osppy.com?subject=Demo request - ${data.hotel}&body=${body}`);
    setSubmitted(true);
  };

  return (
    <section id="demo" className="bg-[#0a1628] py-24 lg:py-32 px-4 sm:px-6 bg-grid-pattern">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedSection className="mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            {t("cta.headline")}
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            {t("cta.body")}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <CheckCircle className="w-12 h-12 text-[#25d366]" />
              <h3 className="text-xl font-semibold text-white">{t("cta.form.success.title")}</h3>
              <p className="text-white/50 text-sm max-w-sm">{t("cta.form.success.body")}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <input
                {...register("name")}
                placeholder={t("cta.form.name")}
                className={cn(
                  "w-full px-5 py-3.5 rounded-xl bg-white/5 border text-white placeholder:text-white/30 text-sm outline-none focus:ring-1 transition-all",
                  errors.name
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-white/10 focus:border-[#4a90e2]/50 focus:ring-[#4a90e2]/30"
                )}
              />
              <input
                {...register("hotel")}
                placeholder={t("cta.form.hotel")}
                className={cn(
                  "w-full px-5 py-3.5 rounded-xl bg-white/5 border text-white placeholder:text-white/30 text-sm outline-none focus:ring-1 transition-all",
                  errors.hotel
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-white/10 focus:border-[#4a90e2]/50 focus:ring-[#4a90e2]/30"
                )}
              />
              <input
                {...register("contact")}
                placeholder={t("cta.form.contact")}
                className={cn(
                  "w-full px-5 py-3.5 rounded-xl bg-white/5 border text-white placeholder:text-white/30 text-sm outline-none focus:ring-1 transition-all",
                  errors.contact
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-white/10 focus:border-[#4a90e2]/50 focus:ring-[#4a90e2]/30"
                )}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-[#4a90e2] text-[#0a1628] font-semibold text-base hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {t("cta.form.submit")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-xs text-white/25 mt-4">
            Sin spam · Sin compromiso · Respondemos en menos de 24 horas
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
