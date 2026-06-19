import React from "react"

const Select = React.forwardRef(function Select({ className = "", ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-main ${className}`}
      {...props}
    />
  )
})

export default Select
