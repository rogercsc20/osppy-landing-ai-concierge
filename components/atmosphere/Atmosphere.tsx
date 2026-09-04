"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";
import { MOTION_OK } from "@/lib/gsap-motion";

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
 *
 * A plain ScrollTrigger with no animation: it exists only for its callback.
 * `onEnter` and `onEnterBack` both claim the scene, so reading the page
 * upwards re-colours it the same way reading it downwards does. This one
 * runs under reduced motion too — the colour change is a 1.4 s CSS variable
 * transition on a background, not movement, and losing it would leave every
 * chapter of the page the same colour.
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

  useGSAP(
    () => {
      const claim = () => setScene({ glow2, glow3, glow4 });
      const st = ScrollTrigger.create({
        trigger: ref.current,
        // 40 % of the chapter showing, which is where useInView's
        // amount: 0.4 used to fire
        start: "40% bottom",
        end: "bottom 40%",
        onEnter: claim,
        onEnterBack: claim,
      });
      return () => st.kill();
    },
    { dependencies: [glow2, glow3, glow4, setScene], scope: ref },
  );

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
   They drift on transform alone (CSS keyframes) and lag the scroll through
   ScrollTrigger, so the page feels like it travels through the atmosphere
   rather than dragging it along. */

const BLOBS = [
  { glow: 1, className: "-left-[25%] -top-[30%] h-[110vmax] w-[110vmax]", dur: 90, dx: "5%", dy: "4%", scale: 1.1, drift: -120 },
  { glow: 2, className: "-right-[20%] top-[18%] h-[85vmax] w-[85vmax]", dur: 72, dx: "-6%", dy: "-5%", scale: 1.12, drift: -220 },
  { glow: 3, className: "left-[0%] top-[58%] h-[70vmax] w-[70vmax]", dur: 58, dx: "7%", dy: "-6%", scale: 1.15, drift: -320 },
  { glow: 4, className: "right-[5%] top-[86%] h-[78vmax] w-[78vmax]", dur: 84, dx: "-4%", dy: "5%", scale: 1.08, drift: -420 },
] as const;

function Blob({ spec }: { spec: (typeof BLOBS)[number] }) {
  // The drift keyframes and the aura colour are plain CSS custom properties;
  // only the scroll lag is animated from JS, so the two are set separately.
  const vars = {
    "--atmos-dur": `${spec.dur}s`,
    "--atmos-dx": spec.dx,
    "--atmos-dy": spec.dy,
    "--atmos-scale": spec.scale,
    background: `radial-gradient(closest-side, color-mix(in srgb, var(--glow-${spec.glow}) var(--glow-${spec.glow}-a), transparent), transparent 72%)`,
  } as React.CSSProperties;

  // Two elements, one transform each. The @keyframes atmos-drift in
  // globals.css already owns `transform` on .atmos-blob, and GSAP writing to
  // the same property would cancel the drift outright — the failure would be
  // a blob that stops breathing, which no test would ever notice. The
  // scroll lag therefore moves a WRAPPER. It is `inset-0`, the same box as
  // the layer, so the blob's own `-left-[25%]` offsets still resolve against
  // an identical containing block: a transformed ancestor becomes the
  // containing block for its absolute descendants, and a zero-sized wrapper
  // would have silently re-anchored every blob.
  return (
    <div className="atmos-drift absolute inset-0" data-drift={spec.drift}>
      <div className={`atmos-blob ${spec.className}`} style={vars} />
    </div>
  );
}

export function Atmosphere({ children }: { children: ReactNode }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // One trigger for the whole document rather than one per blob: they
        // all read the same scroll, and four triggers on the same range is
        // four sets of the same arithmetic every frame.
        const wraps = gsap.utils.toArray<HTMLElement>(".atmos-drift");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });
        for (const el of wraps) {
          tl.to(el, { y: Number(el.dataset.drift), ease: "none" }, 0);
        }
      });
      return () => mm.revert();
    },
    { scope: layerRef },
  );

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

  return (
    <AtmosphereContext.Provider value={setScene}>
      <div ref={layerRef} className="atmos-layer" aria-hidden="true">
        {BLOBS.map((spec) => (
          <Blob key={spec.glow} spec={spec} />
        ))}
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
