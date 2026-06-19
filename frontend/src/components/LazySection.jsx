import { memo } from "react"
import useLazyMount from "../hooks/useLazyMount"
import SectionSkeleton from "./SectionSkeleton"

const LazySection = memo(function LazySection({
  children,
  rootMargin = "400px",
  className = "",
  minHeight = 400,
}) {
  const { ref, mounted } = useLazyMount(rootMargin)

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: mounted ? undefined : minHeight }}
    >
      {mounted ? children : <SectionSkeleton />}
    </div>
  )
})

export default LazySection
