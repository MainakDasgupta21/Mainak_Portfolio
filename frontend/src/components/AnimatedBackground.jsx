import { memo } from "react"

const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ transform: "translateZ(0)", contain: "strict" }}
    >
      <div
        className="absolute inset-0 opacity-15 sm:opacity-20 animate-gradient-shift"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
        }}
      />

      <div
        className="absolute -left-[12%] top-[18%] sm:left-[10%] sm:top-[20%] w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] rounded-full blur-3xl animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[10%] bottom-[22%] sm:right-[15%] sm:bottom-[30%] w-[190px] h-[190px] sm:w-[300px] sm:h-[300px] rounded-full blur-3xl animate-float-slow-reverse"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  )
})

export default AnimatedBackground
