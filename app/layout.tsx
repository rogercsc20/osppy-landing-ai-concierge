// Root layout — next-intl App Router pattern.
// The actual <html> and <body> are in app/[locale]/layout.tsx.
// This wrapper is required by Next.js but delegates to the locale layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
