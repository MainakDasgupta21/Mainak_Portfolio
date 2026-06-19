import Button from "./Button"

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  busy = false,
  onConfirm,
  onClose,
}) => {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-4">
        <h2 className="text-base font-semibold text-text-main">{title}</h2>
        <p className="mt-1.5 text-sm text-text-muted">{description}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} size="sm" onClick={onConfirm} disabled={busy}>
            {busy ? "Working..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
