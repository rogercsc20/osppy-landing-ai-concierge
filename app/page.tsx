// The middleware in middleware.ts redirects all root requests to /[locale].
// This page should never be rendered in production.
export default function RootPage() {
  return null;
}
