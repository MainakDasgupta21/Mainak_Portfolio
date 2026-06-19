import { m, useInView } from "framer-motion"
import { memo, useContext, useMemo, useRef } from "react"
import { Trophy, Award, Medal } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"

const iconMap = { trophy: Trophy, award: Award, medal: Medal }

const Achievements = memo(function Achievements() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { achievements, profile } = useContext(PortfolioContext)
  const hasAchievements = achievements.length > 0
  const subtitle =
    profile.sectionSubtitles?.achievements ||
    "Recognition and milestones that define excellence"

  const particles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${3 + Math.random() * 2}s`,
      })),
    []
  )

  return (
    <section
      id="achievements"
      ref={ref}
      className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-accent/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slow-reverse" />

        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute w-2 h-2 bg-accent/30 rounded-full animate-float-particle"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-20"
        >
          <m.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Achievements
            </h2>
          </m.div>

          <m.div
            className="w-20 md:w-24 h-1 bg-gradient-to-r from-accent to-accent/60 mx-auto mb-6 md:mb-8 rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-light tracking-wide px-2"
          >
            {subtitle}
          </m.p>
        </m.div>

        {!hasAchievements ? (
          <div className="max-w-4xl mx-auto glass-card rounded-lg p-6 text-center text-muted-foreground">
            Achievements will appear here once they are published.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 max-w-6xl mx-auto items-stretch">
            {achievements.map((achievement, index) => {
              const Icon = iconMap[achievement.icon] || Trophy
              return (
                <m.div
                  key={achievement._id || index}
                  initial={{ opacity: 0, y: 80, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                  whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.3, ease: "easeOut" } }}
                  className="relative group h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                  <div className="relative glass-card p-6 md:p-8 rounded-2xl border border-accent/10 bg-gradient-to-br from-background to-muted/5 shadow-2xl shadow-accent/5 hover:shadow-3xl hover:shadow-accent/10 transition-all duration-500 overflow-hidden flex flex-col h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <m.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.15, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
                    className="relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 mb-5 md:mb-6 group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-accent relative z-10 drop-shadow-lg" />
                  </m.div>

                  <m.h3
                    className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent break-words"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.15 }}
                  >
                    {achievement.title}
                  </m.h3>

                  <m.p
                    className="text-sm md:text-lg text-muted-foreground leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1 + index * 0.15 }}
                  >
                    {achievement.description}
                  </m.p>

                  <m.div
                    className="w-0 h-0.5 bg-gradient-to-r from-accent to-accent/60 mt-auto rounded-full group-hover:w-full transition-all duration-500 delay-100"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ delay: 1.2 + index * 0.15, duration: 0.8 }}
                  />
                  </div>
                </m.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
})

export default Achievements
