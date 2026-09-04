"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { ShineButton } from "@/components/ui/ShineButton";
import { Spotlight } from "@/components/fx/Spotlight";
import { whatsappHref } from "@/lib/site";
import dynamic from "next/dynamic";
import { AppWindow } from "@/components/device/AppWindow";

/* The panel body is the repo's FIRST next/dynamic boundary (D4 rule 2): the
   Bklit chart stack (~80 files over visx) must not ride the first load. ONE
   boundary, and it splits the FRAME from the CONTENT: AppWindow is pure
   markup and renders statically, so the window is there from the first
   paint; only its body is deferred, behind a skeleton that reproduces the
   same structure with the same paddings, so nothing jumps when it lands.
   `ssr: false` is legal here because Hero is a client component (the Next 16
   lazy-loading guide: the option only works inside Client Components), and
   it is wanted: the panel is a living demo whose every state is client
   state, and server HTML for it would be a lie the client immediately
   replaces. */
const PanelEmpresa = dynamic(
  () => import("./PanelEmpresa").then((m) => m.PanelEmpresa),
  { ssr: false, loading: () => <PanelSkeleton /> },
);

/** The same boxes the loaded panel paints, empty: top bar, two tiles, five
    queue rows, the chart card. One loading state — the chart's own Bklit
    skeleton takes over INSIDE the loaded panel, so the reader never sees
    two nested spinners fighting (D4 rule 2). */
function PanelSkeleton() {
  return (
    <div className="w-full bg-surface" aria-hidden="true">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
        <div className="h-7 w-7 rounded-lg bg-white/5" />
        <div className="h-4 w-32 rounded bg-white/5" />
        <div className="ml-auto h-6 w-36 rounded-full bg-white/5" />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass h-[92px] rounded-xl" />
          <div className="glass h-[92px] rounded-xl" />
        </div>
        <div className="glass mt-3 rounded-xl p-4">
          <div className="h-4 w-28 rounded bg-white/5" />
          <div className="mt-3 flex flex-col gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-[44px] rounded-lg bg-white/[0.03]" />
            ))}
          </div>
          <div className="mt-3 h-8 border-t border-line" />
        </div>
        <div className="glass mt-3 rounded-xl p-4">
          <div className="h-4 w-32 rounded bg-white/5" />
          <div className="mt-3 aspect-[4.6/1] rounded bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}

/* The house hero (V4, HQA-D39): the WHY ring opens the page — the question
   the reader already has ("we know we need AI") and the promise of the
   answer ("where"). Typographic, with the ig-02 lámina-7 process diagram
   animated in SVG: nodes ignite in sequence and the second one — the written
   process — carries the page's single copper accent, because that is the
   step the whole argument turns on.

   The h1 is the LCP element: it rises with CSS and never starts at opacity 0
   (globals.css). SplitText starts at h2, everywhere else. */

const NODE_W = 181;
const NODE_H = 72;
const ARROW = 33;
const STEP = NODE_W + ARROW; // 214 between node origins

/** "La tarea" → ["La", "tarea"] — every node label is two words in both locales. */
function splitLabel(label: string): [string, string] {
  const i = label.indexOf(" ");
  return i === -1 ? [label, ""] : [label.slice(0, i), label.slice(i + 1)];
}

function NodeBox({
  label,
  x,
  y,
  kind,
}: {
  label: string;
  x: number;
  y: number;
  kind: "plain" | "marked" | "agent";
}) {
  const [l1, l2] = splitLabel(label);
  const fill =
    kind === "agent" ? "var(--accent)" : "var(--surface)";
  const stroke =
    kind === "agent"
      ? "var(--accent)"
      : kind === "marked"
        ? "var(--warm-text)"
        : "var(--line)";
  const textFill =
    kind === "agent" ? "var(--primary-foreground)" : "var(--text)";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={10}
        fill={fill}
        stroke={stroke}
        strokeWidth={kind === "marked" ? 2 : 1}
      />
      <text
        x={x + NODE_W / 2}
        y={y + NODE_H / 2 - 4}
        textAnchor="middle"
        fontSize={16}
        fill={textFill}
      >
        <tspan x={x + NODE_W / 2}>{l1}</tspan>
        <tspan x={x + NODE_W / 2} dy={20}>
          {l2}
        </tspan>
      </text>
    </g>
  );
}

