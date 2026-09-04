import { memo } from "react";

/* Lifted out of the old Hero (E3c) so <Aplicada/> and any future host share
   ONE skeleton. It reproduces the loaded panel's boxes with the same
   paddings, so nothing jumps when the deferred chunk lands (D4 rule 2). */
/** The same boxes the loaded panel paints, empty: top bar, four KPI tiles,
    the volume chart, the by-area block. It was redrawn in E4 with the panel
    (HQA-D91) — a skeleton that keeps the OLD shape is worse than none,
    because the layout jumps at exactly the moment the deferred chunk lands,
    which is the one thing it exists to prevent. Its greys are token-based so
    they invert with the panel. One loading state: the chart's own Bklit
    skeleton takes over INSIDE the loaded panel, so the reader never sees two
    nested spinners fighting (D4 rule 2). */
function PanelSkeletonInner() {
  return (
    <div className="@container w-full bg-surface" aria-hidden="true">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
        <div className="h-7 w-7 rounded-lg bg-text/[0.06]" />
        <div className="h-4 w-32 rounded bg-text/[0.06]" />
        <div className="ml-auto h-6 w-36 rounded-full bg-text/[0.06]" />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="glass h-[92px] rounded-xl" />
          ))}
        </div>
        <div className="glass mt-3 rounded-xl p-4">
          <div className="h-4 w-44 rounded bg-text/[0.06]" />
          <div className="mt-3 aspect-[4.6/1] rounded bg-text/[0.04]" />
        </div>
        <div className="glass mt-3 rounded-xl p-4">
          <div className="h-4 w-20 rounded bg-text/[0.06]" />
          <div className="mt-3 flex flex-col gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-2 rounded-full bg-text/[0.04]" />
            ))}
          </div>
          <div className="mt-3 h-6 border-t border-line" />
        </div>
      </div>
    </div>
  );
}

export const PanelSkeleton = memo(PanelSkeletonInner);
