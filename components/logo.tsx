/**
 * The Osppy icon, in the logo's own geometry (osppy-brand-export/osppy-icon-source.svg), inline
 * so it scales and needs no request. `tile` is the black rounded square with the teal ring and
 * dot (the favicon); `glyph` is the ring and the dot alone on a transparent ground (HQA-D150).
 */
export function Logo({ className = "h-9 w-9", variant = "tile" }: { className?: string; variant?: "tile" | "glyph" }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      {variant === "tile" && <rect width="64" height="64" rx="14" fill="#0a0f0e" />}
      <circle cx="29" cy="27" r="16" stroke="#2fc4d9" strokeWidth="9" fill="none" />
      <circle cx="52" cy="52" r="7" fill="#2fc4d9" />
    </svg>
  );
}

/** The logo's O alone, for the watermark of the teal band: same ring proportion as the icon. */
export function LogoRing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <circle cx="32" cy="32" r="22" stroke="#0a0f0e" strokeWidth="12.4" fill="none" />
    </svg>
  );
}
