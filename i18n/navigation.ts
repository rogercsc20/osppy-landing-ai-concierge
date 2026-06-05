import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers — Link automatically prefixes the active
// locale (e.g. /terminos -> /es/terminos or /en/terminos).
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
