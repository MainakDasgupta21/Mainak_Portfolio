const Field = ({ label, htmlFor, hint, error, required = false, children, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`flex flex-col gap-1.5 text-sm ${className}`}>
      {label ? (
        <span className="font-medium text-text-main">
          {label}
          {required ? <span className="text-danger"> *</span> : null}
        </span>
      ) : null}
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-text-muted">{hint}</span> : null}
    </label>
  )
}

export default Field
