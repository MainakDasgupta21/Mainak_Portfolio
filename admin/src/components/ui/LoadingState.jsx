const LoadingState = ({ label = "Loading..." }) => {
  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-muted">
      {label}
    </div>
  )
}

export default LoadingState
