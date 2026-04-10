"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

interface WaMessage {
  id: number;
  text: string;
  sender: "guest" | "osppy";
  time: string;
}

const DEMO_MESSAGES: WaMessage[] = [
  {
    id: 1,
    sender: "guest",
    text: "Buenas noches 👋 ¿cuánto cuesta la habitación doble para este fin de semana?",
    time: "3:14 AM",
  },
  {
    id: 2,
    sender: "osppy",
    text: "¡Buenas noches! 😊 La habitación doble está disponible este fin de semana desde $1,450 MXN por noche, incluye desayuno para dos personas.\n\n¿Le gustaría que le enviara disponibilidad exacta para viernes y sábado?",
    time: "3:14 AM",
  },
  {
    id: 3,
    sender: "guest",
    text: "Sí por favor, y ¿aceptan mascotas?",
    time: "3:15 AM",
  },
  {
    id: 4,
    sender: "osppy",
    text: "¡Claro! Tenemos disponibilidad viernes y sábado. 🐾 Sí aceptamos mascotas pequeñas (hasta 10 kg) con un cargo adicional de $200 MXN por estancia.\n\n¿Le hago la reservación?",
    time: "3:15 AM",
  },
];

const STATIC_MESSAGES: WaMessage[] = [
  {
    id: 1,
    sender: "guest",
    text: "¿Tienen estacionamiento incluido?",
    time: "11:42 PM",
  },
  {
    id: 2,
    sender: "osppy",
    text: "¡Hola! Sí, contamos con estacionamiento privado sin costo adicional para nuestros huéspedes. 🚗",
    time: "11:42 PM",
  },
  {
    id: 3,
    sender: "guest",
    text: "Perfecto. ¿A qué hora es el check-in?",
    time: "11:43 PM",
  },
  {
    id: 4,
    sender: "osppy",
    text: "El check-in es a partir de las 3pm. Si necesita entrar antes, podemos guardar su equipaje sin problema. ¿Necesita algo más? 😊",
    time: "11:43 PM",
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1.5 self-start">
      <div className="w-8 h-8 rounded-full bg-[#25d366]/20 flex items-center justify-center text-xs font-bold text-[#25d366] flex-shrink-0">
        O
      </div>
      <div className="bg-[#1e2d3d] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <span className="typing-dot w-2 h-2 rounded-full bg-white/50 inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-white/50 inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-white/50 inline-block" />
      </div>
    </div>
  );
}

function MessageBubble({ message, showTicks }: { message: WaMessage; showTicks: boolean }) {
  const isOsppy = message.sender === "osppy";

  return (
    <motion.div
      className={`flex items-end gap-1.5 ${isOsppy ? "self-end flex-row-reverse" : "self-start"}`}
      initial={{ opacity: 0, x: isOsppy ? 20 : -20, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {!isOsppy && (
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60 flex-shrink-0">
          👤
        </div>
      )}
      {isOsppy && (
        <div className="w-8 h-8 rounded-full bg-[#25d366]/20 flex items-center justify-center text-xs font-bold text-[#25d366] flex-shrink-0">
          O
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isOsppy
            ? "bg-[#25d366] text-[#0a1628] rounded-br-sm"
            : "bg-[#1e2d3d] text-white rounded-bl-sm"
        }`}
        style={{ whiteSpace: "pre-line" }}
      >
        {message.text}
        <div className={`flex items-center gap-1 mt-1 ${isOsppy ? "justify-end" : ""}`}>
          <span className={`text-[10px] ${isOsppy ? "text-[#0a1628]/60" : "text-white/40"}`}>
            {message.time}
          </span>
          {isOsppy && showTicks && (
            <motion.div
              className="flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Check className="w-3 h-3 text-blue-400 -mr-1.5" />
              <Check className="w-3 h-3 text-blue-400" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

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
    let total = 600;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const showNext = (index: number) => {
      if (index >= messages.length) {
        // Loop after pause
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

    const startTimeout = setTimeout(() => showNext(0), total);
    timeouts.push(startTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [variant, shouldReduceMotion, messages.length]);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="rounded-[2.5rem] border-2 border-white/10 bg-[#0a1628] shadow-2xl shadow-black/50 overflow-hidden">
        {/* Status bar */}
        <div className="bg-[#128c7e] px-5 pt-3 pb-0">
          <div className="flex items-center justify-between text-white text-[11px] mb-2">
            <span className="font-medium">3:14</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[3, 3, 3, 2].map((h, i) => (
                  <div key={i} className="w-0.5 rounded-sm bg-white" style={{ height: `${h * 2}px` }} />
                ))}
              </div>
              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                <path d="M1.5 8.5C5.9 4.1 11.9 2 17 2s11.1 2.1 15.5 6.5L30 11c-3.6-3.6-8.5-5-13-5s-9.4 1.4-13 5L1.5 8.5z"/>
              </svg>
              <div className="w-5 h-2.5 rounded-sm border border-white flex items-center px-0.5">
                <div className="w-3 h-1.5 bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* WA header */}
          <div className="flex items-center gap-3 py-2">
            <div className="w-9 h-9 rounded-full bg-[#25d366]/30 flex items-center justify-center text-lg">
              🏨
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold leading-tight">Hotel Boutique</p>
              <p className="text-[#25d366] text-[11px]">en línea</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.1-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0C7.1 14.3 4 11.2 4 7.5s3.1-6.8 6.8-6.8 6.8 3.1 6.8 6.8-3.1 6.8-6.9 6.8z"/>
              </svg>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-wa-dots bg-[#080e1a] min-h-[320px] max-h-[380px] overflow-y-auto px-3 py-4 flex flex-col gap-3">
          <AnimatePresence>
            {messages.slice(0, visibleCount).map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                showTicks={i === visibleCount - 1 && msg.sender === "osppy"}
              />
            ))}
            {showTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="bg-[#0a1628] border-t border-white/5 px-3 py-3 flex items-center gap-2">
          <div className="flex-1 bg-white/5 rounded-full px-4 py-2 text-white/30 text-sm">
            Mensaje
          </div>
          <div className="w-9 h-9 rounded-full bg-[#25d366] flex items-center justify-center">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-4 bg-[#25d366]/5 rounded-[3rem] blur-xl -z-10" />
    </div>
  );
}
