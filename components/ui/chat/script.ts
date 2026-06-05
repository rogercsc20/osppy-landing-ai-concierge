/**
 * Scripted decision-tree for the interactive hero chat.
 * Copy lives in messages/{es,en}.json under the `heroChat` key; here we only
 * describe the graph (which answer leads to which follow-up chips).
 */

export interface ChatNode {
  id: string;
  /** i18n key for Osppy's answer */
  answerKey: string;
  /** node ids offered as tappable follow-up chips after this answer */
  followups: string[];
  /** optional terminal call-to-action chip */
  cta?: { labelKey: string; href: string };
}

export const ROOT_ID = "root";
export const AUTO_QUESTION_KEY = "heroChat.autoQuestion";

/** i18n keys for each follow-up chip label, by node id. */
export const CHIP_LABELS: Record<string, string> = {
  different: "heroChat.labels.different",
  pricing: "heroChat.labels.pricing",
  night: "heroChat.labels.night",
  setup: "heroChat.labels.setup",
  human: "heroChat.labels.human",
  demo: "heroChat.labels.demo",
};

export const CHAT_NODES: Record<string, ChatNode> = {
  root: {
    id: "root",
    answerKey: "heroChat.root.answer",
    followups: ["different", "pricing", "night", "demo"],
  },
  different: {
    id: "different",
    answerKey: "heroChat.different.answer",
    followups: ["pricing", "human", "setup", "demo"],
  },
  pricing: {
    id: "pricing",
    answerKey: "heroChat.pricing.answer",
    followups: ["night", "human", "setup", "demo"],
  },
  night: {
    id: "night",
    answerKey: "heroChat.night.answer",
    followups: ["different", "setup", "human", "demo"],
  },
  setup: {
    id: "setup",
    answerKey: "heroChat.setup.answer",
    followups: ["pricing", "human", "night", "demo"],
  },
  human: {
    id: "human",
    answerKey: "heroChat.human.answer",
    followups: ["different", "pricing", "setup", "demo"],
  },
  demo: {
    id: "demo",
    answerKey: "heroChat.demo.answer",
    followups: [],
    cta: { labelKey: "heroChat.labels.demoCta", href: "#demo" },
  },
};
