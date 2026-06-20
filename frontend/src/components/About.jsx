import { m, useInView, useReducedMotion } from "framer-motion"
import { useContext, useRef } from "react"
import { Check, Clock, GraduationCap, School } from "lucide-react"
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

function getEducationIcon(degree) {
  const normalized = String(degree || "").toLowerCase()
  if (/(bachelor|b\.?tech|b\.?e|engineering|technology|university)/.test(normalized)) {
    return GraduationCap
  }
  return School
}

function getGradeDisplay(grade) {
  const rawGrade = String(grade || "").trim()
  if (!rawGrade) return ""

  const numeric = parseFloat(rawGrade.replace(/[^0-9.]/g, ""))
  const hasNumeric = Number.isFinite(numeric)
  if (/cgpa|cpi|gpa/i.test(rawGrade) && hasNumeric) {
    return `${numeric.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")} CGPA`
  }
  if (/%/.test(rawGrade) || !hasNumeric) return rawGrade

  const rounded = Number.isInteger(numeric)
    ? String(numeric)
    : numeric.toFixed(1).replace(/\.0$/, "")
  return `${rounded}%`
}

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()
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
  const hasEducation = education.length > 0
  const educationItems = education.map((ed, index) => {
    const degreeLabel = (ed.degree || "Education milestone").trim()
    const fieldLabel = (ed.field || "").trim()
    const institutionLabel = (ed.institution || "Institution unavailable").trim()
    const yearLabel = (ed.year || "").trim()
    const gradeLabel = getGradeDisplay(ed.grade)
    const isCompleted = String(ed.status || "").toLowerCase() === "completed"
    const statusLabel = isCompleted ? "Completed" : "Pursuing"
    const Icon = getEducationIcon(degreeLabel)

    return {
      key: ed._id || `${institutionLabel}-${index}`,
      index,
      degreeLabel,
      fieldLabel,
      institutionLabel,
      yearLabel,
      gradeLabel,
      isCompleted,
      statusLabel,
      Icon,
    }
  })

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
          <div className="relative mt-10 md:mt-12">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 md:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Education
              </h3>
              {hasEducation && (
                <span className="inline-flex rounded-md border border-border/50 bg-background/55 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {education.length} Milestones
                </span>
              )}
            </div>

            {!hasEducation ? (
              <div className="surface-card rounded-2xl p-6 md:p-8 text-center text-muted-foreground">
                Education entries will appear here once they are published.
              </div>
            ) : (
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 md:left-8">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-border/50" />
                  <m.div
                    className="absolute left-1/2 top-0 h-full origin-top -translate-x-1/2 w-[2px] rounded-full bg-gradient-to-b from-foreground/30 to-foreground/10"
                    initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <div className="space-y-6 md:space-y-8">
                  {educationItems.map((item) => {
                    return (
                      <m.article
                        key={item.key}
                        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.5, delay: item.index * 0.08, ease: [0.22, 1, 0.36, 1] }
                        }
                        viewport={{ once: true, amount: 0.3 }}
                        className="group relative pl-12 md:pl-24"
                      >
                        <span
                          className="absolute left-4 top-8 h-px w-8 -translate-y-1/2 bg-border/55 md:left-8 md:w-12"
                          aria-hidden
                        />

                        <span className="absolute left-4 top-8 z-20 -translate-x-1/2 md:left-8" aria-hidden>
                          <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-background bg-foreground/55">
                            <span className="absolute inset-[3px] rounded-full bg-background" />
                          </span>
                        </span>

                        {item.yearLabel && (
                          <span className="absolute left-7 top-4 z-20 inline-flex rounded-md border border-border/60 bg-background/85 px-2 py-0.5 text-[10px] font-medium text-muted-foreground md:left-12">
                            {item.yearLabel}
                          </span>
                        )}

                        <m.div
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="surface-card relative overflow-hidden rounded-xl border border-border/55 bg-card/80 p-4 sm:p-5 md:p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 group-hover:border-border/70 group-hover:bg-card/85"
                        >
                          <div className="relative flex flex-col gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${
                                    item.isCompleted
                                      ? "border-green-500/30 bg-green-500/10 text-green-500"
                                      : "border-blue-500/30 bg-blue-500/10 text-blue-500"
                                  }`}
                                >
                                  {item.isCompleted ? (
                                    <Check className="h-3.5 w-3.5" />
                                  ) : (
                                    <Clock className="h-3.5 w-3.5" />
                                  )}
                                  {item.statusLabel}
                                </span>
                                {item.gradeLabel && (
                                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground">
                                    <span className="text-muted-foreground">Grade</span>
                                    <span>{item.gradeLabel}</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-start gap-3 sm:gap-4">
                                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/55 bg-background/70 text-muted-foreground">
                                  <item.Icon className="h-5 w-5" />
                                </span>

                                <div className="min-w-0">
                                  <h4 className="text-base sm:text-lg md:text-xl font-semibold text-foreground break-words">
                                    {item.degreeLabel}
                                  </h4>
                                  {item.fieldLabel && (
                                    <p className="mt-1 text-sm md:text-[0.95rem] text-muted-foreground break-words">
                                      in {item.fieldLabel}
                                    </p>
                                  )}
                                  <p className="mt-2 text-sm md:text-base font-medium text-foreground break-words">
                                    {item.institutionLabel}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </m.div>
                      </m.article>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
