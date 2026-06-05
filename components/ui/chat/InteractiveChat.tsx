"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import {
  ChatViewport,
  MessageBubble,
  OsppyAvatar,
  PhoneFrame,
  TypingIndicator,
  type ChatMessage,
} from "./ChatPrimitives";
import { AUTO_QUESTION_KEY, CHAT_NODES, CHIP_LABELS, ROOT_ID } from "./script";

export function InteractiveChat() {
  const t = useTranslations();
  const reduce = useReducedMotion() ?? false;

  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.4 });

  const now = t("heroChat.now");

  // Seed the opening question so the phone is never empty (renders in the
  // server HTML immediately, before hydration). It shows with no entrance
  // animation; Osppy's reply then types in on mount.
  const [thread, setThread] = useState<ChatMessage[]>(() => [
    { id: 0, sender: "guest", text: t(AUTO_QUESTION_KEY), time: now, instant: true },
  ]);
  const [typing, setTyping] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [cta, setCta] = useState<{ labelKey: string; href: string } | null>(
    null,
  );
  const started = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const seq = useRef(1);

  // Drive the conversation once it scrolls into view.
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const push = (msg: Omit<ChatMessage, "id">) =>
      setThread((prev) => [...prev, { ...msg, id: seq.current++ }]);

    const after = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    const answer = (nodeId: string, delay: number) => {
      const node = CHAT_NODES[nodeId];
      setChips([]);
      if (reduce) {
        push({ sender: "osppy", text: t(node.answerKey), time: now });
        setChips(node.followups);
        if (node.cta) setCta(node.cta);
        return;
      }
      setTyping(true);
      after(delay, () => {
        setTyping(false);
        push({ sender: "osppy", text: t(node.answerKey), time: now });
        after(250, () => {
          setChips(node.followups);
          if (node.cta) setCta(node.cta);
        });
      });
    };

    // The opening question is already seeded; just let Osppy reply once the
    // phone has settled.
    after(reduce ? 0 : 600, () => {
      answer(ROOT_ID, reduce ? 0 : 1000);
    });

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  const handleChip = (nodeId: string) => {
    if (typing) return;
    const node = CHAT_NODES[nodeId];
    setChips([]);
    setThread((prev) => [
      ...prev,
      { id: seq.current++, sender: "guest", text: t(CHIP_LABELS[nodeId]), time: now },
    ]);
    setTyping(true);
    const id = setTimeout(() => {
      setTyping(false);
      setThread((prev) => [
        ...prev,
        { id: seq.current++, sender: "osppy", text: t(node.answerKey), time: now },
      ]);
      const id2 = setTimeout(() => {
        setChips(node.followups);
        if (node.cta) setCta(node.cta);
      }, 250);
      timers.current.push(id2);
    }, 950);
    timers.current.push(id);
  };

  const scrollKey = `${thread.length}-${typing}-${chips.length}`;

  return (
    <div ref={containerRef}>
      <PhoneFrame
        title="Osppy"
        subtitle={t("heroChat.status")}
        avatar={<OsppyAvatar />}
        float={!reduce}
        footer={
          <Footer
            chips={chips}
            cta={cta}
            typing={typing}
            reduce={reduce}
            label={(id) => t(CHIP_LABELS[id])}
            ctaLabel={cta ? t(cta.labelKey) : ""}
            placeholder={t("heroChat.inputPlaceholder")}
            onChip={handleChip}
          />
        }
      >
        <ChatViewport scrollKey={scrollKey} className="h-full">
          {thread.map((m, i) => (
            <MessageBubble
              key={m.id}
              text={m.text}
              time={m.time}
              outgoing={m.sender === "osppy"}
              showTicks={m.sender === "osppy" && i === thread.length - 1}
              reduce={reduce || !!m.instant}
            />
          ))}
          <AnimatePresence>
            {typing && <TypingIndicator key="typing" reduce={reduce} />}
          </AnimatePresence>
        </ChatViewport>
      </PhoneFrame>
    </div>
  );
}

function Footer({
  chips,
  cta,
  typing,
  reduce,
  label,
  ctaLabel,
  placeholder,
  onChip,
}: {
  chips: string[];
  cta: { labelKey: string; href: string } | null;
  typing: boolean;
  reduce: boolean;
  label: (id: string) => string;
  ctaLabel: string;
  placeholder: string;
  onChip: (id: string) => void;
}) {
  const showCta = cta && chips.length === 0 && !typing;

  if (showCta) {
    return (
      <a
        href={cta!.href}
        className="flex items-center justify-center gap-2 rounded-full bg-turquoise px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-turquoise-deep"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  if (chips.length > 0 && !typing) {
    return (
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {chips.map((id, i) => (
            <motion.button
              key={id}
              onClick={() => onChip(id)}
              initial={reduce ? false : { opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={reduce ? { duration: 0 } : { delay: i * 0.05 }}
              className="rounded-full border border-turquoise/40 bg-turquoise/10 px-3.5 py-1.5 text-xs font-medium text-turquoise transition-colors hover:bg-turquoise hover:text-white"
            >
              {label(id)}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // idle / typing — show a dead input pill so the frame never looks empty.
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full bg-white/5 px-4 py-2 text-sm text-white/30">
        {placeholder}
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-turquoise">
        <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </div>
    </div>
  );
}
