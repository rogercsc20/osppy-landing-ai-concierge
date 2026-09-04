import { Skeleton } from "@/components/ui/Skeleton";

/** Service-page silhouette: kicker, headline, one line, one button. */
export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-3xl flex-col items-center justify-center px-4 py-16 sm:px-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-6 h-12 w-full" />
      <Skeleton className="mt-3 h-12 w-3/4" />
      <Skeleton className="mt-8 h-5 w-2/3" />
      <Skeleton className="mt-10 h-14 w-56 rounded-full" />
    </div>
  );
}
