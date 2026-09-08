/**
 * Background details (HQA-D153): one thick continuous stroke with curves and loops, and soft
 * tinted shapes. Static, decorative, behind the content; the parent crops them (an inner
 * wrapper, never a <section>). Two path variants so no two sections repeat the same drawing.
 */
const PATHS = {
  a: "M-120,520 C120,120 300,140 400,380 C500,620 260,700 240,500 C220,300 560,200 780,360 C1000,520 1120,160 1320,240 C1520,320 1460,640 1700,520",
  b: "M-100,180 C200,480 380,460 480,260 C580,60 320,-20 340,200 C360,420 760,460 900,260 C1040,60 1200,120 1300,320 C1400,520 1520,480 1660,300",
  // `c` keeps the middle clear for centred text: loops at the left and the right, a run along the bottom edge.
  c: "M-120,140 C60,40 260,100 300,280 C340,460 110,560 130,420 C150,280 330,300 260,520 C200,690 500,690 720,690 C940,690 1060,690 1200,640 C1380,570 1400,340 1260,260 C1120,180 1000,300 1120,120 C1200,10 1400,60 1560,40",
};

export function Ribbon({
  variant = "a",
  color = "var(--accent)",
  opacity = 0.55,
  width = 34,
  className = "",
}: {
  variant?: keyof typeof PATHS;
  color?: string;
  opacity?: number;
  width?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 700"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <path d={PATHS[variant]} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
    </svg>
  );
}

export function Shapes({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="absolute -left-[12%] top-[8%] h-[46vw] w-[46vw] rounded-full bg-tinte" />
      <div className="absolute -right-[10%] bottom-[4%] h-[34vw] w-[34vw] rounded-full bg-tinte-2" />
    </div>
  );
}
