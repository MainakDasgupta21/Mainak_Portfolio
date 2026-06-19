import { motion, AnimatePresence, useInView } from "framer-motion"
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"

const Testimonials = memo(function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { testimonials, profile } = useContext(PortfolioContext)
  const subtitle =
    profile.sectionSubtitles?.testimonials || "What colleagues and mentors say"

  const nextTestimonial = useCallback(() => {
    if (!testimonials.length) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prevTestimonial = useCallback(() => {
    if (!testimonials.length) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (isHovered || !testimonials.length) return
    const ref = { id: 0 }
    const tick = () => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      ref.id = setTimeout(tick, 5000)
    }
    ref.id = setTimeout(tick, 5000)
    return () => clearTimeout(ref.id)
  }, [isHovered, testimonials.length])

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 220 : -220, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 220 : -220, opacity: 0 }),
  }

  const hasTestimonials = testimonials.length > 0

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">Testimonials</h2>
          <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-6 md:mb-8" />
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">{subtitle}</p>
        </motion.div>

        {!hasTestimonials ? (
          <div className="max-w-4xl mx-auto glass-card rounded-lg p-6 text-center text-muted-foreground">
            No testimonials published yet.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 400, damping: 40 },
                    opacity: { duration: 0.3 },
                  }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileHover={{
                    boxShadow:
                      "0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.2)",
                    scale: 1.02,
                    transition: { duration: 0.4, ease: "easeInOut" },
                  }}
                  className="glass-card p-6 md:p-12 rounded-lg shadow-elegant transition-all duration-500"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mb-5 md:mb-6 overflow-hidden">
                      {testimonials[currentIndex].image ? (
                        <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl md:text-2xl font-bold text-accent">
                          {testimonials[currentIndex].name?.charAt(0)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg md:text-xl font-bold mb-2 break-words">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-sm md:text-base text-accent font-medium mb-1 break-words">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground mb-5 md:mb-6 break-words">
                      {testimonials[currentIndex].company}
                    </p>

                    <div className="flex gap-1 mb-5 md:mb-6">
                      {[...Array(testimonials[currentIndex].rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <blockquote className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                      &quot;{testimonials[currentIndex].quote}&quot;
                    </blockquote>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center items-center gap-3 sm:gap-8 mt-8 md:mt-12">
              <button
                type="button"
                onClick={prevTestimonial}
                aria-label="Previous"
                className="hidden sm:inline-flex h-10 w-10 rounded-full hover:bg-accent/10 transition-colors items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 sm:gap-3">
                {testimonials.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1)
                      setCurrentIndex(index)
                    }}
                    title={`Go to testimonial ${index + 1}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-5 sm:w-6 bg-accent"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next"
                className="hidden sm:inline-flex h-10 w-10 rounded-full hover:bg-accent/10 transition-colors items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
})

export default Testimonials
