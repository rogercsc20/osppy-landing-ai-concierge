/**
 * Scripted decision tree for the /hoteles hero chat: Diana introduces
 * herself. Copy lives in messages/{es,en}.json under `hoteles.chat`; keys
 * here are relative to that namespace. This file only describes the graph
 * (which answer offers which follow-up chips).
 */

export interface ChatNode {
  id: string;
  /** i18n key (relative to hoteles.chat) of Diana's answer */
  answerKey: string;
  /** node ids offered as tappable follow-up chips after this answer */
  followups: string[];
  /** optional terminal call to action */
  cta?: { labelKey: string; href: string };
}

export const ROOT_ID = "root";
export const AUTO_QUESTION_KEY = "autoQuestion";

/** i18n keys for each follow-up chip label, by node id. */
export const CHIP_LABELS: Record<string, string> = {
  different: "labels.different",
  pricing: "labels.pricing",
  night: "labels.night",
  setup: "labels.setup",
  human: "labels.human",
  demo: "labels.demo",
};

export const CHAT_NODES: Record<string, ChatNode> = {
  root: { id: "root", answerKey: "root.answer", followups: ["different", "pricing", "night", "demo"] },
  different: { id: "different", answerKey: "different.answer", followups: ["pricing", "human", "setup", "demo"] },
  pricing: { id: "pricing", answerKey: "pricing.answer", followups: ["night", "human", "setup", "demo"] },
  night: { id: "night", answerKey: "night.answer", followups: ["different", "setup", "human", "demo"] },
  setup: { id: "setup", answerKey: "setup.answer", followups: ["pricing", "human", "night", "demo"] },
  human: { id: "human", answerKey: "human.answer", followups: ["different", "pricing", "setup", "demo"] },
  demo: { id: "demo", answerKey: "demo.answer", followups: [], cta: { labelKey: "labels.demoCta", href: "#demo" } },
};
