import React from "react"

const cx = (...classes) => classes.filter(Boolean).join(" ")

const variantClasses = {
  primary: "bg-brand text-brand-foreground border-transparent hover:bg-brand/90",
  secondary: "bg-surface text-text-main border-border hover:bg-surface-soft",
  ghost: "bg-transparent text-text-muted border-transparent hover:bg-surface-soft hover:text-text-main",
  danger: "bg-danger text-danger-foreground border-transparent hover:bg-danger/90",
  "danger-soft": "bg-transparent text-danger border-danger/35 hover:bg-danger-soft",
}

const sizeClasses = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-4 text-sm",
}

const Button = React.forwardRef(function Button(
  {
    type = "button",
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-0",
        "disabled:opacity-60 disabled:pointer-events-none",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
