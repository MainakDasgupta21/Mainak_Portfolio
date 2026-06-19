import { Link } from "react-router-dom"
import Button from "./Button"

const RowActions = ({ editTo, onDelete, deleteLabel = "Delete", busy = false }) => {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {editTo ? (
        <Link
          to={editTo}
          className="inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium text-text-muted transition-colors hover:bg-surface-soft hover:text-text-main"
        >
          Edit
        </Link>
      ) : null}
      <Button variant="danger-soft" size="sm" className="h-8 px-2.5" onClick={onDelete} disabled={busy}>
        {deleteLabel}
      </Button>
    </div>
  )
}

export default RowActions
