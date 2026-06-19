const LoadingState = ({ label = "Loading..." }) => {
  return (
    <div role="status" aria-live="polite" className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-muted">
      {label}
    </div>
  )
}

export default LoadingState
