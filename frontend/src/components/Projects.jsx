import { m, AnimatePresence, useInView } from "framer-motion"
import { memo, useContext, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ExternalLink, Github, X } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"
import { lockLenisScroll, unlockLenisScroll } from "../hooks/useSmoothScroll"
import { normalizeExternalLink } from "../utils/externalLink"
import { InlineMarkdown } from "../utils/inlineMarkdown"

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
  const modalRoot = typeof document !== "undefined" ? document.body : null

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
                    <InlineMarkdown text={project.description} />
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

        {modalRoot && createPortal(
          <AnimatePresence>
            {selected && (
              <m.div
                key="overlay"
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
                data-lenis-prevent
              >
                <m.div
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className="modal-card"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="sticky top-0 z-10 mb-4 rounded-t-[inherit] border-b border-border/50 bg-popover/90 px-5 py-4 backdrop-blur md:px-6">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      aria-label="Close"
                      className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-background/60 hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="pr-12">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl md:text-3xl break-words font-semibold leading-tight">
                          {selected.name}
                        </h3>
                        {selected.featured && (
                          <span className="bg-accent/10 text-accent border border-accent/20 text-xs px-2.5 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Project Details
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 px-5 pb-5 md:space-y-5 md:px-6 md:pb-6">
                    <section className="rounded-xl border border-border/50 bg-background/35 p-4 md:p-5">
                      <h4 className="text-lg md:text-xl font-semibold mb-2">Overview</h4>
                      <div className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        <InlineMarkdown text={selected.description} />
                      </div>
                    </section>

                    <section className="rounded-xl border border-border/50 bg-background/35 p-4 md:p-5">
                      <h4 className="text-lg md:text-xl font-semibold mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {(selected.technologies || []).length > 0 ? (
                          (selected.technologies || []).map((tech, index) => (
                            <span key={index} className="bg-secondary/65 text-secondary-foreground border border-border/50 text-xs md:text-sm px-2.5 py-1 rounded-full">
                              {tech}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Technologies will be updated soon.</p>
                        )}
                      </div>
                    </section>

                    <section className="rounded-xl border border-border/50 bg-background/35 p-4 md:p-5">
                      <h4 className="text-lg md:text-xl font-semibold mb-3">Key Features</h4>
                      {(selected.highlights || []).length > 0 ? (
                        <ul className="space-y-2.5">
                          {(selected.highlights || []).map((highlight, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="mt-2 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                              <span className="text-sm md:text-base text-muted-foreground leading-relaxed">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Feature details will be added soon.</p>
                      )}
                    </section>

                    {(selectedGithubUrl || selectedDemoUrl) && (
                      <div className="grid sm:grid-cols-2 gap-3 pt-1">
                        {selectedGithubUrl && (
                          <a
                            href={selectedGithubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2 inline-flex items-center justify-center rounded-lg border border-input bg-background/70 hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium px-4 h-11"
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
                            className="gap-2 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium px-4 h-11"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>,
          modalRoot
        )}
      </div>
    </section>
  )
})

export default Projects
