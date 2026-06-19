import Card from "./Card"

const EmptyState = ({ title, message }) => {
  return (
    <Card className="border-dashed px-6 py-10 text-center">
      <p className="text-base font-semibold text-text-main">{title}</p>
      <p className="mt-1 text-sm text-text-muted">{message}</p>
    </Card>
  )
}

export default EmptyState
