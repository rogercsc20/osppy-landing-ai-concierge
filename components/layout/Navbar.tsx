"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logomark } from "@/components/ui/Logo";
import { Link, usePathname } from "@/i18n/navigation";
import { APP_LOGIN_URL, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

// Home section anchors the observer tracks (their ids arrive with L4).
const HOME_SECTIONS = ["hacemos", "ayudamos", "como"] as const;
type SectionId = (typeof HOME_SECTIONS)[number];

const LINKS = [
  { key: "inicio", pathname: "/", hash: undefined },
  { key: "hacemos", pathname: "/", hash: "#hacemos" },
  { key: "ayudamos", pathname: "/", hash: "#ayudamos" },
  { key: "como", pathname: "/", hash: "#como" },
  { key: "hoteles", pathname: "/hoteles", hash: undefined },
  { key: "citas", pathname: "/citas", hash: undefined },
] as const;

export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // One CTA per screen: the navbar's appears once the hero's own CTA is gone.
  const [pastHero, setPastHero] = useState(false);
  const [section, setSection] = useState<SectionId | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the visible home section; the band in the middle of the viewport
  // decides which link is active.
  useEffect(() => {
    if (pathname !== "/") return;
    const els = HOME_SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSection(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Mobile menu: focus trapped, Escape closes, body scroll locked.
  useEffect(() => {
    if (!open) return;
    const focusables =
      menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [];
    focusables[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        openButtonRef.current?.focus();
      }
      if (e.key === "Tab" && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeSection = pathname === "/" ? section : null;
  // /hoteles opens on the product's dark object (HQA-D27): while the bar is
  // still transparent over it, it borrows the hotel roles so its text reads;
  // once scrolled it paints the site theme like everywhere else.
  const overDarkHero = pathname === "/hoteles" && !scrolled;

  const isActive = (link: (typeof LINKS)[number]) => {
    if (link.hash) return activeSection === link.hash.slice(1);
    if (link.pathname === "/") return pathname === "/" && activeSection === null;
    return pathname === link.pathname;
  };

  const linkItems = (onNavigate?: () => void) =>
    LINKS.map((link) => (
      <Link
        key={link.key}
        href={
          link.hash
            ? ({ pathname: link.pathname, hash: link.hash } as never)
            : (link.pathname as never)
        }
        onClick={onNavigate}
        aria-current={isActive(link) ? "true" : undefined}
        className={cn(
          "rounded-full px-3 py-2 text-sm font-medium transition-colors",
          isActive(link)
            ? "text-accent-text"
            : "text-text-2 hover:text-text",
        )}
      >
        {t(`nav.${link.key}`)}
      </Link>
    ));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6",
          overDarkHero && "theme-hotel",
        )}
      >
        {/* Logo: glyph + wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <Logomark className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight text-text">Osppy</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center lg:flex" aria-label="principal">
          {linkItems()}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
          {/* Plain <a>, not the i18n Link: the console lives on another
              origin (app.osppy.com). */}
          <a
            href={APP_LOGIN_URL}
            className="hidden whitespace-nowrap px-2 text-sm font-medium text-text-2 transition-colors hover:text-text sm:inline-flex"
          >
            {t("nav.login")}
          </a>
          <a
            href={whatsappHref(t("nav.ctaMessage"))}
            className={cn(
              "hidden whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity duration-300 sm:inline-flex",
            pastHero ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            tabIndex={pastHero ? undefined : -1}
          >
            {t("nav.cta")}
          </a>
          <button
            ref={openButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("nav.menu")}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-2 hover:text-text lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-bg px-6 pt-5 pb-10 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Logomark className="h-8 w-8" />
              <span className="text-lg font-semibold tracking-tight text-text">Osppy</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("nav.close")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-2 hover:text-text"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <nav
            className="mt-10 flex flex-col gap-2 text-lg"
            aria-label="principal"
          >
            {linkItems(() => setOpen(false))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <a
              href={whatsappHref(t("nav.ctaMessage"))}
              className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              {t("nav.cta")}
            </a>
            <a
              href={APP_LOGIN_URL}
              className="text-center text-sm font-medium text-text-2 hover:text-text"
            >
              {t("nav.login")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
