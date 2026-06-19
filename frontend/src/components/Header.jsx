import { motion, AnimatePresence } from "framer-motion"
import { memo, useContext, useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
]

function getBrandShortName(profile, fallbackName) {
  if (profile.brandShortName?.trim()) return profile.brandShortName
  const name = (profile.name?.trim() || fallbackName || "").trim()
  const first = name.split(/\s+/)[0]
  return first ? `${first}.` : ""
}
function getBrandMonogram(profile, fallbackName) {
  if (profile.brandMonogram?.trim()) return profile.brandMonogram
  const name = (profile.name?.trim() || fallbackName || "").trim()
  return name ? name.charAt(0).toUpperCase() : ""
}

const Header = memo(function Header() {
  const { loading, profile } = useContext(PortfolioContext)
  const displayName = profile.name?.trim() || (loading ? "" : "Mainak Dasgupta")
  const brandShortName = getBrandShortName(profile, displayName)
  const brandMonogram = getBrandMonogram(profile, displayName)

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState("#home")
  const menuRef = useRef(null)

  useEffect(() => {
    let ticking = false
    let lastScrolled = false
    const update = () => {
      ticking = false
      const next = window.scrollY > 40
      if (next !== lastScrolled) {
        lastScrolled = next
        setScrolled(next)
      }
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
    const sections = []
    NAV_ITEMS.forEach((item) => {
      const el = document.querySelector(item.href)
      if (el instanceof HTMLElement) sections.push(el)
    })
    if (!sections.length) return

    const ratios = new Map()
    sections.forEach((s) => ratios.set(s, 0))

    const recompute = () => {
      let bestId = "#home"
      let bestRatio = 0
      ratios.forEach((ratio, el) => {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = `#${el.id}`
        }
      })
      setActive(bestId)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.intersectionRatio)
        recompute()
      },
      {
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
        rootMargin: "-30% 0px -30% 0px",
      }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
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
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    window.addEventListener("mousedown", onClick)
    return () => window.removeEventListener("mousedown", onClick)
  }, [mobileOpen])

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        transform: "translateZ(0)",
        willChange: "backdrop-filter, background-color",
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "backdrop-blur-md bg-card/70 border-b border-border/20 shadow-elegant"
          : "bg-gradient-to-b from-black/35 via-black/10 to-transparent md:bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-2.5 md:py-3">
        <div className="flex items-center justify-between">
          <motion.a
            href="#home"
            className="text-2xl md:text-3xl font-bold cursive-brand leading-none flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
            aria-label={`${displayName} - Home`}
          >
            <span
              className="inline-block w-9 h-9 rounded-md bg-gradient-to-br from-foreground/90 to-accent flex items-center justify-center text-black font-bold"
              aria-hidden
            >
              {brandMonogram || "P"}
            </span>
            <span className="hidden md:inline">{brandShortName || "Portfolio"}</span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = active === item.href
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative text-sm transition-colors px-1 py-1 ${
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute left-0 right-0 -bottom-1 h-0.5 rounded-full transition-all ${
                      isActive ? "bg-foreground/90 w-full" : "bg-foreground/0 w-0"
                    }`}
                  />
                </motion.a>
              )
            })}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="h-10 w-10 rounded-md bg-black/25 hover:bg-black/35 border border-white/10 flex items-center justify-center text-foreground"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              data-lenis-prevent
              className="mt-3 md:hidden rounded-xl p-3 bg-card/80 border border-border/20 backdrop-blur-md shadow-elegant max-h-[70vh] overflow-y-auto"
            >
              <div className="flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm px-3.5 py-2.5 rounded-md transition-colors ${
                      active === item.href
                        ? "text-foreground font-semibold bg-accent/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
})

export default Header
