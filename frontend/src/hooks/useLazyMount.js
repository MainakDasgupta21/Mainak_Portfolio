import { useEffect, useRef, useState } from "react"

export function useLazyMount(rootMargin = "400px") {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) return
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setMounted(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMounted(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mounted, rootMargin])

  return { ref, mounted }
}

export default useLazyMount
