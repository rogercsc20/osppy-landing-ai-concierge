"use client";

import { useRouter } from "next/navigation";

export type PropertyOption = { property_id: string; name: string };

export const ACTIVE_PROPERTY_COOKIE = "osppy_active_property";

/**
 * Single-property accounts auto-skip this (the layout renders the name only).
 * Multi-property accounts get a switcher that pins the active property in a
 * cookie the server layout reads + validates against the user's memberships.
 * (Layouts don't receive searchParams, so a cookie — not a query param — is
 * how the selection reaches the server render.)
 */
export function PropertySwitcher({
  label,
  properties,
  activeId,
}: {
  label: string;
  properties: PropertyOption[];
  activeId: string;
}) {
  const router = useRouter();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    document.cookie = `${ACTIVE_PROPERTY_COOKIE}=${event.target.value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-ink/70">
      <span className="sr-only">{label}</span>
      <select
        value={activeId}
        onChange={onChange}
        aria-label={label}
        className="border-line bg-ink-panel rounded-lg border px-2 py-1.5 text-ink"
      >
        {properties.map((p) => (
          <option key={p.property_id} value={p.property_id}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
}
