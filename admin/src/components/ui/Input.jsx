import React from "react"

const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-main ${className}`}
      {...props}
    />
  )
})

export default Input
