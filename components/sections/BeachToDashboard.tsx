"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { DashboardMockup } from "@/components/ui/DashboardMockup";
import {
  ChevronUp,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Home,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type T = ReturnType<typeof useTranslations>;

interface Row {
  name: string;
  preview: string;
  status: "ai" | "you";
  time: string;
  initial: string;
}

const PHONE_BARS = [3, 5, 4, 7, 9, 8, 11, 13, 10, 14, 12, 16, 13, 9];

/** Native-looking mobile app screen shown inside the phone after unlock. */
function PhoneApp({ t, contentY }: { t: T; contentY?: MotionValue<number> }) {
  const rows = (t.raw("dashboard.rows") as Row[]).slice(0, 4);
  const [activeTab, setActiveTab] = useState(0);
  const maxBar = Math.max(...PHONE_BARS);

  const kpis = [
    { icon: MessageCircle, value: "7", label: t("dashboard.kpi.open"), live: true },
    { icon: CheckCircle2, value: "32", label: t("dashboard.kpi.closed"), accent: "turquoise" },
    { icon: AlertTriangle, value: "1", label: t("dashboard.kpi.complaints"), accent: "coral" },
    { icon: Timer, value: "2.4s", label: t("dashboard.kpi.response") },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b141a] pt-11">
      {/* app header */}
      <div className="flex flex-shrink-0 items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-turquoise text-sm font-bold text-white">
            O
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-tight text-white">{t("dashboard.title")}</p>
            <p className="text-[10px] text-white/40">{t("dashboard.hotel")}</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium text-turquoise">
          <span className="h-1.5 w-1.5 rounded-full bg-turquoise" />
          {t("dashboard.live")}
        </span>
      </div>

      {/* scrollable content */}
      <div className={cn("relative flex-1", contentY ? "overflow-hidden" : "overflow-y-auto")}>
        <motion.div style={contentY ? { y: contentY } : undefined} className="flex flex-col gap-3 px-4 pb-10">
          {/* KPI 2×2 */}
          <div className="grid grid-cols-2 gap-2">
            {kpis.map(({ icon: Icon, value, label, live, accent }) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.04] p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5",
                      accent === "coral" ? "text-coral" : accent === "turquoise" ? "text-turquoise" : "text-white/40"
                    )}
                  />
                  {live && <span className="h-1.5 w-1.5 rounded-full bg-turquoise" />}
                </div>
                <p className="text-xl font-semibold leading-none text-white">{value}</p>
                <p className="mt-1 text-[10px] leading-tight text-white/45">{label}</p>
              </div>
            ))}
          </div>

          {/* conversations */}
          <div>
            <p className="mb-2 text-[11px] font-medium text-white/50">{t("dashboard.conversations")}</p>
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <div key={row.name} className="flex items-center gap-2.5 rounded-2xl bg-white/[0.04] p-2.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/8 text-[10px] font-semibold text-white/70">
                    {row.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-white">{row.name}</p>
                    <p className="truncate text-[10px] text-white/45">{row.preview}</p>
                  </div>
                  <span
                    className={cn(
                      "flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium",
                      row.status === "ai" ? "bg-turquoise/15 text-turquoise" : "bg-coral/15 text-coral"
                    )}
                  >
                    {row.status === "ai" ? t("dashboard.statusAI") : t("dashboard.statusYou")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* graph */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-3.5">
            <p className="mb-3 text-[11px] font-medium text-white/60">{t("dashboard.chartTitle")}</p>
            <div className="flex h-32 items-end gap-[3px]">
              {PHONE_BARS.map((b, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-turquoise/30 to-turquoise"
                  style={{ height: `${(b / maxBar) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
              <div>
                <p className="text-lg font-semibold leading-none text-turquoise">94%</p>
                <p className="mt-1 text-[10px] text-white/45">{t("dashboard.resolved")}</p>
              </div>
              <BarChart3 className="h-5 w-5 text-turquoise/50" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* bottom tab bar — interactive */}
      <div className="flex flex-shrink-0 items-center justify-around border-t border-white/8 px-6 pb-7 pt-3">
        {[Home, MessageCircle, BarChart3, Settings].map((Icon, i) => (
          <button key={i} onClick={() => setActiveTab(i)} className="p-1" aria-label={`tab ${i + 1}`}>
            <Icon className={cn("h-5 w-5 transition-colors", i === activeTab ? "text-turquoise" : "text-white/35")} />
          </button>
        ))}
      </div>
    </div>
  );
}

/** The phone's lock screen: wallpaper, clock, Osppy notification, lock pill. */
function LockScreen({ t }: { t: T }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#15788a] via-[#0f3b46] to-[#0b141a]">
      <div className="absolute left-[-20%] top-[10%] h-40 w-40 rounded-full bg-turquoise/40 blur-3xl" />
      <div className="absolute right-[-15%] top-[35%] h-44 w-44 rounded-full bg-coral/20 blur-3xl" />

      <div className="relative z-10 mt-3 pt-14 text-center text-white">
        <p className="text-sm font-medium text-white/80">{t("dashboardReveal.lockDate")}</p>
        <p className="font-display text-[64px] font-semibold leading-none tracking-tight">9:41</p>
      </div>

      <div className="relative z-10 mt-auto px-4 pb-4">
        <div className="flex items-start gap-3 rounded-2xl bg-white/15 p-3.5 backdrop-blur-md">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-turquoise text-sm font-bold text-white">
            O
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-semibold text-white">Osppy</p>
              <span className="text-[10px] text-white/60">{t("dashboardReveal.now")}</span>
            </div>
            <p className="mt-0.5 text-[12px] leading-snug text-white/85">{t("dashboardReveal.notif")}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1 text-white/70">
          <ChevronUp className="h-4 w-4" />
          <span className="text-[11px]">{t("dashboardReveal.swipe")}</span>
        </div>
      </div>
    </div>
  );
}

/** Titanium iPhone frame wrapping arbitrary screen content. */
function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[3rem] bg-gradient-to-b from-[#2a2a2e] to-[#141416] p-[10px] shadow-2xl shadow-black/60 ring-1 ring-white/10", className)}>
      <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[2.4rem] bg-[#0b141a]">
        <div className="absolute left-1/2 top-3 z-40 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
        {children}
        <div className="absolute bottom-2 left-1/2 z-40 h-[5px] w-[110px] -translate-x-1/2 rounded-full bg-white/50" />
      </div>
    </div>
  );
}

/** MacBook frame wrapping the desktop dashboard. */
function Laptop({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* lid / screen */}
      <div className="rounded-[16px] bg-[#1c1c1e] p-[10px] shadow-2xl shadow-black/60 ring-1 ring-white/10">
        <div className="mx-auto mb-1.5 h-1.5 w-1.5 rounded-full bg-white/15" />
        <div className="overflow-hidden rounded-[8px] border border-white/5">{children}</div>
      </div>
      {/* base / hinge */}
      <div className="relative mx-auto h-3 w-[112%] -translate-x-[5.36%] rounded-b-[12px] rounded-t-[3px] bg-gradient-to-b from-[#3a3a3d] to-[#191919] shadow-xl">
        <div className="absolute left-1/2 top-0 h-[7px] w-[92px] -translate-x-1/2 rounded-b-[8px] bg-[#0c0c0e]" />
      </div>
    </div>
  );
}

export function BeachToDashboard() {
  const t = useTranslations();
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 1) unlock: lock screen slides up
  const lockY = useTransform(scrollYProgress, [0.2, 0.4], ["0%", "-100%"]);
  const lockOpacity = useTransform(scrollYProgress, [0.32, 0.42], [1, 0]);
  // 2) phone app scrolls down to reveal the graph
  const appScrollY = useTransform(scrollYProgress, [0.44, 0.7], [0, -210]);
  // 3) phone → desktop (in a MacBook)
  const phoneScale = useTransform(scrollYProgress, [0.72, 0.88], [1, 1.25]);
  const phoneOpacity = useTransform(scrollYProgress, [0.76, 0.88], [1, 0]);
  const dashOpacity = useTransform(scrollYProgress, [0.76, 0.9], [0, 1]);
  const dashScale = useTransform(scrollYProgress, [0.72, 0.94], [0.5, 1]);
  const dashHeadline = useTransform(scrollYProgress, [0.9, 0.97], [0, 1]);

  // enable clicks on the dashboard only once it has settled
  const [dashInteractive, setDashInteractive] = useState(false);
  useMotionValueEvent(dashOpacity, "change", (v) => setDashInteractive(v > 0.6));

  return (
    <section
      ref={ref}
      className={cn("relative bg-gradient-to-b from-[#0b141a] via-ink to-[#0b141a] text-white", !reduce && "lg:h-[380vh]")}
    >
      {/* ───────── Mobile + reduced-motion: static, fully interactive ───────── */}
      <div className={cn("px-4 sm:px-6 py-20", reduce ? "block" : "lg:hidden")}>
        <AnimatedSection className="flex flex-col items-center text-center">
          <Phone>
            <PhoneApp t={t} />
          </Phone>
          <h2 className="font-display mt-8 text-3xl font-semibold leading-tight">
            {t("dashboardReveal.headline")}
          </h2>
          <p className="mt-3 text-white/60">{t("dashboardReveal.sub")}</p>
        </AnimatedSection>
        <AnimatedSection delay={0.15} className="mx-auto mt-10 max-w-3xl">
          <Laptop>
            <DashboardMockup className="rounded-none border-0 shadow-none" />
          </Laptop>
        </AnimatedSection>
      </div>

      {/* ───────── Desktop: scroll-scrubbed unlock → graph → MacBook ───────── */}
      {!reduce && (
        <div className="sticky top-0 hidden h-screen items-center justify-center overflow-hidden lg:flex">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-turquoise/10 blur-3xl" />

          {/* Phone (unlock + internal graph scroll) */}
          <motion.div style={{ scale: phoneScale, opacity: phoneOpacity }} className="pointer-events-none relative z-10">
            <Phone>
              <PhoneApp t={t} contentY={appScrollY} />

              <motion.div style={{ y: lockY, opacity: lockOpacity }} className="absolute inset-0 z-30">
                <LockScreen t={t} />
              </motion.div>
            </Phone>
          </motion.div>

          {/* Desktop dashboard in a MacBook */}
          <motion.div
            style={{ opacity: dashOpacity, scale: dashScale, pointerEvents: dashInteractive ? "auto" : "none" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
          >
            <motion.h2 style={{ opacity: dashHeadline }} className="font-display mb-6 text-center text-2xl font-semibold xl:text-3xl">
              {t("dashboardReveal.headline")}
            </motion.h2>
            <Laptop>
              <DashboardMockup className="rounded-none border-0 shadow-none" />
            </Laptop>
          </motion.div>
        </div>
      )}
    </section>
  );
}
