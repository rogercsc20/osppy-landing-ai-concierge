import type { Metadata } from "next";

/* Unlinked and unindexed (HQA-D88, gate E0-7). The route stays alive on
   purpose so it can be handed to a prospect privately; what it stops doing is
   asking a search engine to send strangers to a product the site no longer
   sells. `follow: false` too, so the crawler does not walk from here back into
   the house under this page's old framing. It is also out of app/sitemap.ts:
   a sitemap entry plus a noindex is a site contradicting itself. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Provisional shell (L3): the founding-clinics page is built in slice L6.
export default function CitasPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Osppy · Citas</h1>
    </main>
  );
}
