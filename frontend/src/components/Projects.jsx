import { m, AnimatePresence, useInView } from "framer-motion"
import { memo, useContext, useEffect, useRef, useState } from "react"
import { ExternalLink, Github, X } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"
import { lockLenisScroll, unlockLenisScroll } from "../hooks/useSmoothScroll"
import { normalizeExternalLink } from "../utils/externalLink"

const Projects = memo(function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { projects, profile } = useContext(PortfolioContext)
  const subtitle =
    profile.sectionSubtitles?.projects || "Transforming ideas into elegant solutions"
  const [selected, setSelected] = useState(null)
  const hasProjects = projects.length > 0
  const selectedGithubUrl = normalizeExternalLink(selected?.github)
  const selectedDemoUrl = normalizeExternalLink(selected?.demo)

  // Esc closes the modal.
  useEffect(() => {
    if (!selected) return

    lockLenisScroll()

    const onKey = (e) => { if (e.key === "Escape") setSelected(null) }
    window.addEventListener("keydown", onKey)

    return () => {
      window.removeEventListener("keydown", onKey)
      unlockLenisScroll()
    }
  }, [selected])

  return (
    <section id="projects" className="py-20 md:py-32 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">
            Projects
          </h2>
          <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-6 md:mb-8" />
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        </m.div>

        {!hasProjects ? (
          <div className="max-w-4xl mx-auto surface-card rounded-lg p-6 text-center text-muted-foreground">
            Projects will appear here once they are published.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5 md:gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => {
              const githubUrl = normalizeExternalLink(project.github)
              const demoUrl = normalizeExternalLink(project.demo)

              return (
                <m.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                  className="surface-card p-5 md:p-8 rounded-lg shadow-elegant hover:shadow-glow transition-all cursor-pointer group"
                  onClick={() => setSelected(project)}
                >
                  <div className="flex items-start justify-between gap-3 mb-3 md:mb-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold group-hover:text-accent transition-colors break-words min-w-0">
                      {project.name}
                    </h3>
                    {project.featured && (
                      <span className="bg-accent/10 text-accent border border-accent/20 flex-shrink-0 text-xs px-2.5 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 line-clamp-3 md:line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                    {(project.technologies || []).slice(0, 3).map((tech, techIndex) => (
                      <span key={techIndex} className="px-2.5 py-0.5 md:px-3 md:py-1 bg-secondary/50 rounded-full text-xs">
                        {tech}
                      </span>
                    ))}
                    {(project.technologies?.length || 0) > 3 && (
                      <span className="px-2.5 py-0.5 md:px-3 md:py-1 bg-secondary/50 rounded-full text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="gap-2 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-sm px-3 h-9"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {demoUrl && (
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="gap-2 w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm px-3 h-9"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                  </div>
                </m.div>
              )
            })}
          </div>
        )}

        <AnimatePresence>
          {selected && (
            <>
              <m.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-backdrop"
                onClick={() => setSelected(null)}
              />
              <m.div
                key="card"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="modal-card"
                data-lenis-prevent
                role="dialog"
                aria-modal="true"
              >
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-2xl md:text-3xl mb-3 md:mb-4 break-words font-semibold">
                  {selected.name}
                </h3>
                <div className="space-y-5 md:space-y-6">
                  <p className="text-muted-foreground text-base md:text-lg">
                    {selected.description}
                  </p>

                  <div>
                    <h4 className="text-lg md:text-xl font-semibold mb-3">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selected.technologies || []).map((tech, index) => (
                        <span key={index} className="bg-secondary text-secondary-foreground border border-border/40 text-xs px-2.5 py-0.5 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg md:text-xl font-semibold mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {(selected.highlights || []).map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span className="text-sm md:text-base text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
                    {selectedGithubUrl && (
                      <a
                        href={selectedGithubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2 w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm px-4 h-10"
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </a>
                    )}
                    {selectedDemoUrl && (
                      <a
                        href={selectedDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-sm px-4 h-10"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
})

export default Projects
