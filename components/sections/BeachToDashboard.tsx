"use client";

import { useRef, useState, useEffect } from "react";
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
  ChevronDown,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Home,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logomark } from "@/components/ui/Logo";
import { IPhone } from "@/components/device/IPhone";
import { AppWindow } from "@/components/device/AppWindow";

type T = ReturnType<typeof useTranslations>;

interface Row {
  name: string;
  preview: string;
  status: "ai" | "you";
  time: string;
  initial: string;
}

const PHONE_BARS = [3, 5, 4, 7, 9, 8, 11, 13, 10, 14, 12, 16, 13, 9];

/**
 * Renders children at a fixed `designWidth` (so their container queries see a
 * wide container and lay out like the desktop view) and uses transform: scale
 * to shrink the whole thing to fit the available width. Unlike `zoom`, scale
 * does NOT shrink the layout box, so the container queries still see the full
 * design width. The outer height is set to the scaled content height so there
 * is no blank space below.
 */
function FitToWidth({ designWidth, children }: { designWidth: number; children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const outer = outerRef.current;
    const content = contentRef.current;
    if (!outer || !content) return;
    const update = () => {
      const s = outer.clientWidth / designWidth;
      setScale(s);
      setHeight(content.offsetHeight * s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(content);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div ref={outerRef} className="w-full overflow-hidden" style={{ height }}>
      <div
        ref={contentRef}
        style={{ width: designWidth, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

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
          <Logomark className="h-7 w-7 bg-turquoise-glow" />
          <div>
            <p className="text-[13px] font-semibold leading-tight text-white">{t("dashboard.title")}</p>
            <p className="text-[10px] text-white/40">{t("dashboard.hotel")}</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium text-turquoise-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-turquoise-glow" />
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
                      accent === "coral" ? "text-coral" : accent === "turquoise" ? "text-turquoise-glow" : "text-white/40"
                    )}
                  />
                  {live && <span className="h-1.5 w-1.5 rounded-full bg-turquoise-glow" />}
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
                      row.status === "ai" ? "bg-turquoise-glow/15 text-turquoise-glow" : "bg-coral/15 text-coral"
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
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-turquoise-glow/30 to-turquoise-glow"
                  style={{ height: `${(b / maxBar) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
              <div>
                <p className="text-lg font-semibold leading-none text-turquoise-glow">94%</p>
                <p className="mt-1 text-[10px] text-white/45">{t("dashboard.resolved")}</p>
              </div>
              <BarChart3 className="h-5 w-5 text-turquoise-glow/50" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* bottom tab bar — interactive */}
      <div className="flex flex-shrink-0 items-center justify-around border-t border-white/8 px-6 pb-7 pt-3">
        {[Home, MessageCircle, BarChart3, Settings].map((Icon, i) => (
          <button key={i} onClick={() => setActiveTab(i)} className="p-1" aria-label={`tab ${i + 1}`}>
            <Icon className={cn("h-5 w-5 transition-colors", i === activeTab ? "text-turquoise-glow" : "text-white/35")} />
          </button>
        ))}
      </div>
    </div>
  );
}

/** The phone's lock screen: wallpaper, clock, Osppy notification, lock pill. */
function LockScreen({ t }: { t: T }) {
  return (
    // decorative mockup — hidden from assistive tech
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#0b5a6b] via-[#0d3540] to-[#0b141a]"
    >
      <div className="absolute left-[-20%] top-[10%] h-40 w-40 rounded-full bg-turquoise-glow/40 blur-3xl" />
      <div className="absolute right-[-15%] top-[35%] h-48 w-48 rounded-full bg-ember blur-3xl" />

      <div className="relative z-10 mt-3 pt-14 text-center text-white">
        <p className="text-sm font-medium text-white/80">{t("dashboardReveal.lockDate")}</p>
        <p className="font-display text-[64px] font-semibold leading-none tracking-tight">9:41</p>
      </div>

      <div className="relative z-10 mt-auto px-4 pb-4">
        <div className="flex items-start gap-3 rounded-2xl bg-white/15 p-3.5 backdrop-blur-md">
          <Logomark className="h-9 w-9 flex-shrink-0 rounded-xl bg-turquoise-glow" />
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



export function BeachToDashboard() {
  const t = useTranslations();
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Each beat gets a dwell before the next begins; ranges deliberately
  // overlap only where two elements crossfade.
  //
  // Function-form mappings (not range arrays) are REQUIRED here: framer
  // compiles numeric range mappings into native ScrollTimeline animations,
  // which track the wrong progress inside this position:sticky container
  // (Chrome). Functions can't be compiled, so they stay on the correct
  // JS-driven path.
  const ramp = (v: number, from: number, to: number, a: number, b: number) => {
    const p = Math.min(1, Math.max(0, (v - from) / (to - from)));
    return a + p * (b - a);
  };
  // 1) lock dwell (0–.16), then the lock screen slides up
  const lockY = useTransform(scrollYProgress, [0.16, 0.34], ["0%", "-100%"]);
  const lockOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.26, 0.36, 1, 0));
  // 2) app dwell, then it scrolls down to reveal the graph (.4–.62)
  const appScrollY = useTransform(scrollYProgress, (v) => ramp(v, 0.4, 0.62, 0, -210));
  // 3) graph dwell, then phone → desktop: the dashboard gains substance
  //    (scale .6→1) while the phone is still visible, so the handoff
  //    crossfades instead of cutting; settled dwell from .92 to the end
  const phoneScale = useTransform(scrollYProgress, (v) => ramp(v, 0.68, 0.84, 1, 1.18));
  const phoneOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.74, 0.84, 1, 0));
  const dashOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.72, 0.86, 0, 1));
  const dashScale = useTransform(scrollYProgress, (v) => ramp(v, 0.68, 0.92, 0.6, 1));
  const dashHeadline = useTransform(scrollYProgress, (v) => ramp(v, 0.88, 0.96, 0, 1));

  // enable clicks on the dashboard only once it has settled
  const [dashInteractive, setDashInteractive] = useState(false);
  useMotionValueEvent(dashOpacity, "change", (v) => setDashInteractive(v > 0.6));

  return (
    <section
      ref={ref}
      className={cn("relative bg-gradient-to-b from-canvas via-ink-panel to-canvas text-white", !reduce && "lg:h-[380vh]")}
    >
      {/* ───────── Mobile + reduced-motion: static, fully interactive ───────── */}
      <div className={cn("px-4 sm:px-6 py-20", reduce ? "block" : "lg:hidden")}>
        {/* phone */}
        <AnimatedSection className="flex flex-col items-center">
          <IPhone width={300} className="mx-auto">
            <PhoneApp t={t} />
          </IPhone>
        </AnimatedSection>

        {/* connector: implies the phone "opens into" the dashboard */}
        <div className="flex flex-col items-center gap-2 py-7 text-center">
          <div className="h-10 w-px bg-gradient-to-b from-turquoise-glow/0 to-turquoise-glow/60" />
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-turquoise-glow/40 bg-turquoise-glow/10 text-turquoise-glow">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>

        {/* headline */}
        <AnimatedSection className="text-center">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            {t("dashboardReveal.headline")}
          </h2>
          <p className="mt-3 text-white/60">{t("dashboardReveal.sub")}</p>
        </AnimatedSection>

        {/* dashboard in a normally-proportioned MacBook; the screen scrolls */}
        <AnimatedSection delay={0.1} className="mx-auto mt-8 max-w-md">
          <AppWindow compact>
            <FitToWidth designWidth={760}>
              <DashboardMockup className="rounded-none border-0 shadow-none" />
            </FitToWidth>
          </AppWindow>
        </AnimatedSection>
      </div>

      {/* ───────── Desktop: scroll-scrubbed unlock → graph → MacBook ───────── */}
      {!reduce && (
        <div className="sticky top-0 hidden h-screen items-center justify-center overflow-hidden lg:flex">
          {/* stage dressing: engineering grid + teal core + ember floor */}
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern mask-radial-fade opacity-60" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-turquoise-glow/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-20%] left-1/2 h-80 w-[60%] -translate-x-1/2 rounded-full bg-ember blur-3xl" />

          {/* Phone (unlock + internal graph scroll) */}
          <motion.div style={{ scale: phoneScale, opacity: phoneOpacity }} className="pointer-events-none relative z-10">
            <div
              aria-hidden="true"
              className="absolute -inset-14 -z-10 rounded-[6rem] bg-[radial-gradient(closest-side,rgba(34,196,217,0.22),transparent)] blur-2xl"
            />
            <IPhone width={300} className="mx-auto">
              <PhoneApp t={t} contentY={appScrollY} />

              <motion.div style={{ y: lockY, opacity: lockOpacity }} className="absolute inset-0 z-30">
                <LockScreen t={t} />
              </motion.div>
            </IPhone>
          </motion.div>

          {/* Desktop dashboard in a MacBook */}
          <motion.div
            style={{ opacity: dashOpacity, scale: dashScale, pointerEvents: dashInteractive ? "auto" : "none" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
          >
            <motion.div style={{ opacity: dashHeadline }} className="mb-8 text-center">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.01em] xl:text-4xl">
                {t("dashboardReveal.headline")}
              </h2>
              <p className="mt-2 text-sm text-white/60 xl:text-base">
                {t("dashboardReveal.sub")}
              </p>
            </motion.div>
            <AppWindow className="w-full max-w-6xl">
              <DashboardMockup className="rounded-none border-0 shadow-none" />
            </AppWindow>
          </motion.div>
        </div>
      )}
    </section>
  );
}
