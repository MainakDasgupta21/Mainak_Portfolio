import { m, useInView, useReducedMotion } from "framer-motion"
import { useContext, useRef } from "react"
import { Check, Clock, GraduationCap, School, Sparkles } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"
import { getProfileDisplayName } from "../utils/profileDisplay"
import assets from "../assets/assets"
import ResponsiveImage from "./ResponsiveImage"

const GRADE_RING_RADIUS = 38
const GRADE_RING_CIRCUMFERENCE = 2 * Math.PI * GRADE_RING_RADIUS

function getAboutParagraphs(profile) {
  if (!profile.bio) return []
  return profile.bio
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function parseGrade(grade) {
  if (!grade) return null

  const rawGrade = String(grade).trim()
  if (!rawGrade) return null

  const numeric = parseFloat(rawGrade.replace(/[^0-9.]/g, ""))
  if (!Number.isFinite(numeric)) return null

  const isCgpa = /cgpa|cpi|gpa/i.test(rawGrade)
  const pct = isCgpa ? (numeric / 10) * 100 : numeric
  const boundedPct = Math.max(0, Math.min(100, pct))
  const rounded = Number.isInteger(numeric)
    ? String(numeric)
    : numeric
      .toFixed(isCgpa ? 2 : 1)
      .replace(/\.0+$/, "")
      .replace(/(\.\d*[1-9])0+$/, "$1")

  return {
    pct: boundedPct,
    label: isCgpa ? rounded : `${rounded}%`,
    unit: isCgpa ? "CGPA" : "Score",
  }
}

function getEducationIcon(degree) {
  const normalized = String(degree || "").toLowerCase()
  if (/(bachelor|b\.?tech|b\.?e|engineering|technology|university)/.test(normalized)) {
    return GraduationCap
  }
  return School
}

function GradeRing({ gradeData, shouldReduceMotion }) {
  const progress = Math.max(0, Math.min(100, gradeData.pct))
  const dashOffset = GRADE_RING_CIRCUMFERENCE - (progress / 100) * GRADE_RING_CIRCUMFERENCE

  return (
    <div className="mx-auto shrink-0 md:mx-0">
      <div className="relative h-24 w-24">
        <div className="pointer-events-none absolute inset-1 rounded-full bg-accent/20 blur-md" aria-hidden />
        <svg
          viewBox="0 0 96 96"
          className="-rotate-90 h-full w-full"
          role="img"
          aria-label={`Grade ${gradeData.label}`}
        >
          <circle
            cx="48"
            cy="48"
            r={GRADE_RING_RADIUS}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="6"
            className="text-border/80"
          />
          <m.circle
            cx="48"
            cy="48"
            r={GRADE_RING_RADIUS}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={GRADE_RING_CIRCUMFERENCE}
            className="text-accent"
            initial={{ strokeDashoffset: shouldReduceMotion ? dashOffset : GRADE_RING_CIRCUMFERENCE }}
            whileInView={{ strokeDashoffset: dashOffset }}
            viewport={{ once: true, amount: 0.6 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-bold leading-none text-foreground">{gradeData.label}</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {gradeData.unit}
          </span>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
        {Math.round(progress)}% equivalent
      </p>
    </div>
  )
}

function EducationInsightCard({ icon: Icon, label, value, note }) {
  return (
    <div className="surface-card rounded-xl border border-border/45 bg-background/55 p-3.5 md:p-4">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  )
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
    const gradeLabel = (ed.grade || "").trim()
    const gradeData = parseGrade(gradeLabel)
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
      gradeData,
      isCompleted,
      statusLabel,
      Icon,
    }
  })
  const completedCount = educationItems.filter((item) => item.isCompleted).length
  const pursuingCount = Math.max(educationItems.length - completedCount, 0)
  const gradedItems = educationItems.filter((item) => item.gradeData)
  const bestGradeItem = gradedItems.reduce(
    (best, item) => (!best || item.gradeData.pct > best.gradeData.pct ? item : best),
    null
  )
  const averageGradePct = gradedItems.length
    ? gradedItems.reduce((sum, item) => sum + item.gradeData.pct, 0) / gradedItems.length
    : null

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
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Education
                </h3>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
                  A focused academic journey with measurable growth, strong performance, and consistent progression.
                </p>
              </div>
              {hasEducation && (
                <span className="inline-flex rounded-full border border-border/45 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
                <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 md:mb-8">
                  <EducationInsightCard
                    icon={Sparkles}
                    label="Milestones"
                    value={educationItems.length}
                    note="Academic checkpoints"
                  />
                  <EducationInsightCard
                    icon={Check}
                    label="Completed"
                    value={completedCount}
                    note={pursuingCount > 0 ? `${pursuingCount} currently pursuing` : "All milestones completed"}
                  />
                  <EducationInsightCard
                    icon={GraduationCap}
                    label="Best Grade"
                    value={bestGradeItem?.gradeData?.label || "--"}
                    note={
                      bestGradeItem?.gradeData
                        ? `${Math.round(bestGradeItem.gradeData.pct)}% score equivalent`
                        : "Grade data unavailable"
                    }
                  />
                  <EducationInsightCard
                    icon={Clock}
                    label="Average"
                    value={averageGradePct !== null ? `${averageGradePct.toFixed(1)}%` : "--"}
                    note={averageGradePct !== null ? "Across scored milestones" : "Awaiting score entries"}
                  />
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-4 md:left-8">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-border/45" />
                  <m.div
                    className="absolute left-1/2 top-0 h-full origin-top -translate-x-1/2 w-[2px] rounded-full bg-gradient-to-b from-accent via-accent/55 to-accent/10"
                    initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <div className="space-y-6 md:space-y-8">
                  {educationItems.map((item) => {
                    const isBestScore = bestGradeItem?.key === item.key
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
                          className="absolute left-4 top-8 h-[2px] w-8 -translate-y-1/2 bg-gradient-to-r from-accent/70 to-transparent md:left-8 md:w-14"
                          aria-hidden
                        />

                        <span className="absolute left-4 top-8 z-20 -translate-x-1/2 md:left-8" aria-hidden>
                          <span className="absolute inset-0 rounded-full bg-accent/35 blur-md" />
                          <span className="relative block h-4 w-4 rounded-full border border-background bg-accent">
                            <span className="absolute inset-1.5 rounded-full bg-background motion-safe:animate-pulse" />
                          </span>
                        </span>

                        {item.yearLabel && (
                          <span className="absolute left-7 top-4 z-20 inline-flex rounded-full border border-accent/30 bg-background/75 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-accent md:left-12">
                            {item.yearLabel}
                          </span>
                        )}

                        <m.div
                          whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.005 }}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                          className="relative overflow-hidden rounded-2xl border border-border/35 bg-card/75 p-4 sm:p-6 md:p-7 shadow-elegant backdrop-blur-sm transition-colors duration-300 group-hover:border-accent/35 group-hover:bg-card/85 group-hover:shadow-[0_0_36px_hsl(var(--ring)_/_0.13)]"
                        >
                          <span className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-accent/20 via-foreground/5 to-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
                          <span className="absolute right-4 top-4 hidden rounded-full border border-border/45 bg-background/55 px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-muted-foreground sm:inline-flex">
                            {`#${String(item.index + 1).padStart(2, "0")}`}
                          </span>

                          <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                    item.isCompleted
                                      ? "border-green-500/35 bg-green-500/12 text-green-400"
                                      : "border-blue-500/35 bg-blue-500/12 text-blue-400"
                                  }`}
                                >
                                  {item.isCompleted ? (
                                    <Check className="h-3.5 w-3.5" />
                                  ) : (
                                    <Clock className="h-3.5 w-3.5 motion-safe:animate-pulse" />
                                  )}
                                  {item.statusLabel}
                                </span>
                                {isBestScore && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Top Score
                                  </span>
                                )}
                              </div>

                              <div className="flex items-start gap-3 sm:gap-4">
                                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent shadow-[0_0_24px_hsl(var(--ring)_/_0.16)]">
                                  <item.Icon className="h-5 w-5" />
                                </span>

                                <div className="min-w-0">
                                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-wide break-words">
                                    {item.degreeLabel}
                                  </h4>
                                  {item.fieldLabel && (
                                    <p className="mt-1 text-sm md:text-base font-medium text-muted-foreground break-words">
                                      in {item.fieldLabel}
                                    </p>
                                  )}
                                  <p className="mt-2 inline-flex max-w-full rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm md:text-base font-semibold text-accent break-words">
                                    {item.institutionLabel}
                                  </p>
                                </div>
                              </div>

                              {!item.gradeData && item.gradeLabel && (
                                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/35 px-3 py-1.5">
                                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                    Grade
                                  </span>
                                  <span className="text-sm font-bold text-foreground">{item.gradeLabel}</span>
                                </div>
                              )}
                            </div>

                            {item.gradeData && (
                              <GradeRing gradeData={item.gradeData} shouldReduceMotion={shouldReduceMotion} />
                            )}
                          </div>

                          <div className="mt-5 h-1 w-0 rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500 group-hover:w-full" />
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
