import { memo } from "react"

const SectionSkeleton = memo(function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6"
      style={{ contentVisibility: "auto" }}
    >
      <div className="rounded-2xl border border-border/20 bg-card/35 p-6 backdrop-blur-md">
        <div className="loading-shimmer h-6 w-52 rounded-md" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="loading-shimmer h-24 rounded-xl" />
          <div className="loading-shimmer h-24 rounded-xl" />
          <div className="loading-shimmer h-24 rounded-xl sm:col-span-2" />
        </div>
      </div>
    </div>
  )
})

export default SectionSkeleton
