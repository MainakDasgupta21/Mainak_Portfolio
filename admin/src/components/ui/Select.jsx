import React from "react"

const Select = React.forwardRef(function Select({ className = "", ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text-main ${className}`}
      {...props}
    />
  )
})

export default Select
