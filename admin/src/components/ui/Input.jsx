import React from "react"

const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text-main ${className}`}
      {...props}
    />
  )
})

export default Input
