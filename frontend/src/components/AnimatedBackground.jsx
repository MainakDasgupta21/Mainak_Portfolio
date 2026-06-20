import { memo } from "react"

const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none animated-bg-layer"
      style={{ transform: "translateZ(0)", contain: "strict" }}
    >
      <div
        className="absolute inset-0 opacity-10 sm:opacity-20 animate-gradient-shift"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
        }}
      />

      <div
        className="animated-bg-blob absolute -left-[16%] top-[20%] sm:left-[8%] sm:top-[18%] w-[170px] h-[170px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] rounded-full blur-2xl animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="animated-bg-blob absolute hidden sm:block -right-[10%] bottom-[22%] sm:right-[12%] sm:bottom-[28%] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] rounded-full blur-2xl animate-float-slow-reverse"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
        }}
      />
    </div>
  )
})

export default AnimatedBackground
