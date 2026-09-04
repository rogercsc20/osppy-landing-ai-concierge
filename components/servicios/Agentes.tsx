"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { Float } from "@/components/fx/Float";
import { PathDraw } from "@/components/fx/PathDraw";

/* The four-node diagram, moved here from the house's hero by decision E0-2
   and plan §3.3. Not to be confused with `PhaseDiagram` in Como.tsx, which
   paints the FIVE phases of the method and stayed in the house.

   What changed in the move, and why. In the hero this diagram only existed
   below `md` — it was the phone's object, because the panel is not rendered
   there (D4 rule 5), and it was drawn VERTICALLY in a 220px column. Here it
   is the opening object of its own page at every width, so it lays out
   horizontally from `sm` and keeps the vertical stack below it. The geometry
   is the same primitive in both directions: a box, an arrow, a box.

   The entrance is unchanged in kind: nodes and arrows ignite in order and the
   caption's delay is DERIVED from the timing constants rather than
   hand-computed, so it does not rot if a node is ever added. Under reduced
   motion `appear` returns nothing and the SVG is simply there. */

const NODE_W = 181;
const NODE_H = 72;
const ARROW = 33;
const APPEAR_BASE = 0.2;
const APPEAR_STEP = 0.28;
const APPEAR_DUR = 0.45;
const NODE_COUNT = 4;
const CAPTION_DELAY = (
  APPEAR_BASE +
  (NODE_COUNT * 2 - 2) * APPEAR_STEP +
  APPEAR_DUR
).toFixed(2);

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
  const fill = kind === "agent" ? "var(--accent)" : "var(--surface)";
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
      <path
        d={`M ${x - 5} ${y + ARROW - 10} L ${x} ${y + ARROW} L ${x + 5} ${y + ARROW - 10}`}
      />
    </g>
  ) : (
    <g fill="none" stroke="var(--text-2)" strokeWidth={2}>
      <line x1={x} y1={y} x2={x + ARROW - 8} y2={y} />
      <path
        d={`M ${x + ARROW - 10} ${y - 5} L ${x + ARROW} ${y} L ${x + ARROW - 10} ${y + 5}`}
      />
    </g>
  );
}

export function Agentes() {
  const t = useTranslations("servicios.implementacion.agentes");
  const reduce = useReducedMotion();

  const nodes = [
    { label: t("diagrama.tarea"), kind: "plain" as const },
    { label: t("diagrama.proceso"), kind: "marked" as const },
    { label: t("diagrama.agente"), kind: "agent" as const },
    { label: t("diagrama.resultado"), kind: "plain" as const },
  ];

  const appear = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: {
            delay: APPEAR_BASE + i * APPEAR_STEP,
            duration: APPEAR_DUR,
          },
        };

  const step = NODE_W + ARROW;
  const anchoH = 4 * NODE_W + 3 * ARROW + 40;
  const altoV = NODE_COUNT * NODE_H + (NODE_COUNT - 1) * ARROW;

  return (
    <div role="img" aria-label={t("diagrama.alt")}>
      <Float distance={6} duration={7}>
        {/* Horizontal from sm, where four boxes fit across; vertical below it,
            which is the layout this diagram was born with in the hero. */}
        <svg
          viewBox={`0 0 ${anchoH} ${NODE_H + 40}`}
          className="mx-auto hidden w-full max-w-3xl sm:block"
          aria-hidden="true"
        >
          {nodes.map((node, i) => (
            <motion.g key={node.label} {...appear(i * 2)}>
              <NodeBox
                label={node.label}
                x={20 + i * step}
                y={20}
                kind={node.kind}
              />
              {node.kind === "marked" && (
                <text
                  x={20 + i * step + NODE_W / 2}
                  y={20 + NODE_H + 16}
                  fontSize={12}
                  fill="var(--warm-text)"
                  textAnchor="middle"
                >
                  {t("diagrama.procesoEtiqueta")}
                </text>
              )}
            </motion.g>
          ))}
          <PathDraw stagger={0.24} delay={APPEAR_BASE}>
            {[0, 1, 2].map((i) => (
              <ArrowLine
                key={i}
                x={20 + i * step + NODE_W}
                y={20 + NODE_H / 2}
              />
            ))}
          </PathDraw>
        </svg>

        <svg
          viewBox={`0 0 220 ${altoV}`}
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
          <PathDraw stagger={0.24} delay={APPEAR_BASE}>
            {[0, 1, 2].map((i) => (
              <ArrowLine
                key={i}
                x={20 + NODE_W / 2}
                y={i * (NODE_H + ARROW) + NODE_H}
                vertical
              />
            ))}
          </PathDraw>
        </svg>
      </Float>
      <p
        className="animate-fade-rise mt-6 text-center text-sm text-text-2"
        style={{ "--rise-delay": `${CAPTION_DELAY}s` } as React.CSSProperties}
      >
        {t("diagrama.pie")}
      </p>
    </div>
  );
}
