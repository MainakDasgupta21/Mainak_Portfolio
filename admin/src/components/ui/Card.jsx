const Card = ({ className = "", children, ...props }) => {
  return (
    <section className={`rounded-lg border border-border/80 bg-surface ${className}`} {...props}>
      {children}
    </section>
  )
}

export default Card
