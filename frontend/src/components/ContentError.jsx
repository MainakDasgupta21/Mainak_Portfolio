import { memo } from "react"
import { AlertTriangle, RotateCw } from "lucide-react"

const ContentError = memo(function ContentError({ onRetry }) {
  return (
    <section className="py-20 md:py-32" role="alert" aria-live="assertive">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="surface-card mx-auto max-w-xl rounded-2xl p-8 text-center md:p-10">
          <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-background/60 text-foreground">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Couldn&apos;t load the content
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm md:text-base leading-relaxed text-muted-foreground">
            Something went wrong while fetching the latest portfolio data. Please
            check your connection and try again.
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="hover-glow glow-button glow-delay-0 mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-foreground/25 bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
          )}
        </div>
      </div>
    </section>
  )
})

export default ContentError
