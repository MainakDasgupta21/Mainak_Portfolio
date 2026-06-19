const Card = ({ className = "", children, ...props }) => {
  return (
    <section className={`rounded-2xl border border-border bg-surface shadow-panel ${className}`} {...props}>
      {children}
    </section>
  )
}

export default Card
