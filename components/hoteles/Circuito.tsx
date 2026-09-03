"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { AppWindow } from "@/components/device/AppWindow";
import { Fit } from "@/components/device/Fit";
import { FxLayer } from "@/components/fx/FxLayer";
import {
  ChatViewport,
  MessageBubble,
  OsppyAvatar,
  PhoneFrame,
  TypingIndicator,
  type ChatMessage,
} from "@/components/ui/chat/ChatPrimitives";
import { Panel } from "./Panel";

/* The loop and the panel (source of truth §4.4): the owner's WhatsApp —
   Diana hands over the built reservation with two buttons, then the
   payment confirmation with one — and, beside it, the operations panel.
   Replaces the old scroll-scrubbed "phone app" act: this is the real
   circuit, and every number is labeled demo data. */

type Step = "reserva" | "aprobada" | "rechazada" | "pago" | "confirmado";

/** An incoming WhatsApp "interactive" message: a card with buttons below. */
function Card({
  title,
  detail,
  time,
  buttons,
  reduce,
}: {
  title: string;
  detail: string;
  time: string;
  buttons: { label: string; onClick: () => void; primary?: boolean }[];
  reduce: boolean;
}) {
  return (
    <motion.div
      className="flex max-w-[86%] self-start"
      initial={reduce ? false : { opacity: 0, scale: 0.9, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 34, mass: 0.7 }}
    >
      <div className="w-full overflow-hidden rounded-2xl rounded-bl-md bg-[#1e2d3d] text-[13.5px] leading-relaxed text-white shadow-md shadow-black/20">
        <div className="px-3.5 py-2">
          <p className="font-semibold">{title}</p>
          <p className="mt-0.5 text-white/85">{detail}</p>
          <span aria-hidden="true" className="float-right ml-2 mt-1 text-[10px] text-white/60">
            {time}
          </span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
          {buttons.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={b.onClick}
              className={
                b.primary
                  ? "py-2.5 text-center text-[13px] font-semibold text-accent-text transition-colors hover:bg-white/5"
                  : "py-2.5 text-center text-[13px] font-medium text-white/70 transition-colors hover:bg-white/5"
              }
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function OwnerPhone() {
  const t = useTranslations("hoteles.circuito.telefono");
  const chat = useTranslations("hoteles.chat");
  const reduce = useReducedMotion();
  const now = t("ahora");

  const [step, setStep] = useState<Step>("reserva");
  const [replies, setReplies] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const seq = useRef(1);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const after = (ms: number, fn: () => void) => {
    if (reduce) return fn();
    timers.current.push(setTimeout(fn, ms));
  };
  const push = (msg: Omit<ChatMessage, "id">) => setReplies((prev) => [...prev, { ...msg, id: seq.current++ }]);

  // Tapping a button sends it as the owner's reply; Diana answers.
  const tap = (label: string, answer: string, next: Step) => {
    push({ sender: "guest", text: label, time: now });
    setTyping(true);
    after(900, () => {
      setTyping(false);
      push({ sender: "osppy", text: answer, time: now });
      setStep(next);
    });
  };

  const approve = () => tap(t("aprobar"), t("aprobada"), "aprobada");
  const decline = () => tap(t("rechazar"), t("rechazada"), "rechazada");
  const confirm = () => tap(t("confirmarPago"), t("pagoConfirmado"), "confirmado");
  const reset = () => {
    timers.current.forEach(clearTimeout);
    setReplies([]);
    setTyping(false);
    setStep("reserva");
  };

  // After the approval lands, the guest "transfers" and the second card arrives.
  useEffect(() => {
    if (step !== "aprobada") return;
    const id = setTimeout(() => setStep("pago"), reduce ? 0 : 1400);
    return () => clearTimeout(id);
  }, [step, reduce]);

  const done = step === "confirmado" || step === "rechazada";
  const scrollKey = `${step}-${replies.length}-${typing}`;

  // On the owner's phone, Diana is the incoming side and the owner's taps
  // are the outgoing (green) bubbles.
  return (
    <PhoneFrame
      title={t("de")}
      subtitle={chat("status")}
      avatar={<OsppyAvatar />}
      footer={
        done ? (
          <button
            type="button"
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-accent-text/40 bg-accent-text/10 px-4 py-2 text-sm font-medium text-accent-text transition-colors hover:bg-accent hover:text-primary-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t("reiniciar")}
          </button>
        ) : (
          <div className="flex items-center gap-2" aria-hidden="true">
            <div className="flex-1 rounded-full bg-white/5 px-4 py-2 text-sm text-white/55">{chat("inputPlaceholder")}</div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        )
      }
    >
      <ChatViewport scrollKey={scrollKey} className="h-full">
        <Card
          title={t("reservaTitulo")}
          detail={t("reservaDetalle")}
          time={now}
          reduce
          buttons={
            step === "reserva"
              ? [
                  { label: t("aprobar"), onClick: approve, primary: true },
                  { label: t("rechazar"), onClick: decline },
                ]
              : []
          }
        />
        {replies.slice(0, step === "pago" || step === "confirmado" ? 2 : replies.length).map((m, i, arr) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            time={m.time}
            outgoing={m.sender === "guest"}
            showTicks={m.sender === "guest" && i === arr.length - 1}
            reduce={reduce}
          />
        ))}
        {(step === "pago" || step === "confirmado") && (
          <Card
            title={t("pagoTitulo")}
            detail={t("pagoDetalle")}
            time={now}
            reduce={reduce}
            buttons={step === "pago" ? [{ label: t("confirmarPago"), onClick: confirm, primary: true }] : []}
          />
        )}
        {replies.slice(2).map((m, i, arr) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            time={m.time}
            outgoing={m.sender === "guest"}
            showTicks={m.sender === "guest" && i === arr.length - 1}
            reduce={reduce}
          />
        ))}
        <AnimatePresence>{typing && <TypingIndicator key="typing" reduce={reduce} />}</AnimatePresence>
      </ChatViewport>
    </PhoneFrame>
  );
}

export function Circuito() {
  const t = useTranslations("hoteles.circuito");

  return (
    <section id="circuito" className="relative px-4 py-section sm:px-6">
      <FxLayer>
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/2 h-80 w-[60%] -translate-x-1/2 rounded-full bg-warm/10 blur-3xl" />
      </FxLayer>

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-16 max-w-3xl lg:mb-20">
          <p className="eyebrow mb-5">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-2">{t("sub")}</p>
        </Reveal>

        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="flex min-w-0 flex-col items-center gap-5 lg:col-span-4">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-10 -z-10 rounded-[5rem] blur-2xl"
                style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent-text) 22%, transparent), transparent)" }}
              />
              <OwnerPhone />
            </div>
            <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-2">
              {t("panel.etiqueta")}
            </span>
          </Reveal>

          <Reveal delay={0.15} className="min-w-0 lg:col-span-8">
            {/* Wide: the panel at its own width. Narrow: scaled to fit. */}
            <div className="hidden md:block">
              <AppWindow>
                <Panel />
              </AppWindow>
            </div>
            <div className="overflow-hidden md:hidden">
              <AppWindow compact>
                <Fit designWidth={860}>
                  <Panel compact />
                </Fit>
              </AppWindow>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
