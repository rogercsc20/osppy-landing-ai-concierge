"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { SPRING } from "@/lib/motion";

/* ── Scenes ────────────────────────────────────────────────────────────────
   A chapter can re-colour the page's auras as it arrives: the WHY ring warm,
   the HOW ring green, a product page teal. The colours live in CSS variables
   registered in app/globals.css, so the change tweens over 1.4 s instead of
   cutting. The PAGE changes colour, not the section. */

export type Scene = { glow2?: string; glow3?: string; glow4?: string };

const AtmosphereContext = createContext<(scene: Scene | null) => void>(() => {});

export function useAtmosphereScene() {
  return useContext(AtmosphereContext);
}

/**
 * Wraps a chapter: while it is in view, the page's auras take its colours.
 * Leaving the last scene mounted is deliberate — the atmosphere holds the
 * colour of the chapter you are reading until the next one claims it.
 */
export function Scene({
  glow2,
  glow3,
  glow4,
  children,
  className,
}: Scene & { children: ReactNode; className?: string }) {
  const setScene = useAtmosphereScene();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    if (inView) setScene({ glow2, glow3, glow4 });
  }, [inView, glow2, glow3, glow4, setScene]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ── The layer ─────────────────────────────────────────────────────────────
   One fixed layer under the whole site, mounted once in the locale layout.
   It is the only element allowed to clip (`contain: strict` clips it to the
   viewport), which is what lets every <section> above it stay transparent:
   no glow is ever cut by a section edge (landing v2 §2).

   Four blobs, 70–110 vmax, painted as pre-blurred radial gradients — a
   `filter: blur()` on an element that size costs more than the whole page.
   They drift on transform alone (CSS keyframes) and lag the scroll through a
   single shared useScroll, so the page feels like it travels through the
   atmosphere rather than dragging it along. */

const BLOBS = [
  { glow: 1, className: "-left-[25%] -top-[30%] h-[110vmax] w-[110vmax]", dur: 90, dx: "5%", dy: "4%", scale: 1.1, drift: -120 },
  { glow: 2, className: "-right-[20%] top-[18%] h-[85vmax] w-[85vmax]", dur: 72, dx: "-6%", dy: "-5%", scale: 1.12, drift: -220 },
  { glow: 3, className: "left-[0%] top-[58%] h-[70vmax] w-[70vmax]", dur: 58, dx: "7%", dy: "-6%", scale: 1.15, drift: -320 },
  { glow: 4, className: "right-[5%] top-[86%] h-[78vmax] w-[78vmax]", dur: 84, dx: "-4%", dy: "5%", scale: 1.08, drift: -420 },
] as const;

function Blob({
  spec,
  progress,
}: {
  spec: (typeof BLOBS)[number];
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, (v) => v * spec.drift);

  // The drift keyframes and the aura colour are plain CSS custom properties;
  // only `y` is animated from JS, so the two are set separately.
  const vars = {
    "--atmos-dur": `${spec.dur}s`,
    "--atmos-dx": spec.dx,
    "--atmos-dy": spec.dy,
    "--atmos-scale": spec.scale,
    background: `radial-gradient(closest-side, color-mix(in srgb, var(--glow-${spec.glow}) var(--glow-${spec.glow}-a), transparent), transparent 72%)`,
  } as React.CSSProperties;

  return (
    <motion.div className={`atmos-blob ${spec.className}`} style={{ y, ...vars }} />
  );
}

export function Atmosphere({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, SPRING.soft);
  const progress = useTransform(smooth, (v) => (reduce ? 0 : v));

  const setScene = useCallback((scene: Scene | null) => {
    const root = document.documentElement.style;
    for (const [key, value] of [
      ["--glow-2", scene?.glow2],
      ["--glow-3", scene?.glow3],
      ["--glow-4", scene?.glow4],
    ] as const) {
      if (value) root.setProperty(key, value);
      else root.removeProperty(key);
    }
  }, []);

  const blobs = useMemo(
    () => BLOBS.map((spec) => <Blob key={spec.glow} spec={spec} progress={progress} />),
    [progress],
  );

  return (
    <AtmosphereContext.Provider value={setScene}>
      <div className="atmos-layer" aria-hidden="true">
        {blobs}
        <div className="atmos-grain" />
        <div className="atmos-navshade" />
      </div>
      {/* The page rides above the layer. overflow-x: clip is the site's one
          horizontal guard: a section's decoration may bleed DOWN into the
          next section (that is the whole point) but never sideways past the
          viewport. `clip` and not `hidden`, so position: sticky keeps
          working, and only on x, so the vertical bleed survives. */}
      <div className="relative z-10 overflow-x-clip overflow-y-visible">{children}</div>
    </AtmosphereContext.Provider>
  );
}
