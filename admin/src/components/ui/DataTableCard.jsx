import Card from "./Card"

const DataTableCard = ({ headers, gridClass, children }) => {
  return (
    <Card className="overflow-hidden">
      <div className={`hidden bg-surface-soft px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted md:grid ${gridClass}`}>
        {headers.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </Card>
  )
}

export default DataTableCard
