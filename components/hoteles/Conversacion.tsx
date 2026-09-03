"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import {
  ChatViewport,
  MessageBubble,
  PhoneFrame,
  TypingIndicator,
  type ChatMessage,
} from "@/components/ui/chat/ChatPrimitives";

/* A guest's WhatsApp with the demo hotel: the six-message thread of the
   source of truth's "day of use" (§4.5), typed in by the reader's scroll.
   Every string lives in messages/*.json under hoteles.hace.conversacion;
   the times are mockup chrome that mirrors the 1:07 a.m. of the story. */
const SENDERS: ChatMessage["sender"][] = ["guest", "osppy", "guest", "osppy", "guest", "osppy"];
const TIMES = ["1:07", "1:08", "1:09", "1:09", "1:12", "1:13"];
/** message i becomes visible once progress crosses REVEAL_AT[i] */
const REVEAL_AT = [0, 0.18, 0.34, 0.5, 0.66, 0.82];
/** how far ahead of a Diana message the typing indicator appears */
const TYPING_LEAD = 0.1;

export function Conversacion({ progress }: { progress: number }) {
  const t = useTranslations("hoteles.hace.conversacion");
  const reduce = useReducedMotion();

  const messages: ChatMessage[] = SENDERS.map((sender, i) => ({
    id: i + 1,
    sender,
    text: t(`m${i + 1}`),
    time: TIMES[i],
  }));

  // Reduced motion shows the whole conversation at once.
  let count = messages.length;
  let typing = false;
  if (!reduce) {
    count = REVEAL_AT.filter((at) => progress >= at).length;
    const next = count;
    typing =
      next < messages.length &&
      messages[next].sender === "osppy" &&
      progress >= REVEAL_AT[next] - TYPING_LEAD;
  }
  const shown = messages.slice(0, count);

  return (
    <div className="mx-auto w-full max-w-sm">
      <PhoneFrame
        title={t("hotel")}
        subtitle={t("status")}
        avatar={
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]/25 text-lg" aria-hidden="true">
            🏨
          </div>
        }
        footer={
          <div className="flex items-center gap-2" aria-hidden="true">
            <div className="flex-1 rounded-full bg-white/5 px-4 py-2 text-sm text-white/55">{t("placeholder")}</div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]">
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        }
      >
        <ChatViewport scrollKey={`${count}-${typing}`} className="h-full">
          {shown.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              time={msg.time}
              outgoing={msg.sender === "osppy"}
              showTicks={i === count - 1 && msg.sender === "osppy"}
              reduce={reduce}
            />
          ))}
          <AnimatePresence>{typing && <TypingIndicator key="typing" reduce={reduce} />}</AnimatePresence>
        </ChatViewport>
      </PhoneFrame>
    </div>
  );
}
