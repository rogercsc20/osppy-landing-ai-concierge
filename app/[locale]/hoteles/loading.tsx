import { Skeleton } from "@/components/ui/Skeleton";

/** /hoteles silhouette: dark hero band with a phone, then two rows. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-6 h-12 w-full" />
          <Skeleton className="mt-3 h-12 w-3/4" />
          <Skeleton className="mt-10 h-12 w-56 rounded-full" />
        </div>
        <Skeleton className="h-[420px] w-64 justify-self-center rounded-[2.5rem]" />
      </div>
      <div className="mt-20 grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}
