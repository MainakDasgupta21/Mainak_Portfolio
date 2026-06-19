import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion"
import { memo, useContext, useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"
import { getProfileDisplayName } from "../utils/profileDisplay"

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Achievements", href: "#achievements" },
]
const PRIMARY_CTA = { label: "Let's Talk", href: "#contact" }

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
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  })

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
  const activeLockRef = useRef(null)
  const activeLockUntilRef = useRef(0)

  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      setScrolled(window.scrollY > 28)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    let io = null
    const ratios = new Map()

    const recompute = () => {
      const lockedTarget = activeLockRef.current
      if (lockedTarget) {
        const targetSection = document.querySelector(lockedTarget)
        if (targetSection instanceof HTMLElement) {
          const ratio = ratios.get(targetSection) || 0
          const distanceFromTop = Math.abs(targetSection.getBoundingClientRect().top - 88)
          const reachedTarget = ratio >= 0.35 || distanceFromTop <= 28
          const expiredLock = performance.now() > activeLockUntilRef.current

          if (!reachedTarget && !expiredLock) {
            setActive((prev) => (prev === lockedTarget ? prev : lockedTarget))
            return
          }
        }

        activeLockRef.current = null
      }

      let bestId = "#home"
      let bestRatio = 0

      ratios.forEach((ratio, section) => {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = `#${section.id}`
        }
      })

      if (bestRatio === 0) {
        const viewportProbe = window.innerHeight * 0.35
        ratios.forEach((_, section) => {
          if (section.getBoundingClientRect().top - viewportProbe <= 0) {
            bestId = `#${section.id}`
          }
        })
      }

      setActive((prev) => (prev === bestId ? prev : bestId))
    }

    const observeSections = () => {
      const sections = NAV_ITEMS.map((item) => document.querySelector(item.href)).filter(
        (el) => el instanceof HTMLElement
      )

      if (!sections.length) return false

      io?.disconnect()
      ratios.clear()
      sections.forEach((section) => ratios.set(section, 0))

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(entry.target, entry.intersectionRatio)
          }
          recompute()
        },
        {
          threshold: [0, 0.1, 0.25, 0.45, 0.65, 0.85, 1],
          rootMargin: "-24% 0px -48% 0px",
        }
      )
      sections.forEach((section) => io.observe(section))
      recompute()
      return true
    }

    if (observeSections()) {
      return () => io?.disconnect()
    }

    const mutationObserver = new MutationObserver(() => {
      if (observeSections()) mutationObserver.disconnect()
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      io?.disconnect()
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
    : "border border-white/10 bg-black/25 backdrop-blur-md md:border-transparent md:bg-transparent md:backdrop-blur-0"
  const mobileMenuVariants = {
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
  }
  const mobileItemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
    visible: shouldReduceMotion
      ? { opacity: 1, transition: { duration: 0.12 } }
      : { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  }
  const lockActiveItem = (href) => {
    activeLockRef.current = href
    activeLockUntilRef.current = performance.now() + 1400
    setActive(href)
  }

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        transform: "translateZ(0)",
      }}
      className="fixed inset-x-0 top-0 z-50 pointer-events-none"
    >
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/95 to-transparent origin-left"
          style={{ scaleX: progressScaleX }}
        />
      )}

      <nav className="container pointer-events-auto mx-auto px-4 sm:px-6 pt-3 md:pt-4" aria-label="Primary">
        <motion.div
          className={`rounded-2xl md:rounded-[999px] transition-all duration-300 ${shellClassName}`}
          animate={shouldReduceMotion ? undefined : { y: scrolled ? 0 : -2 }}
        >
          <div className="flex items-center justify-between gap-3 px-3 sm:px-4 md:px-5 py-2.5">
            <motion.a
              href="#home"
              aria-label={`${ariaDisplayName} - Home`}
              onClick={() => {
                lockActiveItem("#home")
                setMobileOpen(false)
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
            </motion.a>

            <div className="hidden md:flex items-center gap-3">
              <div className="relative flex items-center gap-1 rounded-full border border-border/35 bg-background/30 p-1 backdrop-blur-md">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = active === item.href
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={() => lockActiveItem(item.href)}
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
                        <motion.span
                          layoutId="navActivePill"
                          aria-hidden
                          className="absolute inset-0 rounded-full border border-foreground/20 bg-foreground/10"
                          transition={{ type: "spring", stiffness: 460, damping: 42, mass: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </motion.a>
                  )
                })}
              </div>

              <a
                href={PRIMARY_CTA.href}
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
                      <motion.span
                        key="close"
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="inline-flex"
                      >
                        <X className="h-5 w-5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="open"
                        initial={{ opacity: 0, rotate: 45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="inline-flex"
                      >
                        <Menu className="h-5 w-5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={menuRef}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              data-lenis-prevent
              className="mt-2 md:hidden rounded-2xl border border-border/30 bg-card/85 p-3 backdrop-blur-xl shadow-elegant max-h-[70vh] overflow-y-auto"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = active === item.href
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      variants={mobileItemVariants}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        lockActiveItem(item.href)
                        setMobileOpen(false)
                      }}
                      className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-foreground/10 text-foreground border border-foreground/15"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent"
                      }`}
                    >
                      {item.label}
                    </motion.a>
                  )
                })}
              </div>

              <motion.a
                href={PRIMARY_CTA.href}
                variants={mobileItemVariants}
                onClick={() => {
                  lockActiveItem(PRIMARY_CTA.href)
                  setMobileOpen(false)
                }}
                className={`mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border border-foreground/30 bg-foreground px-4 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors ${focusRingClass}`}
              >
                {PRIMARY_CTA.label}
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
})

export default Header
