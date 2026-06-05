"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChatViewport,
  MessageBubble,
  PhoneFrame,
  TypingIndicator,
  type ChatMessage,
} from "./chat/ChatPrimitives";

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: "guest",
    text: "Buenas noches 👋 ¿cuánto cuesta la habitación doble para este fin de semana?",
    time: "3:14",
  },
  {
    id: 2,
    sender: "osppy",
    text: "¡Buenas noches! 😊 La habitación doble está disponible este fin de semana desde $1,450 MXN por noche, incluye desayuno para dos personas.\n\n¿Le gustaría que le enviara disponibilidad exacta para viernes y sábado?",
    time: "3:14",
  },
  {
    id: 3,
    sender: "guest",
    text: "Sí por favor, y ¿aceptan mascotas?",
    time: "3:15",
  },
  {
    id: 4,
    sender: "osppy",
    text: "¡Claro! Tenemos disponibilidad viernes y sábado. 🐾 Sí aceptamos mascotas pequeñas (hasta 10 kg) con un cargo adicional de $200 MXN por estancia.\n\n¿Le hago la reservación?",
    time: "3:15",
  },
];

const STATIC_MESSAGES: ChatMessage[] = [
  { id: 1, sender: "guest", text: "¿Tienen estacionamiento incluido?", time: "11:42" },
  {
    id: 2,
    sender: "osppy",
    text: "¡Hola! Sí, contamos con estacionamiento privado sin costo adicional para nuestros huéspedes. 🚗",
    time: "11:42",
  },
  { id: 3, sender: "guest", text: "Perfecto. ¿A qué hora es el check-in?", time: "11:43" },
  {
    id: 4,
    sender: "osppy",
    text: "El check-in es a partir de las 3pm. Si necesita entrar antes, podemos guardar su equipaje sin problema. ¿Necesita algo más? 😊",
    time: "11:43",
  },
];

interface WhatsAppMockupProps {
  variant?: "animated" | "static";
}

export function WhatsAppMockup({ variant = "animated" }: WhatsAppMockupProps) {
  const shouldReduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);

  const messages = variant === "animated" ? DEMO_MESSAGES : STATIC_MESSAGES;

  useEffect(() => {
    if (variant === "static" || shouldReduceMotion) {
      setVisibleCount(messages.length);
      return;
    }

    const delays = [800, 2200, 1500, 2000];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const showNext = (index: number) => {
      if (index >= messages.length) {
        const resetTimeout = setTimeout(() => {
          setVisibleCount(0);
          setShowTyping(false);
          setTimeout(() => showNext(0), 300);
        }, 4000);
        timeouts.push(resetTimeout);
        return;
      }

      if (messages[index].sender === "osppy") {
        const typingTimeout = setTimeout(() => {
          setShowTyping(true);
          const msgTimeout = setTimeout(() => {
            setShowTyping(false);
            setVisibleCount(index + 1);
            showNext(index + 1);
          }, delays[index] || 1500);
          timeouts.push(msgTimeout);
        }, 400);
        timeouts.push(typingTimeout);
      } else {
        const timeout = setTimeout(() => {
          setVisibleCount(index + 1);
          showNext(index + 1);
        }, 600);
        timeouts.push(timeout);
      }
    };

    const startTimeout = setTimeout(() => showNext(0), 600);
    timeouts.push(startTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [variant, shouldReduceMotion, messages.length]);

  const shown = messages.slice(0, visibleCount);

  return (
    <div className="mx-auto w-full max-w-sm">
      <PhoneFrame
        title="Hotel Boutique"
        subtitle="en línea"
        avatar={
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]/25 text-lg">
            🏨
          </div>
        }
        footer={
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-full bg-white/5 px-4 py-2 text-sm text-white/30">
              Mensaje
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]">
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        }
      >
        <ChatViewport
          scrollKey={`${visibleCount}-${showTyping}`}
          className="h-full"
        >
          {shown.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              time={msg.time}
              outgoing={msg.sender === "osppy"}
              showTicks={i === visibleCount - 1 && msg.sender === "osppy"}
              reduce={shouldReduceMotion ?? false}
            />
          ))}
          <AnimatePresence>
            {showTyping && <TypingIndicator key="typing" reduce={shouldReduceMotion ?? false} />}
          </AnimatePresence>
        </ChatViewport>
      </PhoneFrame>
    </div>
  );
}
