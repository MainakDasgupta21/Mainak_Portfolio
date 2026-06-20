import {
  AnimatePresence,
  m,
  useReducedMotion,
  useScroll,
} from "framer-motion"
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"
import { getProfileDisplayName } from "../utils/profileDisplay"
import { lockLenisScroll, unlockLenisScroll } from "../hooks/useSmoothScroll"

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Achievements", href: "#achievements" },
]
const PRIMARY_CTA = { label: "Let's Talk", href: "#contact" }
const OBSERVED_SECTION_HASHES = [...new Set([...NAV_ITEMS.map((item) => item.href), PRIMARY_CTA.href])]
const NAV_ACTIVE_LOCK_MS = 1150

function getBrandShortName(profile, fallbackName) {
  if (profile.brandShortName?.trim()) return profile.brandShortName
  const name = (fallbackName || "").trim()
  const first = name.split(/\s+/)[0]
  return first ? `${first}.` : ""
}
function getBrandMonogram(profile, fallbackName) {
  if (profile.brandMonogram?.trim()) return profile.brandMonogram
  const name = (fallbackName || "").trim()
  return name ? name.charAt(0).toUpperCase() : ""
}

const Header = memo(function Header() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progressScaleX = scrollYProgress

  const { loading, profile } = useContext(PortfolioContext)
  const displayName = getProfileDisplayName(profile, loading ? "" : "Mainak Dasgupta")
  const brandShortName = getBrandShortName(profile, displayName)
  const brandMonogram = getBrandMonogram(profile, displayName)
  const ariaDisplayName = displayName || brandShortName || "Portfolio"

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState("#home")
  const menuRef = useRef(null)
  const toggleButtonRef = useRef(null)
  const lastScrolledRef = useRef(false)
  const activeLockUntilRef = useRef(0)

  const selectNavTarget = (href, { closeMobile = false } = {}) => {
    setActive(href)
    activeLockUntilRef.current = performance.now() + NAV_ACTIVE_LOCK_MS
    if (closeMobile) {
      setMobileOpen(false)
    }
  }

  useEffect(() => {
    let rafId = 0
    let observedSections = []
    let sectionMetrics = []
    let headerOffset = 0
    let sectionResizeObserver = null
    const totalObservedTargets = OBSERVED_SECTION_HASHES.length

    const syncScrolledState = () => {
      const nextValue = window.scrollY > 28
      if (nextValue !== lastScrolledRef.current) {
        lastScrolledRef.current = nextValue
        setScrolled(nextValue)
      }
    }

    const updateHeaderOffset = () => {
      const firstSection = observedSections[0]
      if (!(firstSection instanceof HTMLElement)) {
        headerOffset = 0
        return
      }

      const styles = window.getComputedStyle(firstSection)
      headerOffset = parseFloat(styles.scrollMarginTop || "0") || 0
    }

    const syncSectionMetrics = () => {
      const baseScrollY = window.scrollY
      sectionMetrics = observedSections
        .map((section) => ({
          id: `#${section.id}`,
          top: section.getBoundingClientRect().top + baseScrollY,
        }))
        .sort((a, b) => a.top - b.top)
    }

    const computeActiveSection = () => {
      if (!sectionMetrics.length) return "#home"

      const scrollY = window.scrollY
      const viewportBottom = scrollY + window.innerHeight
      const documentBottom = document.documentElement.scrollHeight - 2

      if (scrollY <= 2) {
        return "#home"
      }

      if (viewportBottom >= documentBottom) {
        return sectionMetrics[sectionMetrics.length - 1]?.id || "#home"
      }

      const probeY = scrollY + headerOffset + 1
      let bestId = "#home"

      for (const metric of sectionMetrics) {
        if (metric.top <= probeY) {
          bestId = metric.id
          continue
        }
        break
      }

      return bestId
    }

    const recompute = () => {
      syncScrolledState()
      if (performance.now() < activeLockUntilRef.current) return
      const nextId = computeActiveSection()
      setActive((prev) => (prev === nextId ? prev : nextId))
    }

    const scheduleRecompute = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        recompute()
      })
    }

    const observeSections = () => {
      const sections = OBSERVED_SECTION_HASHES.map((hash) => document.querySelector(hash)).filter(
        (el) => el instanceof HTMLElement
      )

      if (!sections.length) return false

      const sectionsChanged =
        sections.length !== observedSections.length ||
        sections.some((section, index) => section !== observedSections[index])
      if (sectionsChanged) {
        observedSections = sections
        if (sectionResizeObserver) {
          sectionResizeObserver.disconnect()
          sections.forEach((section) => sectionResizeObserver.observe(section))
        }
      }

      updateHeaderOffset()
      syncSectionMetrics()
      scheduleRecompute()
      return sections.length === totalObservedTargets
    }

    const onScroll = () => {
      scheduleRecompute()
    }

    const onResize = () => {
      updateHeaderOffset()
      syncSectionMetrics()
      scheduleRecompute()
    }

    if (typeof ResizeObserver !== "undefined") {
      sectionResizeObserver = new ResizeObserver(() => {
        syncSectionMetrics()
        scheduleRecompute()
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)

    const mutationObserver = new MutationObserver(() => {
      if (observeSections()) mutationObserver.disconnect()
    })

    const hasAllTargetsInitially = observeSections()
    if (!hasAllTargetsInitially) {
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }
    scheduleRecompute()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      mutationObserver.disconnect()
      sectionResizeObserver?.disconnect()
    }
  }, [])

  useEffect(() => {
    const clearActiveLock = () => {
      activeLockUntilRef.current = 0
    }

    window.addEventListener("wheel", clearActiveLock, { passive: true })
    window.addEventListener("touchmove", clearActiveLock, { passive: true })

    return () => {
      window.removeEventListener("wheel", clearActiveLock)
      window.removeEventListener("touchmove", clearActiveLock)
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    lockLenisScroll()
    return () => unlockLenisScroll()
  }, [mobileOpen])

  useEffect(() => {
    const onClick = (e) => {
      if (!mobileOpen) return
      const target = e.target
      if (!(target instanceof Node)) return

      const clickedMenu = menuRef.current?.contains(target)
      const clickedToggle = toggleButtonRef.current?.contains(target)

      if (!clickedMenu && !clickedToggle) {
        setMobileOpen(false)
      }
    }
    window.addEventListener("pointerdown", onClick)
    return () => window.removeEventListener("pointerdown", onClick)
  }, [mobileOpen])

  const focusRingClass =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  const shellClassName = scrolled || mobileOpen
    ? "glass-card border border-border/35 shadow-elegant"
    : "border border-white/10 bg-black/25 backdrop-blur-sm md:border-transparent md:bg-transparent md:backdrop-blur-0"
  const mobileMenuVariants = useMemo(
    () => ({
      hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 },
      visible: shouldReduceMotion
        ? { opacity: 1, transition: { duration: 0.16 } }
        : {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              duration: 0.24,
              ease: [0.22, 1, 0.36, 1],
              when: "beforeChildren",
              staggerChildren: 0.045,
            },
          },
      exit: shouldReduceMotion
        ? { opacity: 0, transition: { duration: 0.12 } }
        : {
            opacity: 0,
            y: -8,
            scale: 0.98,
            transition: { duration: 0.18, ease: "easeOut" },
          },
    }),
    [shouldReduceMotion]
  )
  const mobileItemVariants = useMemo(
    () => ({
      hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
      visible: shouldReduceMotion
        ? { opacity: 1, transition: { duration: 0.12 } }
        : { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    }),
    [shouldReduceMotion]
  )
  return (
    <m.header
      initial={shouldReduceMotion ? false : { y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        transform: "translateZ(0)",
      }}
      className="fixed inset-x-0 top-0 z-50 pointer-events-none"
    >
      {!shouldReduceMotion && (
        <m.div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/95 to-transparent origin-left"
          style={{ scaleX: progressScaleX }}
        />
      )}

      <nav className="container pointer-events-auto mx-auto px-4 sm:px-6 pt-3 md:pt-4" aria-label="Primary">
        <m.div
          className={`rounded-2xl md:rounded-[999px] transition-all duration-300 ${shellClassName}`}
          animate={shouldReduceMotion ? undefined : { y: scrolled ? 0 : -2 }}
        >
          <div className="flex items-center justify-between gap-3 px-3 sm:px-4 md:px-5 py-2.5">
            <m.a
              href="#home"
              aria-label={`${ariaDisplayName} - Home`}
              onClick={() => {
                selectNavTarget("#home", { closeMobile: true })
              }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              className={`inline-flex items-center gap-2.5 rounded-full px-1.5 py-1 ${focusRingClass}`}
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-foreground to-foreground/80 text-background font-semibold text-sm"
                aria-hidden
              >
                {brandMonogram || "P"}
              </span>
              <span className="text-xl md:text-2xl font-bold cursive-brand leading-none">
                {brandShortName || "Portfolio"}
              </span>
            </m.a>

            <div className="hidden md:flex items-center gap-3">
              <div className="relative flex items-center gap-1 rounded-full border border-border/35 bg-background/30 p-1 backdrop-blur-sm">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = active === item.href
                  return (
                    <m.a
                      key={item.href}
                      href={item.href}
                      onClick={() => selectNavTarget(item.href)}
                      aria-current={isActive ? "page" : undefined}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={shouldReduceMotion ? undefined : { delay: 0.03 + idx * 0.04 }}
                      className={`relative inline-flex h-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      } ${focusRingClass}`}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {isActive && (
                        <m.span
                          layoutId="navActivePill"
                          aria-hidden
                          className="absolute inset-0 rounded-full border border-foreground/20 bg-foreground/10"
                          transition={{ type: "spring", stiffness: 360, damping: 40, mass: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </m.a>
                  )
                })}
              </div>

              <a
                href={PRIMARY_CTA.href}
                onClick={() => selectNavTarget(PRIMARY_CTA.href)}
                className={`inline-flex h-10 items-center justify-center rounded-full border border-foreground/30 bg-foreground px-4 text-sm font-semibold text-background hover-glow hover:bg-foreground/90 transition-colors ${focusRingClass}`}
              >
                {PRIMARY_CTA.label}
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button
                ref={toggleButtonRef}
                type="button"
                onClick={() => setMobileOpen((isOpen) => !isOpen)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/30 bg-background/45 text-foreground hover:bg-muted/40 transition-colors ${focusRingClass}`}
              >
                {shouldReduceMotion ? (
                  mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    {mobileOpen ? (
                      <m.span
                        key="close"
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="inline-flex"
                      >
                        <X className="h-5 w-5" />
                      </m.span>
                    ) : (
                      <m.span
                        key="open"
                        initial={{ opacity: 0, rotate: 45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="inline-flex"
                      >
                        <Menu className="h-5 w-5" />
                      </m.span>
                    )}
                  </AnimatePresence>
                )}
              </button>
            </div>
          </div>
        </m.div>

        <AnimatePresence>
          {mobileOpen && (
            <m.div
              ref={menuRef}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              data-lenis-prevent
              className="mt-2 md:hidden rounded-2xl border border-border/30 bg-card/85 p-3 backdrop-blur-sm shadow-elegant max-h-[70vh] overflow-y-auto"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = active === item.href
                  return (
                    <m.a
                      key={item.href}
                      href={item.href}
                      variants={mobileItemVariants}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        selectNavTarget(item.href, { closeMobile: true })
                      }}
                      className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-foreground/10 text-foreground border border-foreground/15"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent"
                      }`}
                    >
                      {item.label}
                    </m.a>
                  )
                })}
              </div>

              <m.a
                href={PRIMARY_CTA.href}
                variants={mobileItemVariants}
                onClick={() => {
                  selectNavTarget(PRIMARY_CTA.href, { closeMobile: true })
                }}
                className={`mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border border-foreground/30 bg-foreground px-4 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors ${focusRingClass}`}
              >
                {PRIMARY_CTA.label}
              </m.a>
            </m.div>
          )}
        </AnimatePresence>
      </nav>
    </m.header>
  )
})

export default Header
