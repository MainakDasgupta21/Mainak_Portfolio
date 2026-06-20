import { memo } from "react"

const AppLoader = memo(function AppLoader() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section
        role="status"
        aria-live="polite"
        aria-label="Loading portfolio content"
        className="surface-card w-full max-w-md rounded-2xl bg-card/55 p-6 shadow-elegant backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-foreground/15" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground border-r-foreground/65 motion-safe:animate-spin" />
            <div className="absolute inset-2 rounded-full bg-background/45" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Loading portfolio</p>
            <p className="text-xs text-muted-foreground">Preparing your content...</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <div className="loading-shimmer h-2.5 w-full rounded-full" />
          <div className="loading-shimmer h-2.5 w-11/12 rounded-full" />
          <div className="loading-shimmer h-2.5 w-8/12 rounded-full" />
        </div>
      </section>
    </main>
  )
})

export default AppLoader
