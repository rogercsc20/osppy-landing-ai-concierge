/** The Osppy icon: the logo's own geometry (osppy-brand-export/osppy-icon-source.svg), inline so it scales and needs no request. */
export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <rect width="64" height="64" rx="14" fill="#0a0f0e" />
      <circle cx="29" cy="27" r="16" stroke="#2fc4d9" strokeWidth="9" fill="none" />
      <circle cx="52" cy="52" r="7" fill="#2fc4d9" />
    </svg>
  );
}
