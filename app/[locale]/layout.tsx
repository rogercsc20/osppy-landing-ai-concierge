import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import { Fraunces } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

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
  };
}

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
      className={`${geist.variable} ${inter.variable} ${fraunces.variable}`}
    >
      <body className="antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
