import { Link } from "react-router-dom"
import Button from "./Button"

const RowActions = ({ editTo, onDelete, deleteLabel = "Delete", busy = false }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      {editTo ? (
        <Link
          to={editTo}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
        >
          Edit
        </Link>
      ) : null}
      <Button variant="danger-soft" size="sm" onClick={onDelete} disabled={busy}>
        {deleteLabel}
      </Button>
    </div>
  )
}

export default RowActions
