import { Skeleton } from "@/components/ui/Skeleton";

/** The home's silhouette while it streams: hero + three content blocks. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6">
      {/* hero: headline lines + CTA */}
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="mt-3 h-12 w-4/5" />
        <Skeleton className="mt-8 h-5 w-2/3" />
        <Skeleton className="mt-10 h-12 w-48 rounded-full" />
      </div>
      {/* three blocks */}
      <div className="mt-24 grid gap-6 sm:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
