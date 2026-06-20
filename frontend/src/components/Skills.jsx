import { m, useInView } from "framer-motion"
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react"
import { PortfolioContext } from "../context/PortfolioContext"

const Skills = memo(function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { skillsByCategory, profile } = useContext(PortfolioContext)
  const categories = useMemo(() => Object.keys(skillsByCategory || {}), [skillsByCategory])
  const hasSkillCategories = categories.length > 0
  const subtitle =
    profile.sectionSubtitles?.skills || "Technical expertise across multiple domains"
  const [activeCategory, setActiveCategory] = useState(categories[0] || "")

  useEffect(() => {
    if (!activeCategory || !skillsByCategory[activeCategory]) {
      setActiveCategory(categories[0] || "")
    }
  }, [activeCategory, categories, skillsByCategory])

  return (
    <section id="skills" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">Skills</h2>
          <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-6 md:mb-8" />
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        </m.div>

        <div className="max-w-6xl mx-auto">
          {!hasSkillCategories ? (
            <div className="surface-card rounded-lg p-6 text-center text-muted-foreground">
              Skills will appear here once they are published.
            </div>
          ) : (
            <>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 sm:gap-3 md:gap-4 mb-8 md:mb-12 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                    className={`px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0 sm:shrink h-9 rounded-md border transition-colors ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </m.div>

              <m.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid sm:grid-cols-2 gap-4 md:gap-6"
              >
                {(skillsByCategory[activeCategory] || []).map((skill, index) => (
                  <m.div
                    key={skill._id || skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="surface-card p-4 md:p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <span className="font-medium text-sm md:text-base break-words">{skill.name}</span>
                      <m.span
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                        className="text-xs md:text-sm text-muted-foreground shrink-0"
                      >
                        {skill.proficiency}%
                      </m.span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <m.div
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: Math.max(0, Math.min(Number(skill.proficiency) || 0, 100)) / 100 } : {}}
                        transition={{
                          duration: 1,
                          delay: 0.3 + index * 0.05,
                          ease: "easeOut",
                        }}
                        className="h-full w-full bg-gradient-to-r from-accent to-accent/70 origin-left"
                      />
                    </div>
                  </m.div>
                ))}
              </m.div>
            </>
          )}
        </div>
      </div>
    </section>
  )
})

export default Skills
