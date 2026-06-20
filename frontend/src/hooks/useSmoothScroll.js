import { useEffect } from "react"
import Lenis from "lenis"

let lenisInstance = null
let lenisLockCount = 0
let bodyLockState = null
const ANCHOR_LOOKUP_TIMEOUT_MS = 800
const LENIS_SCROLL_DURATION = 1.1

const lockBodyScroll = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return
  if (bodyLockState) return

  const body = document.body
  const root = document.documentElement
  const scrollY = window.scrollY
  const scrollbarWidth = window.innerWidth - root.clientWidth

  bodyLockState = {
    scrollY,
    overflow: body.style.overflow,
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    overscrollBehavior: body.style.overscrollBehavior,
    touchAction: body.style.touchAction,
    paddingRight: body.style.paddingRight,
  }

  body.style.overflow = "hidden"
  body.style.position = "fixed"
  body.style.top = `-${scrollY}px`
  body.style.width = "100%"
  body.style.overscrollBehavior = "none"
  body.style.touchAction = "none"
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`
  }
}

const unlockBodyScroll = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return
  if (!bodyLockState) return

  const body = document.body
  const { scrollY } = bodyLockState

  body.style.overflow = bodyLockState.overflow
  body.style.position = bodyLockState.position
  body.style.top = bodyLockState.top
  body.style.width = bodyLockState.width
  body.style.overscrollBehavior = bodyLockState.overscrollBehavior
  body.style.touchAction = bodyLockState.touchAction
  body.style.paddingRight = bodyLockState.paddingRight

  bodyLockState = null
  window.scrollTo(0, scrollY)
}

const syncScrollLockState = () => {
  // When Lenis is running it already blocks background scrolling via the
  // `.lenis-stopped { overflow: clip }` rule, so stopping/starting it is enough.
  // Toggling `position: fixed` on the body here would additionally force a
  // `window.scrollTo` on unlock, which fights Lenis' own `scrollTo` and makes
  // nav links that close the mobile menu appear to do nothing.
  if (lenisInstance) {
    if (lenisLockCount > 0) {
      lenisInstance.stop()
    } else {
      lenisInstance.start()
    }
    return
  }

  // Fallback for when Lenis is absent (e.g. prefers-reduced-motion).
  if (lenisLockCount > 0) {
    lockBodyScroll()
  } else {
    unlockBodyScroll()
  }
}

export const lockLenisScroll = () => {
  lenisLockCount += 1
  syncScrollLockState()
}

export const unlockLenisScroll = () => {
  lenisLockCount = Math.max(0, lenisLockCount - 1)
  syncScrollLockState()
}

const resolveHashTarget = (hash) => {
  try {
    const target = document.querySelector(hash)
    return target instanceof HTMLElement ? target : null
  } catch {
    return null
  }
}

const getScrollMarginTop = (target) => {
  const styles = window.getComputedStyle(target)
  return parseFloat(styles.scrollMarginTop || "0") || 0
}

const scrollToTarget = (target, { hash, instant = false, updateHistory = true } = {}) => {
  const marginTop = getScrollMarginTop(target)

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: -marginTop,
      duration: instant ? 0 : LENIS_SCROLL_DURATION,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      immediate: instant,
      // Run the whole slide in one shot: ignore stray wheel/touch events so the
      // animation reaches the section directly instead of stopping partway.
      lock: !instant,
      force: true,
    })
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - marginTop
    window.scrollTo({ top, behavior: instant ? "auto" : "smooth" })
  }

  if (updateHistory && hash && history.replaceState) {
    history.replaceState(null, "", hash)
  }
}

/**
 * Page-wide buttery smooth scroll, powered by Lenis.
 * Identical configuration to the original src/hooks/useSmoothScroll.ts.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const shouldUseLenis = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    let lenis = null

    let rafId = 0
    let pendingAnchorRafId = 0

    if (shouldUseLenis) {
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      })
      lenisInstance = lenis
      syncScrollLockState()

      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    const cancelPendingAnchorScroll = () => {
      if (!pendingAnchorRafId) return
      cancelAnimationFrame(pendingAnchorRafId)
      pendingAnchorRafId = 0
    }

    const scrollToHashWithRetry = (hash, { instant = false, updateHistory = true } = {}) => {
      if (!hash || hash.length < 2) return
      cancelPendingAnchorScroll()

      const startedAt = performance.now()
      const attemptScroll = () => {
        const target = resolveHashTarget(hash)
        // Wait until any active scroll lock (open mobile menu / modal) is
        // released so the target's position is measured against the real,
        // unlocked layout in both the Lenis and reduced-motion code paths.
        if (target && lenisLockCount === 0) {
          pendingAnchorRafId = 0
          scrollToTarget(target, { hash, instant, updateHistory })
          return
        }

        if (performance.now() - startedAt >= ANCHOR_LOOKUP_TIMEOUT_MS) {
          pendingAnchorRafId = 0
          if (updateHistory && history.replaceState) {
            history.replaceState(null, "", hash)
          }
          return
        }

        pendingAnchorRafId = requestAnimationFrame(attemptScroll)
      }

      attemptScroll()
    }

    const onAnchorClick = (e) => {
      if (e.defaultPrevented) return
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = e.target?.closest?.('a[href^="#"]')
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href === "#" || href.length < 2) return

      e.preventDefault()
      scrollToHashWithRetry(href)
    }

    document.addEventListener("click", onAnchorClick)
    scrollToHashWithRetry(window.location.hash, { instant: true, updateHistory: false })

    return () => {
      document.removeEventListener("click", onAnchorClick)
      cancelPendingAnchorScroll()
      cancelAnimationFrame(rafId)
      lenis?.destroy()
      if (lenisInstance === lenis) {
        lenisInstance = null
        lenisLockCount = 0
        unlockBodyScroll()
      }
    }
  }, [])
}

export default useSmoothScroll
