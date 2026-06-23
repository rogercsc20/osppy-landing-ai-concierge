"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Logomark } from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";

export function Navbar() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(10, 15, 14, 0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.08)"
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
          {/* Wordmark hidden on phones so the EN toggle + Log in + Book demo
              actions fit on one row (no hamburger). Logomark stays. */}
          <span className="hidden sm:inline font-semibold text-ink text-lg tracking-tight">
            Osppy
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <LanguageToggle />
          <Link
            href="/login"
            className="inline-flex whitespace-nowrap text-sm font-medium text-ink/70 hover:text-ink px-2 py-2 sm:px-3 transition-colors"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/#demo"
            className="whitespace-nowrap px-3 sm:px-4 py-2 rounded-full bg-turquoise-deep text-white text-sm font-semibold hover:bg-turquoise transition-colors"
          >
            {t("nav.cta")}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
