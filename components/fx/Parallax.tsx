"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";
import { MOTION_OK } from "@/lib/gsap-motion";

/**
 * Content that drifts against the page as it crosses the viewport.
 * `distance` is the total travel in pixels, centred on the crossing: 60 means
 * +30 on the way in and -30 on the way out. Nothing runs under reduced
 * motion, so the element sits where the layout put it.
 *
 * `ease: "none"` is not a style choice here: with `scrub`, the tween's
 * progress IS the scroll position, so any other curve makes the element
 * travel at a different rate than the finger and reads as lag.
 */
export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { y: distance / 2 },
          {
            y: -distance / 2,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              // a number, not `true`: half a second of catch-up is the same
              // softness the old useSpring(SPRING.soft) gave this element
              scrub: 0.5,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { dependencies: [distance], scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
