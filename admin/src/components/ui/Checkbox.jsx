const Checkbox = ({ className = "", ...props }) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-border text-brand focus:ring-brand/40 ${className}`}
      {...props}
    />
  )
}

export default Checkbox
