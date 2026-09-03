"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders children at a fixed `designWidth` and scales the whole thing to the
 * available width, so an object built for a wide container (the operations
 * panel, a document mock) keeps its container queries and its proportions on
 * a phone instead of reflowing into something else. The outer height follows
 * the scaled content.
 *
 * Lifted out of components/hoteles/Circuito.tsx in slice V3: it is a device
 * primitive, not a hotel one.
 */
export function Fit({
  designWidth,
  maxScale = 1,
  children,
}: {
  designWidth: number;
  /** never blow the object up past its design size */
  maxScale?: number;
  children: ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const outer = outerRef.current;
    const content = contentRef.current;
    if (!outer || !content) return;
    const update = () => {
      const s = Math.min(outer.clientWidth / designWidth, maxScale);
      setScale(s);
      setHeight(content.offsetHeight * s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(content);
    return () => ro.disconnect();
  }, [designWidth, maxScale]);

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
