"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { useTranslations } from "next-intl";
import { whatsappHref } from "@/lib/site";

/* The house hero (L4c, HQA-D26/D31): typographic, with the ig-02 lámina-7
   process diagram animated in SVG — nodes ignite in sequence; the second
   node (the written process) carries the page's single copper accent. */

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
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
      <p className="eyebrow animate-fade-rise" style={{ "--rise-delay": "0s" } as CSSProperties}>
        {t("kicker")}
      </p>
      <h1
        className="font-display animate-rise-only mt-4 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-6xl"
        style={{ "--rise-delay": "0.05s" } as CSSProperties}
      >
        {t("headline")}
      </h1>
      <p
        className="animate-fade-rise mt-6 max-w-2xl text-lg leading-relaxed text-text-2"
        style={{ "--rise-delay": "0.15s" } as CSSProperties}
      >
        {t("sub")}
      </p>
      <div
        className="animate-fade-rise mt-8"
        style={{ "--rise-delay": "0.25s" } as CSSProperties}
      >
        <a
          href={whatsappHref(t("ctaMessage"))}
          className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t("cta")}
        </a>
      </div>

      {/* The diagram — horizontal from sm up, vertical on phones (no
          horizontal scroll). Both are the same four nodes and three arrows. */}
      <div className="mt-14" role="img" aria-label={t("diagrama.alt")}>
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
    </section>
  );
}
