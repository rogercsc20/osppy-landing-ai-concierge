"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

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
        backgroundColor: scrolled ? "rgba(8, 14, 26, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(74, 144, 226, 0.1)" : "1px solid transparent",
      }}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#4a90e2] flex items-center justify-center">
            <span className="text-[#0a1628] font-bold text-sm">O</span>
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            osppy
          </span>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a
            href="#demo"
            className="px-4 py-2 rounded-full bg-[#4a90e2] text-[#0a1628] text-sm font-semibold hover:scale-[1.02] transition-transform"
          >
            {t("nav.cta")}
          </a>
        </div>
      </div>
    </motion.header>
  );
}
