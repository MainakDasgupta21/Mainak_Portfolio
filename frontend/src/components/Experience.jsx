import { motion, useScroll, useTransform } from "framer-motion"
import { memo, useContext, useRef, useState } from "react"
import { FileText, Globe } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"

const Experience = memo(function Experience() {
  const sectionRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const { experience, profile } = useContext(PortfolioContext)
  const subtitle =
    profile.sectionSubtitles?.experience ||
    "Professional journey building impactful solutions"

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section id="experience" className="py-20 md:py-32 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 md:left-1/2 md:-translate-x-1/2">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[6px] bg-gradient-to-b from-white/5 via-white/10 to-white/5 rounded-full blur-[1px]" />

              <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-0 w-[8px] rounded-full overflow-hidden"
                style={{ height: timelineHeight }}
              >
                <div
                  className="w-full h-full relative"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.8) 45%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 55%, rgba(255,255,255,0.3) 80%, rgba(255,255,255,0.1) 100%)",
                    boxShadow:
                      "0 0 25px 6px rgba(255,255,255,0.4), 0 0 50px 12px rgba(255,255,255,0.2)",
                  }}
                />
              </motion.div>

              <motion.div
                style={{ top: timelineHeight }}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-white pointer-events-none"
              >
                <div
                  className="absolute inset-0 rounded-full bg-white"
                  style={{
                    boxShadow:
                      "0 0 20px 8px rgba(255,255,255,0.7), 0 0 40px 16px rgba(255,255,255,0.4), 0 0 60px 24px rgba(255,255,255,0.2)",
                    filter: "blur(1px)",
                  }}
                />
                <div className="absolute inset-0 m-auto w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white shadow-[0_0_15px_6px_rgba(255,255,255,0.8)]" />
              </motion.div>
            </div>

            <div className="space-y-10 md:space-y-24">
              {experience.map((exp, index) => {
                const isLeft = index % 2 === 0
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    className={`relative md:flex md:items-center ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Mobile logo */}
                    <div className="md:hidden absolute left-4 -translate-x-1/2 top-5 z-10">
                      <motion.div
                        animate={{ scale: hoveredIndex === index ? 1.1 : 1 }}
                        className="w-10 h-10 rounded-full border-2 border-white/10 bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                      >
                        {exp.logo ? (
                          <img
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-white font-bold text-[10px]">
                              {exp.company.charAt(0)}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    <div className={`pl-10 sm:pl-12 md:pl-0 md:w-[45%] ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        className={`glass-card p-4 sm:p-5 md:p-10 rounded-2xl border border-border/20 backdrop-blur-xl shadow-elegant hover:shadow-glow transition-all duration-500 ${
                          hoveredIndex !== null && hoveredIndex !== index
                            ? "md:opacity-50 md:blur-[1px]"
                            : "opacity-100 blur-0"
                        }`}
                      >
                        <div className={`flex items-center gap-3 mb-4 md:mb-6 justify-start ${isLeft ? "md:justify-start" : "md:justify-end"}`}>
                          <span className="text-xs md:text-sm font-semibold text-accent bg-accent/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-accent/20 break-words">
                            {exp.period}
                          </span>
                        </div>

                        <div className="mb-4 md:mb-6">
                          <h3 className="text-base sm:text-xl md:text-2xl font-bold text-foreground mb-2 leading-snug break-words">
                            {exp.role}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-3 mb-3 md:mb-4">
                            <p className="text-sm sm:text-base md:text-lg font-bold text-accent bg-accent/5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg break-words w-full sm:flex-1 sm:min-w-0">
                              {exp.company}
                            </p>

                            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                              {exp.link && (
                                <motion.a
                                  href={exp.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ scale: 1.1 }}
                                  className="p-2 bg-primary/10 hover:bg-accent/20 rounded-lg border border-border/30 transition-all duration-300"
                                  title="Company Website"
                                >
                                  <Globe className="w-4 h-4 text-muted-foreground hover:text-accent" />
                                </motion.a>
                              )}
                              {exp.certificate && (
                                <motion.a
                                  href={exp.certificate}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ scale: 1.1 }}
                                  className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/30 transition-all duration-300"
                                  title="View Certificate"
                                >
                                  <FileText className="w-4 h-4 text-green-500 hover:text-green-400" />
                                </motion.a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                          {(exp.highlights || []).map((highlight, hIndex) => (
                            <motion.div
                              key={hIndex}
                              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 + hIndex * 0.1 }}
                              className="flex items-start gap-3 p-3 md:p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300"
                            >
                              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                              <p className="text-[0.92rem] md:text-base text-muted-foreground leading-relaxed break-words">
                                {highlight}
                              </p>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          className={`absolute bottom-0 h-1 bg-gradient-to-r from-accent to-primary rounded-full ${isLeft ? "left-0" : "right-0"}`}
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                    </div>

                    {/* Desktop center logo */}
                    <div className="hidden md:flex flex-1 justify-center relative z-10">
                      <div
                        className={`absolute top-1/2 h-0.5 bg-gradient-to-r from-border/50 to-border/30 ${
                          isLeft ? "left-0 right-1/2" : "left-1/2 right-0"
                        }`}
                      />

                      <motion.div
                        animate={{
                          scale: hoveredIndex === index ? 1.1 : 1,
                          borderColor:
                            hoveredIndex === index
                              ? "hsl(var(--accent))"
                              : "rgba(255,255,255,0.1)",
                        }}
                        className="w-16 h-16 rounded-full border-2 bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-2xl relative transition-all duration-300"
                      >
                        {exp.logo ? (
                          <img
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {exp.company.charAt(0)}
                            </span>
                          </div>
                        )}

                        <motion.div
                          className="absolute inset-0 rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredIndex === index ? 0.6 : 0 }}
                          style={{ boxShadow: "0 0 20px 8px hsl(var(--accent))" }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    </div>

                    <div className="hidden md:block md:w-[45%]" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default Experience
