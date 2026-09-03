import { Skeleton } from "@/components/ui/Skeleton";

/** /citas silhouette: typographic hero, then the static preview block. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="mt-3 h-12 w-2/3" />
        <Skeleton className="mt-8 h-5 w-1/2" />
      </div>
      <Skeleton className="mt-16 h-80 w-full" />
    </div>
  );
}
