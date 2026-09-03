import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Manrope, IBM_Plex_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Fraunces stays loaded for the hotel world only (.theme-hotel, HQA-D27).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  // Variable optical-size axis: browsers auto-tune letterforms to font-size,
  // so display-size headlines get the high-contrast cut.
  axes: ["opsz"],
});

// The site's display face (brand guide §8.6): Manrope for headlines.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// One editorial quote per page at most (guide §8.6).
const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Runs before paint: stored choice wins, then the system preference, light
// otherwise — so a reload never flashes the wrong theme (HQA-D27). React
// logs a DEV-ONLY note when the locale layout re-renders this script on a
// language switch; the script only ever executes from the initial HTML and
// the warning is stripped from production builds (verified on next start).
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isES = locale === "es";

  return {
    title: isES
      ? "Osppy — Tu recepción nunca duerme"
      : "Osppy — Your front desk never sleeps",
    description: isES
      ? "Osppy responde a tus huéspedes por WhatsApp en segundos — precios, check-in, disponibilidad — 24/7. Sin contratar a nadie."
      : "Osppy answers your guests on WhatsApp in seconds — pricing, check-in, availability — 24/7. No extra staff required.",
    metadataBase: new URL("https://osppy.com"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
    openGraph: {
      type: "website",
      locale: isES ? "es_MX" : "en_US",
      siteName: "Osppy",
      title: isES ? "Osppy — Tu recepción nunca duerme" : "Osppy — Your front desk never sleeps",
      description: isES
        ? "El asistente de WhatsApp para hoteles boutique en México."
        : "The WhatsApp assistant for boutique hotels in Mexico.",
    },
    twitter: {
      card: "summary_large_image",
      title: isES ? "Osppy — Tu recepción nunca duerme" : "Osppy — Your front desk never sleeps",
    },
    // Meta Business Manager domain verification (osppy.com). Rendered server-side
    // into <head> on every locale page — Meta's crawler ignores JS-injected tags.
    verification: {
      other: {
        "facebook-domain-verification": "qlbay91x09y35ldrbk37ljz6hxtedp",
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0f0e" },
    { color: "#f7f5f0" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} ${manrope.variable} ${plexSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            <Navbar />
            {children}
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
