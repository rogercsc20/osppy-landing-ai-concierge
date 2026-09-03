/**
 * The site-wide motion vocabulary (landing v2 §3): one easing family, three
 * durations, two springs, one viewport rule and one stagger scale. Every
 * primitive in components/fx/* reads from here, so "more motion" never means
 * "a different grammar per section". Mirrors --ease-luxe / --ease-expo in
 * app/globals.css.
 */
export const EASE_LUXE = [0.22, 1, 0.36, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export const DUR = { fast: 0.35, reveal: 0.8, slow: 1.2 } as const;
/** Kept for the components written before the vocabulary grew. */
export const DUR_REVEAL = DUR.reveal;

export const SPRING = {
  soft: { stiffness: 120, damping: 20, mass: 0.6 },
  snappy: { stiffness: 380, damping: 30, mass: 0.5 },
} as const;

/** One rule for when a reveal fires, so the page reads at one rhythm. */
export const VIEWPORT = { once: true, amount: 0.35 } as const;
/** Grids and lists reveal earlier than a headline does. */
export const VIEWPORT_WIDE = { once: true, amount: 0.15 } as const;

export const STAGGER = { chars: 0.018, words: 0.045, cards: 0.09 } as const;
