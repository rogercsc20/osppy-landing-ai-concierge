import { memo } from "react";

/* Lifted out of the old Hero (E3c) so <Aplicada/> and any future host share
   ONE skeleton. It reproduces the loaded panel's boxes with the same
   paddings, so nothing jumps when the deferred chunk lands (D4 rule 2). */
/** The same boxes the loaded panel paints, empty: top bar, two tiles, five
    queue rows, the chart card. One loading state — the chart's own Bklit
    skeleton takes over INSIDE the loaded panel, so the reader never sees
    two nested spinners fighting (D4 rule 2). */
function PanelSkeletonInner() {
  return (
    <div className="w-full bg-surface" aria-hidden="true">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
        <div className="h-7 w-7 rounded-lg bg-white/5" />
        <div className="h-4 w-32 rounded bg-white/5" />
        <div className="ml-auto h-6 w-36 rounded-full bg-white/5" />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass h-[92px] rounded-xl" />
          <div className="glass h-[92px] rounded-xl" />
        </div>
        <div className="glass mt-3 rounded-xl p-4">
          <div className="h-4 w-28 rounded bg-white/5" />
          <div className="mt-3 flex flex-col gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-[44px] rounded-lg bg-white/[0.03]" />
            ))}
          </div>
          <div className="mt-3 h-8 border-t border-line" />
        </div>
        <div className="glass mt-3 rounded-xl p-4">
          <div className="h-4 w-32 rounded bg-white/5" />
          <div className="mt-3 aspect-[4.6/1] rounded bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}

export const PanelSkeleton = memo(PanelSkeletonInner);
