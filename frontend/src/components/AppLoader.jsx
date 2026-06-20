import { memo, useContext } from "react"
import { PortfolioContext } from "../context/PortfolioContext"

const NAV_PILL_WIDTHS = ["w-14", "w-16", "w-20", "w-16", "w-14", "w-24"]
const NAV_PILL_SHIMMERS = [
  "shimmer-delay-1",
  "shimmer-delay-2",
  "shimmer-delay-3",
  "shimmer-delay-4",
  "shimmer-delay-1",
  "shimmer-delay-2",
]

const AppLoader = memo(function AppLoader({ isExiting = false }) {
  const { profile } = useContext(PortfolioContext)
  const brandShortName = (profile?.brandShortName || "").trim() || "Mainak."
  const brandMonogram = (profile?.brandMonogram || "").trim() || brandShortName.charAt(0).toUpperCase() || "M"

  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading portfolio content"
      className={`loader-root fixed inset-0 z-40 overflow-x-hidden overflow-y-auto ${isExiting ? "is-exiting" : ""}`}
    >
      <span className="sr-only">Loading portfolio content. Preparing your experience.</span>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="loader-noise-overlay" />
        <div className="loader-vignette-overlay" />
        <div className="loader-ambient-orb loader-ambient-orb-1" />
        <div className="loader-ambient-orb loader-ambient-orb-2" />
        <div className="loader-ambient-orb loader-ambient-orb-3" />
      </div>

      <div className="loader-topbar" aria-hidden="true" />

      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <nav className="container mx-auto px-4 sm:px-6 pt-3 md:pt-4">
          <div className="skeleton-in rounded-2xl border border-border/35 glass-card shadow-elegant md:rounded-[999px]">
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 md:px-5">
              <div className="inline-flex items-center gap-2.5 rounded-full px-1.5 py-1">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-foreground to-foreground/80 text-sm font-semibold text-background"
                  aria-hidden="true"
                >
                  {brandMonogram}
                </span>
                <span className="cursive-brand text-xl font-bold leading-none md:text-2xl">
                  {brandShortName}
                </span>
              </div>

              <div className="hidden items-center gap-3 md:flex skeleton-in skeleton-delay-1">
                <div className="relative flex items-center gap-1 rounded-full border border-border/35 bg-background/30 p-1 backdrop-blur-sm">
                  {NAV_PILL_WIDTHS.map((widthClass, index) => (
                    <div
                      key={widthClass + String(index)}
                      className={`loading-shimmer h-9 rounded-full ${widthClass} ${NAV_PILL_SHIMMERS[index]}`}
                    />
                  ))}
                </div>
                <div className="loading-shimmer shimmer-delay-2 h-10 w-28 rounded-full" />
              </div>

              <div className="md:hidden skeleton-in skeleton-delay-1">
                <div className="loading-shimmer shimmer-delay-1 h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div
        aria-hidden="true"
        className="skeleton-in skeleton-delay-2 pointer-events-none absolute right-4 top-24 z-30 hidden items-center gap-2.5 rounded-full border border-border/35 bg-card/55 px-3 py-1.5 backdrop-blur-sm lg:flex"
      >
        <span className="blink-dot" />
        <div className="loading-shimmer shimmer-delay-3 h-2.5 w-24 rounded-full" />
      </div>

      <section
        aria-hidden="true"
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pt-16 md:pt-24"
      >
        <div className="absolute inset-0 z-10 bg-black/45" />

        <div className="container relative z-20 mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="skeleton-in mb-5 flex justify-center md:mb-8">
            <div className="relative inline-flex rounded-full profile-halo">
              <div
                className="absolute -inset-1.5 animate-spin-slow rounded-full opacity-85 pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 180deg, hsl(var(--ring) / 0.55), hsl(var(--ring) / 0.08), hsl(var(--ring) / 0.55))",
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 h-28 w-28 overflow-hidden rounded-full border-4 border-white/95 bg-black p-2 sm:h-36 sm:w-36 md:h-48 md:w-48">
                <div className="loading-shimmer shimmer-delay-2 h-full w-full rounded-full" />
              </div>
            </div>
          </div>

          <div className="skeleton-in skeleton-delay-1 mb-5 inline-flex items-center gap-2.5 rounded-full glass-card px-3 py-1.5 md:mb-8 md:px-4 md:py-2">
            <span className="blink-dot" aria-hidden="true" />
            <div className="loading-shimmer shimmer-delay-3 h-3 w-36 rounded-full md:w-44" />
          </div>

          <div className="skeleton-in skeleton-delay-2 mx-auto mb-3 max-w-4xl space-y-3 md:mb-4 md:space-y-4">
            <div className="loading-shimmer shimmer-delay-1 mx-auto h-10 w-[15.5rem] rounded-xl sm:h-12 sm:w-[22rem] md:h-14 md:w-[34rem]" />
            <div className="loading-shimmer shimmer-delay-2 mx-auto h-10 w-[13.5rem] rounded-xl sm:h-11 sm:w-[20rem] md:h-14 md:w-[30rem]" />
            <div className="loading-shimmer shimmer-delay-4 mx-auto h-8 w-[11rem] rounded-xl sm:h-10 sm:w-[16rem] md:h-12 md:w-[24rem]" />
          </div>

          <div className="skeleton-in skeleton-delay-3 mx-auto mb-7 max-w-2xl space-y-2.5 px-2 md:mb-10 md:space-y-3">
            <div className="loading-shimmer shimmer-delay-1 mx-auto h-4 w-full rounded-full md:h-5" />
            <div className="loading-shimmer shimmer-delay-3 mx-auto h-4 w-9/12 rounded-full md:h-5" />
          </div>

          <div className="skeleton-in skeleton-delay-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <div
              className="loading-shimmer shimmer-delay-1 h-12 w-full max-w-[14rem] rounded-md"
              style={{
                background: "hsl(var(--foreground) / 0.76)",
                boxShadow: "inset 0 0 0 1px hsl(var(--foreground) / 0.38)",
              }}
            />
            <div className="loading-shimmer shimmer-delay-2 h-12 w-full max-w-[14rem] rounded-md border border-input/50 bg-background/34" />
          </div>

          <div className="skeleton-in skeleton-delay-5 mt-8 md:mt-14">
            <div className="loading-shimmer shimmer-delay-1 mx-auto mb-3 h-3 w-24 rounded-full md:mb-4 md:w-28" />
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/35 md:h-9 md:w-9 loader-scroll-cue">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/60" />
            </div>
            <div className="loading-shimmer shimmer-delay-2 mx-auto mt-3 h-3 w-28 rounded-full md:mt-4 md:w-32" />
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="pointer-events-none relative -mt-10 sm:-mt-12">
        <div className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6">
          <div className="skeleton-in skeleton-delay-6 rounded-3xl border border-border/35 bg-card/35 p-5 backdrop-blur-sm">
            <div className="loading-shimmer shimmer-delay-2 h-5 w-40 rounded-md" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="loading-shimmer shimmer-delay-1 h-20 rounded-2xl" />
              <div className="loading-shimmer shimmer-delay-3 h-20 rounded-2xl" />
              <div className="loading-shimmer shimmer-delay-4 h-20 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
})

export default AppLoader
