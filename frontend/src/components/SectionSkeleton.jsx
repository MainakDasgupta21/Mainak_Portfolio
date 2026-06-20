import { memo } from "react"

const SectionSkeleton = memo(function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6"
    >
      <div className="skeleton-in rounded-2xl border border-border/35 bg-card/35 p-6 surface-card backdrop-blur-sm">
        <div className="skeleton-in skeleton-delay-1 loading-shimmer shimmer-delay-1 h-6 w-52 rounded-md" />
        <div className="skeleton-in skeleton-delay-2 mt-3 loading-shimmer shimmer-delay-2 h-3 w-72 max-w-[85%] rounded-full" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="skeleton-in skeleton-delay-3 rounded-2xl border border-border/35 bg-background/30 p-4">
            <div className="loading-shimmer shimmer-delay-1 h-4 w-2/3 rounded-full" />
            <div className="mt-3 space-y-2">
              <div className="loading-shimmer shimmer-delay-2 h-3 w-full rounded-full" />
              <div className="loading-shimmer shimmer-delay-3 h-3 w-5/6 rounded-full" />
            </div>
          </div>
          <div className="skeleton-in skeleton-delay-4 rounded-2xl border border-border/35 bg-background/30 p-4">
            <div className="loading-shimmer shimmer-delay-2 h-4 w-3/5 rounded-full" />
            <div className="mt-3 space-y-2">
              <div className="loading-shimmer shimmer-delay-3 h-3 w-full rounded-full" />
              <div className="loading-shimmer shimmer-delay-4 h-3 w-4/5 rounded-full" />
            </div>
          </div>
          <div className="skeleton-in skeleton-delay-5 rounded-2xl border border-border/35 bg-background/30 p-4 sm:col-span-2">
            <div className="loading-shimmer shimmer-delay-3 h-4 w-1/2 rounded-full" />
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="loading-shimmer shimmer-delay-1 h-10 rounded-xl" />
              <div className="loading-shimmer shimmer-delay-2 h-10 rounded-xl" />
              <div className="loading-shimmer shimmer-delay-4 h-10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default SectionSkeleton
