"use client";

import { useRef, type ReactNode } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";
import { DUR, VIEWPORT } from "@/lib/motion";
import { GSAP_EASE_EXPO, MOTION_OK, startAtAmount } from "@/lib/gsap-motion";

/**
 * An SVG stroke that draws itself when the diagram arrives. Renders a <g>
 * inside an <svg>; every stroked child under it is drawn in order. Nothing
 * runs under reduced motion, and the strokes are simply there — the diagram
 * is information, not decoration, and a reader who asked for less motion
 * still needs to see the arrows.
 *
 * DrawSVGPlugin rather than hand-rolled stroke-dasharray: it measures the
 * real path length for every shape type, including a <line> and a <polyline>
 * whose getTotalLength browsers disagree about. It has been part of the free
 * GSAP distribution since 3.13, so this costs a plugin import and no licence.
 */
export function PathDraw({
  children,
  className,
  stagger = 0.18,
  delay = 0,
  duration = DUR.slow,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(DrawSVGPlugin);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const strokes = gsap.utils.toArray<SVGElement>("path, line, polyline, circle, rect");
        if (strokes.length === 0) return;
        gsap.from(strokes, {
          drawSVG: "0%",
          duration,
          delay,
          stagger,
          ease: GSAP_EASE_EXPO,
          scrollTrigger: {
            trigger: ref.current,
            start: startAtAmount(VIEWPORT.amount),
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [stagger, delay, duration], scope: ref },
  );

  return (
    <g ref={ref} className={cn(className)}>
      {children}
    </g>
  );
}
