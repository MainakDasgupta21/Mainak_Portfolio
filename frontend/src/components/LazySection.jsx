import { memo } from "react"
import useLazyMount from "../hooks/useLazyMount"
import SectionSkeleton from "./SectionSkeleton"

const LazySection = memo(function LazySection({
  id,
  children,
  rootMargin = "400px",
  className = "",
  minHeight = 400,
}) {
  const { ref, mounted } = useLazyMount(rootMargin)
  const wrapperClassName = `scroll-mt-[5.5rem] ${className}`.trim()

  return (
    <div
      id={id}
      ref={ref}
      data-section={id ? "true" : undefined}
      className={wrapperClassName}
      style={{ minHeight: mounted ? undefined : minHeight }}
    >
      {mounted ? children : <SectionSkeleton />}
    </div>
  )
})

export default LazySection
