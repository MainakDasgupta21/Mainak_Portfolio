import { m, useInView } from "framer-motion"
import { useContext, useEffect, useRef, useState } from "react"
import { Check, Clock } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"
import { getProfileDisplayName } from "../utils/profileDisplay"
import assets from "../assets/assets"
import ResponsiveImage from "./ResponsiveImage"

function getAboutParagraphs(profile) {
  if (!profile.bio) return []
  return profile.bio
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { profile, education } = useContext(PortfolioContext)

  const aboutParagraphs = getAboutParagraphs(profile)
  const displayName = getProfileDisplayName(profile, "")
  const aboutProfileSrc = profile.media?.aboutProfileSrc || assets.aboutProfile
  const aboutProfileAvifSrc =
    profile.media?.aboutProfileAvifSrc ||
    (aboutProfileSrc === assets.aboutProfile ? assets.aboutProfileAvif : undefined)
  const aboutProfileWebpSrc =
    profile.media?.aboutProfileWebpSrc ||
    (aboutProfileSrc === assets.aboutProfile ? assets.aboutProfileWebp : undefined)

  const itemRefs = useRef([])
  const [visibleMap, setVisibleMap] = useState(() => new Array(education.length).fill(false))

  const setItemRef = (el, i) => { itemRefs.current[i] = el }

  useEffect(() => {
    setVisibleMap(new Array(education.length).fill(false))
  }, [education.length])

  useEffect(() => {
    if (!education.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleMap((prev) => {
          const next = prev.slice()
          let changed = false
          entries.forEach((entry) => {
            const idx = itemRefs.current.findIndex((el) => el === entry.target)
            if (idx >= 0) {
              const isVisible = entry.intersectionRatio >= 0.25
              if (next[idx] !== isVisible) {
                next[idx] = isVisible
                changed = true
              }
            }
          })
          return changed ? next : prev
        })
      },
      {
        root: null,
        rootMargin: "0px 0px -30% 0px",
        threshold: [0.25],
      }
    )
    itemRefs.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [education.length])

  const maxVisibleIndex = visibleMap.reduce((acc, v, i) => (v ? i : acc), -1)
  const progress = education.length
    ? maxVisibleIndex >= 0
      ? (maxVisibleIndex + 1) / education.length
      : 0
    : 0

  const itemMotion = {
    hidden: { opacity: 0, x: 20, y: 10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] },
    }),
  }

  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            About Me
          </h2>
          <div className="w-16 md:w-20 h-1.5 bg-accent rounded-full mx-auto mb-6 md:mb-8" />
        </m.div>

        <div className="max-w-6xl mx-auto">
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-12"
          >
            <div className="w-full max-w-[260px] sm:max-w-none sm:w-[280px] mx-auto sm:mx-0 md:w-[380px] h-[320px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-xl border-4 border-white flex-shrink-0">
              <ResponsiveImage
                src={aboutProfileSrc}
                avifSrc={aboutProfileAvifSrc}
                webpSrc={aboutProfileWebpSrc}
                alt={displayName || "Profile"}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 ease-out hover:scale-105"
                loading="lazy"
                decoding="async"
                width={760}
                height={840}
                sizes="(min-width: 1024px) 380px, (min-width: 768px) 280px, 260px"
              />
            </div>

            <div className="flex-1 pt-2">
              {aboutParagraphs.map((paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(0, 24)}`}
                  className={`text-base md:text-lg leading-relaxed text-muted-foreground ${
                    index < aboutParagraphs.length - 1 ? "mb-4" : ""
                  }`}
                >
                  {index === 0 ? (
                    displayName ? (
                      <>
                        <span className="font-semibold text-foreground">
                          {displayName}
                        </span>{" "}
                        - {paragraph}
                      </>
                    ) : (
                      paragraph
                    )
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          </m.div>

          {/* Education Timeline */}
          <div className="relative mt-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="hidden md:flex w-16 justify-center flex-shrink-0">
                <div className="relative flex justify-center h-full">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-white/10 via-white/20 to-white/10 rounded-full" />

                  <m.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(progress, 0.02) * 100}%` }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 15,
                      duration: 1.2,
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-[8px] rounded-full overflow-hidden"
                  >
                    <div className="w-full h-full relative bg-gradient-to-b from-white/10 via-white/60 to-white/10">
                      <m.div
                        initial={{ top: "0%" }}
                        animate={{ top: `${Math.max(progress, 0.02) * 100}%` }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 rounded-full pointer-events-none"
                      >
                        <div className="absolute inset-0 rounded-full bg-white/70 blur-md" />
                        <div className="absolute inset-2 md:inset-2.5 rounded-full bg-white" />
                      </m.div>
                    </div>
                  </m.div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 md:mb-8 text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Education
                </h3>

                <div className="space-y-6 md:space-y-8 relative">
                  {education.map((ed, i) => (
                    <m.div
                      key={`${ed.institution}-${i}`}
                      ref={(el) => setItemRef(el, i)}
                      custom={i}
                      initial="hidden"
                      animate={visibleMap[i] ? "visible" : "hidden"}
                      variants={itemMotion}
                      className="group relative"
                    >
                      <div className="hidden md:block absolute -left-[52px] top-8 z-10">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white border-2 md:border-4 border-accent shadow-[0_0_20px_8px_rgba(255,255,255,0.6)] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative bg-card/60 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl border border-border/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:bg-card/80 group-hover:border-border/40 group-hover:scale-[1.02]">
                          <div className="md:absolute md:top-6 md:right-6 mb-3 md:mb-0">
                            {ed.status === "Completed" ? (
                              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-500 px-2.5 py-1 rounded-full border border-green-500/30">
                                <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span className="text-[11px] md:text-sm font-semibold">
                                  Completed
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30 motion-safe:animate-pulse">
                                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span className="text-[11px] md:text-sm font-semibold">
                                  Pursuing
                                </span>
                              </div>
                            )}
                          </div>

                          <h4 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 tracking-wide md:pr-32 break-words">
                            {ed.degree} {ed.field ? `in ${ed.field}` : ""}
                          </h4>

                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                            <span className="text-sm md:text-lg font-semibold text-accent bg-accent/10 px-2.5 py-1 md:px-3 rounded-full break-words">
                              {ed.institution}
                            </span>
                            <span className="text-xs md:text-sm text-muted-foreground font-medium bg-muted/50 px-2.5 py-1 md:px-3 rounded-full">
                              {ed.year}
                            </span>
                          </div>

                          {ed.grade && (
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-muted/60 to-muted/40 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-border/30">
                              <span className="text-xs md:text-sm font-semibold text-foreground">Grade:</span>
                              <span className="text-xs md:text-sm font-bold text-accent">{ed.grade}</span>
                            </div>
                          )}

                          <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500 group-hover:w-full" />
                        </div>
                      </div>
                    </m.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
