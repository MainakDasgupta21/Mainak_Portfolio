import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowRight } from "lucide-react"
import { useContext } from "react"
import { PortfolioContext } from "../context/PortfolioContext"

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const { profile } = useContext(PortfolioContext)
  const heroUi = profile.heroUi || {}
  const media = profile.media || {}
  const displayName = profile.name || "Mainak Dasgupta"
  const heroRole = typeof heroUi.role === "string" ? heroUi.role.trim() : ""
  const role = heroRole || "Software Developer"
  const introPrefix = heroUi.introPrefix || "Hi, I'm"
  const badgeText = heroUi.badge || "Crafting Unique Solutions"
  const tagline = profile.tagline || "Building scalable systems and intelligent solutions"
  const scrollHintTop = heroUi.scrollHintTop || "Scroll down"
  const scrollHintBottom = heroUi.scrollHintBottom || "to see projects"
  const heroVideoSrc = media.heroVideoSrc || "/back.mp4"
  const heroPosterSrc = media.heroPosterSrc || "/back-poster.jpg"
  const heroProfileSrc = media.heroProfileSrc || "/me.png"
  const easeOutQuint = [0.22, 1, 0.36, 1]

  const heroContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { delayChildren: 0.08, staggerChildren: 0.12 },
    },
  }

  const heroItemVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 20, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.72, ease: easeOutQuint },
    },
  }

  return (
    <section
      id="home"
      className="min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden pt-16 md:pt-24"
    >
      <video
        className="absolute inset-0 z-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroPosterSrc}
        aria-hidden="true"
      >
        <source src={heroVideoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px]" />

      <motion.div
        className="container mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-20"
        variants={heroContainerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
      >
        <motion.div
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
            <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white/95 backdrop-blur-sm bg-black">
              <img
                src={heroProfileSrc}
                alt={displayName}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={heroItemVariants}
          className="inline-block mb-5 md:mb-8"
        >
          <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full glass-card text-[11px] md:text-sm text-shadow-hero">
            <span className="blink-dot">•</span> {badgeText}
          </span>
        </motion.div>

        <motion.h1
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
        </motion.h1>

        <motion.p
          variants={heroItemVariants}
          className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-7 md:mb-10 px-2 text-shadow-hero"
        >
          {tagline}
        </motion.p>

        <motion.div
          variants={heroItemVariants}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <a
            href={heroUi.primaryCtaHref || "#contact"}
            className="group w-full max-w-[17rem] sm:w-auto px-6 py-5 sm:px-10 sm:py-6 text-sm sm:text-base hover-glow glow-button glow-delay-0 inline-flex items-center justify-center gap-2 rounded-md border border-foreground/25 bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium"
          >
            {heroUi.primaryCtaLabel || "Book a Free Call"}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <a
            href={heroUi.secondaryCtaHref || "#projects"}
            className="group w-full max-w-[17rem] sm:w-auto px-6 py-5 sm:px-10 sm:py-6 text-sm sm:text-base hover-glow glow-delay-2 inline-flex items-center justify-center gap-2 rounded-md glass-card border border-input/60 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
          >
            {heroUi.secondaryCtaLabel || "See Projects"}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>

        <motion.div
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
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ArrowDown className="mx-auto w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
          )}
          <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
            {scrollHintBottom}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
