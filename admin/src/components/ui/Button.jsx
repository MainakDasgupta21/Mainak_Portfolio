import React from "react"

const cx = (...classes) => classes.filter(Boolean).join(" ")

const variantClasses = {
  primary: "bg-brand text-brand-foreground hover:bg-brand/90 border-transparent shadow-sm",
  secondary: "bg-surface text-text-main border-border hover:bg-surface-soft",
  ghost: "bg-transparent text-text-main border-transparent hover:bg-surface-soft",
  danger: "bg-danger text-danger-foreground border-transparent hover:bg-danger/90",
  "danger-soft": "bg-danger-soft text-danger border-danger/20 hover:bg-danger-soft/75",
}

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-[0.95rem]",
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
        "inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition-all duration-200 ease-out",
        "focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas",
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
