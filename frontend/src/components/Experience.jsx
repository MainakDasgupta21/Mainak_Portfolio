import { m, useInView, useReducedMotion } from "framer-motion"
import { memo, useContext, useRef } from "react"
import { FileText, Globe } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"

const Experience = memo(function Experience() {
  const sectionRef = useRef(null)
  const timelineInView = useInView(sectionRef, { once: true, margin: "-15% 0px -15% 0px" })
  const shouldReduceMotion = useReducedMotion()
  const { experience, profile } = useContext(PortfolioContext)
  const hasExperience = experience.length > 0
  const subtitle =
    profile.sectionSubtitles?.experience ||
    "Professional journey building impactful solutions"

  return (
    <section id="experience" className="py-20 md:py-32 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6">
        <m.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Work Experience
          </h2>
          <div className="w-16 md:w-20 h-1.5 bg-accent rounded-full mx-auto mb-6 md:mb-8" />
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        </m.div>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 md:left-1/2 md:-translate-x-1/2">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-border/45" />
              <m.div
                className="absolute left-1/2 top-0 h-full origin-top -translate-x-1/2 w-[2px] rounded-full bg-gradient-to-b from-accent via-accent/55 to-accent/15"
                initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                animate={{ scaleY: timelineInView ? 1 : 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {!hasExperience ? (
              <div className="pl-12 md:pl-0">
                <div className="surface-card rounded-2xl p-6 md:p-8 text-center text-muted-foreground max-w-3xl md:mx-auto">
                  Experience entries will appear here once they are published.
                </div>
              </div>
            ) : (
              <div className="space-y-8 md:space-y-12">
                {experience.map((exp, index) => {
                  const isLeft = index % 2 === 0
                  const companyName = (exp.company || "Company unavailable").trim()
                  const roleName = (exp.role || "Role not specified").trim()
                  const highlights = Array.isArray(exp.highlights) ? exp.highlights : []
                  const periodLabel = (exp.period || "Timeline unavailable").trim()
                  const connectorClass = isLeft
                    ? "hidden md:block absolute top-9 right-1/2 mr-2 h-[2px] w-14 rounded-full bg-gradient-to-l from-accent via-accent/45 to-transparent opacity-95"
                    : "hidden md:block absolute top-9 left-1/2 ml-2 h-[2px] w-14 rounded-full bg-gradient-to-r from-accent via-accent/45 to-transparent opacity-95"
                  const cardDockClass = isLeft
                    ? "md:mr-auto md:pr-14"
                    : "md:ml-auto md:pl-14"

                  return (
                    <m.article
                      key={exp._id || `${companyName}-${index}`}
                      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.52, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }
                      }
                      viewport={{ once: true, amount: 0.28 }}
                      className="relative pl-12 md:pl-0"
                    >
                      <span className="absolute z-20 top-8 left-4 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2">
                        <span className="absolute inset-0 rounded-full bg-accent/30 blur-md" />
                        <span className="relative block h-3 w-3 rounded-full border border-background bg-accent" />
                      </span>

                      <span className={connectorClass} aria-hidden />

                      <m.div
                        whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.005 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`surface-card rounded-2xl p-4 sm:p-5 md:p-7 shadow-elegant hover:shadow-glow md:w-[calc(50%-1.5rem)] ${cardDockClass}`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-accent sm:text-xs">
                            {periodLabel}
                          </span>
                          <span className="hidden sm:inline-flex rounded-full border border-border/50 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground">
                            Experience {index + 1}
                          </span>
                        </div>

                        <div className="mt-4 flex items-start gap-3 sm:gap-4">
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-background/70 shadow-sm">
                            {exp.logo ? (
                              <img
                                src={exp.logo}
                                alt={`${companyName} logo`}
                                className="h-6 w-6 object-contain"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <span className="text-sm font-bold text-foreground">
                                {companyName.charAt(0).toUpperCase() || "W"}
                              </span>
                            )}
                          </span>

                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl md:text-[1.45rem] font-semibold leading-tight text-foreground break-words">
                              {roleName}
                            </h3>
                            <p className="mt-1 text-sm sm:text-base font-medium text-muted-foreground break-words">
                              {companyName}
                            </p>
                          </div>
                        </div>

                        <ul className="mt-5 space-y-2.5">
                          {highlights.length > 0 ? (
                            highlights.map((highlight, hIndex) => (
                              <li
                                key={`${hIndex}-${String(highlight).slice(0, 18)}`}
                                className="flex items-start gap-3 rounded-xl border border-border/30 bg-muted/20 px-3 py-3"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                <span className="text-sm md:text-[0.94rem] leading-relaxed text-muted-foreground break-words">
                                  {highlight}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="rounded-xl border border-border/30 bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
                              Details will be updated soon.
                            </li>
                          )}
                        </ul>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                          {exp.link && (
                            <m.a
                              href={exp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                              className="inline-flex h-9 items-center gap-2 rounded-md border border-border/45 bg-background/65 px-3 text-sm text-foreground hover:bg-accent/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              aria-label={`Open ${companyName} website`}
                              title="Company website"
                            >
                              <Globe className="h-4 w-4 text-accent" />
                              <span>Website</span>
                            </m.a>
                          )}

                          {exp.certificate && (
                            <m.a
                              href={exp.certificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                              className="inline-flex h-9 items-center gap-2 rounded-md border border-green-500/35 bg-green-500/10 px-3 text-sm text-green-400 hover:bg-green-500/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              aria-label={`View ${companyName} certificate`}
                              title="Internship certificate"
                            >
                              <FileText className="h-4 w-4" />
                              <span>Certificate</span>
                            </m.a>
                          )}
                        </div>
                      </m.div>
                    </m.article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

export default Experience
