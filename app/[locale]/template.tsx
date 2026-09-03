import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Route changes cross-fade instead of cutting (landing v2 §3). A template
 * (not a layout) re-mounts on every navigation, which is what gives React's
 * <ViewTransition> two states to animate between; in the App Router a
 * navigation is already a Transition, so the animation activates by itself.
 *
 * The timing lives in app/globals.css (::view-transition-old/new(root)) and
 * is switched off under prefers-reduced-motion. Browsers without the View
 * Transition API navigate normally, with no animation and no error.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <ViewTransition>{children}</ViewTransition>;
}
