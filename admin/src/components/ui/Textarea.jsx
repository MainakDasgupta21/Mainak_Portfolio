import React from "react"

const Textarea = React.forwardRef(function Textarea({ className = "", rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main ${className}`}
      {...props}
    />
  )
})

export default Textarea
