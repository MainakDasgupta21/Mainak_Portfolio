import { useEffect } from "react"
import Lenis from "lenis"

/**
 * Page-wide buttery smooth scroll, powered by Lenis.
 * Identical configuration to the original src/hooks/useSmoothScroll.ts.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    })

    let rafId = 0
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onAnchorClick = (e) => {
      if (e.defaultPrevented) return
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = e.target?.closest?.('a[href^="#"]')
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href === "#" || href.length < 2) return

      const target = document.querySelector(href)
      if (!(target instanceof HTMLElement)) return

      e.preventDefault()

      const styles = window.getComputedStyle(target)
      const marginTop = parseFloat(styles.scrollMarginTop || "0") || 0

      lenis.scrollTo(target, {
        offset: -marginTop,
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      })

      if (history.replaceState) history.replaceState(null, "", href)
    }

    document.addEventListener("click", onAnchorClick)

    return () => {
      document.removeEventListener("click", onAnchorClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}

export default useSmoothScroll
