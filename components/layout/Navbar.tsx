"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { WaitlistModal } from "@/components/ui/WaitlistModal";
import { Logomark } from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";

export function Navbar() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(251, 249, 244, 0.94)" : "transparent",
        borderBottom: scrolled
          ? "1px solid rgba(16, 25, 21, 0.08)"
          : "1px solid transparent",
      }}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logomark className="w-8 h-8" />
          <span className="font-semibold text-ink text-lg tracking-tight">
            Osppy
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <button
            onClick={() => setWaitlistOpen(true)}
            className="hidden sm:inline-flex text-sm font-medium text-ink/70 hover:text-ink px-3 py-2 transition-colors"
          >
            {t("auth.signIn")}
          </button>
          <Link
            href="/#demo"
            className="px-4 py-2 rounded-full bg-turquoise-deep text-white text-sm font-semibold hover:bg-turquoise transition-colors"
          >
            {t("nav.cta")}
          </Link>
        </div>
      </div>

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </motion.header>
  );
}
