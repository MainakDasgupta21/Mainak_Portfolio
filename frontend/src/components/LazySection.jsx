import { memo, useEffect, useState } from "react"
import useLazyMount from "../hooks/useLazyMount"
import SectionSkeleton from "./SectionSkeleton"

const LazySection = memo(function LazySection({
  children,
  rootMargin = "400px",
  className = "",
  minHeight = 400,
}) {
  const { ref, mounted } = useLazyMount(rootMargin)
  const [reserveHeight, setReserveHeight] = useState(true)
  const wrapperClassName = className.trim()

  useEffect(() => {
    if (!mounted) {
      setReserveHeight(true)
      return
    }

    const timerId = window.setTimeout(() => {
      setReserveHeight(false)
    }, 180)

    return () => window.clearTimeout(timerId)
  }, [mounted])

  return (
    <div
      ref={ref}
      className={wrapperClassName}
      style={{ minHeight: reserveHeight ? minHeight : undefined }}
    >
      {mounted ? children : <SectionSkeleton />}
    </div>
  )
})

export default LazySection
