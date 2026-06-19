import { memo } from "react"

const SectionSkeleton = memo(function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[400px] w-full"
      style={{ contentVisibility: "auto" }}
    />
  )
})

export default SectionSkeleton
