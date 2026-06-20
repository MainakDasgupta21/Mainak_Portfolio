import { memo } from "react"

/**
 * Below-the-fold loading skeletons. Each block mirrors the real section's outer
 * shell (same id, padding, container and static heading) so that when the live
 * content swaps in there is no visible layout shift or heading flash — only the
 * data-driven card bodies are placeholders.
 *
 * Custom classes (loading-shimmer / skeleton-in / *-delay-*) live in Tailwind's
 * @layer utilities, so they must always appear here as literal strings.
 */

const Bar = ({ className = "", shimmer = "" }) => (
  <div aria-hidden="true" className={`loading-shimmer ${shimmer} ${className}`} />
)

const SectionEyebrow = ({ title, divider, subtitle, gradientHeading = false, wide = false }) => (
  <div className="text-center mb-12 md:mb-16 skeleton-in">
    <h2
      className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 ${
        gradientHeading
          ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
          : ""
      }`}
    >
      {title}
    </h2>
    <div
      className={`${wide ? "w-20 md:w-24" : "w-16 md:w-20"} ${divider} bg-accent rounded-full mx-auto mb-6 md:mb-8`}
    />
    {subtitle && (
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
        {subtitle}
      </p>
    )}
  </div>
)

const AboutSkeleton = () => (
  <section aria-hidden="true" className="py-20 md:py-32 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionEyebrow title="About Me" divider="h-1.5" gradientHeading />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-12">
          <div className="skeleton-in skeleton-delay-1 w-full max-w-[260px] sm:max-w-none sm:w-[280px] mx-auto sm:mx-0 md:w-[380px] h-[320px] sm:h-[360px] md:h-[420px] flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white/10">
            <Bar shimmer="shimmer-delay-2" className="h-full w-full !rounded-none" />
          </div>

          <div className="skeleton-in skeleton-delay-2 w-full flex-1 space-y-3.5 pt-2">
            <Bar shimmer="shimmer-delay-1" className="h-4 w-full rounded-full" />
            <Bar shimmer="shimmer-delay-2" className="h-4 w-[97%] rounded-full" />
            <Bar shimmer="shimmer-delay-3" className="h-4 w-[92%] rounded-full" />
            <Bar shimmer="shimmer-delay-1" className="h-4 w-[95%] rounded-full" />
            <Bar shimmer="shimmer-delay-2" className="h-4 w-[55%] rounded-full" />
            <div className="h-2" />
            <Bar shimmer="shimmer-delay-3" className="h-4 w-[90%] rounded-full" />
            <Bar shimmer="shimmer-delay-1" className="h-4 w-[88%] rounded-full" />
            <Bar shimmer="shimmer-delay-2" className="h-4 w-[42%] rounded-full" />
          </div>
        </div>

        <div className="relative mt-10 md:mt-12">
          <div className="skeleton-in skeleton-delay-3 mb-6 flex flex-wrap items-center justify-between gap-3 md:mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Education
            </h3>
            <Bar shimmer="shimmer-delay-2" className="h-7 w-28 rounded-md" />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 md:left-8">
              <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-border/50" />
            </div>

            <div className="space-y-6 md:space-y-8">
              <EducationRowSkeleton stagger="skeleton-delay-4" />
              <EducationRowSkeleton stagger="skeleton-delay-5" />
              <EducationRowSkeleton stagger="skeleton-delay-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const EducationRowSkeleton = ({ stagger }) => (
  <div className={`relative pl-12 md:pl-24 skeleton-in ${stagger}`}>
    <span className="absolute left-4 top-8 h-px w-8 -translate-y-1/2 bg-border/55 md:left-8 md:w-12" aria-hidden="true" />
    <span className="absolute left-4 top-8 z-20 -translate-x-1/2 md:left-8" aria-hidden="true">
      <span className="block h-3.5 w-3.5 rounded-full border-2 border-background bg-foreground/40" />
    </span>
    <div className="surface-card relative overflow-hidden rounded-xl bg-card/80 p-4 sm:p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <Bar shimmer="shimmer-delay-1" className="h-6 w-24 rounded-md" />
        <Bar shimmer="shimmer-delay-2" className="h-6 w-20 rounded-md" />
      </div>
      <div className="flex items-start gap-3 sm:gap-4">
        <Bar shimmer="shimmer-delay-3" className="h-10 w-10 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <Bar shimmer="shimmer-delay-1" className="h-5 w-2/3 rounded-md" />
          <Bar shimmer="shimmer-delay-2" className="h-3.5 w-1/3 rounded-full" />
          <Bar shimmer="shimmer-delay-3" className="h-4 w-1/2 rounded-full" />
        </div>
      </div>
    </div>
  </div>
)

const ExperienceCardSkeleton = ({ side, stagger }) => {
  const dock = side === "left" ? "md:mr-auto md:pr-14" : "md:ml-auto md:pl-14"
  return (
    <div className={`relative pl-12 md:pl-0 skeleton-in ${stagger}`}>
      <span className="absolute left-4 top-8 z-20 -translate-x-1/2 md:left-1/2" aria-hidden="true">
        <span className="block h-3 w-3 rounded-full border border-background bg-accent/70" />
      </span>
      <div className={`surface-card rounded-2xl p-4 sm:p-5 md:p-7 md:w-[calc(50%-1.5rem)] ${dock}`}>
        <Bar shimmer="shimmer-delay-1" className="h-7 w-32 rounded-full" />
        <div className="mt-4 flex items-start gap-3 sm:gap-4">
          <Bar shimmer="shimmer-delay-2" className="h-11 w-11 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2.5">
            <Bar shimmer="shimmer-delay-1" className="h-5 w-3/5 rounded-md" />
            <Bar shimmer="shimmer-delay-3" className="h-3.5 w-2/5 rounded-full" />
          </div>
        </div>
        <div className="mt-5 space-y-2.5">
          <Bar shimmer="shimmer-delay-1" className="h-12 w-full rounded-xl" />
          <Bar shimmer="shimmer-delay-2" className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

const ExperienceSkeleton = () => (
  <section aria-hidden="true" className="py-20 md:py-32 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-12 md:mb-20 skeleton-in">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Work Experience
        </h2>
        <div className="w-16 md:w-20 h-1.5 bg-accent rounded-full mx-auto mb-6 md:mb-8" />
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
          Professional journey building impactful solutions
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-4 md:left-1/2 md:-translate-x-1/2">
            <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-border/45" />
          </div>

          <div className="space-y-8 md:space-y-12">
            <ExperienceCardSkeleton side="left" stagger="skeleton-delay-1" />
            <ExperienceCardSkeleton side="right" stagger="skeleton-delay-2" />
            <ExperienceCardSkeleton side="left" stagger="skeleton-delay-3" />
          </div>
        </div>
      </div>
    </div>
  </section>
)

const ProjectCardSkeleton = ({ stagger }) => (
  <div className={`surface-card rounded-lg p-5 md:p-8 shadow-elegant skeleton-in ${stagger}`}>
    <div className="mb-3 flex items-start justify-between gap-3 md:mb-4">
      <Bar shimmer="shimmer-delay-1" className="h-6 w-2/5 rounded-md" />
      <Bar shimmer="shimmer-delay-2" className="h-5 w-16 rounded-full" />
    </div>
    <div className="mb-3 space-y-2 md:mb-4">
      <Bar shimmer="shimmer-delay-2" className="h-3.5 w-full rounded-full" />
      <Bar shimmer="shimmer-delay-3" className="h-3.5 w-4/5 rounded-full" />
    </div>
    <div className="mb-3 flex flex-wrap gap-2 md:mb-4">
      <Bar shimmer="shimmer-delay-1" className="h-6 w-20 rounded-full" />
      <Bar shimmer="shimmer-delay-2" className="h-6 w-16 rounded-full" />
      <Bar shimmer="shimmer-delay-3" className="h-6 w-24 rounded-full" />
    </div>
    <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
      <Bar shimmer="shimmer-delay-1" className="h-9 w-full rounded-md sm:w-24" />
      <Bar shimmer="shimmer-delay-2" className="h-9 w-full rounded-md sm:w-24" />
    </div>
  </div>
)

const ProjectsSkeleton = () => (
  <section aria-hidden="true" className="py-20 md:py-32 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionEyebrow
        title="Projects"
        divider="h-1"
        subtitle="Transforming ideas into elegant solutions"
      />
      <div className="grid max-w-6xl mx-auto gap-5 sm:grid-cols-2 md:gap-8">
        <ProjectCardSkeleton stagger="skeleton-delay-1" />
        <ProjectCardSkeleton stagger="skeleton-delay-2" />
        <ProjectCardSkeleton stagger="skeleton-delay-3" />
        <ProjectCardSkeleton stagger="skeleton-delay-4" />
      </div>
    </div>
  </section>
)

const SkillCardSkeleton = ({ stagger }) => (
  <div className={`surface-card rounded-lg p-4 md:p-6 skeleton-in ${stagger}`}>
    <div className="mb-3 flex items-start justify-between gap-3">
      <Bar shimmer="shimmer-delay-1" className="h-4 w-1/3 rounded-full" />
      <Bar shimmer="shimmer-delay-2" className="h-4 w-10 rounded-full" />
    </div>
    <Bar shimmer="shimmer-delay-3" className="h-2 w-full rounded-full" />
  </div>
)

const SkillsSkeleton = () => (
  <section aria-hidden="true" className="py-20 md:py-32">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionEyebrow
        title="Skills"
        divider="h-1"
        subtitle="Technical expertise across multiple domains"
      />
      <div className="max-w-6xl mx-auto">
        <div className="skeleton-in skeleton-delay-1 mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 md:mb-12 md:gap-4">
          <Bar shimmer="shimmer-delay-1" className="h-9 w-28 rounded-md" />
          <Bar shimmer="shimmer-delay-2" className="h-9 w-24 rounded-md" />
          <Bar shimmer="shimmer-delay-3" className="h-9 w-28 rounded-md" />
          <Bar shimmer="shimmer-delay-1" className="h-9 w-20 rounded-md" />
          <Bar shimmer="shimmer-delay-2" className="h-9 w-32 rounded-md" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
          <SkillCardSkeleton stagger="skeleton-delay-2" />
          <SkillCardSkeleton stagger="skeleton-delay-3" />
          <SkillCardSkeleton stagger="skeleton-delay-4" />
          <SkillCardSkeleton stagger="skeleton-delay-5" />
          <SkillCardSkeleton stagger="skeleton-delay-5" />
          <SkillCardSkeleton stagger="skeleton-delay-6" />
        </div>
      </div>
    </div>
  </section>
)

const AchievementCardSkeleton = ({ stagger }) => (
  <div className={`glass-card flex h-full min-h-[300px] flex-col rounded-2xl border border-accent/10 p-6 md:min-h-[340px] md:p-8 skeleton-in ${stagger}`}>
    <Bar shimmer="shimmer-delay-1" className="mb-4 h-16 w-16 rounded-2xl md:mb-5 md:h-20 md:w-20" />
    <Bar shimmer="shimmer-delay-2" className="mb-3 h-6 w-3/4 rounded-md md:mb-4" />
    <div className="flex-1 space-y-2.5">
      <Bar shimmer="shimmer-delay-2" className="h-3.5 w-full rounded-full" />
      <Bar shimmer="shimmer-delay-3" className="h-3.5 w-[92%] rounded-full" />
      <Bar shimmer="shimmer-delay-1" className="h-3.5 w-3/5 rounded-full" />
    </div>
    <Bar shimmer="shimmer-delay-3" className="mt-5 h-0.5 w-full rounded-full" />
  </div>
)

const AchievementsSkeleton = () => (
  <section
    aria-hidden="true"
    className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-accent/5 py-20 md:py-32"
  >
    <div className="container relative z-10 mx-auto px-4 sm:px-6">
      <div className="text-center mb-12 md:mb-20 skeleton-in">
        <div className="mb-4 inline-flex items-center gap-3">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            Achievements
          </h2>
        </div>
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-accent to-accent/60 md:mb-8 md:w-24" />
        <p className="mx-auto max-w-2xl px-2 text-base md:text-xl font-light tracking-wide text-muted-foreground">
          Recognition and milestones that define excellence
        </p>
      </div>

      <div className="grid max-w-6xl mx-auto items-stretch gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
        <AchievementCardSkeleton stagger="skeleton-delay-1" />
        <AchievementCardSkeleton stagger="skeleton-delay-2" />
        <AchievementCardSkeleton stagger="skeleton-delay-3" />
      </div>
    </div>
  </section>
)

const ContactFieldSkeleton = ({ labelWidth, control, shimmer }) => (
  <div className="space-y-2">
    <Bar shimmer={shimmer} className={`h-3.5 ${labelWidth} rounded-full`} />
    <Bar shimmer={shimmer} className={`${control} w-full rounded-md`} />
  </div>
)

const ContactSkeleton = () => (
  <section aria-hidden="true" className="py-20 md:py-32 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionEyebrow
        title="Get in Touch"
        divider="h-1"
        subtitle="Let's discuss your next project"
      />

      <div className="grid max-w-6xl mx-auto gap-10 md:grid-cols-2 md:gap-12">
        <div className="skeleton-in skeleton-delay-1">
          <Bar shimmer="shimmer-delay-1" className="mb-5 h-7 w-48 rounded-md md:mb-6" />
          <div className="space-y-5 md:space-y-6">
            <ContactFieldSkeleton labelWidth="w-16" control="h-10" shimmer="shimmer-delay-1" />
            <ContactFieldSkeleton labelWidth="w-20" control="h-10" shimmer="shimmer-delay-2" />
            <ContactFieldSkeleton labelWidth="w-24" control="h-10" shimmer="shimmer-delay-3" />
            <ContactFieldSkeleton labelWidth="w-24" control="h-32" shimmer="shimmer-delay-1" />
            <Bar shimmer="shimmer-delay-2" className="h-10 w-full rounded-md" />
          </div>
        </div>

        <div className="skeleton-in skeleton-delay-2 space-y-8">
          <div>
            <Bar shimmer="shimmer-delay-1" className="mb-5 h-7 w-56 rounded-md md:mb-6" />
            <div className="space-y-4">
              <Bar shimmer="shimmer-delay-2" className="h-16 w-full rounded-lg" />
              <Bar shimmer="shimmer-delay-3" className="h-16 w-full rounded-lg" />
            </div>
          </div>
          <div>
            <Bar shimmer="shimmer-delay-1" className="mb-5 h-7 w-52 rounded-md md:mb-6" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              <Bar shimmer="shimmer-delay-1" className="h-[84px] w-full rounded-lg md:h-24" />
              <Bar shimmer="shimmer-delay-2" className="h-[84px] w-full rounded-lg md:h-24" />
              <Bar shimmer="shimmer-delay-3" className="h-[84px] w-full rounded-lg md:h-24" />
              <Bar shimmer="shimmer-delay-2" className="h-[84px] w-full rounded-lg md:h-24" />
              <Bar shimmer="shimmer-delay-3" className="h-[84px] w-full rounded-lg md:h-24" />
              <Bar shimmer="shimmer-delay-1" className="h-[84px] w-full rounded-lg md:h-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const SectionsSkeleton = memo(function SectionsSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label="Loading portfolio content">
      <span className="sr-only">Loading portfolio content. Preparing your experience.</span>
      <AboutSkeleton />
      <ExperienceSkeleton />
      <ProjectsSkeleton />
      <SkillsSkeleton />
      <AchievementsSkeleton />
      <ContactSkeleton />
    </div>
  )
})

export default SectionsSkeleton
