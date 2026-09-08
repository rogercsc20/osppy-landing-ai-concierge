import type { Metadata } from "next";
import { Figtree, Newsreader } from "next/font/google";
import { Footer } from "@/components/footer";
import { LOCALES, SITE_URL, getMessages, isLocale } from "@/lib/i18n";
import "../globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: m.meta.title,
    description: m.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      title: m.meta.title,
      description: m.meta.description,
      url: `/${locale}`,
      siteName: "Osppy",
      locale: locale === "es" ? "es_MX" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: m.meta.title,
      description: m.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "es";
  const m = getMessages(l);
  return (
    <html lang={l} className={`${newsreader.variable} ${figtree.variable}`} suppressHydrationWarning>
      <head>
        <script
          // Dark mode (HQA-D152): apply the stored choice before first paint; light by default.
          dangerouslySetInnerHTML={{
            __html: 'try{if(localStorage.getItem("theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}',
          }}
        />
      </head>
      <body>
        {children}
        <Footer locale={l} m={m} />
      </body>
    </html>
  );
}
