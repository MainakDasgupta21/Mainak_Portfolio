import { m, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowRight } from "lucide-react"
import { useContext, useEffect, useMemo, useRef } from "react"
import { PortfolioContext } from "../context/PortfolioContext"
import { getProfileDisplayName } from "../utils/profileDisplay"
import assets from "../assets/assets"
import ResponsiveImage from "./ResponsiveImage"

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1]

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const { loading, profile } = useContext(PortfolioContext)
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const heroUi = profile.heroUi || {}
  const media = profile.media || {}
  const displayName = getProfileDisplayName(profile, loading ? "" : "Mainak Dasgupta")
  const heroRole = typeof heroUi.role === "string" ? heroUi.role.trim() : ""
  const role = heroRole || (loading ? "" : "Software Developer")
  const introPrefix = heroUi.introPrefix || (loading ? "" : "Hi, I'm")
  const badgeText = heroUi.badge || (loading ? "" : "Crafting Unique Solutions")
  const tagline = profile.tagline || (loading ? "" : "Building scalable systems and intelligent solutions")
  const scrollHintTop = heroUi.scrollHintTop || (loading ? "" : "Scroll down")
  const scrollHintBottom = heroUi.scrollHintBottom || (loading ? "" : "to see projects")
  const heroVideoSrc = media.heroVideoSrc || assets.heroVideo
  const heroVideoWebmSrc = media.heroVideoWebmSrc || assets.heroVideoWebm
  const heroPosterSrc = media.heroPosterSrc || assets.heroPoster
  const heroProfileSrc = media.heroProfileSrc || assets.heroProfile
  const heroProfileAvifSrc =
    media.heroProfileAvifSrc ||
    (heroProfileSrc === assets.heroProfile ? assets.heroProfileAvif : undefined)
  const heroProfileWebpSrc =
    media.heroProfileWebpSrc ||
    (heroProfileSrc === assets.heroProfile ? assets.heroProfileWebp : undefined)
  const ctaBaseClass =
    "group inline-flex h-12 w-full max-w-[14rem] sm:w-auto items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45"
  const ctaPrimaryClass = `${ctaBaseClass} hover-glow glow-button glow-delay-0 border border-foreground/25 bg-foreground text-background hover:bg-foreground/92`
  const ctaSecondaryClass = `${ctaBaseClass} hover-glow glow-delay-2 glass-card border border-input/50 text-foreground hover:bg-accent/80 hover:text-accent-foreground`

  const heroContainerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: shouldReduceMotion
          ? { duration: 0 }
          : { delayChildren: 0.08, staggerChildren: 0.12 },
      },
    }),
    [shouldReduceMotion]
  )

  const heroItemVariants = useMemo(
    () => ({
      hidden: shouldReduceMotion
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y: 20, filter: "blur(8px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.72, ease: EASE_OUT_QUINT },
      },
    }),
    [shouldReduceMotion]
  )

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!(section instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) return

    let sectionIsVisible = true
    let pageIsVisible = document.visibilityState === "visible"

    const syncVideoPlayback = () => {
      if (sectionIsVisible && pageIsVisible) {
        if (video.paused) {
          const playPromise = video.play()
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {})
          }
        }
        return
      }

      if (!video.paused) {
        video.pause()
      }
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        sectionIsVisible = Boolean(entry?.isIntersecting)
        syncVideoPlayback()
      },
      { threshold: 0.15 }
    )
    visibilityObserver.observe(section)

    const onVisibilityChange = () => {
      pageIsVisible = document.visibilityState === "visible"
      syncVideoPlayback()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    syncVideoPlayback()

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      visibilityObserver.disconnect()
    }
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden pt-16 md:pt-24"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroPosterSrc}
        aria-hidden="true"
      >
        <source src={heroVideoWebmSrc} type="video/webm" />
        <source src={heroVideoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 z-10 bg-black/45" />

      <m.div
        className="container mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-20"
        variants={heroContainerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
      >
        <m.div
          variants={heroItemVariants}
          className="flex justify-center mb-5 md:mb-8"
        >
          <div className="relative inline-flex rounded-full profile-halo">
            <div
              className="absolute -inset-1.5 rounded-full animate-spin-slow opacity-90 pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 180deg, hsl(var(--ring) / 0.55), hsl(var(--ring) / 0.08), hsl(var(--ring) / 0.55))",
              }}
              aria-hidden
            />
            <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white/95 bg-black">
              <ResponsiveImage
                src={heroProfileSrc}
                avifSrc={heroProfileAvifSrc}
                webpSrc={heroProfileWebpSrc}
                alt={displayName}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width={192}
                height={192}
                sizes="(min-width: 768px) 12rem, (min-width: 640px) 9rem, 7rem"
              />
            </div>
          </div>
        </m.div>

        <m.div
          variants={heroItemVariants}
          className="inline-block mb-5 md:mb-8"
        >
          <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full glass-card text-[11px] md:text-sm text-shadow-hero">
            <span className="blink-dot" aria-hidden /> {badgeText}
          </span>
        </m.div>

        <m.h1
          variants={heroItemVariants}
          className="text-[2.05rem] sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4 leading-tight text-shadow-hero"
        >
          {introPrefix}{" "}
          <span className="cursive-brand text-[2.45rem] sm:text-6xl md:text-8xl block sm:inline mt-1.5 sm:mt-0">
            {displayName}
          </span>
          <br className="hidden sm:block" />
          <span className="block mt-1.5 sm:mt-0 text-[1.95rem] sm:text-4xl md:text-6xl text-muted-foreground">
            {role}
          </span>
        </m.h1>

        <m.p
          variants={heroItemVariants}
          className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-7 md:mb-10 px-2 text-shadow-hero"
        >
          {tagline}
        </m.p>

        <m.div
          variants={heroItemVariants}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <a
            href={heroUi.primaryCtaHref || "#contact"}
            className={ctaPrimaryClass}
          >
            {heroUi.primaryCtaLabel || "Book a Free Call"}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <a
            href={heroUi.secondaryCtaHref || "#projects"}
            className={ctaSecondaryClass}
          >
            {heroUi.secondaryCtaLabel || "See Projects"}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </m.div>

        <m.div
          variants={heroItemVariants}
          className="mt-8 md:mt-14"
        >
          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
            {scrollHintTop}
          </p>
          {shouldReduceMotion ? (
            <div>
              <ArrowDown className="mx-auto w-5 h-5 md:w-6 md:h-6" />
            </div>
          ) : (
            <m.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ArrowDown className="mx-auto w-5 h-5 md:w-6 md:h-6" />
            </m.div>
          )}
          <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
            {scrollHintBottom}
          </p>
        </m.div>
      </m.div>
    </section>
  )
}

export default Hero