function ArrowLine({
  x,
  y,
  vertical = false,
}: {
  x: number;
  y: number;
  vertical?: boolean;
}) {
  // A straight shaft plus a small triangular tip, no curves (lámina 7).
  return vertical ? (
    <g fill="none" stroke="var(--text-2)" strokeWidth={2}>
      <line x1={x} y1={y} x2={x} y2={y + ARROW - 8} />
      <path d={`M ${x - 5} ${y + ARROW - 10} L ${x} ${y + ARROW} L ${x + 5} ${y + ARROW - 10}`} />
    </g>
  ) : (
    <g fill="none" stroke="var(--text-2)" strokeWidth={2}>
      <line x1={x} y1={y} x2={x + ARROW - 8} y2={y} />
      <path d={`M ${x + ARROW - 10} ${y - 5} L ${x + ARROW} ${y} L ${x + ARROW - 10} ${y + 5}`} />
    </g>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");
  const reduce = useReducedMotion();

  const nodes = [
    { label: t("diagrama.tarea"), kind: "plain" as const },
    { label: t("diagrama.proceso"), kind: "marked" as const },
    { label: t("diagrama.agente"), kind: "agent" as const },
    { label: t("diagrama.resultado"), kind: "plain" as const },
  ];

  // Ignition order: node, arrow, node, … then the caption.
  const appear = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.5 + i * 0.28, duration: 0.45 },
        };

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center px-4 pb-section pt-32 sm:px-6 lg:pt-36">
      <Spotlight className="mx-auto w-full max-w-7xl">
      {/* Two columns from lg (D3/D4): the argument on the left, the living
          panel on the right. Below lg everything stacks; below md the panel
          is not rendered at all (D4 rule 5) and the hero's object is the
          vertical diagram. */}
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-16">
      <div>
      <p className="eyebrow animate-fade-rise" style={{ "--rise-delay": "0s" } as CSSProperties}>
        {t("kicker")}
      </p>
      {/* The split headline (tanda D, D3). text-display measures in vw —
          viewport, not container — so inside the lg half-column it wraps six
          lines at 1024 (measured; the tanda-D prompt's own trigger was "more
          than four"). text-h1 with xl:text-display is the prescribed fix.
          animate-rise-only stays: this is the LCP element and never starts
          at opacity 0. The
          subtitle is the second half of the thought, smaller, with the page's
          one thick underline on the word the whole site exists to answer;
          t.rich lets each language pick which word that is («dónde» / "where",
          not in the same position). The subtitle's comma is the operator's,
          verbatim. */}
      <h1
        className="font-display animate-rise-only mt-6 max-w-4xl text-h1 font-extrabold text-text xl:text-display"
        style={{ "--rise-delay": "0.05s" } as CSSProperties}
      >
        {t("headline")}
      </h1>
      <p
        className="font-display animate-fade-rise mt-8 max-w-3xl text-h3 font-semibold text-text"
        style={{ "--rise-delay": "0.15s" } as CSSProperties}
      >
        {t.rich("subtitulo", {
          u: (chunks) => <u className="underline-thick">{chunks}</u>,
        })}
      </p>
      <div
        className="animate-fade-rise mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8"
        style={{ "--rise-delay": "0.25s" } as CSSProperties}
      >
        {/* Until /diagnostico ships (V5) the primary CTA opens the same
            conversation the rest of the page opens; the secondary one drops
            the reader into the eight areas, which is the question it asks. */}
        <ShineButton href={whatsappHref(t("ctaMessage"))}>
          {t("cta")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </ShineButton>
        <a
          href="#areas"
          className="link-underline group inline-flex items-center gap-2 text-base font-medium text-text-2 transition-colors hover:text-text"
        >
          {t("ctaSecundario")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
      </div>

      {/* The operation panel (D4): a scaled-down tablero is decoration, not
          communication, and it would cost the phone its LCP — below md it
          simply does not exist. animate-fade-rise, not a motion entrance:
          the panel is content, arriving with the same CSS rise as the copy,
          and reduced motion turns that off in globals.css. */}
      <div
        className="animate-fade-rise hidden md:block"
        style={{ "--rise-delay": "0.35s" } as CSSProperties}
        role="img"
        aria-label={t("panel.alt")}
      >
        <AppWindow>
          <PanelEmpresa />
        </AppWindow>
      </div>
      </div>

      {/* The diagram — horizontal from sm up, vertical on phones (no
          horizontal scroll). Both are the same four nodes and three arrows. */}
      <div className="mt-20" role="img" aria-label={t("diagrama.alt")}>
        {/* Horizontal */}
        <svg
          viewBox="0 0 824 132"
          className="hidden w-full max-w-3xl sm:block"
          aria-hidden="true"
        >
          {nodes.map((node, i) => (
            <motion.g key={node.label} {...appear(i * 2)}>
              <NodeBox label={node.label} x={i * STEP} y={8} kind={node.kind} />
              {node.kind === "marked" && (
                <text
                  x={i * STEP + NODE_W / 2}
                  y={NODE_H + 30}
                  textAnchor="middle"
                  fontSize={13}
                  fill="var(--warm-text)"
                >
                  {t("diagrama.procesoEtiqueta")}
                </text>
              )}
            </motion.g>
          ))}
          {[0, 1, 2].map((i) => (
            <motion.g key={i} {...appear(i * 2 + 1)}>
              <ArrowLine x={i * STEP + NODE_W} y={8 + NODE_H / 2} />
            </motion.g>
          ))}
        </svg>
        {/* Vertical */}
        <svg
          viewBox="0 0 220 428"
          className="mx-auto block w-full max-w-[220px] sm:hidden"
          aria-hidden="true"
        >
          {nodes.map((node, i) => (
            <motion.g key={node.label} {...appear(i * 2)}>
              <NodeBox
                label={node.label}
                x={20}
                y={i * (NODE_H + ARROW)}
                kind={node.kind}
              />
              {node.kind === "marked" && (
                <text
                  x={20 + NODE_W + 6}
                  y={i * (NODE_H + ARROW) + NODE_H / 2}
                  fontSize={12}
                  fill="var(--warm-text)"
                  transform={`rotate(90 ${20 + NODE_W + 6} ${i * (NODE_H + ARROW) + NODE_H / 2})`}
                  textAnchor="middle"
                >
                  {t("diagrama.procesoEtiqueta")}
                </text>
              )}
            </motion.g>
          ))}
          {[0, 1, 2].map((i) => (
            <motion.g key={i} {...appear(i * 2 + 1)}>
              <ArrowLine
                x={20 + NODE_W / 2}
                y={i * (NODE_H + ARROW) + NODE_H}
                vertical
              />
            </motion.g>
          ))}
        </svg>
        <p
          className="animate-fade-rise mt-4 max-w-3xl text-sm text-text-2 max-sm:text-center"
          style={{ "--rise-delay": "2.6s" } as CSSProperties}
        >
          {t("diagrama.pie")}
        </p>
      </div>
      </Spotlight>
    </section>
  );
}
