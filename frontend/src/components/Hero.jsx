import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useContext } from "react"
import { PortfolioContext } from "../context/PortfolioContext"

const Hero = () => {
  const { profile } = useContext(PortfolioContext)
  const heroUi = profile.heroUi || {}
  const media = profile.media || {}
  const displayName = profile.name || "Mainak Dasgupta"
  const role = heroUi.role || profile.title || "Software Developer"
  const heroVideoSrc = media.heroVideoSrc || "/back.mp4"
  const heroPosterSrc = media.heroPosterSrc || "/back-poster.jpg"
  const heroProfileSrc = media.heroProfileSrc || "/me.png"

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

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-5 md:mb-8"
        >
          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white backdrop-blur-sm">
            <img
              src={heroProfileSrc}
              alt={displayName}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-5 md:mb-8"
        >
          <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full glass-card text-[11px] md:text-sm">
            <span className="blink-dot">•</span> {heroUi.badge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[2.05rem] sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4 leading-tight"
        >
          {heroUi.introPrefix}{" "}
          <span className="cursive-brand text-[2.45rem] sm:text-6xl md:text-8xl block sm:inline mt-1.5 sm:mt-0">
            {displayName}
          </span>
          <br className="hidden sm:block" />
          <span className="block mt-1.5 sm:mt-0 text-[1.95rem] sm:text-4xl md:text-6xl text-muted-foreground">
            {role}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-7 md:mb-10 px-2"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <a
            href={heroUi.primaryCtaHref || "#contact"}
            className="w-full max-w-[17rem] sm:w-auto px-6 py-5 sm:px-10 sm:py-6 text-sm sm:text-base hover-glow glow-button glow-delay-0 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
          >
            {heroUi.primaryCtaLabel || "Book a Free Call"}
          </a>

          <a
            href={heroUi.secondaryCtaHref || "#projects"}
            className="w-full max-w-[17rem] sm:w-auto px-6 py-5 sm:px-10 sm:py-6 text-sm sm:text-base hover-glow glow-button glow-delay-2 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
          >
            {heroUi.secondaryCtaLabel || "See Projects"}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 md:mt-14"
        >
          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
            {heroUi.scrollHintTop}
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="mx-auto w-5 h-5 md:w-6 md:h-6" />
          </motion.div>
          <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
            {heroUi.scrollHintBottom}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
